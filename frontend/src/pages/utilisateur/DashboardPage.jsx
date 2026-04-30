import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Users, BadgeCheck, GraduationCap,
  Calendar, Star, Clock, LayoutDashboard
} from 'lucide-react';
import Layout from '../../components/Layout';
import Skeleton from '../../components/Skeleton';
import { api } from '../../services/api';
import { mapError } from '../../utils/errorMapper';
import PageHeader from '../../components/PageHeader';

const StatCard = ({ icon: Icon, title, value, color }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${color}`}>
      <Icon size={24} />
    </div>
    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1">{title}</h3>
    <p className="text-2xl font-bold text-[var(--color-text-main)] font-display">{value}</p>
  </motion.div>
);

const QuickAction = ({ icon: Icon, title, desc, color, onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] hover:bg-[var(--color-surface-hover)] hover:border-indigo-500/30 transition-all text-left group"
  >
    <div className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform`}>
      <Icon size={20} />
    </div>
    <div>
      <h4 className="text-sm font-bold text-[var(--color-text-main)]">{title}</h4>
      <p className="text-xs text-[var(--color-text-muted)]">{desc}</p>
    </div>
  </button>
);

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // We use the same stats endpoint but filter or present differently
    api.get('/stats/dashboard')
      .then(setStats)
      .catch((err) => setError(mapError(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <Layout>
      <div className="space-y-6">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    </Layout>
  );

  return (
    <Layout>
      <PageHeader
        icon={LayoutDashboard}
        title="Tableau de Bord"
        subtitle="Bienvenue dans votre espace de gestion des formations"
        iconContainerClassName="bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={BookOpen} 
          title="Vos Formations" 
          value={stats?.totalFormations ?? 0}
          color="bg-blue-500/10 text-blue-500" 
        />
        <StatCard 
          icon={GraduationCap} 
          title="Formateurs" 
          value={stats?.totalFormateurs ?? 0}
          color="bg-amber-500/10 text-amber-500" 
        />
        <StatCard 
          icon={Users} 
          title="Participants" 
          value={stats?.totalParticipants ?? 0}
          color="bg-violet-500/10 text-violet-500" 
        />
        <StatCard 
          icon={Star} 
          title="Domaines" 
          value={stats?.totalDomaines ?? 0}
          color="bg-emerald-500/10 text-emerald-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Quick Actions & Welcome */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-8 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden"
          >
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">Prêt à gérer vos formations ?</h2>
              <p className="text-indigo-100 text-sm max-w-md mb-6 leading-relaxed">
                Utilisez les outils à votre disposition pour suivre l'évolution des sessions, affecter des formateurs et gérer les inscriptions des participants en temps réel.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold">
                  <Calendar size={14} /> {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
              </div>
            </div>
            <LayoutDashboard size={180} className="absolute -right-10 -bottom-10 text-white/10 -rotate-12" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <QuickAction 
              icon={BookOpen} 
              title="Nouvelle Formation" 
              desc="Planifier une session d'apprentissage"
              color="bg-blue-500/10 text-blue-500"
              onClick={() => window.location.href = '/utilisateur/formations'}
            />
            <QuickAction 
              icon={Users} 
              title="Gérer Participants" 
              desc="Inscrire et suivre les élèves"
              color="bg-violet-500/10 text-violet-500"
              onClick={() => window.location.href = '/utilisateur/participants'}
            />
          </div>
        </div>

        {/* Right Column: Mini Stats/Alerts */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)] shadow-sm">
            <h3 className="text-xs font-bold text-[var(--color-text-main)] uppercase tracking-widest mb-6 flex items-center gap-2">
              <Clock size={14} className="text-indigo-500" /> État des Lieux
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-bg-main)]">
                <span className="text-xs font-medium text-[var(--color-text-muted)]">Durée Moyenne</span>
                <span className="text-sm font-bold text-[var(--color-text-main)] text-indigo-500">
                  {stats?.dureeMoyenne?.toFixed(1) ?? 0} j
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-bg-main)]">
                <span className="text-xs font-medium text-[var(--color-text-muted)]">Sans Formateur</span>
                <span className={`text-sm font-bold ${stats?.formationsSansFormateur > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {stats?.formationsSansFormateur ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-bg-main)]">
                <span className="text-xs font-medium text-[var(--color-text-muted)]">Cout/Part. (moy)</span>
                <span className="text-sm font-bold text-emerald-500">
                  {stats?.coutMoyenParParticipant?.toLocaleString() ?? 0} DT
                </span>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
              <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest mb-1 italic">Note de service</p>
              <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed italic">
                N'oubliez pas de valider les attestations de fin de formation pour chaque participant.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
