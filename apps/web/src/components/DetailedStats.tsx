"use client";

import { motion } from 'framer-motion';
import { 
  HiCursorClick, 
  HiLightningBolt, 
  HiChartBar, 
  HiShieldCheck, 
  HiTrendingUp 
} from 'react-icons/hi';
import type { UserProfile } from '@vantage/shared';

// --- Formatters ---
const formatPercent = (val: number | undefined, decimals = 1) => {
  if (val === undefined || val === null) return '-';
  let num = val;
  // Normalize 0.x vs 100x
  if (num > 100) num = num / 100;
  if (num <= 1 && num > 0) num = num * 100;
  return `${num.toFixed(decimals)}%`;
};

const getRawPercent = (val: number | undefined) => {
  if (val === undefined || val === null) return 0;
  let num = val;
  if (num > 100) num = num / 100;
  if (num <= 1 && num > 0) num = num * 100;
  return num;
};

const formatNumber = (val: number | undefined, decimals = 2) => {
  if (val === undefined || val === null) return '-';
  return val.toFixed(decimals);
};

const formatMs = (val: number | undefined) => {
  if (val === undefined || val === null) return '-';
  return `${val.toFixed(0)}ms`;
};

interface DetailedStatsProps {
  profile: UserProfile;
}

export default function DetailedStats({ profile }: DetailedStatsProps) {
  const { leetify, steam } = profile;
  
  if (!leetify?.stats) return null;
  const stats = leetify.stats;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-border/40">
        <HiChartBar className="text-primary w-5 h-5" />
        <h2 className="text-lg font-bold uppercase tracking-wide text-foreground">Advanced Analytics</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. Aim & Mechanics */}
        <StatCard title="Aim Mechanics" icon={HiCursorClick}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <MetricBox label="Headshot %" value={formatPercent(stats.accuracy_head)} highlight={getRawPercent(stats.accuracy_head) > 50} />
            <MetricBox label="Spray acc" value={formatPercent(stats.spray_accuracy)} />
            <MetricBox label="CStrafe" value={formatPercent(stats.counter_strafing_good_shots_ratio)} />
            <MetricBox label="Reaction Time" value={formatMs(stats.reaction_time_ms)} />
            <MetricBox label="Preaim" value={`${formatNumber(stats.preaim, 1)}°`} />
            <MetricBox label="Spotted Acc" value={formatPercent(stats.accuracy_enemy_spotted)} />
          </div>
        </StatCard>

        {/* 2. Utility & Teamplay */}
        <StatCard title="Utility & Teamplay" icon={HiLightningBolt}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <MetricBox label="Util Dmg/Rnd" value={formatNumber(stats.he_foes_damage_avg, 1)} highlight={Number(stats.he_foes_damage_avg) > 5} />
            <MetricBox label="Flash Assists" value={formatNumber(stats.flashbang_leading_to_kill, 0)} />
            <MetricBox label="Blind Time" value={`${formatNumber(stats.flashbang_hit_foe_avg_duration, 1)}s`} />
            <MetricBox label="Trade Success" value={formatPercent(stats.trade_kills_success_percentage)} />
            <MetricBox label="Traded Deaths" value={formatPercent(stats.traded_deaths_success_percentage)} />
            <MetricBox label="Flash Usage" value={formatNumber(stats.flashbang_thrown, 0)} />
          </div>
        </StatCard>
      </div>

      {/* 3. Opening Duels (Split Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DuelCard 
          side="T" 
          winRate={stats.t_opening_duel_success_percentage}
          attemptRate={stats.t_opening_aggression_success_rate}
        />
        <DuelCard 
          side="CT" 
          winRate={stats.ct_opening_duel_success_percentage}
          attemptRate={stats.ct_opening_aggression_success_rate}
        />
      </div>

      {/* 4. Meta Rankings */}
      <div className="bg-secondary/10 border border-white/5 rounded-lg p-4 flex flex-wrap justify-between gap-4 items-center">
        <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase">
          <HiShieldCheck className="w-4 h-4" /> Global Rankings
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-2">
          {/* Fix: Applied simple logic to display cleaner rank numbers */}
          <MetaStat label="Leetify Rank" value={`${leetify.ranks?.leetify ? Number(leetify.ranks.leetify).toFixed(2) : '-'}`} />
          <MetaStat label="Premier" value={leetify.ranks?.premier?.toString() || '-'} />
          <MetaStat label="Service" value={`${steam.yearsOfService || 0} Years`} />
        </div>
      </div>

      {/* 5. Recent Teammates */}
      {leetify.recent_teammates && leetify.recent_teammates.length > 0 && (
        <div className="bg-card border border-white/10 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-zinc-800 rounded-md text-foreground">
              <HiShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold uppercase text-muted-foreground tracking-wider">Frequent Teammates</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {leetify.recent_teammates.slice(0, 6).map((teammate) => (
              <a
                key={teammate.steam64_id}
                href={`/profile/${teammate.steam64_id}`}
                className="group relative flex items-center gap-3 p-3 rounded-lg bg-zinc-900/40 border border-white/5 hover:border-primary/30 hover:bg-zinc-800/60 transition-all duration-200"
              >
                {/* Steam Avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    src={teammate.avatar || `https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg`}
                    alt={teammate.name || 'Steam Avatar'}
                    className="w-10 h-10 rounded-lg border border-white/10 group-hover:border-primary/40 transition-colors"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg';
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 bg-primary text-[9px] font-bold text-black px-1.5 py-0.5 rounded-full">
                    {teammate.recent_matches_count}
                  </div>
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                    {teammate.name || `Player #${teammate.steam64_id.slice(-6)}`}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-medium">
                    {teammate.recent_matches_count} {teammate.recent_matches_count === 1 ? 'match' : 'matches'} together
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Sub-Components ---

function StatCard({ title, icon: Icon, children }: any) {
  const SafeIcon = Icon || HiCursorClick;

  return (
    <div className="bg-card border border-white/10 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-zinc-800 rounded-md text-foreground">
          <SafeIcon className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-bold uppercase text-muted-foreground tracking-wider">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function MetricBox({ label, value, highlight }: any) {
  return (
    <div className="bg-zinc-900/40 border border-white/5 rounded-lg p-3 hover:bg-zinc-800/50 transition-colors">
      <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1 leading-tight min-h-[1.2em]">
        {label}
      </div>
      <div className={`font-mono text-lg font-bold ${highlight ? 'text-emerald-500' : 'text-foreground'}`}>
        {value}
      </div>
    </div>
  );
}

function DuelCard({ side, winRate, attemptRate }: { side: 'T' | 'CT', winRate: number, attemptRate: number }) {
  const isT = side === 'T';
  const color = isT ? 'bg-amber-500' : 'bg-blue-500';
  const textColor = isT ? 'text-amber-500' : 'text-blue-500';
  const label = isT ? 'Terrorist' : 'Counter-Terrorist';
  
  const winPercent = getRawPercent(winRate);
  const attemptPercent = getRawPercent(attemptRate);

  return (
    <div className="bg-card border border-white/10 rounded-xl p-5 relative overflow-hidden group">
      {/* Header */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <div className={`text-xs font-black uppercase tracking-widest ${textColor} mb-1`}>{label} Opening</div>
          <div className="text-3xl font-mono font-black text-foreground tracking-tight">
            {formatPercent(winRate)}
          </div>
          <div className="text-xs text-muted-foreground font-medium mt-1">Win Rate</div>
        </div>
        
        <div className="text-right border border-white/5 bg-zinc-900/50 p-2 rounded-lg">
          <div className="text-lg font-mono font-bold">{formatPercent(attemptRate)}</div>
          <div className="text-[10px] uppercase font-bold text-muted-foreground">Aggression</div>
        </div>
      </div>

      {/* Visual Bars */}
      <div className="space-y-4 relative z-10">
        <ProgressBar label="Win Probability" value={winPercent} color={color} />
        <ProgressBar label="Engagement Frequency" value={attemptPercent} color="bg-zinc-500" />
      </div>

      {/* Background Decor */}
      <HiTrendingUp className={`absolute -right-6 -bottom-6 w-40 h-40 opacity-[0.03] rotate-12 ${textColor}`} />
    </div>
  );
}

function ProgressBar({ label, value, color }: any) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
        <span>{label}</span>
      </div>
      {/* Fix: Darker background track for better visibility */}
      <div className="h-1.5 w-full bg-zinc-800/80 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${color} shadow-[0_0_10px_rgba(0,0,0,0.3)]`}
        />
      </div>
    </div>
  );
}

function MetaStat({ label, value }: any) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground font-medium">{label}:</span>
      <span className="text-sm font-mono font-bold text-foreground">{value}</span>
    </div>
  );
}