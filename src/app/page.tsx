'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StockHolding, PortfolioSummary, RefreshSettings } from '@/types/portfolio';
import { INITIAL_HOLDINGS } from '@/data/initialHoldings';
import { calculatePortfolioSummary } from '@/lib/finance-service';
import { Navbar } from '@/components/Navbar';
import { PortfolioStats } from '@/components/PortfolioStats';
import { PortfolioCharts } from '@/components/PortfolioCharts';
import { PortfolioTable } from '@/components/PortfolioTable';
import { StockDetailModal } from '@/components/StockDetailModal';
import { AddStockModal } from '@/components/AddStockModal';
import { ScraperInspectorModal } from '@/components/ScraperInspectorModal';
import { 
  Building2, 
  ShieldCheck, 
  Cpu, 
  ExternalLink, 
  Layers, 
  TrendingUp, 
  BarChart4,
  CheckCircle2
} from 'lucide-react';

export default function Home() {
  const [holdings, setHoldings] = useState<StockHolding[]>(INITIAL_HOLDINGS);
  const [summary, setSummary] = useState<PortfolioSummary>(() => calculatePortfolioSummary(INITIAL_HOLDINGS));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('Just now');
  
  // Refresh interval settings (Default: 15 seconds as required by case study)
  const [settings, setSettings] = useState<RefreshSettings>({
    intervalSeconds: 15,
    isAutoRefreshEnabled: true,
    soundAlerts: false,
  });
  const [secondsRemaining, setSecondsRemaining] = useState<number>(15);

  // Price flash tracking (ticker -> 'up' | 'down')
  const [priceFlashMap, setPriceFlashMap] = useState<Record<string, 'up' | 'down'>>({});

  // Modals state
  const [selectedStock, setSelectedStock] = useState<StockHolding | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  const holdingsRef = useRef<StockHolding[]>(holdings);
  useEffect(() => {
    holdingsRef.current = holdings;
  }, [holdings]);

  /**
   * Refreshes portfolio quotes from Next.js server API
   */
  const refreshQuotes = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);

    try {
      const response = await fetch('/api/portfolio/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ holdings: holdingsRef.current }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.holdings)) {
        // Compute price changes to trigger flash animations
        const flashMap: Record<string, 'up' | 'down'> = {};
        const oldMap = new Map(holdingsRef.current.map(h => [h.ticker, h.cmp]));

        data.holdings.forEach((newH: StockHolding) => {
          const oldCmp = oldMap.get(newH.ticker);
          if (oldCmp !== undefined && newH.cmp !== oldCmp) {
            flashMap[newH.ticker] = newH.cmp > oldCmp ? 'up' : 'down';
          }
        });

        if (Object.keys(flashMap).length > 0) {
          setPriceFlashMap(flashMap);
          setTimeout(() => setPriceFlashMap({}), 1500);
        }

        setHoldings(data.holdings);
        if (data.summary) {
          setSummary(data.summary);
        } else {
          setSummary(calculatePortfolioSummary(data.holdings));
        }

        setLastUpdatedTime(new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }));
      }
    } catch (error) {
      console.warn('Auto refresh error, maintaining resilient state:', error);
    } finally {
      setIsRefreshing(false);
      setSecondsRemaining(settings.intervalSeconds > 0 ? settings.intervalSeconds : 15);
    }
  }, [isRefreshing, settings.intervalSeconds]);

  // Initial fetch on mount
  useEffect(() => {
    refreshQuotes();
  }, []);

  // Interval timer tick for periodic update
  useEffect(() => {
    if (!settings.isAutoRefreshEnabled || settings.intervalSeconds <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          refreshQuotes();
          return settings.intervalSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [settings.isAutoRefreshEnabled, settings.intervalSeconds, refreshQuotes]);

  // Add new stock
  const handleAddStock = (newStock: StockHolding) => {
    const updated = [newStock, ...holdings];
    setHoldings(updated);
    setSummary(calculatePortfolioSummary(updated));
    // Trigger price fetch for newly added stock
    setTimeout(() => refreshQuotes(), 100);
  };

  // Delete holding
  const handleDeleteStock = (id: string) => {
    const updated = holdings.filter(h => h.id !== id);
    setHoldings(updated);
    setSummary(calculatePortfolioSummary(updated));
  };

  // Export to CSV or JSON
  const handleExportData = (format: 'csv' | 'json') => {
    if (format === 'json') {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(holdings, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `portfolio_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else {
      const headers = [
        'Particulars',
        'Sector',
        'Purchase Price',
        'Quantity',
        'Investment',
        'Portfolio Weight %',
        'NSE/BSE Code',
        'CMP',
        'Present Value',
        'Gain/Loss',
        'Gain/Loss %',
        'P/E Ratio',
        'Latest Earnings',
        'Signal'
      ];
      const rows = holdings.map(h => [
        `"${h.name}"`,
        `"${h.sector}"`,
        h.purchasePrice,
        h.quantity,
        h.investment,
        h.portfolioWeight,
        `"${h.ticker} / ${h.bseCode}"`,
        h.cmp,
        h.presentValue,
        h.gainLoss,
        h.gainLossPercentage,
        h.peRatio || '-',
        `"${h.latestEarnings || '-'}"`,
        `"${h.abhishekSignal || '-'}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', encodeURI(csvContent));
      downloadAnchor.setAttribute('download', `portfolio_${Date.now()}.csv`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      
      {/* Background radial aura glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[400px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[400px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>

      {/* Top Navigation */}
      <Navbar
        settings={settings}
        onSettingsChange={setSettings}
        secondsRemaining={secondsRemaining}
        isRefreshing={isRefreshing}
        onManualRefresh={refreshQuotes}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenInspector={() => setIsInspectorOpen(true)}
        onExportData={handleExportData}
        lastUpdated={lastUpdatedTime}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Breadcrumb & Status */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300 mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>Octa Byte AI Case Study: Dynamic Portfolio Dashboard</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Equity Holdings & Sector Performance
            </h2>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-500">Last Synced:</span>
              <span className="text-slate-200 font-semibold">{lastUpdatedTime}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Auto-refresh {settings.intervalSeconds}s</span>
            </div>
          </div>
        </div>

        {/* 1. Summary KPI Cards */}
        <PortfolioStats 
          summary={summary} 
          holdings={holdings} 
        />

        {/* 2. Visualizations (Recharts) */}
        <PortfolioCharts 
          sectorSummaries={summary.sectorSummaries} 
          holdings={holdings} 
        />

        {/* 3. Main Portfolio Table (Sector Grouping & Sorting) */}
        <div className="mb-10">
          <PortfolioTable
            holdings={holdings}
            sectorSummaries={summary.sectorSummaries}
            onSelectStock={(stock) => setSelectedStock(stock)}
            onDeleteStock={handleDeleteStock}
            priceFlashMap={priceFlashMap}
          />
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/60 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Octa Byte AI Pvt Ltd</span>
            <span>•</span>
            <span>CIN: U62099KA2025PTC201620</span>
            <span>•</span>
            <span className="text-slate-500">WeWork Prestige Cube, Adugodi, Bangalore - 560030</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Powered by Next.js, TypeScript & Tailwind CSS</span>
            <span>•</span>
            <span>Yahoo Finance CMP & Google Finance P/E Engine</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <StockDetailModal
        stock={selectedStock}
        onClose={() => setSelectedStock(null)}
      />

      <AddStockModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddStock={handleAddStock}
      />

      <ScraperInspectorModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
      />

    </div>
  );
}
