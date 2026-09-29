'use client';

import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  DollarSign, 
  AlertTriangle, 
  Award,
  Zap
} from 'lucide-react';
import { PortfolioSummary, StockHolding } from '@/types/portfolio';
import { formatINR, formatPercent, formatLakhCr } from '@/lib/formatters';

interface PortfolioStatsProps {
  summary: PortfolioSummary;
  holdings: StockHolding[];
}

export const PortfolioStats: React.FC<PortfolioStatsProps> = ({ summary, holdings }) => {
  const isPositiveGain = summary.totalGainLoss >= 0;
  const isPositiveDay = summary.dayChange >= 0;

  // Advisory counters
  const mustExitCount = holdings.filter(h => h.abhishekSignal === 'Must exit' || h.abhishekSignal === 'Exit').length;
  const stage2Count = holdings.filter(h => h.stage2 === 'Yes').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      
      {/* 1. Present Value */}
      <div className="glass-panel glass-card-hover rounded-2xl p-5 border border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-slate-950/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">Total Portfolio Value</span>
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white font-mono">
            {formatINR(summary.totalPresentValue)}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-slate-400">
              {formatLakhCr(summary.totalPresentValue)}
            </span>
            <span className="inline-block w-1 h-1 rounded-full bg-slate-700"></span>
            <span className="text-xs text-slate-400 font-mono">
              {summary.totalHoldingsCount} Holdings
            </span>
          </div>
        </div>
      </div>

      {/* 2. Total Invested */}
      <div className="glass-panel glass-card-hover rounded-2xl p-5 border border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-slate-950/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">Capital Invested</span>
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-200 font-mono">
            {formatINR(summary.totalInvestment)}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-slate-400">
              {formatLakhCr(summary.totalInvestment)}
            </span>
            <span className="inline-block w-1 h-1 rounded-full bg-slate-700"></span>
            <span className="text-xs text-cyan-400 font-medium flex items-center gap-1">
              <Zap className="w-3 h-3" /> Cost Basis
            </span>
          </div>
        </div>
      </div>

      {/* 3. Total Net P&L */}
      <div className="glass-panel glass-card-hover rounded-2xl p-5 border border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-slate-950/80 relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-32 h-32 ${isPositiveGain ? 'bg-emerald-500/10' : 'bg-rose-500/10'} rounded-full blur-2xl pointer-events-none -mr-10 -mt-10`}></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">Total Net Gain / Loss</span>
          <div className={`p-2 rounded-xl border ${
            isPositiveGain 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>
            {isPositiveGain ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          </div>
        </div>
        <div className="mt-3">
          <div className={`text-2xl lg:text-3xl font-extrabold tracking-tight font-mono ${
            isPositiveGain ? 'text-emerald-400 glow-emerald' : 'text-rose-400 glow-rose'
          }`}>
            {formatINR(summary.totalGainLoss, true)}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold font-mono ${
              isPositiveGain 
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
            }`}>
              {formatPercent(summary.totalGainLossPercentage, true)}
            </span>
            <span className="text-xs text-slate-400">
              Overall Return
            </span>
          </div>
        </div>
      </div>

      {/* 4. Strategic Signal & Risk Alert */}
      <div className="glass-panel glass-card-hover rounded-2xl p-5 border border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-slate-950/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">Advisory & Health</span>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 mb-1">Exit Signals</div>
            <div className="text-2xl font-bold font-mono text-rose-400 flex items-center gap-1.5">
              <span>{mustExitCount}</span>
              <span className="text-xs font-normal text-slate-400">stocks</span>
            </div>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <div className="text-xs text-slate-400 mb-1">Stage-2 Leaders</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 flex items-center gap-1.5">
              <span>{stage2Count}</span>
              <span className="text-xs font-normal text-slate-400">stocks</span>
            </div>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Day movement:</span>
          <span className={`font-mono font-medium ${isPositiveDay ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatINR(summary.dayChange, true)} ({formatPercent(summary.dayChangePercentage, true)})
          </span>
        </div>
      </div>

    </div>
  );
};
