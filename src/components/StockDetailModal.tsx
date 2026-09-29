'use client';

import React from 'react';
import { StockHolding } from '@/types/portfolio';
import { formatINR, formatPercent } from '@/lib/formatters';
import { 
  X, 
  ExternalLink, 
  TrendingUp, 
  TrendingDown, 
  Building, 
  BarChart2, 
  ShieldAlert, 
  DollarSign,
  Activity
} from 'lucide-react';

interface StockDetailModalProps {
  stock: StockHolding | null;
  onClose: () => void;
}

export const StockDetailModal: React.FC<StockDetailModalProps> = ({ stock, onClose }) => {
  if (!stock) return null;

  const isPositive = stock.gainLoss >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-panel-elevated rounded-3xl border border-slate-700 p-6 md:p-8 bg-slate-950 text-white shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-white">{stock.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                {stock.ticker}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800">
                BSE: {stock.bseCode}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
              <span>Sector: <strong className="text-slate-200">{stock.sector}</strong></span>
              <span>•</span>
              <span>Exchange: <strong className="text-slate-200">{stock.exchange}</strong></span>
              <span>•</span>
              <span className="text-emerald-400 font-mono">Source: {stock.dataSource || 'Yahoo Finance Live'}</span>
            </div>
          </div>
        </div>

        {/* Real-time Pricing Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 mb-6">
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-medium">Current Price (CMP)</span>
            <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">{formatINR(stock.cmp)}</div>
            <span className="text-[10px] text-slate-500">Live Yahoo Quote</span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 uppercase font-medium">Purchase Price</span>
            <div className="text-xl font-bold font-mono text-slate-200 mt-0.5">{formatINR(stock.purchasePrice)}</div>
            <span className="text-[10px] text-slate-500">Qty: {stock.quantity}</span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 uppercase font-medium">Present Value</span>
            <div className="text-xl font-bold font-mono text-slate-100 mt-0.5">{formatINR(stock.presentValue)}</div>
            <span className="text-[10px] text-slate-500">Inv: {formatINR(stock.investment)}</span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 uppercase font-medium">Net Return</span>
            <div className={`text-xl font-bold font-mono mt-0.5 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatINR(stock.gainLoss, true)}
            </div>
            <span className={`text-[10px] font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatPercent(stock.gainLossPercentage, true)}
            </span>
          </div>
        </div>

        {/* Strategy & Advisory Signals */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-indigo-900/40 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <div>
              <div className="text-xs font-semibold text-slate-300">Technical & Advisory Recommendation</div>
              <div className="text-sm font-bold text-white flex items-center gap-2 mt-0.5">
                <span>Signal:</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                  stock.abhishekSignal === 'Must exit' || stock.abhishekSignal === 'Exit'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                }`}>
                  {stock.abhishekSignal || 'Hold / Accumulate'}
                </span>
                {stock.stage2 && (
                  <span className="text-xs text-slate-400 font-mono">
                    Stage-2 Momentum: <strong className="text-cyan-400">{stock.stage2}</strong>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <a
              href={`https://www.google.com/finance/quote/${stock.ticker}:NSE`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <span>Google Finance</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href={`https://finance.yahoo.com/quote/${stock.ticker}.NS`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <span>Yahoo Finance</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Tabs: Fundamentals & Growth Breakdown */}
        <div className="space-y-6">
          
          {/* 3-Year Growth Metrics */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>3-Year Historical Growth Rates (Excel Sheet)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Revenue Growth (3y)</span>
                <div className="text-lg font-bold font-mono text-cyan-300 mt-1">
                  {stock.revGrowth3y ? formatPercent(stock.revGrowth3y * 100, true) : 'N/A'}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">EBITDA Growth (3y)</span>
                <div className="text-lg font-bold font-mono text-indigo-300 mt-1">
                  {stock.ebitdaGrowth3y ? formatPercent(stock.ebitdaGrowth3y * 100, true) : 'N/A'}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Profit Growth (3y)</span>
                <div className="text-lg font-bold font-mono text-emerald-300 mt-1">
                  {stock.profitGrowth3y ? formatPercent(stock.profitGrowth3y * 100, true) : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Core Fundamentals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Core Fundamentals & Cash Flows</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Revenue TTM</span>
                <div className="font-mono font-bold text-white mt-1">
                  {stock.revTTM ? `₹${stock.revTTM.toLocaleString('en-IN')} Cr` : 'N/A'}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">EBITDA Margin</span>
                <div className="font-mono font-bold text-white mt-1">
                  {stock.ebitdaMargin ? formatPercent(stock.ebitdaMargin * 100, false) : 'N/A'}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">PAT Margin</span>
                <div className="font-mono font-bold text-white mt-1">
                  {stock.patMargin ? formatPercent(stock.patMargin * 100, false) : 'N/A'}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Debt to Equity</span>
                <div className="font-mono font-bold text-white mt-1">
                  {stock.debtToEquity !== undefined ? stock.debtToEquity.toFixed(1) : '0.0'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Book Value</span>
                <div className="font-mono font-bold text-white mt-1">
                  {stock.bookValue ? `₹${stock.bookValue}` : 'N/A'}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">5-Yr Cash Flow (CFO)</span>
                <div className="font-mono font-bold text-white mt-1">
                  {stock.cfo5yr ? `₹${stock.cfo5yr.toLocaleString('en-IN')} Cr` : 'N/A'}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Free Cash Flow (FCF)</span>
                <div className="font-mono font-bold text-white mt-1">
                  {stock.fcf5yr ? `₹${stock.fcf5yr.toLocaleString('en-IN')} Cr` : 'N/A'}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">P/E Ratio</span>
                <div className="font-mono font-bold text-indigo-400 mt-1">
                  {stock.peRatio ? (typeof stock.peRatio === 'number' ? stock.peRatio.toFixed(1) : stock.peRatio) : 'N/A'}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all cursor-pointer"
          >
            Close Overview
          </button>
        </div>

      </div>
    </div>
  );
};
