'use client';

import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { SectorSummary, StockHolding } from '@/types/portfolio';
import { formatINR, formatPercent } from '@/lib/formatters';
import { PieChart as PieIcon, BarChart3, TrendingUp, TrendingDown } from 'lucide-react';

interface PortfolioChartsProps {
  sectorSummaries: SectorSummary[];
  holdings: StockHolding[];
}

const SECTOR_COLORS: Record<string, string> = {
  Financial: '#6366f1', // Indigo
  Tech: '#06b6d4',      // Cyan
  Consumer: '#ec4899',  // Pink
  Power: '#f59e0b',     // Amber
  Pipe: '#8b5cf6',      // Purple
  Others: '#10b981',    // Emerald
};

export const PortfolioCharts: React.FC<PortfolioChartsProps> = ({
  sectorSummaries,
  holdings,
}) => {
  const [activeTab, setActiveTab] = useState<'allocation' | 'performance'>('allocation');

  // Prepare allocation data
  const allocationData = sectorSummaries.map((s) => ({
    name: s.sector,
    value: s.totalInvestment,
    weight: s.portfolioWeight,
    color: SECTOR_COLORS[s.sector] || '#94a3b8',
    presentValue: s.totalPresentValue,
    gainLoss: s.totalGainLoss,
  }));

  // Prepare performance data
  const performanceData = sectorSummaries.map((s) => ({
    sector: s.sector,
    gainLossPercent: s.totalGainLossPercentage,
    gainLossAmount: s.totalGainLoss,
    color: s.totalGainLossPercentage >= 0 ? '#10b981' : '#f43f5e',
  }));

  // Top gainers & losers
  const sortedHoldings = [...holdings].sort((a, b) => b.gainLossPercentage - a.gainLossPercentage);
  const topGainers = sortedHoldings.slice(0, 3);
  const topLosers = [...sortedHoldings].reverse().slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      
      {/* Chart Panel (Takes 2 cols) */}
      <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800/80 bg-slate-900/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-cyan-400" />
              <span>Sector Breakdown & Analytics</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Portfolio capital weight & sector-level returns
            </p>
          </div>

          <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs self-start">
            <button
              onClick={() => setActiveTab('allocation')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'allocation'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <PieIcon className="w-3.5 h-3.5" />
              <span>Allocation %</span>
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'performance'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Sector P&L %</span>
            </button>
          </div>
        </div>

        {/* Chart View */}
        <div className="h-64 w-full">
          {activeTab === 'allocation' ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, weight }: any) => `${name} (${weight}%)`}
                  labelLine={false}
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#090d16" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="glass-panel-elevated p-3 rounded-xl border border-slate-700 text-xs">
                          <p className="font-bold text-white mb-1">{data.name} Sector</p>
                          <p className="text-slate-300">Invested: <span className="font-mono text-cyan-300">{formatINR(data.value)}</span></p>
                          <p className="text-slate-300">Present Val: <span className="font-mono text-emerald-300">{formatINR(data.presentValue)}</span></p>
                          <p className="text-slate-300">Gain/Loss: <span className={`font-mono ${data.gainLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{formatINR(data.gainLoss, true)}</span></p>
                          <p className="text-slate-400 mt-1">Weight: <span className="font-mono font-semibold text-white">{data.weight}%</span></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="sector" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit="%" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="glass-panel-elevated p-3 rounded-xl border border-slate-700 text-xs">
                          <p className="font-bold text-white mb-1">{d.sector} Sector</p>
                          <p className={`font-mono font-bold ${d.gainLossPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            Return: {formatPercent(d.gainLossPercent, true)}
                          </p>
                          <p className="text-slate-300 font-mono">
                            P&L: {formatINR(d.gainLossAmount, true)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="gainLossPercent" radius={[4, 4, 0, 0]}>
                  {performanceData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Legend pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-4 pt-3 border-t border-slate-800/60 text-xs">
          {allocationData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></span>
              <span className="text-slate-300">{entry.name}</span>
              <span className="text-slate-500 font-mono text-[11px]">({entry.weight}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Gainers & Losers Rankings */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 bg-slate-900/50 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Top Movers</span>
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Leaders and laggards by return %
          </p>

          {/* Top 3 Gainers */}
          <div className="space-y-2 mb-4">
            <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Top Performers
            </div>
            {topGainers.map((stock) => (
              <div 
                key={stock.id}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs hover:border-emerald-500/40 transition-colors"
              >
                <div>
                  <div className="font-semibold text-white">{stock.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{stock.ticker} • {stock.sector}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-400 font-mono">
                    {formatPercent(stock.gainLossPercentage, true)}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {formatINR(stock.gainLoss, true)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Top 3 Losers */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1">
              <TrendingDown className="w-3 h-3" /> Underperformers
            </div>
            {topLosers.map((stock) => (
              <div 
                key={stock.id}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs hover:border-rose-500/40 transition-colors"
              >
                <div>
                  <div className="font-semibold text-white">{stock.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{stock.ticker} • {stock.sector}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-rose-400 font-mono">
                    {formatPercent(stock.gainLossPercentage, true)}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {formatINR(stock.gainLoss, true)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
