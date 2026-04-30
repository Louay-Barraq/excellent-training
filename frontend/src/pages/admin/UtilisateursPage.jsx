import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import { SkeletonTable } from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';
import PageHeader from '../../components/PageHeader';
import { Users, ShieldAlert, Trash2, UserPlus, Fingerprint, X, Loader2, Edit2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { mapError } from '../../utils/errorMapper';
import FilterBar from '../../components/FilterBar';
import ConfirmModal from '../../components/ConfirmModal';
import { motion, AnimatePresence } from 'framer-motion';

const roleStyle = (role) => {
    switch (role) {
        case 'ADMINISTRATEUR': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
        case 'RESPONSABLE': return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20';
        case 'UTILISATEUR': return 'bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20';
        default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
};

const UtilisateursPage = () => {
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [formData, setFormData] = useState({ id: null, login: '', password: '', roleId: 3 });
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const { addToast } = useToast();
    const { user, logoutUser } = useAuth();

    const fetchUsers = () => {
        setLoading(true);
        api.get('/utilisateurs')
            .then(setUtilisateurs)
            .catch(err => {
                console.error(err);
                addToast(mapError(err), 'error');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = (id) => setConfirmDeleteId(id);
    const executeDelete = async () => {
        const id = confirmDeleteId;
        setConfirmDeleteId(null);
        try {
            await api.delete(`/utilisateurs/${id}`);
            addToast('Utilisateur supprimé avec succès', 'success');
            fetchUsers();
        } catch (err) {
            addToast(mapError(err), 'error');
        }
    };

    const handleEdit = (user) => {
        const roleNom = (user.roleNom || '').toUpperCase();
        const roleId =
            roleNom === 'ADMINISTRATEUR' || roleNom === 'ADMIN' ? 1 :
            roleNom === 'RESPONSABLE' ? 2 :
            3;
        setFormData({
            id: user.id,
            login: user.login,
            password: '', // Password is required by backend for update, user must set a new one
            roleId
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            if (formData.id) {
                await api.put(`/utilisateurs/${formData.id}`, formData);
                addToast('Compte mis à jour avec succès', 'success');
            } else {
                await api.post('/utilisateurs', formData);
                addToast('Compte créé avec succès', 'success');
            }
            setIsModalOpen(false);
            setFormData({ id: null, login: '', password: '', roleId: 3 });
            
            // Check if updated user is the current user
            if (formData.id === parseInt(user?.id)) {
                addToast('Votre compte a été mis à jour. Veuillez vous reconnecter.', 'info');
                setTimeout(() => logoutUser(), 1500);
            } else {
                fetchUsers();
            }
        } catch (err) {
            addToast(mapError(err), 'error');
        } finally {
            setFormLoading(false);
        }
    };

    const adminsCount = utilisateurs.filter(u => u.roleNom === 'ADMINISTRATEUR').length;
    const respCount = utilisateurs.filter(u => u.roleNom === 'RESPONSABLE').length;
    const usersCount = utilisateurs.filter(u => u.roleNom === 'UTILISATEUR').length;

    const roleOptions = [
        { value: 'ADMINISTRATEUR', label: 'Administrateur' },
        { value: 'RESPONSABLE', label: 'Responsable' },
        { value: 'UTILISATEUR', label: 'Utilisateur' }
    ];

    return (
        <Layout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <PageHeader
                    icon={Users}
                    iconContainerClassName="bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
                    iconClassName="text-indigo-500"
                    title="Utilisateurs"
                    subtitle="Contrôle d'accès et administration des comptes de formation."
                    action={(
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="btn-prism flex items-center gap-2 shadow-xl shadow-indigo-500/10"
                        >
                            <UserPlus size={18} />
                            <span>Nouvel Utilisateur</span>
                        </button>
                    )}
                />

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Inscrits', value: utilisateurs.length, icon: Users, color: 'indigo' },
                        { label: 'Administrateurs', value: adminsCount, icon: ShieldAlert, color: 'cyan' },
                        { label: 'Responsables', value: respCount, icon: Fingerprint, color: 'lime' },
                        { label: 'Utilisateurs', value: usersCount, icon: Users, color: 'slate' }
                    ].map((s, idx) => (
                        <motion.div 
                            key={s.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="card-prism p-6 flex items-center gap-5 group hover:border-indigo-500/30 transition-all duration-500"
                        >
                            <div className={`w-12 h-12 rounded-xl bg-${s.color}-500/10 flex items-center justify-center text-${s.color}-500 border border-${s.color}-500/20 shadow-inner group-hover:scale-110 transition-transform`}>
                                <s.icon size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-bold">{s.label}</p>
                                <p className="text-2xl font-bold text-[var(--color-text-main)] mt-1 font-sans">{s.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content */}
                <FilterBar 
                    data={utilisateurs}
                    searchKeys={['login', 'roleNom']}
                    onFilter={setFilteredUsers}
                    placeholder="Rechercher par identifiant ou rôle..."
                    filterConfigs={[
                        { key: 'roleNom', label: 'Rôle', options: roleOptions }
                    ]}
                />

                {loading ? (
                    <div className="card-prism p-8">
                        <SkeletonTable rows={5} />
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="card-prism p-12 text-center">
                        <EmptyState
                            title={utilisateurs.length > 0 ? "Aucun résultat trouvé" : "Aucun utilisateur trouvé"}
                            description={utilisateurs.length > 0 ? "Pas d'utilisateur correspondant à vos filtres" : "La base de données utilisateur est actuellement vide."}
                        />
                    </div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.99 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="card-prism overflow-hidden shadow-sm"
                    >
                        <div className="p-6 border-b border-[var(--color-border)] bg-[var(--color-surface-hover)]/40 flex items-center justify-between">
                            <h3 className="text-xs font-bold text-[var(--color-text-main)] uppercase tracking-widest">Liste des Comptes</h3>
                            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-500 text-[10px] font-bold rounded-full border border-indigo-500/20 uppercase tracking-widest">
                                {filteredUsers.length} Utilisateurs
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-hover)]/40 transition-colors">
                                        <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Identité</th>
                                        <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Niveau d'Accès</th>
                                        <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--color-border)]">
                                    {filteredUsers.map((u, i) => (
                                        <motion.tr 
                                            key={u.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="hover:bg-[var(--color-surface-hover)] transition-colors group"
                                        >
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-[var(--color-bg-main)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-main)] font-black text-xs shadow-sm group-hover:border-[var(--color-accent)] transition-colors">
                                                        {u.login.slice(0, 2).toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-[var(--color-text-main)] text-sm tracking-tight">{u.login}</span>
                                                        <span className="text-[10px] text-[var(--color-text-muted)] font-medium font-sans uppercase">ID: #{u.id.toString().padStart(4, '0')}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full border ${roleStyle(u.roleNom)}`}>
                                                    {u.roleNom}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        onClick={() => handleEdit(u)}
                                                        className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:bg-indigo-500/10 rounded-lg transition-all"
                                                        title="Modifier le compte"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(u.id)}
                                                        className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-subtle)] rounded-lg transition-all"
                                                        title="Supprimer le compte"
                                                    >
                                                        <Trash2 size={18} />
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
                {/* Modal for Creating/Editing User */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div 
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
                            onClick={() => !formLoading && setIsModalOpen(false)}
                        />
                        <div className="card-prism w-full max-w-md relative z-10 p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-[var(--color-text-main)]">
                                    {formData.id ? 'Modifier le Compte' : 'Configuration d\'Accès'}
                                </h3>
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-1 hover:bg-[var(--color-surface-hover)] rounded-lg text-[var(--color-text-muted)] transition-colors"
                                    disabled={formLoading}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-bold">Identifiant Unique</label>
                                    <input
                                        type="text"
                                        className="w-full bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-[var(--color-text-main)] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="ex: j.dupont"
                                        required
                                        value={formData.login}
                                        onChange={(e) => setFormData({...formData, login: e.target.value})}
                                        disabled={formLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-bold">
                                        {formData.id ? 'Nouveau Mot de Passe (laisser vide pour conserver)' : 'Mot de Passe Sécurisé'}
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-[var(--color-text-main)] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="••••••••"
                                        required={!formData.id}
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        disabled={formLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-bold">Niveau d'Autorisation</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({...formData, roleId: 1})}
                                            className={`px-4 py-3 rounded-xl border text-[10px] font-bold uppercase transition-all flex flex-col items-center gap-2 ${
                                                formData.roleId === 1 
                                                ? 'bg-indigo-500/10 border-indigo-500 text-indigo-500' 
                                                : 'bg-[var(--color-bg-main)] border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-indigo-500/50'
                                            }`}
                                            disabled={formLoading}
                                        >
                                            <ShieldAlert size={16} />
                                            Administrateur
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({...formData, roleId: 2})}
                                            className={`px-4 py-3 rounded-xl border text-[10px] font-bold uppercase transition-all flex flex-col items-center gap-2 ${
                                                formData.roleId === 2 
                                                ? 'bg-cyan-500/10 border-cyan-500 text-cyan-500' 
                                                : 'bg-[var(--color-bg-main)] border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-cyan-500/50'
                                            }`}
                                            disabled={formLoading}
                                        >
                                            <Fingerprint size={16} />
                                            Responsable
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({...formData, roleId: 3})}
                                            className={`px-4 py-3 rounded-xl border text-[10px] font-bold uppercase transition-all flex flex-col items-center gap-2 ${
                                                formData.roleId === 3 
                                                ? 'bg-slate-500/10 border-slate-500 text-slate-600 dark:text-slate-300' 
                                                : 'bg-[var(--color-bg-main)] border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-slate-500/50'
                                            }`}
                                            disabled={formLoading}
                                        >
                                            <Users size={16} />
                                            Utilisateur
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-6 py-3 rounded-xl text-[10px] font-bold uppercase text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] transition-all"
                                        disabled={formLoading}
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 btn-prism py-3 flex items-center justify-center gap-2"
                                        disabled={formLoading}
                                    >
                                        {formLoading ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            formData.id ? <Edit2 size={16} /> : <UserPlus size={16} />
                                        )}
                                        <span>{formData.id ? 'Mettre à jour' : 'Créer le Compte'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            <ConfirmModal
                isOpen={confirmDeleteId !== null}
                title="Supprimer l'utilisateur"
                message="Ce compte sera définitivement supprimé. Cette action est irréversible."
                onConfirm={executeDelete}
                onCancel={() => setConfirmDeleteId(null)}
            />
        </Layout>
    );
};

export default UtilisateursPage;