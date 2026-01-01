"use client";

import { motion } from 'framer-motion';
import { HiShieldExclamation } from 'react-icons/hi';
import type { RiskAssessment } from '@vantage/shared';

export default function RiskMeter({ risk }: { risk: RiskAssessment }) {
  const levelColors = {
    low: 'bg-emerald-500',
    medium: 'bg-amber-500',
    high: 'bg-orange-500',
    critical: 'bg-rose-500',
  };

  const bgClass = levelColors[risk.level] || 'bg-zinc-500';

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <HiShieldExclamation className="text-muted-foreground" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Risk Assessment</h3>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <span className="text-3xl font-bold font-mono text-foreground">{risk.totalScore}</span>
          <span className="text-xs font-bold uppercase text-muted-foreground pb-1">{risk.level} Risk</span>
        </div>
        
        {/* Simple Progress Bar */}
        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${risk.totalScore}%` }}
            transition={{ duration: 1 }}
            className={`h-full ${bgClass}`}
          />
        </div>
      </div>

      <div className="space-y-3">
        {risk.flags.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">No risk flags detected.</p>
        ) : (
          risk.flags.map((f, i) => (
            <div key={i} className="flex justify-between items-start text-xs border-t border-border pt-2 first:border-0">
              <div className="pr-4">
                <span className="font-bold text-foreground block mb-0.5">{f.flag.replace(/_/g, ' ')}</span>
                <span className="text-muted-foreground">{f.reason}</span>
              </div>
              <span className="font-mono text-rose-500 font-bold shrink-0">+{f.weight}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}