'use client';

import React, { useState } from 'react';
import { X, Play, CheckCircle2, AlertTriangle, ShieldCheck, Terminal, Server, RefreshCw } from 'lucide-react';

interface ScraperInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScraperInspectorModal: React.FC<ScraperInspectorModalProps> = ({ isOpen, onClose }) => {
  const [selectedTicker, setSelectedTicker] = useState('HDFCBANK');
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const runTest = async () => {
    setLoading(true);
    setTestResult(null);
    try {
      const res = await fetch(`/api/portfolio/scrape-google?ticker=${encodeURIComponent(selectedTicker)}&exchange=NSE`);
      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-panel-elevated rounded-3xl border border-slate-700 p-6 md:p-8 bg-slate-950 text-white shadow-2xl">
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">API & Scraper Technical Architecture</h2>
            <p className="text-xs text-slate-400">Section 3 Case Study: External unofficial APIs, caching, scraping & resilience</p>
          </div>
        </div>

        {/* Technical Architecture Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-1">
              <Server className="w-3.5 h-3.5" />
              <span>Yahoo Finance</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Extracts real-time CMP via v8 ticker charts with `.NS` / `.BO` suffix mapping.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-indigo-400 font-semibold mb-1">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Google Finance</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Server-side HTML scraper parses P/E ratio, market cap, and quarterly reports using Cheerio.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Rate Throttling</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              In-memory 15s TTL LRU cache + micro-fluctuation fallback prevents IP bans & blocks.
            </p>
          </div>
        </div>

        {/* Live Scrape Diagnostics Runner */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 mb-6">
          <div className="text-xs font-semibold text-slate-300 mb-2">Live Scraper Diagnostic Tool:</div>
          <div className="flex items-center gap-3">
            <select
              value={selectedTicker}
              onChange={(e) => setSelectedTicker(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            >
              <option value="HDFCBANK">HDFCBANK (NSE)</option>
              <option value="BAJFINANCE">BAJFINANCE (NSE)</option>
              <option value="ICICIBANK">ICICIBANK (NSE)</option>
              <option value="INFY">INFY (NSE)</option>
              <option value="TATAPOWER">TATAPOWER (NSE)</option>
              <option value="ASTRAL">ASTRAL (NSE)</option>
              <option value="POLYCAB">POLYCAB (NSE)</option>
            </select>

            <button
              onClick={runTest}
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer disabled:opacity-50 transition-all"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{loading ? 'Scraping...' : 'Test Scrape'}</span>
            </button>
          </div>

          {testResult && (
            <div className="mt-4 p-3 rounded-xl bg-black border border-slate-800 font-mono text-[11px] text-slate-300 max-h-48 overflow-y-auto">
              <pre>{JSON.stringify(testResult, null, 2)}</pre>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold cursor-pointer border border-slate-800 transition-colors"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
