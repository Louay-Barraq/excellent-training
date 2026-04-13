import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../services/api';
import Layout from '../../components/Layout';
import { Plus, Edit2, Trash2, Layers, Book, Building2, UserCircle, Settings2, X } from 'lucide-react';
import { SkeletonList } from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';
import { useToast } from '../../context/ToastContext';
import { mapError } from '../../utils/errorMapper';

import { Search } from 'lucide-react';

const ReferentielTable = ({ title, type, items, icon: Icon, loading, accentColor = 'indigo', onAdd, onEdit, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const accentPresets = {
        indigo: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20 shadow-indigo-500/5',
        cyan: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20 shadow-cyan-500/5',
        lime: 'text-lime-600 dark:text-lime-400 bg-lime-500/10 border-lime-500/20 shadow-lime-500/5',
    };

    const filteredItems = items.filter(item => {
        const text = (item.libelle || item.nomEmployeur || '').toLowerCase();
        return text.includes(searchTerm.toLowerCase());
    });

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="card-prism flex flex-col h-full transition-all duration-500 hover:shadow-2xl hover:shadow-black/5"
        >
            <div className="p-6 border-b border-[var(--color-border)] bg-[var(--color-surface-hover)]/30">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl border shadow-inner ${accentPresets[accentColor]}`}>
                            <Icon size={24} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-xl font-display font-bold text-[var(--color-text-main)] tracking-tight">{title}</h2>
                    </div>
                    <button 
                        onClick={() => onAdd(type, title)}
                        className="w-10 h-10 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] flex items-center justify-center text-[var(--color-text-muted)] hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all shadow-sm"
                    >
                        <Plus size={20} />
                    </button>
                </div>
                
                <div className="relative group/search">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within/search:text-indigo-500">
                        <Search size={14} strokeWidth={2.5} />
                    </div>
                    <input 
                        type="text"
                        placeholder={`Filtrer par libellé...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 bg-[var(--color-bg-main)]/50 border border-[var(--color-border)] rounded-2xl text-[11px] font-bold text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)]/50 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 focus:bg-[var(--color-bg-main)] outline-none transition-all duration-300"
                    />
                    {searchTerm && (
                        <button 
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-rose-500/10 text-[var(--color-text-muted)] hover:text-rose-500 transition-all"
                        >
                            <X size={12} strokeWidth={3} />
                        </button>
                    )}
                </div>
            </div>

            <div className="p-6 flex-grow overflow-y-auto max-h-[55vh] bg-[var(--color-bg-card)] custom-scrollbar">
                {loading ? (
                    <SkeletonList rows={4} />
                ) : filteredItems.length === 0 ? (
                    <div className="py-8">
                        <EmptyState 
                            title={searchTerm ? "Aucun résultat" : "Liste vide"} 
                            description={searchTerm ? `Aucun élément pour "${searchTerm}".` : `Aucun élément configuré.`} 
                        />
                    </div>
                ) : (
                    <div className="space-y-3">
                        <AnimatePresence mode="popLayout">
                            {filteredItems.map((item, idx) => (
                                <motion.div 
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx % 10 * 0.05 }}
                                    className="flex justify-between items-center p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-main)]/50 hover:bg-[var(--color-surface-hover)] hover:border-indigo-500/30 transition-all group"
                                >
                                    <span className="text-sm font-semibold text-[var(--color-text-main)] tracking-tight">{item.libelle || item.nomEmployeur}</span>
                                    <div className="flex gap-2 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => onEdit(type, title, item)}
                                            className="p-2 rounded-lg border border-[var(--color-border)] hover:bg-indigo-500/10 hover:text-indigo-500 transition-all font-semibold" 
                                            title="Modifier"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button 
                                            onClick={() => onDelete(type, item.id)}
                                            className="p-2 rounded-lg border border-[var(--color-border)] hover:bg-rose-500/10 hover:text-rose-500 transition-all" 
                                            title="Supprimer"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface-hover)]/10 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest text-center">
                {filteredItems.length} {filteredItems.length <= 1 ? 'élément' : 'éléments'} {searchTerm ? 'trouvé(s)' : 'enregistré(s)'}
            </div>
        </motion.div>
    );
};

const ReferentielsPage = () => {
    const [domaines, setDomaines] = useState([]);
    const [structures, setStructures] = useState([]);
    const [profils, setProfils] = useState([]);
    const [employeurs, setEmployeurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ type: '', title: '', item: null, value: '' });
    const [submitting, setSubmitting] = useState(false);

    const fetchData = () => {
        setLoading(true);
        Promise.all([
            api.get('/referentiels/domaines'),
            api.get('/referentiels/structures'),
            api.get('/referentiels/profils'),
            api.get('/referentiels/employeurs'),
        ]).then(([d, s, p, e]) => {
            setDomaines(d || []);
            setStructures(s || []);
            setProfils(p || []);
            setEmployeurs(e || []);
        }).catch(err => {
            addToast(mapError(err), 'error');
        }).finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = (type, title) => {
        setModalData({ type, title, item: null, value: '' });
        setModalOpen(true);
    };

    const handleEdit = (type, title, item) => {
        setModalData({ 
            type, 
            title, 
            item, 
            value: type === 'employeurs' ? item.nomEmployeur : item.libelle 
        });
        setModalOpen(true);
    };

    const handleDelete = async (type, id) => {
        if (!window.confirm('Voulez-vous vraiment supprimer cet élément ?')) return;

        try {
            await api.delete(`/referentiels/${type}/${id}`);
            addToast('Élément supprimé avec succès', 'success');
            fetchData();
        } catch (err) {
            addToast(mapError(err), 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const { type, item, value } = modalData;
        const payload = type === 'employeurs' ? { nomEmployeur: value } : { libelle: value };

        try {
            if (item) {
                await api.put(`/referentiels/${type}/${item.id}`, payload);
                addToast('Mise à jour réussie', 'success');
            } else {
                await api.post(`/referentiels/${type}`, payload);
                addToast('Élément ajouté', 'success');
            }
            setModalOpen(false);
            fetchData();
        } catch (err) {
            addToast(mapError(err), 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Layout>
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 border border-indigo-500/20 shadow-inner">
                            <Settings2 size={24} strokeWidth={1.5} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-display font-bold tracking-tight text-[var(--color-text-main)]">
                                Référentiels
                            </h1>
                            <p className="text-[var(--color-text-muted)] text-sm font-medium">
                                Configuration globale et frameworks de données
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
                <ReferentielTable
                    title="Domaines"
                    type="domaines"
                    items={domaines}
                    icon={Book}
                    loading={loading}
                    accentColor="indigo"
                    onAdd={handleAdd}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
                <ReferentielTable
                    title="Structures"
                    type="structures"
                    items={structures}
                    icon={Building2}
                    loading={loading}
                    accentColor="cyan"
                    onAdd={handleAdd}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
                <ReferentielTable
                    title="Profils"
                    type="profils"
                    items={profils}
                    icon={UserCircle}
                    loading={loading}
                    accentColor="lime"
                    onAdd={handleAdd}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
                <ReferentielTable
                    title="Employeurs"
                    type="employeurs"
                    items={employeurs}
                    icon={Layers}
                    loading={loading}
                    accentColor="indigo"
                    onAdd={handleAdd}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            {/* Generic Modal */}
            <AnimatePresence>
                {modalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="card-prism w-full max-w-md p-8 space-y-6 shadow-2xl border border-indigo-500/20"
                        >
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-[var(--color-text-main)]">
                                {modalData.item ? 'Modifier' : 'Ajouter'} {modalData.title.slice(0, -1)}
                            </h3>
                            <button 
                                onClick={() => !submitting && setModalOpen(false)}
                                className="p-1 hover:bg-[var(--color-surface-hover)] rounded-lg text-[var(--color-text-muted)]"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-bold">Libellé / Nom</label>
                                <input
                                    type="text"
                                    autoFocus
                                    required
                                    className="w-full bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-[var(--color-text-main)] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                    value={modalData.value}
                                    onChange={(e) => setModalData({...modalData, value: e.target.value})}
                                    disabled={submitting}
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="flex-1 px-4 py-2 rounded-xl text-xs font-bold uppercase text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] transition-all"
                                    disabled={submitting}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="flex-2 btn-prism py-2 px-6 flex items-center justify-center gap-2"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        modalData.item ? <Edit2 size={16} /> : <Plus size={16} />
                                    )}
                                    <span className="font-bold border-none uppercase text-[10px] tracking-widest">
                                        {modalData.item ? 'Mettre à jour' : 'Confirmer'}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
                )}
            </AnimatePresence>
        </Layout>
    );
};

export default ReferentielsPage;