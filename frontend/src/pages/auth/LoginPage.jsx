import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Shield, AlertCircle, ArrowRight, User, Lock, Building2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const LoginPage = () => {
  const [form, setForm] = useState({ login: '', password: '' });
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const reason = sessionStorage.getItem('auth_reason');
    if (reason === 'expired') {
      setInfo('Votre session a expiré. Veuillez vous reconnecter.');
    }
    if (reason) sessionStorage.removeItem('auth_reason');
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.post('/auth/login', form);
      loginUser(data);
      if (data.role === 'ADMINISTRATEUR') navigate('/admin/utilisateurs');
      else if (data.role === 'RESPONSABLE') navigate('/responsable/dashboard');
      else navigate('/utilisateur/formations');
    } catch (err) {
      console.error(err);
      setError('Identifiants incorrects ou accès non autorisé.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] text-[var(--color-text-main)] flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-500">
      {/* Subtle Background Decoration */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-[60%] left-[70%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[150px]" />
        <div className="absolute top-[20%] left-[30%] w-[30%] h-[30%] bg-lime-500/10 rounded-full blur-[100px]" />
      </div>
      
      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-700">
        <div className="card-prism p-8 md:p-10 shadow-2xl relative overflow-hidden bg-[var(--color-bg-card)]/80 backdrop-blur-xl">
          {/* Header */}
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-cyan-500 to-lime-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20 transform hover:scale-105 transition-transform duration-500 uppercase">
              <Building2 size={32} className="text-white" strokeWidth={2} />
            </div>
            <h1 className="text-3xl font-display font-bold tracking-tight text-[var(--color-text-main)] uppercase leading-none mb-2">
              Excellent <span className="text-[var(--color-accent)]">Training</span>
            </h1>
            <p className="text-[var(--color-text-muted)] text-sm font-medium">
              Plateforme de Gestion de Formation
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-8 flex items-center gap-3 animate-in shake duration-300">
              <AlertCircle size={18} />
              <span className="text-xs font-bold uppercase tracking-wide">{error}</span>
            </div>
          )}

          {info && !error && (
            <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 px-4 py-3 rounded-xl mb-8 flex items-center gap-3 animate-in fade-in duration-300">
              <Shield size={18} />
              <span className="text-xs font-bold uppercase tracking-wide">{info}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest ml-1">
                Identifiant
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-accent)] transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="login"
                  value={form.login}
                  onChange={handleChange}
                  required
                  className="w-full bg-[var(--color-bg-main)]/50 border border-[var(--color-border)] rounded-xl pl-12 pr-5 py-4 text-sm font-bold text-[var(--color-text-main)] focus:border-[var(--color-accent)] focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all placeholder:text-[var(--color-text-muted)]/30 font-sans"
                  placeholder="Nom d'utilisateur"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest ml-1">
                Mot de passe
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-accent)] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-[var(--color-bg-main)]/50 border border-[var(--color-border)] rounded-xl pl-12 pr-5 py-4 text-sm font-bold text-[var(--color-text-main)] focus:border-[var(--color-accent)] focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all placeholder:text-[var(--color-text-muted)]/30 font-sans"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-prism w-full py-5 text-sm flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/20 active:scale-95 group transition-all"
            >
              {loading ? (
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="font-bold uppercase tracking-widest">Se connecter</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-10 pt-6 border-t border-[var(--color-border)] flex justify-center items-center">
             <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest opacity-50">
               © 2026 Excellent Training
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;