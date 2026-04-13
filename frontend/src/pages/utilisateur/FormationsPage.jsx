import { useEffect, useMemo, useState } from 'react';
import {
  Plus, Search, Pencil, Trash2, UserPlus, UserMinus,
  BookOpen, ChevronRight, X, Calendar, Clock,
  Wallet, Tag, User, Users, Eye, GraduationCap
} from 'lucide-react';
import Layout from '../../components/Layout';
import Skeleton from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';
import PageHeader from '../../components/PageHeader';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { mapError } from '../../utils/errorMapper';
import FilterBar from '../../components/FilterBar';
import { motion } from 'framer-motion';

const EMPTY_FORM = {
  titre: '', annee: new Date().getFullYear(),
  duree: 1, budget: 0, domaineId: '', formateurId: ''
};

const Field = ({ label, icon: Icon, color, children }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] ml-1">
      {label}
    </label>
    <div className="relative">
      {Icon && <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 ${color} opacity-50`} size={16} />}
      {children}
    </div>
  </div>
);

export default function FormationsPage() {
  const { addToast } = useToast();

  const [formations, setFormations]     = useState([]);
  const [domaines, setDomaines]         = useState([]);
  const [formateurs, setFormateurs]     = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [submitting, setSubmitting]     = useState(false);
  const [filteredFormations, setFilteredFormations] = useState([]);

  const [modal, setModal] = useState(null);
  // modal = null | 'form' | 'affect' | 'inscribe' | 'detail'

  const [formData, setFormData]                   = useState(EMPTY_FORM);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [selectedFormateurId, setSelectedFormateurId] = useState('');
  const [selectedPIds, setSelectedPIds]           = useState([]);
  const [inscrits, setInscrits]                   = useState([]);
  const [formParticipantIds, setFormParticipantIds] = useState([]);
  const [initialParticipantIds, setInitialParticipantIds] = useState([]);
  const [participantsDropdownOpen, setParticipantsDropdownOpen] = useState(false);

  // ── Load ─────────────────────────────────────────────────────
  const load = async () => {
    try {
      const [f, d, fmt, p] = await Promise.all([
        api.get('/formations'),
        api.get('/referentiels/domaines'),
        api.get('/formateurs'),
        api.get('/participants'),
      ]);
      setFormations(f); setDomaines(d);
      setFormateurs(fmt); setParticipants(p);
    } catch (err) { addToast(mapError(err), 'error'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const closeModal = () => {
    setModal(null);
    setSelectedFormation(null);
    setParticipantsDropdownOpen(false);
    setFormParticipantIds([]);
    setInitialParticipantIds([]);
  };

  // ── Filters ────────────────────────────────────────────────
  const domaineOptions = useMemo(() => 
    domaines.map(d => ({ value: d.libelle, label: d.libelle })),
  [domaines]);

  const yearOptions = useMemo(() => {
    const years = [...new Set(formations.map(f => f.annee))].sort((a, b) => b - a);
    return years.map(y => ({ value: y.toString(), label: y.toString() }));
  }, [formations]);

  // ── CRUD ─────────────────────────────────────────────────────
  const openCreate = () => {
    setFormData(EMPTY_FORM);
    setFormParticipantIds([]);
    setInitialParticipantIds([]);
    setParticipantsDropdownOpen(false);
    setModal('form');
  };
  const openEdit = async (f) => {
    setFormData({
      id: f.id,
      titre: f.titre,
      annee: f.annee,
      duree: f.duree,
      budget: f.budget,
      domaineId: domaines.find(d => d.libelle === f.domaineLibelle)?.id ?? '',
      formateurId: formateurs.find(x => `${x.nom} ${x.prenom}` === f.formateurNomComplet)?.id ?? '',
    });
    setParticipantsDropdownOpen(false);
    try {
      const enrolled = await api.get(`/formations/${f.id}/participants`);
      const ids = enrolled.map(p => p.id);
      setInitialParticipantIds(ids);
      setFormParticipantIds(ids);
    } catch (err) {
      addToast(mapError(err), 'error');
      setInitialParticipantIds([]);
      setFormParticipantIds([]);
    }
    setModal('form');
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      const payload = {
        titre: formData.titre, annee: +formData.annee,
        duree: +formData.duree, budget: +formData.budget,
        domaineId: +formData.domaineId,
        formateurId: formData.formateurId ? +formData.formateurId : null,
      };
      if (formData.id) {
        await api.put(`/formations/${formData.id}`, payload);

        const want = new Set(formParticipantIds);
        const had = new Set(initialParticipantIds);
        const toAdd = [...want].filter(id => !had.has(id));
        const toRemove = [...had].filter(id => !want.has(id));

        if (toAdd.length) {
          await api.post(`/formations/${formData.id}/participants`, toAdd);
        }
        for (const pId of toRemove) {
          await api.delete(`/formations/${formData.id}/participants/${pId}`);
        }

        addToast('Formation mise à jour', 'success');
      } else {
        const created = await api.post('/formations', payload);
        const newId = created?.id;
        if (newId && formParticipantIds.length) {
          await api.post(`/formations/${newId}/participants`, formParticipantIds);
        }
        addToast('Formation créée avec succès', 'success');
      }
      closeModal(); load();
    } catch (err) { addToast(mapError(err), 'error'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette formation définitivement ?')) return;
    try {
      await api.delete(`/formations/${id}`);
      addToast('Formation supprimée', 'success'); load();
    } catch (err) { addToast(mapError(err), 'error'); }
  };

  // ── Affectation ───────────────────────────────────────────────
  const openAffect = (f) => {
    setSelectedFormation(f); setSelectedFormateurId(''); setModal('affect');
  };
  const handleAffect = async () => {
    if (!selectedFormateurId) return; setSubmitting(true);
    try {
      await api.put(`/formations/${selectedFormation.id}/formateur/${selectedFormateurId}`);
      addToast('Formateur affecté avec succès', 'success');
      closeModal(); load();
    } catch (err) { addToast(mapError(err), 'error'); }
    finally { setSubmitting(false); }
  };

  // ── Inscription ───────────────────────────────────────────────
  const openInscribe = async (f) => {
    setSelectedFormation(f); setSelectedPIds([]);
    try {
      const ins = await api.get(`/formations/${f.id}/participants`);
      setInscrits(ins.map(p => p.id));
    } catch { setInscrits([]); }
    setModal('inscribe');
  };
  const toggleP = (id) =>
    setSelectedPIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const handleInscrire = async () => {
    if (!selectedPIds.length) return; setSubmitting(true);
    try {
      await api.post(`/formations/${selectedFormation.id}/participants`, selectedPIds);
      addToast(`${selectedPIds.length} participant(s) inscrits`, 'success');
      closeModal(); load();
    } catch (err) { addToast(mapError(err), 'error'); }
    finally { setSubmitting(false); }
  };
  const handleDesinscrire = async (pId) => {
    try {
      await api.delete(`/formations/${selectedFormation.id}/participants/${pId}`);
      setInscrits(prev => prev.filter(id => id !== pId));
      addToast('Participant désinscrit', 'success'); load();
    } catch (err) { addToast(mapError(err), 'error'); }
  };

  // ── Détail ────────────────────────────────────────────────────
  const openDetail = async (f) => {
    setSelectedFormation(f);
    try {
      const ins = await api.get(`/formations/${f.id}/participants`);
      setInscrits(ins);
    } catch { setInscrits([]); }
    setModal('detail');
  };

  const inputCls = `w-full bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-xl
    py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium`;

  const participantsById = useMemo(() => {
    const m = new Map();
    for (const p of participants) m.set(p.id, p);
    return m;
  }, [participants]);

  const selectedParticipantsPreview = useMemo(() => (
    formParticipantIds
      .map(id => participantsById.get(id))
      .filter(Boolean)
      .slice(0, 2)
  ), [formParticipantIds, participantsById]);

  return (
    <Layout>
      <PageHeader
        icon={BookOpen}
        iconContainerClassName="bg-blue-500/10 text-blue-500 border-blue-500/20"
        iconClassName="text-blue-500"
        title="Formations"
        subtitle={`${formations.length} formation${formations.length !== 1 ? 's' : ''} au total`}
        action={(
          <button
            onClick={openCreate}
            className="btn-prism flex items-center gap-2 shadow-xl shadow-blue-500/10"
          >
            <Plus size={18} />
            <span>Nouvelle formation</span>
          </button>
        )}
      />

      {/* ── Filters ── */}
      <FilterBar 
        data={formations}
        searchKeys={['titre', 'domaineLibelle', 'formateurNomComplet']}
        onFilter={setFilteredFormations}
        placeholder="Rechercher par titre, domaine ou formateur..."
        filterConfigs={[
          { key: 'domaineLibelle', label: 'Domaine', options: domaineOptions },
          { key: 'annee', label: 'Année', options: yearOptions }
        ]}
      />

      {/* ── Table ── */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      ) : filteredFormations.length === 0 ? (
        <EmptyState
          icon={<BookOpen size={40} className="text-[var(--color-text-muted)]" />}
          title="Aucune formation trouvée"
          description={formations.length > 0 ? 'Essayez d\'autres filtres' : 'Créez votre première formation'}
          action={formations.length === 0 && (
            <button onClick={openCreate} className="btn-prism px-4 py-2 rounded-xl text-sm font-bold font-display flex items-center gap-2">
              <Plus size={14} /> Nouvelle formation
            </button>
          )}
        />
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                  {['Formation', 'Année', 'Durée', 'Budget', 'Domaine', 'Formateur', 'Inscrits', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredFormations.map((f, i) => (
                  <motion.tr 
                    key={f.id}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className={`border-b border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)] transition-colors
                      ${i === filteredFormations.length - 1 ? 'border-0' : ''}`}
                  >
                    <td className="px-4 py-4">
                      <button onClick={() => openDetail(f)}
                        className="font-semibold text-[var(--color-text-primary)] hover:text-blue-500 transition-colors flex items-center gap-1.5 group">
                        {f.titre}
                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
                        <Calendar size={13} /> {f.annee}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
                        <Clock size={13} /> {f.duree}j
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
                        <Wallet size={13} /> {f.budget?.toLocaleString()} DT
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1 bg-purple-500/10 text-purple-500 text-xs font-semibold px-2.5 py-1 rounded-lg">
                        <Tag size={11} /> {f.domaineLibelle || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {f.formateurNomComplet ? (
                        <span className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
                          <GraduationCap size={13} /> {f.formateurNomComplet}
                        </span>
                      ) : (
                        <button onClick={() => openAffect(f)}
                          className="text-xs text-amber-500 hover:text-amber-600 font-semibold flex items-center gap-1 transition-colors">
                          <User size={12} /> Affecter
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-500 text-xs font-semibold px-2.5 py-1 rounded-lg">
                        <Users size={11} /> {f.nombreParticipants}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        {/* Voir détail */}
                        <button onClick={() => openDetail(f)}
                          title="Voir le détail"
                          className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-blue-500/10 hover:text-blue-500 transition-all">
                          <Eye size={15} />
                        </button>
                        {/* Modifier */}
                        <button onClick={() => openEdit(f)}
                          title="Modifier"
                          className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-indigo-500/10 hover:text-indigo-500 transition-all">
                          <Pencil size={15} />
                        </button>
                        {/* Affecter formateur */}
                        <button onClick={() => openAffect(f)}
                          title="Affecter un formateur"
                          className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-amber-500/10 hover:text-amber-500 transition-all">
                          <GraduationCap size={15} />
                        </button>
                        {/* Inscrire participants */}
                        <button onClick={() => openInscribe(f)}
                          title="Gérer les participants"
                          className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-green-500/10 hover:text-green-500 transition-all">
                          <UserPlus size={15} />
                        </button>
                        {/* Supprimer */}
                        <button onClick={() => handleDelete(f.id)}
                          title="Supprimer"
                          className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-red-500/10 hover:text-red-500 transition-all">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* ════════════════════════════════════════
          MODAL — Créer / Modifier
      ════════════════════════════════════════ */}
      {modal === 'form' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
              <div>
                <h2 className="text-lg font-bold font-display text-[var(--color-text-primary)]">
                  {formData.id ? 'Modifier la formation' : 'Nouvelle formation'}
                </h2>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                  {formData.id ? 'Mettez à jour les informations' : 'Remplissez les champs ci-dessous'}
                </p>
              </div>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-[var(--color-bg-secondary)] transition-colors text-[var(--color-text-muted)]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Field label="Titre de la formation" icon={BookOpen} color="text-blue-500">
                <input required value={formData.titre}
                  onChange={e => setFormData(prev => ({ ...prev, titre: e.target.value }))}
                  className={inputCls} placeholder="Ex: Spring Boot & Microservices" />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Année" icon={Calendar} color="text-indigo-500">
                  <input required type="number" min="2000" max="2100"
                    value={formData.annee}
                    onChange={e => setFormData(prev => ({ ...prev, annee: e.target.value }))}
                    className={inputCls} />
                </Field>
                <Field label="Durée (jours)" icon={Clock} color="text-violet-500">
                  <input required type="number" min="1"
                    value={formData.duree}
                    onChange={e => setFormData(prev => ({ ...prev, duree: e.target.value }))}
                    className={inputCls} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Budget (DT)" icon={Wallet} color="text-emerald-500">
                  <input required type="number" min="0" step="0.01"
                    value={formData.budget}
                    onChange={e => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                    className={inputCls} />
                </Field>
                <Field label="Domaine" icon={Tag} color="text-purple-500">
                  <select required value={formData.domaineId}
                    onChange={e => setFormData(prev => ({ ...prev, domaineId: e.target.value }))}
                    className={`${inputCls} appearance-none`}>
                    <option value="">Sélectionner</option>
                    {domaines.map(d => <option key={d.id} value={d.id}>{d.libelle}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Formateur (optionnel)" icon={GraduationCap} color="text-amber-500">
                <select
                  value={formData.formateurId}
                  onChange={e => setFormData(prev => ({ ...prev, formateurId: e.target.value }))}
                  className={`${inputCls} appearance-none`}
                >
                  <option value="">Aucun formateur</option>
                  {formateurs.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.nom} {f.prenom} — {f.type}
                    </option>
                  ))}
                </select>
              </Field>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] ml-1">
                  Participants (optionnel)
                </label>
                <button
                  type="button"
                  onClick={() => setParticipantsDropdownOpen(v => !v)}
                  className="w-full bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm font-medium
                    hover:bg-[var(--color-bg-secondary)] transition-all flex items-center justify-between"
                >
                  <span className="text-[var(--color-text-primary)]">
                    {formParticipantIds.length
                      ? `${formParticipantIds.length} sélectionné(s)`
                      : 'Sélectionner des participants'}
                  </span>
                  <ChevronRight
                    size={16}
                    className={`text-[var(--color-text-muted)] transition-transform ${participantsDropdownOpen ? 'rotate-90' : ''}`}
                  />
                </button>

                {formParticipantIds.length > 0 && (
                  <div className="text-xs text-[var(--color-text-muted)]">
                    {selectedParticipantsPreview.map(p => `${p.nom} ${p.prenom}`).join(', ')}
                    {formParticipantIds.length > selectedParticipantsPreview.length ? '…' : ''}
                  </div>
                )}

                {participantsDropdownOpen && (
                  <div className="border border-[var(--color-border)] rounded-xl bg-[var(--color-bg-main)] max-h-56 overflow-y-auto p-2 space-y-1.5">
                    {participants.length === 0 ? (
                      <p className="text-xs text-[var(--color-text-muted)] italic text-center py-3">
                        Aucun participant disponible
                      </p>
                    ) : (
                      participants.map(p => {
                        const checked = formParticipantIds.includes(p.id);
                        return (
                          <label
                            key={p.id}
                            className={[
                              'flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all border',
                              checked
                                ? 'bg-blue-500/10 border-blue-500/30'
                                : 'border-transparent hover:bg-[var(--color-bg-secondary)]',
                            ].join(' ')}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {
                                setFormParticipantIds(prev =>
                                  prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id]
                                );
                              }}
                              className="rounded accent-blue-500"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-medium text-[var(--color-text-primary)]">
                                {p.nom} {p.prenom}
                              </span>
                              <span className="text-xs text-[var(--color-text-muted)] ml-2">
                                {p.profilLibelle || '—'}
                              </span>
                            </div>
                            <span className="text-xs text-[var(--color-text-muted)] truncate max-w-[35%]">
                              {p.structureLibelle || '—'}
                            </span>
                          </label>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal}
                  className="flex-1 px-4 py-3 rounded-xl border border-[var(--color-border)] text-sm font-bold
                    text-[var(--color-text-muted)] hover:bg-[var(--color-bg-secondary)] transition-all font-display">
                  Annuler
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-[2] btn-prism px-6 py-3 rounded-xl shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all">
                  <div className="flex items-center justify-center gap-2">
                    {submitting
                      ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <Plus size={16} />}
                    <span className="font-bold font-display text-sm">
                      {submitting ? 'Enregistrement...' : formData.id ? 'Mettre à jour' : 'Créer la formation'}
                    </span>
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          MODAL — Affecter Formateur
      ════════════════════════════════════════ */}
      {modal === 'affect' && selectedFormation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
              <div>
                <h2 className="text-lg font-bold font-display text-[var(--color-text-primary)]">Affecter un formateur</h2>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5 truncate max-w-[260px]">{selectedFormation.titre}</p>
              </div>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-[var(--color-bg-secondary)] transition-colors text-[var(--color-text-muted)]">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Field label="Formateur" icon={GraduationCap} color="text-amber-500">
                <select value={selectedFormateurId}
                  onChange={e => setSelectedFormateurId(e.target.value)}
                  className={`${inputCls} appearance-none`}>
                  <option value="">Sélectionner un formateur</option>
                  {formateurs.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.nom} {f.prenom} — {f.type}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="flex gap-3">
                <button onClick={closeModal}
                  className="flex-1 px-4 py-3 rounded-xl border border-[var(--color-border)] text-sm font-bold
                    text-[var(--color-text-muted)] hover:bg-[var(--color-bg-secondary)] transition-all font-display">
                  Annuler
                </button>
                <button onClick={handleAffect} disabled={!selectedFormateurId || submitting}
                  className="flex-[2] btn-prism px-6 py-3 rounded-xl shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all">
                  <div className="flex items-center justify-center gap-2">
                    {submitting
                      ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <GraduationCap size={16} />}
                    <span className="font-bold font-display text-sm">
                      {submitting ? 'Affectation...' : 'Affecter'}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          MODAL — Inscrire Participants
      ════════════════════════════════════════ */}
      {modal === 'inscribe' && selectedFormation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
              <div>
                <h2 className="text-lg font-bold font-display text-[var(--color-text-primary)]">Gérer les participants</h2>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5 truncate max-w-[280px]">{selectedFormation.titre}</p>
              </div>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-[var(--color-bg-secondary)] transition-colors text-[var(--color-text-muted)]">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">

              {/* Inscrits */}
              {inscrits.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
                    Déjà inscrits ({inscrits.length})
                  </p>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {participants.filter(p => inscrits.includes(p.id)).map(p => (
                      <div key={p.id}
                        className="flex justify-between items-center bg-green-500/5 border border-green-500/20 rounded-xl px-3 py-2">
                        <div>
                          <span className="text-sm font-medium text-[var(--color-text-primary)]">{p.nom} {p.prenom}</span>
                          <span className="text-xs text-[var(--color-text-muted)] ml-2">{p.structureLibelle}</span>
                        </div>
                        <button onClick={() => handleDesinscrire(p.id)}
                          className="p-1 rounded-lg hover:bg-red-500/10 hover:text-red-500 text-[var(--color-text-muted)] transition-all">
                          <UserMinus size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* À inscrire */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
                  Sélectionner pour inscrire
                </p>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {participants.filter(p => !inscrits.includes(p.id)).length === 0 ? (
                    <p className="text-xs text-[var(--color-text-muted)] italic text-center py-3">Tous les participants sont inscrits</p>
                  ) : (
                    participants.filter(p => !inscrits.includes(p.id)).map(p => (
                      <label key={p.id}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all border
                          ${selectedPIds.includes(p.id)
                            ? 'bg-blue-500/10 border-blue-500/30'
                            : 'border-transparent hover:bg-[var(--color-bg-secondary)]'}`}>
                        <input type="checkbox" checked={selectedPIds.includes(p.id)}
                          onChange={() => toggleP(p.id)} className="rounded accent-blue-500" />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-[var(--color-text-primary)]">{p.nom} {p.prenom}</span>
                          <span className="text-xs text-[var(--color-text-muted)] ml-2">{p.profilLibelle}</span>
                        </div>
                        <span className="text-xs text-[var(--color-text-muted)]">{p.structureLibelle}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button onClick={closeModal}
                  className="flex-1 px-4 py-3 rounded-xl border border-[var(--color-border)] text-sm font-bold
                    text-[var(--color-text-muted)] hover:bg-[var(--color-bg-secondary)] transition-all font-display">
                  Fermer
                </button>
                {selectedPIds.length > 0 && (
                  <button onClick={handleInscrire} disabled={submitting}
                    className="flex-[2] btn-prism px-6 py-3 rounded-xl shadow-lg shadow-green-500/20 disabled:opacity-50 transition-all">
                    <div className="flex items-center justify-center gap-2">
                      {submitting
                        ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        : <UserPlus size={16} />}
                      <span className="font-bold font-display text-sm">
                        {submitting ? 'Inscription...' : `Inscrire (${selectedPIds.length})`}
                      </span>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          MODAL — Détail Formation
      ════════════════════════════════════════ */}
      {modal === 'detail' && selectedFormation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
              <h2 className="text-lg font-bold font-display text-[var(--color-text-primary)]">
                {selectedFormation.titre}
              </h2>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-[var(--color-bg-secondary)] transition-colors text-[var(--color-text-muted)]">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Calendar, label: 'Année', value: selectedFormation.annee, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                  { icon: Clock, label: 'Durée', value: `${selectedFormation.duree} jour(s)`, color: 'text-violet-500', bg: 'bg-violet-500/10' },
                  { icon: Wallet, label: 'Budget', value: `${selectedFormation.budget?.toLocaleString()} DT`, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                  { icon: Tag, label: 'Domaine', value: selectedFormation.domaineLibelle, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                ].map(({ icon: Icon, label, value, color, bg }) => (
                  <div key={label} className={`${bg} rounded-xl p-3`}>
                    <div className={`flex items-center gap-1.5 ${color} mb-1`}>
                      <Icon size={13} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
                    </div>
                    <p className="text-sm font-bold text-[var(--color-text-primary)]">{value || '—'}</p>
                  </div>
                ))}
              </div>

              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-amber-500 mb-1">
                  <GraduationCap size={13} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Formateur</span>
                </div>
                <p className="text-sm font-bold text-[var(--color-text-primary)]">
                  {selectedFormation.formateurNomComplet || '—'}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
                  Participants inscrits ({Array.isArray(inscrits) ? inscrits.length : 0})
                </p>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {Array.isArray(inscrits) && inscrits.length > 0 ? inscrits.map(p => (
                    <div key={p.id}
                      className="flex justify-between items-center bg-[var(--color-bg-secondary)] rounded-xl px-3 py-2">
                      <span className="text-sm font-medium text-[var(--color-text-primary)]">{p.nom} {p.prenom}</span>
                      <span className="text-xs text-[var(--color-text-muted)]">{p.structureLibelle}</span>
                    </div>
                  )) : (
                    <p className="text-xs text-[var(--color-text-muted)] italic text-center py-2">Aucun participant inscrit</p>
                  )}
                </div>
              </div>

              <button onClick={closeModal}
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] text-sm font-bold
                  text-[var(--color-text-muted)] hover:bg-[var(--color-bg-secondary)] transition-all font-display">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
