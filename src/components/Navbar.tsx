'use client';

import React from 'react';
import { 
  RefreshCw, 
  Clock, 
  PlusCircle, 
  Download, 
  Terminal, 
  TrendingUp, 
  Layers
} from 'lucide-react';
import { RefreshSettings } from '@/types/portfolio';

interface NavbarProps {
  settings: RefreshSettings;
  onSettingsChange: (settings: RefreshSettings) => void;
  secondsRemaining: number;
  isRefreshing: boolean;
  onManualRefresh: () => void;
  onOpenAddModal: () => void;
  onOpenInspector: () => void;
  onExportData: (format: 'csv' | 'json') => void;
  lastUpdated: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onSettingsChange,
  secondsRemaining,
  isRefreshing,
  onManualRefresh,
  onOpenAddModal,
  onOpenInspector,
  onExportData,
  lastUpdated,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand & Subtitle */}
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span>Octa Byte AI</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-mono font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                    PORTFOLIO PRO
                  </span>
                </h1>
                <span className="hidden lg:inline-flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-mono">
                  CIN: U62099KA2025PTC201620
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>Real-time Yahoo CMP & Google Finance P/E Engine</span>
                <span className="inline-block w-1 h-1 rounded-full bg-slate-600"></span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  NSE / BSE Connected
                </span>
              </p>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            
            {/* Auto-Refresh Timer Control */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Interval:</span>
              <select
                aria-label="Refresh interval"
                value={settings.intervalSeconds}
                onChange={(e) => onSettingsChange({
                  ...settings,
                  intervalSeconds: Number(e.target.value),
                  isAutoRefreshEnabled: Number(e.target.value) > 0
                })}
                className="bg-slate-950 text-white font-medium px-2 py-0.5 rounded border border-slate-700 text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value={5}>5 sec (Turbo)</option>
                <option value={15}>15 sec (Default)</option>
                <option value={30}>30 sec</option>
                <option value={60}>60 sec</option>
                <option value={0}>Pause</option>
              </select>

              {settings.intervalSeconds > 0 && (
                <div className="flex items-center gap-1 pl-1 text-[11px] font-mono text-cyan-400">
                  <span className="w-4 text-right font-bold">{secondsRemaining}</span>s
                </div>
              )}
            </div>

            {/* Manual Sync Button */}
            <button
              id="refresh-now-btn"
              onClick={onManualRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 text-xs font-medium transition-all cursor-pointer disabled:opacity-50"
              title="Fetch latest CMP from Yahoo & P/E from Google Finance"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">{isRefreshing ? 'Syncing...' : 'Sync Now'}</span>
            </button>

            {/* Scraper / Architecture Inspector */}
            <button
              id="api-inspector-btn"
              onClick={onOpenInspector}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/50 text-indigo-300 border border-indigo-800/40 text-xs font-medium transition-all cursor-pointer"
              title="Inspect Yahoo & Google Finance scraper and cache status"
            >
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">API Inspector</span>
            </button>

            {/* Add Stock Button */}
            <button
              id="add-stock-btn"
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-700/20 text-xs font-semibold transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Stock</span>
            </button>

            {/* Export Dropdown */}
            <div className="relative group">
              <button
                id="export-btn"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export</span>
              </button>
              <div className="absolute right-0 mt-1 w-32 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 hidden group-hover:block z-50">
                <button
                  onClick={() => onExportData('csv')}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  Export CSV
                </button>
                <button
                  onClick={() => onExportData('json')}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  Export JSON
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
