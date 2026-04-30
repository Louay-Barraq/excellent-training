import { useEffect, useState, useContext, useCallback, useMemo } from 'react';
import { api } from '../../services/api';
import Layout from '../../components/Layout';
import { SkeletonTable } from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';
import { Search, Plus, Trash2, Edit2, Check, X, Mail, Phone, Building2, Briefcase, Users, Award, BadgeCheck, AlertCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { errorMapper } from '../../utils/errorMapper';
import FilterBar from '../../components/FilterBar';
import ConfirmModal from '../../components/ConfirmModal';
import Pagination from '../../components/Pagination';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const ExpertModal = ({ isOpen, onClose, onFinish, employeurs, initialData }) => {
  const [formData, setFormData] = useState({
    id: null,
    nom: '',
    prenom: '',
    email: '',
    tel: '',
    type: 'INTERNE',
    employeurId: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        nom: initialData.nom,
        prenom: initialData.prenom,
        email: initialData.email,
        tel: initialData.tel,
        type: initialData.type,
        employeurId: employeurs.find(e => e.nomEmployeur === initialData.nomEmployeur)?.id || ''
      });
    } else {
      setFormData({
        id: null,
        nom: '',
        prenom: '',
        email: '',
        tel: '',
        type: 'INTERNE',
        employeurId: ''
      });
    }
  }, [initialData, employeurs]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const payload = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        tel: formData.tel,
        type: formData.type,
        employeurId: formData.type === 'EXTERNE' ? (parseInt(formData.employeurId) || null) : null
      };
      
      if (formData.id) {
        await api.put(`/formateurs/${formData.id}`, payload);
        addToast('Expert mis à jour avec succès', 'success');
      } else {
        await api.post('/formateurs', payload);
        addToast('Expert ajouté avec succès', 'success');
      }
      onFinish();
      onClose();
    } catch (err) {
      if (err.fieldErrors) {
        setErrors(err.fieldErrors);
      } else {
        setErrors({ global: errorMapper.mapError(err) });
      }
      addToast(errorMapper.mapError(err), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="card-prism w-full max-w-xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-surface-hover)]/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-500">
              <Award size={20} />
            </div>
            <h2 className="text-xl font-display font-bold text-[var(--color-text-main)]">
                {formData.id ? 'Modifier' : 'Nouveau'} Formateur
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-rose-500/10 hover:text-rose-500 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {errors.global && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-500 text-xs font-bold uppercase tracking-wider">
              <AlertCircle size={16} />
              <span>{errors.global}</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Nom</label>
              <input
                type="text"
                required
                className={`w-full bg-[var(--color-bg-main)] border ${errors.nom ? 'border-rose-500' : 'border-[var(--color-border)]'} rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all outline-none`}
                placeholder="Ex: Dupont"
                value={formData.nom}
                onChange={e => setFormData({ ...formData, nom: e.target.value })}
              />
              {errors.nom && <p className="text-[10px] text-rose-500 font-bold uppercase">{errors.nom}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Prénom</label>
              <input
                type="text"
                required
                className={`w-full bg-[var(--color-bg-main)] border ${errors.prenom ? 'border-rose-500' : 'border-[var(--color-border)]'} rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all outline-none`}
                placeholder="Ex: Jean"
                value={formData.prenom}
                onChange={e => setFormData({ ...formData, prenom: e.target.value })}
              />
              {errors.prenom && <p className="text-[10px] text-rose-500 font-bold uppercase">{errors.prenom}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={16} />
                <input
                  type="email"
                  required
                  className={`w-full bg-[var(--color-bg-main)] border ${errors.email ? 'border-rose-500' : 'border-[var(--color-border)]'} rounded-xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all outline-none`}
                  placeholder="jean.dupont@email.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              {errors.email && <p className="text-[10px] text-rose-500 font-bold uppercase">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Téléphone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={16} />
                <input
                  type="tel"
                  required
                  className={`w-full bg-[var(--color-bg-main)] border ${errors.tel ? 'border-rose-500' : 'border-[var(--color-border)]'} rounded-xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all outline-none`}
                  placeholder="06 12 34 56 78"
                  value={formData.tel}
                  onChange={e => setFormData({ ...formData, tel: e.target.value })}
                />
              </div>
              {errors.tel && <p className="text-[10px] text-rose-500 font-bold uppercase">{errors.tel}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block">Type de Formateur</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'INTERNE' })}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  formData.type === 'INTERNE' 
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500 shadow-lg shadow-indigo-500/20' 
                    : 'border-[var(--color-border)] bg-[var(--color-bg-main)] text-[var(--color-text-muted)] opacity-60'
                }`}
              >
                <Users size={20} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Interne</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'EXTERNE' })}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  formData.type === 'EXTERNE' 
                    ? 'border-cyan-500 bg-cyan-500/10 text-cyan-500 shadow-lg shadow-cyan-500/20' 
                    : 'border-[var(--color-border)] bg-[var(--color-bg-main)] text-[var(--color-text-muted)] opacity-60'
                }`}
              >
                <Briefcase size={20} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Externe</span>
              </button>
            </div>
          </div>

          {formData.type === 'EXTERNE' && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
              <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Employeur / Cabinet</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={16} />
                <select
                  required
                  className={`w-full bg-[var(--color-bg-main)] border ${errors.employeurId ? 'border-rose-500' : 'border-[var(--color-border)]'} rounded-xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all outline-none appearance-none cursor-pointer`}
                  value={formData.employeurId}
                  onChange={e => setFormData({ ...formData, employeurId: e.target.value })}
                >
                  <option value="">Sélectionner un employeur</option>
                  {employeurs.map(e => (
                    <option key={e.id} value={e.id}>{e.nomEmployeur}</option>
                  ))}
                </select>
              </div>
              {errors.employeurId && <p className="text-[10px] text-rose-500 font-bold uppercase">{errors.employeurId}</p>}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 px-6 rounded-xl border border-[var(--color-border)] text-sm font-bold text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-4 px-6 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                    <Check size={18} />
                    <span>{formData.id ? 'Mettre à jour' : "Confirmer l'ajout"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FormateursPage = () => {
  const [formateurs, setFormateurs] = useState([]);
  const [employeurs, setEmployeurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpert, setEditingExpert] = useState(null);
  const [filteredFormateursData, setFilteredFormateursData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const { addToast } = useToast();
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    try {
      const [fData, eData] = await Promise.all([
        api.get('/formateurs'),
        api.get('/referentiels/employeurs')
      ]);
      setFormateurs(fData);
      setEmployeurs(eData);
    } catch (err) {
      console.error(err);
      addToast('Erreur de chargement des données', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const pagedFormateurs = useMemo(() =>
    filteredFormateursData.slice((page - 1) * pageSize, page * pageSize),
  [filteredFormateursData, page, pageSize]);

  const handleEdit = (expert) => {
    setEditingExpert(expert);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => setConfirmDeleteId(id);
  const executeDelete = async () => {
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    try {
      await api.delete(`/formateurs/${id}`);
      setFormateurs(prev => prev.filter(f => f.id !== id));
      addToast('Expert supprimé avec succès', 'success');
    } catch (err) {
      addToast(errorMapper.mapError(err), 'error');
    }
  };


  const internesCount = formateurs.filter(f => f.type === 'INTERNE').length;
  const externesCount = formateurs.filter(f => f.type === 'EXTERNE').length;

  const employeurOptions = Array.from(new Set(formateurs.map(f => f.nomEmployeur).filter(Boolean)))
    .map(e => ({ value: e, label: e }));

  const typeOptions = [
    { value: 'INTERNE', label: 'Interne' },
    { value: 'EXTERNE', label: 'Externe' }
  ];

  return (
    <Layout>
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-500 border border-cyan-500/20 shadow-inner"
            >
              <Award size={24} strokeWidth={1.5} />
            </motion.div>
            <div>
              <h1 className="text-4xl font-display font-bold tracking-tight text-[var(--color-text-main)]">
                Formateurs
              </h1>
              <p className="text-[var(--color-text-muted)] text-sm font-medium">
                Annuaire stratégique des experts et intervenants
              </p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => {
            setEditingExpert(null);
            setIsModalOpen(true);
          }}
          className="btn-prism flex items-center gap-2 shadow-xl shadow-cyan-500/10 bg-cyan-600 hover:bg-cyan-700 border-cyan-500"
        >
          <Plus size={18} />
          <span>Ajouter un Expert</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: 'Total Experts', value: formateurs.length, unit: 'accrédités', icon: BadgeCheck, color: 'cyan' },
          { label: 'Internes', value: internesCount, unit: 'ressources', icon: Users, color: 'indigo' },
          { label: 'Externes', value: externesCount, unit: 'partenaires', icon: Briefcase, color: 'magenta' }
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
              <span className="text-4xl font-display font-bold text-[var(--color-text-main)]">{m.value}</span>
              <span className="text-[var(--color-text-muted)] text-xs font-medium">{m.unit}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {/* Filters */}
        <FilterBar 
          data={formateurs}
          searchKeys={['nom', 'prenom', 'email', 'nomEmployeur']}
          onFilter={(data) => { setFilteredFormateursData(data); setPage(1); }}
          placeholder="Rechercher par nom, email, employeur..."
          filterConfigs={[
            { key: 'type', label: 'Type', options: typeOptions },
            { key: 'nomEmployeur', label: 'Employeur', options: employeurOptions }
          ]}
        />

        {loading ? (
          <SkeletonTable rows={5} />
        ) : filteredFormateursData.length === 0 ? (
          <EmptyState 
            title={formateurs.length > 0 ? "Aucun résultat trouvé" : "Aucun formateur référencé"} 
            description={formateurs.length > 0 ? "Pas d'expert correspondant à vos filtres" : "L'annuaire des experts est actuellement vide. Ajoutez votre premier formateur pour l'affecter à des sessions."}
            action={formateurs.length === 0 ? { label: 'Ajouter un expert', onClick: () => setIsModalOpen(true) } : null}
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
                    <th className="px-8 py-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Identité / Expertise</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Contact</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Type / Employeur</th>
                    <th className="px-8 py-4 text-right text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {pagedFormateurs.map((f, idx) => (
                    <motion.tr 
                      key={f.id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-[var(--color-surface-hover)]/30 transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm border ${
                            f.type === 'INTERNE' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' : 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20'
                          }`}>
                            {f.nom.charAt(0)}{f.prenom.charAt(0)}
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="font-bold text-[var(--color-text-main)] text-base tracking-tight leading-none group-hover:text-cyan-500 transition-colors">
                              {f.nom} {f.prenom}
                            </span>
                            <span className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-widest flex items-center gap-2">
                              {f.type}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-semibold text-[var(--color-text-main)]">{f.email}</span>
                          <span className="text-xs text-[var(--color-text-muted)] font-medium">{f.tel}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                           <div className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${
                            f.type === 'INTERNE' 
                              ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' 
                              : 'bg-magenta-500/10 text-magenta-500 border-magenta-500/20'
                          }`}>
                            {f.type}
                          </div>
                          {f.nomEmployeur && (
                            <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wide flex items-center gap-1.5">
                              <Building2 size={12} className="text-cyan-500" />
                              {f.nomEmployeur}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEdit(f)}
                            className="p-2.5 rounded-lg border border-[var(--color-border)] hover:bg-cyan-500/10 hover:text-cyan-500 transition-all shadow-sm" 
                            title="Modifier"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(f.id)}
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
              total={filteredFormateursData.length}
              page={page}
              pageSize={pageSize}
              onPage={setPage}
              onPageSize={setPageSize}
            />
            <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-surface-hover)]/20 flex justify-between items-center text-xs text-[var(--color-text-muted)] font-medium">
               <span>Affichage de {filteredFormateursData.length} experts certifiés</span>
               <span className="uppercase tracking-widest opacity-50 font-bold">Excellent Training Expert Registry</span>
            </div>
          </motion.div>
        )}
      </div>

      <ExpertModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onFinish={fetchData}
        employeurs={employeurs}
        initialData={editingExpert}
      />
      <ConfirmModal
        isOpen={confirmDeleteId !== null}
        title="Supprimer le formateur"
        message="Ce formateur sera définitivement supprimé. Cette action est irréversible."
        onConfirm={executeDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </Layout>
  );
};

export default FormateursPage;