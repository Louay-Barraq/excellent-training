import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import AnimatedPage from './components/AnimatedPage';

import LoginPage from './pages/auth/LoginPage';
import FormationsPage from './pages/utilisateur/FormationsPage';
import FormateursPage from './pages/utilisateur/FormateursPage';
import ParticipantsPage from './pages/utilisateur/ParticipantsPage';
import DashboardPage from './pages/responsable/DashboardPage';
import UtilisateurDashboardPage from './pages/utilisateur/DashboardPage';
import UtilisateursPage from './pages/admin/UtilisateursPage';
import ReferentielsPage from './pages/admin/ReferentielsPage';

const Unauthorized = () => (
    <AnimatedPage>
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg-main)] p-8 text-center">
            <div className="w-24 h-24 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 border border-rose-500/20 mb-8 shadow-inner shadow-rose-500/5">
                <ShieldAlert size={48} strokeWidth={1.5} />
            </div>
            <h2 className="text-4xl font-display font-bold text-[var(--color-text-main)] tracking-tight uppercase mb-4">Accès Non Autorisé</h2>
            <p className="text-[var(--color-text-muted)] text-sm font-medium max-w-md mb-10 leading-relaxed italic">
                Désolé, vous n'avez pas les permissions nécessaires pour accéder à cette section du système. Veuillez contacter votre administrateur si vous pensez qu'il s'agit d'une erreur.
            </p>
            <a 
                href="/login" 
                className="btn-prism shadow-xl shadow-indigo-500/10 flex items-center gap-2 group"
            >
                <ArrowRight size={18} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                <span>Retour à la Connexion</span>
            </a>
        </div>
    </AnimatedPage>
);

const HomeRedirect = () => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    
    const roleSlug = user.role.toLowerCase();
    if (user.role === 'ADMINISTRATEUR') return <Navigate to={`/${roleSlug}/utilisateurs`} replace />;
    return <Navigate to={`/${roleSlug}/dashboard`} replace />;
};

const App = () => {
    const location = useLocation();
    const { user } = useAuth();
    
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomeRedirect />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Universal Role-Based Routes */}
                <Route path="/:role/formations" element={
                    <ProtectedRoute allowedRoles={['UTILISATEUR', 'ADMINISTRATEUR']}>
                        <AnimatedPage><FormationsPage /></AnimatedPage>
                    </ProtectedRoute>
                } />
                <Route path="/:role/formateurs" element={
                    <ProtectedRoute allowedRoles={['UTILISATEUR', 'ADMINISTRATEUR']}>
                        <AnimatedPage><FormateursPage /></AnimatedPage>
                    </ProtectedRoute>
                } />
                <Route path="/:role/participants" element={
                    <ProtectedRoute allowedRoles={['UTILISATEUR', 'ADMINISTRATEUR']}>
                        <AnimatedPage><ParticipantsPage /></AnimatedPage>
                    </ProtectedRoute>
                } />
                <Route path="/:role/dashboard" element={
                    <ProtectedRoute allowedRoles={['UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR']}>
                        {user?.role === 'UTILISATEUR' 
                            ? <AnimatedPage><UtilisateurDashboardPage /></AnimatedPage>
                            : <AnimatedPage><DashboardPage /></AnimatedPage>
                        }
                    </ProtectedRoute>
                } />
                <Route path="/:role/utilisateurs" element={
                    <ProtectedRoute allowedRoles={['ADMINISTRATEUR']}>
                        <AnimatedPage><UtilisateursPage /></AnimatedPage>
                    </ProtectedRoute>
                } />
                <Route path="/:role/referentiels" element={
                    <ProtectedRoute allowedRoles={['ADMINISTRATEUR']}>
                        <AnimatedPage><ReferentielsPage /></AnimatedPage>
                    </ProtectedRoute>
                } />

                {/* Legacy / Compatibility Redirects */}
                <Route path="/admin/*" element={<Navigate to={`/administrateur/${location.pathname.split('/')[2] || 'utilisateurs'}`} replace />} />
                <Route path="/utilisateur/*" element={<Navigate to={`/utilisateur/${location.pathname.split('/')[2] || 'formations'}`} replace />} />
                <Route path="/responsable/*" element={<Navigate to={`/responsable/${location.pathname.split('/')[2] || 'dashboard'}`} replace />} />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AnimatePresence>
    );
};

export default App;