"use client";

import { motion } from 'framer-motion';
import { HiShieldExclamation, HiExclamationTriangle, HiInformationCircle } from 'react-icons/hi';
import type { RiskAssessment } from '@vantage/shared';

// Categorize flags for better organization
const CATEGORIES = {
  ACCOUNT: ['NEW_ACCOUNT', 'YOUNG_ACCOUNT', 'HIDDEN_PROFILE', 'VAC_BANNED', 'GAME_BANNED', 'LOW_STEAM_LEVEL', 'FACEIT_BANNED'],
  STATISTICS: ['EXTREME_HEADSHOT', 'INHUMAN_REACTIONS', 'PERFECT_SPRAY', 'SKILL_IMBALANCE', 'NO_UTILITY_USAGE', 'HIGH_KD_LOW_MATCHES'],
  PERFORMANCE: ['PERFECT_MOVEMENT', 'DOMINANT_T_ENTRIES', 'DOMINANT_CT_HOLDS', 'PERFECT_CROSSHAIR', 'NEW_ACCOUNT_DOMINATING'],
  BEHAVIORAL: ['NEW_FACEIT_HIGH_LEVEL', 'INCONSISTENT_PERFORMANCE', 'LOW_HOURS_HIGH_SKILL', 'EXTREME_SIDE_BIAS']
};

const CATEGORY_LABELS = {
  ACCOUNT: 'Account Flags',
  STATISTICS: 'Statistical Anomalies',
  PERFORMANCE: 'Performance Patterns',
  BEHAVIORAL: 'Behavioral Indicators'
};

const CATEGORY_ICONS = {
  ACCOUNT: HiShieldExclamation,
  STATISTICS: HiExclamationTriangle,
  PERFORMANCE: HiInformationCircle,
  BEHAVIORAL: HiExclamationTriangle
};

export default function RiskMeter({ risk }: { risk: RiskAssessment }) {
  const levelColors = {
    low: 'bg-emerald-500',
    medium: 'bg-amber-500',
    high: 'bg-orange-500',
    critical: 'bg-rose-500',
  };

  const levelTextColors = {
    low: 'text-emerald-500',
    medium: 'text-amber-500',
    high: 'text-orange-500',
    critical: 'text-rose-500',
  };

  const levelBgColors = {
    low: 'bg-emerald-500/10',
    medium: 'bg-amber-500/10',
    high: 'bg-orange-500/10',
    critical: 'bg-rose-500/10',
  };

  const bgClass = levelColors[risk.level] || 'bg-zinc-500';
  const textColorClass = levelTextColors[risk.level] || 'text-zinc-500';
  const bgColorClass = levelBgColors[risk.level] || 'bg-zinc-500/10';

  // Group flags by category
  const categorizedFlags: Record<string, typeof risk.flags> = {
    ACCOUNT: [],
    STATISTICS: [],
    PERFORMANCE: [],
    BEHAVIORAL: []
  };

  risk.flags.forEach(flag => {
    for (const [category, flagList] of Object.entries(CATEGORIES)) {
      if (flagList.includes(flag.flag)) {
        categorizedFlags[category].push(flag);
        break;
      }
    }
  });

  const getRiskLevelText = () => {
    switch (risk.level) {
      case 'critical': return 'CRITICAL THREAT';
      case 'high': return 'HIGH RISK';
      case 'medium': return 'MODERATE RISK';
      case 'low': return 'LOW RISK';
      default: return 'UNKNOWN';
    }
  };

  return (
    <div className="bg-card rounded-xl border border-white/10 p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/5">
        <div className={`p-2 ${bgColorClass} rounded-lg`}>
          <HiShieldExclamation className={`${textColorClass} w-5 h-5`} />
        </div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Threat Assessment</h3>
      </div>

      {/* Risk Score Display */}
      <div className="mb-6">
        <div className="flex justify-between items-end mb-3">
          <div>
            <span className={`text-5xl font-black font-mono ${textColorClass} drop-shadow-lg`}>
              {risk.totalScore}
            </span>
            <span className="text-xl text-muted-foreground font-mono ml-1">/100</span>
          </div>
          <div className="text-right">
            <div className={`text-xs font-black uppercase tracking-wider ${textColorClass} mb-1`}>
              {getRiskLevelText()}
            </div>
            <div className="text-[10px] text-muted-foreground">
              {risk.flags.length} {risk.flags.length === 1 ? 'flag' : 'flags'} detected
            </div>
          </div>
        </div>
        
        {/* Enhanced Progress Bar */}
        <div className="relative">
          <div className="h-3 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/10">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${risk.totalScore}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className={`h-full ${bgClass} shadow-lg`}
              style={{
                boxShadow: `0 0 15px ${risk.level === 'critical' ? 'rgba(244, 63, 94, 0.5)' : 
                                        risk.level === 'high' ? 'rgba(249, 115, 22, 0.5)' :
                                        risk.level === 'medium' ? 'rgba(251, 191, 36, 0.5)' :
                                        'rgba(16, 185, 129, 0.5)'}`
              }}
            />
          </div>
          {/* Threshold Markers */}
          <div className="absolute -top-1 left-0 w-full h-5 flex justify-between pointer-events-none">
            <div className="w-px h-full bg-zinc-700" style={{ marginLeft: '25%' }}></div>
            <div className="w-px h-full bg-zinc-700" style={{ marginLeft: '20%' }}></div>
            <div className="w-px h-full bg-zinc-700" style={{ marginLeft: '25%' }}></div>
          </div>
        </div>
        <div className="flex justify-between text-[9px] text-muted-foreground font-medium mt-1 px-1">
          <span>0</span>
          <span>25</span>
          <span>45</span>
          <span>70</span>
          <span>100</span>
        </div>
      </div>

      {/* Categorized Flags */}
      <div className="space-y-4">
        {risk.flags.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 rounded-full mb-3">
              <HiShieldExclamation className="w-8 h-8 text-emerald-500" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">No suspicious activity detected</p>
            <p className="text-xs text-muted-foreground/70 mt-1">This player appears legitimate</p>
          </div>
        ) : (
          Object.entries(categorizedFlags).map(([category, flags]) => {
            if (flags.length === 0) return null;
            
            const Icon = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS];
            const categoryScore = flags.reduce((sum, f) => sum + f.weight, 0);
            
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-t border-white/5 pt-4 first:border-0 first:pt-0"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">
                      {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-rose-500">+{categoryScore}</span>
                </div>

                {/* Flags in Category */}
                <div className="space-y-2">
                  {flags.map((f, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex justify-between items-start text-xs bg-zinc-900/40 p-3 rounded-lg border border-white/5 hover:border-white/10 transition-colors"
                    >
                      <div className="pr-4 flex-1">
                        <span className="font-bold text-foreground block mb-1">
                          {f.flag.replace(/_/g, ' ')}
                        </span>
                        <span className="text-muted-foreground text-[11px] leading-relaxed">{f.reason}</span>
                      </div>
                      <div className="flex-shrink-0 flex items-center gap-1">
                        <span className="font-mono text-rose-400 font-bold">+{f.weight}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Risk Level Legend (if flags exist) */}
      {risk.flags.length > 0 && (
        <div className="mt-6 pt-4 border-t border-white/5">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="space-y-1">
              <div className="h-1.5 bg-emerald-500 rounded-full"></div>
              <div className="text-[9px] text-muted-foreground font-medium">Low</div>
              <div className="text-[10px] text-emerald-500 font-bold">0-24</div>
            </div>
            <div className="space-y-1">
              <div className="h-1.5 bg-amber-500 rounded-full"></div>
              <div className="text-[9px] text-muted-foreground font-medium">Medium</div>
              <div className="text-[10px] text-amber-500 font-bold">25-44</div>
            </div>
            <div className="space-y-1">
              <div className="h-1.5 bg-orange-500 rounded-full"></div>
              <div className="text-[9px] text-muted-foreground font-medium">High</div>
              <div className="text-[10px] text-orange-500 font-bold">45-69</div>
            </div>
            <div className="space-y-1">
              <div className="h-1.5 bg-rose-500 rounded-full"></div>
              <div className="text-[9px] text-muted-foreground font-medium">Critical</div>
              <div className="text-[10px] text-rose-500 font-bold">70-100</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}