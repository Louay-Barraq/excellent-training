import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Wallet, Users, BookOpen, BarChart2,
  PieChart, ArrowUp, Award, AlertTriangle, GraduationCap,
  Activity, Target, Zap, Trophy
} from 'lucide-react';
import Layout from '../../components/Layout';
import Skeleton from '../../components/Skeleton';
import { api } from '../../services/api';
import { mapError } from '../../utils/errorMapper';
import PageHeader from '../../components/PageHeader';

// ─────────────────────────────────────────────────────────────
// REUSABLE CHART COMPONENTS
// ─────────────────────────────────────────────────────────────

const FilterTabs = ({ options, value, onChange }) => (
  <div className="flex gap-1 bg-[var(--color-bg-secondary)] rounded-xl p-1">
    {options.map(opt => (
      <button key={opt.value} onClick={() => onChange(opt.value)}
        className={`flex-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1.5 rounded-lg transition-all
          ${value === opt.value
            ? 'bg-[var(--color-bg-main)] text-[var(--color-text-primary)] shadow-sm'
            : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'}`}>
        {opt.label}
      </button>
    ))}
  </div>
);

const HorizontalBarChart = ({ data, valueKey, labelKey, color, formatVal }) => {
  const max = Math.max(...data.map(d => Number(d[valueKey])), 1);
  if (!data.length) return <Empty />;
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={i}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-[var(--color-text-primary)] truncate max-w-[55%]"
              title={String(d[labelKey])}>
              {String(d[labelKey]).length > 22 ? String(d[labelKey]).slice(0, 22) + '…' : d[labelKey]}
            </span>
            <span className="text-xs font-bold text-[var(--color-text-muted)]">
              {formatVal ? formatVal(d[valueKey]) : Number(d[valueKey]).toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-[var(--color-bg-secondary)] rounded-full h-2 overflow-hidden">
            <div className={`h-2 rounded-full transition-all duration-700 ease-out ${color}`}
              style={{ width: `${(Number(d[valueKey]) / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
};

const VerticalBarChart = ({ data, valueKey, labelKey, color, formatVal }) => {
  const max = Math.max(...data.map(d => Number(d[valueKey])), 1);
  if (!data.length) return <Empty />;
  return (
    <div className="flex items-end gap-2 h-36 pt-6">
      {data.map((d, i) => {
        const pct = (Number(d[valueKey]) / max) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[var(--color-bg-main)] border
              border-[var(--color-border)] text-[10px] font-bold px-1.5 py-0.5 rounded-lg opacity-0
              group-hover:opacity-100 transition-all whitespace-nowrap z-10 shadow-sm">
              {formatVal ? formatVal(d[valueKey]) : Number(d[valueKey]).toLocaleString()}
            </div>
            <div className="w-full flex items-end" style={{ height: '100px' }}>
              <div className={`w-full rounded-t-lg transition-all duration-700 ease-out ${color}`}
                style={{ height: `${Math.max(pct, 4)}%` }} />
            </div>
            <span className="text-[10px] font-medium text-[var(--color-text-muted)] truncate w-full text-center">
              {d[labelKey]}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const DonutChart = ({ data, valueKey, labelKey, colors, centerLabel }) => {
  const [hovered, setHovered] = useState(null);
  const total = data.reduce((s, d) => s + Number(d[valueKey]), 0);
  if (total === 0) return <Empty />;

  let cumAngle = -90;
  const cx = 70, cy = 70, r = 56, ri = 36;
  const toRad = a => (a * Math.PI) / 180;

  const slices = data.map((d, i) => {
    const pct = Number(d[valueKey]) / total;
    const angle = pct * 360;
    const start = cumAngle;
    cumAngle += angle;
    const x1 = cx + r * Math.cos(toRad(start));   const y1 = cy + r * Math.sin(toRad(start));
    const x2 = cx + r * Math.cos(toRad(cumAngle)); const y2 = cy + r * Math.sin(toRad(cumAngle));
    const xi1= cx +ri * Math.cos(toRad(start));    const yi1= cy +ri * Math.sin(toRad(start));
    const xi2= cx +ri * Math.cos(toRad(cumAngle)); const yi2= cy +ri * Math.sin(toRad(cumAngle));
    const large = angle > 180 ? 1 : 0;
    return {
      path: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${ri} ${ri} 0 ${large} 0 ${xi1} ${yi1} Z`,
      color: colors[i % colors.length], label: d[labelKey], value: d[valueKey], pct
    };
  });

  const active = hovered !== null ? slices[hovered] : null;

  return (
    <div className="flex items-center gap-5">
      <div className="flex-shrink-0">
        <svg width="140" height="140" viewBox="0 0 140 140">
          {slices.map((s, i) => (
            <path key={i} d={s.path} fill={s.color}
              style={{ transform: hovered === i ? 'scale(1.06)' : 'scale(1)', transformOrigin: `${cx}px ${cy}px`, transition: 'transform 0.15s' }}
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
              className="cursor-pointer" />
          ))}
          <text x={cx} y={cy - 8}  textAnchor="middle" fontSize="9"  fill="var(--color-text-muted)">
            {active ? String(active.label).slice(0, 12) : (centerLabel || 'Total')}
          </text>
          <text x={cx} y={cy + 9}  textAnchor="middle" fontSize="16" fontWeight="700" fill="var(--color-text-main)">
            {active ? `${Math.round(active.pct * 100)}%` : total}
          </text>
        </svg>
      </div>
      <div className="space-y-1.5 flex-1 min-w-0">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-2 cursor-pointer"
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-xs text-[var(--color-text-muted)] truncate flex-1">{s.label}</span>
            <span className="text-xs font-bold text-[var(--color-text-main)] flex-shrink-0">
              {Math.round(s.pct * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Heatmap = ({ data, rowKey, colKey, valueKey }) => {
  const rows = [...new Set(data.map(d => d[rowKey]))];
  const cols = [...new Set(data.map(d => d[colKey]))];
  const max  = Math.max(...data.map(d => Number(d[valueKey])), 1);
  const getVal = (r, c) => {
    const found = data.find(d => d[rowKey] === r && d[colKey] === c);
    return found ? Number(found[valueKey]) : 0;
  };
  if (!rows.length) return <Empty />;
  return (
    <div className="overflow-x-auto">
      <table className="text-xs border-collapse">
        <thead>
          <tr>
            <th className="pb-2 pr-3 text-left text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] whitespace-nowrap min-w-[120px]">
              Structure / Profil
            </th>
            {cols.map(c => (
              <th key={c} className="pb-2 px-1 text-center text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] whitespace-nowrap min-w-[60px]">
                {String(c).length > 10 ? String(c).slice(0, 10) + '…' : c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r}>
              <td className="py-1 pr-3 font-medium text-[var(--color-text-primary)] whitespace-nowrap">
                {String(r).length > 18 ? String(r).slice(0, 18) + '…' : r}
              </td>
              {cols.map(c => {
                const val = getVal(r, c);
                const intensity = val / max;
                return (
                  <td key={c} className="py-1 px-1 text-center">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto font-bold transition-all"
                      title={`${r} × ${c} : ${val}`}
                      style={{
                        backgroundColor: val > 0 ? `rgba(99,102,241,${0.1 + intensity * 0.75})` : 'transparent',
                        color: intensity > 0.5 ? '#fff' : 'var(--color-text-muted)',
                      }}>
                      {val > 0 ? val : '—'}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const KpiCard = ({ icon: Icon, title, value, sub, iconBg }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="rounded-2xl p-5 border border-[var(--color-border)] bg-[var(--color-bg-main)] shadow-sm hover:shadow-md transition-shadow"
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${iconBg}`}>
      <Icon size={18} />
    </div>
    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1">{title}</p>
    <p className="text-2xl font-bold font-display text-[var(--color-text-primary)]">{value}</p>
    {sub && <p className="text-xs text-[var(--color-text-muted)] mt-1">{sub}</p>}
  </motion.div>
);

const SectionCard = ({ icon: Icon, title, color, children, action }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-2xl p-5 shadow-sm"
  >
    <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-lg ${color}`}><Icon size={14} /></div>
        <h2 className="text-sm font-bold font-display text-[var(--color-text-primary)]">{title}</h2>
      </div>
      {action}
    </div>
    {children}
  </motion.div>
);

const Divider = ({ label }) => (
  <div className="flex items-center gap-2 my-6">
    <div className="h-px flex-1 bg-[var(--color-border)]" />
    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] px-2">{label}</span>
    <div className="h-px flex-1 bg-[var(--color-border)]" />
  </div>
);

const Empty = () => (
  <p className="text-xs text-[var(--color-text-muted)] italic text-center py-4">Aucune donnée disponible</p>
);

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const [filterAnnee,     setFilterAnnee]     = useState('count');
  const [filterDomaine,   setFilterDomaine]   = useState('count');
  const [filterStructure, setFilterStructure] = useState('effectif');
  const [filterFormateur, setFilterFormateur] = useState('all');

  useEffect(() => {
    api.get('/stats/dashboard')
      .then(setStats)
      .catch((err) => setError(mapError(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <Layout>
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-48 rounded-xl" />
        <Skeleton className="h-4 w-64 rounded-xl" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}
      </div>
    </Layout>
  );

  if (error) return (
    <Layout>
      <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl p-4 text-sm font-medium">
        {error}
      </div>
    </Layout>
  );

  // ── Formatters ─────────────────────────────────────────────
  const fmt    = n => Number(n).toLocaleString();
  const fmtDT  = n => `${Number(n).toLocaleString()} DT`;
  const fmtJ   = n => `${Number(n).toFixed(1)} j`;

  // ── Alert indicators ───────────────────────────────────────
  const alerts = [
    { label: 'formation(s) sans formateur',    count: stats?.formationsSansFormateur    ?? 0, cls: 'bg-red-500/10 border-red-500/20 text-red-500' },
    { label: 'formation(s) sans participants', count: stats?.formationsSansParticipants ?? 0, cls: 'bg-orange-500/10 border-orange-500/20 text-orange-500' },
    { label: 'formateur(s) non affecté(s)',    count: stats?.formateursSansFormation    ?? 0, cls: 'bg-amber-500/10 border-amber-500/20 text-amber-500' },
    { label: 'participant(s) sans formation',  count: stats?.participantsSansInscription?? 0, cls: 'bg-blue-500/10 border-blue-500/20 text-blue-500' },
  ].filter(a => a.count > 0);

  // ── Computed ───────────────────────────────────────────────
  const budgetTotal = stats?.budgetTotal ?? 0;

  const topDomaine = (stats?.formationsParDomaine ?? []).reduce(
    (top, s) => Number(s.budgetTotal) > Number(top?.budgetTotal ?? 0) ? s : top, null
  );

  // Filtered année data
  const anneeData = (stats?.formationsParAnnee ?? []).map(s => ({
    annee: s.annee,
    value: filterAnnee === 'count'  ? s.count
         : filterAnnee === 'budget' ? s.budgetTotal
         : (stats?.inscriptionsParAnnee ?? []).find(x => x.annee === s.annee)?.totalInscriptions ?? 0
  }));

  // Filtered domaine data
  const domaineData = (stats?.formationsParDomaine ?? []).map(s => ({
    domaine: s.domaine,
    value: filterDomaine === 'count'  ? s.count
         : filterDomaine === 'budget' ? s.budgetTotal
         : s.budgetMoyen
  }));

  // Filtered structure data
  const structureData = (filterStructure === 'effectif'
    ? (stats?.participantsParStructure ?? []).map(s => ({ structure: s.structure, value: s.count }))
    : (stats?.inscriptionsParStructure ?? []).map(s => ({ structure: s.structure, value: s.totalInscriptions }))
  );

  // Filtered formateur data
  const formateurData = (stats?.chargeParFormateur ?? [])
    .filter(f => filterFormateur === 'all' || f.type === filterFormateur)
    .map(f => ({ ...f, label: `${f.nom} ${f.prenom}` }));

  const DONUT_COLORS = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ef4444','#ec4899','#a78bfa'];

  return (
    <Layout>
      <div>
        <PageHeader
          icon={BarChart2}
          iconContainerClassName="bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
          iconClassName="text-indigo-500"
          title="Tableau de bord"
          subtitle="Vue analytique complète — accès lecture seule"
          action={(
            <span
              className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/20
                text-green-500 text-xs font-bold px-3 py-1.5 rounded-xl"
            >
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Données en temps réel
            </span>
          )}
        />

      {/* ── Alerts ─────────────────────────────────────────── */}
      {alerts.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {alerts.map((a, i) => (
            <div key={i} className={`flex items-center gap-2 border rounded-xl px-3 py-2 text-xs font-semibold ${a.cls}`}>
              <AlertTriangle size={13} />
              <span>{a.count} {a.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── KPI Row 1 ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <KpiCard icon={BookOpen}      title="Total formations"   value={fmt(stats?.totalFormations   ?? 0)} sub="toutes années"            iconBg="bg-blue-500/10 text-blue-500" />
        <KpiCard icon={Wallet}        title="Budget total"       value={fmtDT(budgetTotal)}                 sub="tous domaines"            iconBg="bg-emerald-500/10 text-emerald-500" />
        <KpiCard icon={Users}         title="Participants"       value={fmt(stats?.totalParticipants ?? 0)} sub="dans le système"          iconBg="bg-violet-500/10 text-violet-500" />
        <KpiCard icon={GraduationCap} title="Formateurs"        value={fmt(stats?.totalFormateurs   ?? 0)} sub="internes et externes"     iconBg="bg-amber-500/10 text-amber-500" />
      </div>

      {/* ── KPI Row 2 ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard icon={Zap}      title="Budget moyen"       value={fmtDT(stats?.budgetMoyen          ?? 0)} sub="par formation"         iconBg="bg-cyan-500/10 text-cyan-500" />
        <KpiCard icon={Activity} title="Durée moyenne"      value={fmtJ(stats?.dureeMoyenne          ?? 0)} sub="par formation"         iconBg="bg-indigo-500/10 text-indigo-500" />
        <KpiCard icon={Target}   title="Coût / participant" value={fmtDT(stats?.coutMoyenParParticipant?? 0)} sub="budget ÷ inscriptions"iconBg="bg-pink-500/10 text-pink-500" />
        <KpiCard icon={BarChart2} title="Domaines actifs"   value={fmt(stats?.totalDomaines          ?? 0)} sub="avec formations"      iconBg="bg-orange-500/10 text-orange-500" />
      </div>

      {/* ── Top insight ────────────────────────────────────── */}
      {topDomaine && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[var(--color-bg-main)] border border-indigo-500/20 rounded-2xl px-5 py-4 mb-2 flex items-center gap-4 shadow-sm"
        >
          <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-500 flex-shrink-0"><Award size={20} /></div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-0.5">Domaine le plus investi</p>
            <p className="text-sm font-bold text-[var(--color-text-primary)] truncate">
              {topDomaine.domaine}
              <span className="text-indigo-500 ml-2">{fmtDT(topDomaine.budgetTotal)}</span>
              {budgetTotal > 0 && (
                <span className="text-[var(--color-text-muted)] font-normal ml-1">
                  ({Math.round((Number(topDomaine.budgetTotal) / budgetTotal) * 100)}% du budget total)
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-1 text-emerald-500 text-sm font-bold flex-shrink-0">
            <ArrowUp size={14} /> Top
          </div>
        </motion.div>
      )}

      {/* ════════════════ FORMATIONS ════════════════ */}
      <Divider label="Formations" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">

        <SectionCard icon={TrendingUp} title="Activité par année" color="bg-blue-500/10 text-blue-500"
          action={
            <FilterTabs value={filterAnnee} onChange={setFilterAnnee} options={[
              { value: 'count',        label: 'Nb' },
              { value: 'budget',       label: 'Budget' },
              { value: 'inscriptions', label: 'Inscrip.' },
            ]} />
          }>
          <VerticalBarChart data={anneeData} valueKey="value" labelKey="annee" color="bg-blue-500"
            formatVal={filterAnnee === 'budget' ? fmtDT : fmt} />
        </SectionCard>

        <SectionCard icon={PieChart} title="Répartition par domaine" color="bg-purple-500/10 text-purple-500"
          action={
            <FilterTabs value={filterDomaine} onChange={setFilterDomaine} options={[
              { value: 'count',       label: 'Nb' },
              { value: 'budget',      label: 'Budget' },
              { value: 'budgetMoyen', label: 'Moy.' },
            ]} />
          }>
          <DonutChart data={domaineData} valueKey="value" labelKey="domaine"
            colors={DONUT_COLORS} centerLabel="domaines" />
        </SectionCard>

        <SectionCard icon={Trophy} title="Top 5 formations" color="bg-amber-500/10 text-amber-500">
          <HorizontalBarChart data={stats?.topFormationsParBudget ?? []}
            valueKey="budget" labelKey="titre" color="bg-amber-500" formatVal={fmtDT} />
        </SectionCard>

      </div>

      <SectionCard icon={Wallet} title="Détail budget par domaine" color="bg-emerald-500/10 text-emerald-500"
        action={<span className="text-xs text-[var(--color-text-muted)]">trié par budget décroissant</span>}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {['Domaine','Formations','Budget total','Budget moyen','Part du total','Rang'].map(h => (
                  <th key={h} className="text-left pb-3 pr-4 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...(stats?.formationsParDomaine ?? [])]
                .sort((a, b) => Number(b.budgetTotal) - Number(a.budgetTotal))
                .map((s, i) => {
                  const pct = budgetTotal > 0 ? (Number(s.budgetTotal) / budgetTotal) * 100 : 0;
                  return (
                    <tr key={i} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg-secondary)] transition-colors">
                      <td className="py-3 pr-4 font-semibold text-[var(--color-text-primary)]">{s.domaine}</td>
                      <td className="py-3 pr-4 text-[var(--color-text-muted)]">{fmt(s.count)}</td>
                      <td className="py-3 pr-4 font-bold text-emerald-500">{fmtDT(s.budgetTotal)}</td>
                      <td className="py-3 pr-4 text-[var(--color-text-muted)]">{fmtDT(s.budgetMoyen)}</td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-[var(--color-bg-secondary)] rounded-full h-1.5 overflow-hidden">
                            <div className="h-1.5 bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-[var(--color-text-muted)] w-8">{Math.round(pct)}%</span>
                        </div>
                      </td>
                      <td className="py-3">
                        {i === 0
                          ? <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold px-2 py-0.5 rounded-lg"><ArrowUp size={10} /> #1</span>
                          : <span className="text-xs text-[var(--color-text-muted)]">#{i + 1}</span>}
                      </td>
                    </tr>
                  );
                })}
              {!(stats?.formationsParDomaine ?? []).length && (
                <tr><td colSpan="6" className="py-6 text-center"><Empty /></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* ════════════════ PARTICIPANTS ════════════════ */}
      <Divider label="Participants" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">

        <SectionCard icon={Users} title="Profil des participants" color="bg-violet-500/10 text-violet-500">
          <DonutChart
            data={(stats?.participantsParProfil ?? []).map(s => ({ profil: s.profil, value: s.count }))}
            valueKey="value" labelKey="profil" colors={DONUT_COLORS} centerLabel="participants" />
        </SectionCard>

        <SectionCard icon={Activity} title="Participation par structure" color="bg-indigo-500/10 text-indigo-500"
          action={
            <FilterTabs value={filterStructure} onChange={setFilterStructure} options={[
              { value: 'effectif',     label: 'Effectif' },
              { value: 'inscriptions', label: 'Inscrip.' },
            ]} />
          }>
          <HorizontalBarChart data={structureData} valueKey="value" labelKey="structure"
            color="bg-indigo-500"
            formatVal={filterStructure === 'effectif' ? n => `${fmt(n)} pers.` : n => `${fmt(n)} inscrip.`} />
        </SectionCard>

        <SectionCard icon={Trophy} title="Top 5 participants" color="bg-pink-500/10 text-pink-500">
          <HorizontalBarChart
            data={(stats?.topParticipants ?? []).map(p => ({ ...p, label: `${p.nom} ${p.prenom}` }))}
            valueKey="nbFormations" labelKey="label" color="bg-pink-500"
            formatVal={n => `${fmt(n)} formation${Number(n) > 1 ? 's' : ''}`} />
        </SectionCard>

      </div>

      <SectionCard icon={BarChart2} title="Heatmap — Participants par structure et profil"
        color="bg-cyan-500/10 text-cyan-500"
        action={<span className="text-xs text-[var(--color-text-muted)]">intensité = nombre de participants</span>}>
        <Heatmap data={stats?.heatmapStructureProfil ?? []}
          rowKey="structure" colKey="profil" valueKey="count" />
      </SectionCard>

      {/* ════════════════ FORMATEURS ════════════════ */}
      <Divider label="Formateurs" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        <SectionCard icon={GraduationCap} title="Internes vs Externes" color="bg-amber-500/10 text-amber-500">
          <DonutChart
            data={(stats?.formateursParType ?? []).map(s => ({ type: s.type, value: s.count }))}
            valueKey="value" labelKey="type" colors={['#10b981','#f59e0b']} centerLabel="formateurs" />
          <div className="mt-4 grid grid-cols-2 gap-3">
            {(stats?.formateursParType ?? []).map((s, i) => {
              const total = (stats?.formateursParType ?? []).reduce((a, x) => a + Number(x.count), 0);
              return (
                <div key={i} className={`rounded-xl p-3 ${i === 0 ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
                  <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${i === 0 ? 'text-emerald-500' : 'text-amber-500'}`}>{s.type}</p>
                  <p className="text-xl font-bold font-display text-[var(--color-text-primary)]">{fmt(s.count)}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{total > 0 ? Math.round((Number(s.count) / total) * 100) : 0}%</p>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard icon={Activity} title="Charge par formateur" color="bg-orange-500/10 text-orange-500"
          action={
            <FilterTabs value={filterFormateur} onChange={setFilterFormateur} options={[
              { value: 'all',     label: 'Tous' },
              { value: 'INTERNE', label: 'Internes' },
              { value: 'EXTERNE', label: 'Externes' },
            ]} />
          }>
          <HorizontalBarChart data={formateurData} valueKey="nbFormations" labelKey="label"
            color="bg-orange-500"
            formatVal={n => `${fmt(n)} formation${Number(n) > 1 ? 's' : ''}`} />
        </SectionCard>

      </div>
      </div>
    </Layout>
  );
}