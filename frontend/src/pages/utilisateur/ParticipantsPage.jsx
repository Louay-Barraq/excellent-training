import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../../services/api';
import Layout from '../../components/Layout';
import { SkeletonTable } from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';
import { Plus, Users, Building2, UserCircle, Edit2, Trash2, Search, Filter, X, Mail, Phone, Briefcase } from 'lucide-react';
import { mapError } from '../../utils/errorMapper';
import { useToast } from '../../context/ToastContext';
import FilterBar from '../../components/FilterBar';
import ConfirmModal from '../../components/ConfirmModal';
import Pagination from '../../components/Pagination';
import { motion } from 'framer-motion';

const ParticipantsPage = () => {
  const [participants, setParticipants] = useState([]);
  const [structures, setStructures] = useState([]);
  const [profils, setProfils] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [filteredParticipantsData, setFilteredParticipantsData] = useState([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailParticipant, setDetailParticipant] = useState(null);
  const [detailFormations, setDetailFormations] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    id: null,
    nom: '',
    prenom: '',
    email: '',
    tel: '',
    structureId: '',
    profilId: ''
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [pData, sData, prData] = await Promise.all([
        api.get('/participants'),
        api.get('/referentiels/structures'),
        api.get('/referentiels/profils')
      ]);
      setParticipants(pData);
      setStructures(sData);
      setProfils(prData);
    } catch (err) {
      addToast(mapError(err), 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const pagedParticipants = useMemo(() =>
    filteredParticipantsData.slice((page - 1) * pageSize, page * pageSize),
  [filteredParticipantsData, page, pageSize]);

  useEffect(() => {
    if (editingParticipant) {
      setFormData({
        id: editingParticipant.id,
        nom: editingParticipant.nom,
        prenom: editingParticipant.prenom,
        email: editingParticipant.email,
        tel: editingParticipant.tel.toString(),
        structureId: structures.find(s => s.libelle === editingParticipant.structureLibelle)?.id || '',
        profilId: profils.find(p => p.libelle === editingParticipant.profilLibelle)?.id || ''
      });
    } else {
      setFormData({
        id: null,
        nom: '',
        prenom: '',
        email: '',
        tel: '',
        structureId: '',
        profilId: ''
      });
    }
  }, [editingParticipant, structures, profils]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        tel: parseInt(formData.tel) || 0,
        structureId: parseInt(formData.structureId),
        profilId: parseInt(formData.profilId)
      };

      if (formData.id) {
        await api.put(`/participants/${formData.id}`, payload);
        addToast('Participant mis à jour avec succès', 'success');
      } else {
        await api.post('/participants', payload);
        addToast('Participant créé avec succès', 'success');
      }
      
      setIsModalOpen(false);
      setEditingParticipant(null);
      fetchData();
    } catch (err) {
      addToast(mapError(err), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (participant) => {
    setEditingParticipant(participant);
    setIsModalOpen(true);
  };

  const openDetail = async (participant) => {
    setDetailOpen(true);
    setDetailParticipant(participant);
    setDetailFormations([]);
    setDetailLoading(true);
    try {
      const [p, formations] = await Promise.all([
        api.get(`/participants/${participant.id}`),
        api.get(`/participants/${participant.id}/formations`),
      ]);
      setDetailParticipant({ ...participant, ...p });
      setDetailFormations(formations || []);
    } catch (err) {
      addToast(mapError(err), 'error');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDelete = (id) => setConfirmDeleteId(id);
  const executeDelete = async () => {
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    try {
      await api.delete(`/participants/${id}`);
      addToast('Participant supprimé', 'success');
      fetchData();
    } catch (err) {
      addToast(mapError(err), 'error');
    }
  };

  const structureOptions = Array.from(new Set(participants.map(p => p.structureLibelle).filter(Boolean)))
    .map(s => ({ value: s, label: s }));
    
  const profilOptions = Array.from(new Set(participants.map(p => p.profilLibelle).filter(Boolean)))
    .map(p => ({ value: p, label: p }));

  const uniqueStructures = new Set(participants.map(p => p.structureLibelle).filter(Boolean)).size;
  const uniqueProfils = new Set(participants.map(p => p.profilLibelle).filter(Boolean)).size;

  return (
    <Layout>
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 border border-indigo-500/20 shadow-inner"
            >
              <Users size={24} strokeWidth={1.5} />
            </motion.div>
            <div>
              <h1 className="text-4xl font-display font-bold tracking-tight text-[var(--color-text-main)]">
                Participants
              </h1>
              <p className="text-[var(--color-text-muted)] text-sm font-medium">
                Annuaire stratégique des experts et intervenants
              </p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => {
            setEditingParticipant(null);
            setIsModalOpen(true);
          }}
          className="btn-prism flex items-center gap-2 shadow-xl shadow-indigo-500/10"
        >
          <Plus size={18} />
          <span>Inscrire un Participant</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: 'Total Inscrits', value: participants.length, unit: 'individus', icon: Users, color: 'indigo' },
          { label: 'Structures', value: uniqueStructures, unit: 'organisations', icon: Building2, color: 'cyan' },
          { label: 'Profils Types', value: uniqueProfils, unit: 'catégories', icon: UserCircle, color: 'lime' }
        ].map((m, idx) => (
          <motion.div 
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`card-prism p-6 group hover:border-${m.color}-500/30 transition-all duration-500`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest font-bold">{m.label}</span>
              <div className={`p-2 bg-${m.color}-500/10 rounded-lg text-${m.color}-500 group-hover:scale-110 transition-transform`}>
                <m.icon size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-display font-bold text-[var(--color-text-main)] font-sans">{m.value}</span>
              <span className="text-[var(--color-text-muted)] text-xs font-medium">{m.unit}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {/* Filters */}
        <FilterBar 
          data={participants}
          searchKeys={['nom', 'prenom', 'email', 'structureLibelle', 'profilLibelle']}
          onFilter={(data) => { setFilteredParticipantsData(data); setPage(1); }}
          placeholder="Rechercher par nom, email, structure..."
          filterConfigs={[
            { key: 'structureLibelle', label: 'Structure', options: structureOptions },
            { key: 'profilLibelle', label: 'Profil', options: profilOptions }
          ]}
        />

        {loading ? (
          <SkeletonTable rows={5} />
        ) : filteredParticipantsData.length === 0 ? (
          <EmptyState 
            title={participants.length > 0 ? "Aucun résultat trouvé" : "Aucun participant"} 
            description={participants.length > 0 ? "Pas de participant correspondant à vos filtres" : "Le registre des participants est vide. Commencez par inscrire un nouvel apprenant."}
            action={participants.length === 0 ? { label: 'Ajouter un participant', onClick: () => setIsModalOpen(true) } : null}
          />
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-prism overflow-hidden shadow-sm"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--color-surface-hover)]/50">
                    <th className="px-8 py-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Identité / Profil</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Contact</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Structure</th>
                    <th className="px-8 py-4 text-right text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {pagedParticipants.map((p, idx) => (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => openDetail(p)}
                      className="hover:bg-[var(--color-surface-hover)]/30 transition-colors group cursor-pointer"
                    >
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1.5">
                          <span className="font-bold text-[var(--color-text-main)] text-lg tracking-tight leading-none group-hover:text-indigo-500 transition-colors">
                            {p.nom} {p.prenom}
                          </span>
                          <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest bg-indigo-500/5 w-fit px-2 py-0.5 rounded-md border border-indigo-500/10">
                            {p.profilLibelle || 'Non Défini'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-semibold text-[var(--color-text-muted)]">{p.email}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-[var(--color-text-main)] font-bold text-xs uppercase tracking-tight">
                          <Building2 size={14} className="text-[var(--color-text-muted)]" />
                          <span>{p.structureLibelle || '—'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleEdit(p); }}
                            className="p-2.5 rounded-lg border border-[var(--color-border)] hover:bg-indigo-500/10 hover:text-indigo-500 transition-all shadow-sm"
                            title="Modifier"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}
                            className="p-2.5 rounded-lg border border-[var(--color-border)] hover:bg-rose-500/10 hover:text-rose-500 transition-all shadow-sm"
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              total={filteredParticipantsData.length}
              page={page}
              pageSize={pageSize}
              onPage={setPage}
              onPageSize={setPageSize}
            />
            <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-surface-hover)]/20 flex justify-between items-center text-xs text-[var(--color-text-muted)] font-medium">
               <span>Affichage de {filteredParticipantsData.length} participants</span>
               <span className="uppercase tracking-widest opacity-50">Excellent Training</span>
            </div>
          </motion.div>
        )}

        {/* Create Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="card-prism w-full max-w-xl p-8 space-y-6 shadow-2xl border border-indigo-500/20 animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-display font-bold text-[var(--color-text-main)] flex items-center gap-3">
                  <Plus className="text-indigo-500" /> {formData.id ? 'Modifier' : 'Inscrire'} un <span className="text-indigo-500">Participant</span>
                </h2>
                <button onClick={() => {
                  setIsModalOpen(false);
                  setEditingParticipant(null);
                }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-[var(--color-text-muted)]">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] ml-1">Prénom</label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500/50" size={16} />
                    <input 
                      required
                      value={formData.prenom}
                      onChange={e => setFormData({...formData, prenom: e.target.value})}
                      className="w-full bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-medium"
                      placeholder="Prénom"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] ml-1">Nom</label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500/50" size={16} />
                    <input 
                      required
                      value={formData.nom}
                      onChange={e => setFormData({...formData, nom: e.target.value})}
                      className="w-full bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-medium"
                      placeholder="Nom de famille"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] ml-1">Email Professionnel</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/50" size={16} />
                    <input 
                      required
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all font-medium"
                      placeholder="expert@company.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] ml-1">Téléphone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-lime-500/50" size={16} />
                    <input 
                      type="tel"
                      value={formData.tel}
                      onChange={e => setFormData({...formData, tel: e.target.value})}
                      className="w-full bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-lime-500/20 outline-none transition-all font-medium"
                      placeholder="+216 -- --- ---"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] ml-1">Structure d'Origine</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500/50" size={16} />
                    <select 
                      required
                      value={formData.structureId}
                      onChange={e => setFormData({...formData, structureId: e.target.value})}
                      className="w-full bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-medium appearance-none"
                    >
                      <option value="">Sélectionner une structure</option>
                      {structures.map(s => (
                        <option key={s.id} value={s.id}>{s.libelle}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] ml-1">Profil Métier</label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/50" size={16} />
                    <select 
                      required
                      value={formData.profilId}
                      onChange={e => setFormData({...formData, profilId: e.target.value})}
                      className="w-full bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all font-medium appearance-none"
                    >
                      <option value="">Sélectionner un profil</option>
                      {profils.map(p => (
                        <option key={p.id} value={p.id}>{p.libelle}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 rounded-xl border border-[var(--color-border)] text-sm font-bold text-[var(--color-text-muted)] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-display"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="flex-3 btn-prism px-6 py-3 rounded-xl shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition-all"
                  >
                    <div className="flex items-center justify-center gap-2">
                      {submitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Plus size={18} />
                      )}
                      <span className="font-bold font-display">{formData.id ? 'Mettre à jour' : 'Inscrire Participant'}</span>
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {detailOpen && detailParticipant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="card-prism w-full max-w-2xl p-8 space-y-6 shadow-2xl border border-indigo-500/20 animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 border border-indigo-500/20 shadow-inner">
                    <UserCircle size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold text-[var(--color-text-main)] tracking-tight">
                      {detailParticipant.nom} {detailParticipant.prenom}
                    </h2>
                    <p className="text-[var(--color-text-muted)] text-sm font-medium">
                      {detailParticipant.profilLibelle || 'Profil non défini'} · {detailParticipant.structureLibelle || 'Structure —'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setDetailOpen(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-[var(--color-text-muted)]"
                >
                  <X size={20} />
                </button>
              </div>

              {detailLoading ? (
                <SkeletonTable rows={4} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest font-bold">
                      Informations
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-main)]">
                        <Mail size={16} className="text-cyan-500/70" />
                        <span className="truncate">{detailParticipant.email || '—'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-main)]">
                        <Phone size={16} className="text-lime-500/70" />
                        <span>{detailParticipant.tel || '—'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest font-bold">
                      Formations
                    </p>
                    {detailFormations.length === 0 ? (
                      <p className="text-xs text-[var(--color-text-muted)] italic">
                        Aucune formation pour ce participant.
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                        {detailFormations.map(f => (
                          <div
                            key={f.id}
                            className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-main)]/40 hover:bg-[var(--color-surface-hover)] transition-colors"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-[var(--color-text-main)] truncate">
                                  {f.titre}
                                </p>
                                <p className="text-xs text-[var(--color-text-muted)]">
                                  {f.annee} · {f.duree}j · {f.domaineLibelle || '—'}
                                </p>
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded-lg">
                                {f.nombreParticipants} inscrits
                              </span>
                            </div>
                            {f.formateurNomComplet && (
                              <p className="text-xs text-[var(--color-text-muted)] mt-2">
                                Formateur: <span className="font-semibold text-[var(--color-text-main)]">{f.formateurNomComplet}</span>
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDetailOpen(false)}
                  className="px-4 py-3 rounded-xl border border-[var(--color-border)] text-sm font-bold text-[var(--color-text-muted)] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-display"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ConfirmModal
        isOpen={confirmDeleteId !== null}
        title="Supprimer le participant"
        message="Ce participant sera définitivement supprimé. Cette action est irréversible."
        onConfirm={executeDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </Layout>
  );
};

export default ParticipantsPage;