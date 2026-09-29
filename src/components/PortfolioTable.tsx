'use client';

import React, { useState, useMemo } from 'react';
import { StockHolding, SectorSummary } from '@/types/portfolio';
import { formatINR, formatPercent } from '@/lib/formatters';
import { 
  Search, 
  ChevronDown, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpDown, 
  Eye, 
  Trash2, 
  Filter, 
  Layers, 
  List, 
  ExternalLink,
  AlertCircle
} from 'lucide-react';

interface PortfolioTableProps {
  holdings: StockHolding[];
  sectorSummaries: SectorSummary[];
  onSelectStock: (stock: StockHolding) => void;
  onDeleteStock: (id: string) => void;
  priceFlashMap?: Record<string, 'up' | 'down'>;
}

type SortField = 'name' | 'purchasePrice' | 'quantity' | 'investment' | 'portfolioWeight' | 'cmp' | 'presentValue' | 'gainLoss' | 'gainLossPercentage' | 'peRatio';
type SortDirection = 'asc' | 'desc';

export const PortfolioTable: React.FC<PortfolioTableProps> = ({
  holdings,
  sectorSummaries,
  onSelectStock,
  onDeleteStock,
  priceFlashMap = {},
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [filterAction, setFilterAction] = useState<'all' | 'gainers' | 'losers' | 'exit'>('all');
  const [isGroupedView, setIsGroupedView] = useState<boolean>(true);
  const [expandedSectors, setExpandedSectors] = useState<Record<string, boolean>>({
    Financial: true,
    Tech: true,
    Consumer: true,
    Power: true,
    Pipe: true,
    Others: true,
  });

  const [sortField, setSortField] = useState<SortField>('investment');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Toggle accordion sector
  const toggleSector = (sector: string) => {
    setExpandedSectors(prev => ({
      ...prev,
      [sector]: !prev[sector]
    }));
  };

  const expandAllSectors = () => {
    const updated: Record<string, boolean> = {};
    sectorSummaries.forEach(s => { updated[s.sector] = true; });
    setExpandedSectors(updated);
  };

  const collapseAllSectors = () => {
    const updated: Record<string, boolean> = {};
    sectorSummaries.forEach(s => { updated[s.sector] = false; });
    setExpandedSectors(updated);
  };

  // Handle column sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filter holdings
  const filteredHoldings = useMemo(() => {
    return holdings.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.bseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sector.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSector = selectedSector === 'All' || item.sector === selectedSector;

      let matchesFilter = true;
      if (filterAction === 'gainers') matchesFilter = item.gainLoss >= 0;
      else if (filterAction === 'losers') matchesFilter = item.gainLoss < 0;
      else if (filterAction === 'exit') matchesFilter = item.abhishekSignal === 'Must exit' || item.abhishekSignal === 'Exit';

      return matchesSearch && matchesSector && matchesFilter;
    });
  }, [holdings, searchTerm, selectedSector, filterAction]);

  // Sort function
  const sortItems = (items: StockHolding[]) => {
    return [...items].sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'peRatio') {
        aVal = typeof aVal === 'number' ? aVal : 0;
        bVal = typeof bVal === 'number' ? bVal : 0;
      }

      if (typeof aVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });
  };

  // Group filtered holdings by sector
  const groupedData = useMemo(() => {
    const map = new Map<string, StockHolding[]>();
    filteredHoldings.forEach(item => {
      if (!map.has(item.sector)) map.set(item.sector, []);
      map.get(item.sector)!.push(item);
    });

    return sectorSummaries.map(secSummary => {
      const items = map.get(secSummary.sector) || [];
      const totalInv = items.reduce((sum, i) => sum + i.investment, 0);
      const totalPV = items.reduce((sum, i) => sum + i.presentValue, 0);
      const totalGL = totalPV - totalInv;
      const totalGLPct = totalInv > 0 ? (totalGL / totalInv) * 100 : 0;

      return {
        ...secSummary,
        totalInvestment: totalInv,
        totalPresentValue: totalPV,
        totalGainLoss: totalGL,
        totalGainLossPercentage: totalGLPct,
        holdings: sortItems(items),
      };
    }).filter(sec => sec.holdings.length > 0);
  }, [filteredHoldings, sectorSummaries, sortField, sortDirection]);

  return (
    <div className="glass-panel rounded-2xl border border-slate-800/80 bg-slate-900/60 overflow-hidden shadow-2xl">
      
      {/* Table Toolbar */}
      <div className="p-4 sm:p-6 border-b border-slate-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left: Search input */}
        <div className="flex flex-1 items-center gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="portfolio-search-input"
              type="text"
              placeholder="Search stock, ticker, BSE code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Sector filter */}
          <select
            id="sector-filter-select"
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Sectors</option>
            <option value="Financial">Financial Sector</option>
            <option value="Tech">Tech Sector</option>
            <option value="Consumer">Consumer Sector</option>
            <option value="Power">Power Sector</option>
            <option value="Pipe">Pipe Sector</option>
            <option value="Others">Others / Specialty</option>
          </select>
        </div>

        {/* Right: Quick filter tabs & view mode toggle */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Performance filters */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950/90 border border-slate-800 text-xs">
            <button
              onClick={() => setFilterAction('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterAction === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({holdings.length})
            </button>
            <button
              onClick={() => setFilterAction('gainers')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterAction === 'gainers' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Gains
            </button>
            <button
              onClick={() => setFilterAction('losers')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterAction === 'losers' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Losses
            </button>
            <button
              onClick={() => setFilterAction('exit')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterAction === 'exit' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Must Exit
            </button>
          </div>

          {/* Group View vs Flat Table Mode */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950/90 border border-slate-800 text-xs">
            <button
              onClick={() => setIsGroupedView(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                isGroupedView ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-white'
              }`}
              title="Group holdings by sector with sector summaries"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Sectors</span>
            </button>
            <button
              onClick={() => setIsGroupedView(false)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                !isGroupedView ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-white'
              }`}
              title="View all holdings in a single unified table"
            >
              <List className="w-3.5 h-3.5" />
              <span>Flat Table</span>
            </button>
          </div>

          {/* Expand/Collapse All when in Grouped Mode */}
          {isGroupedView && (
            <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 pl-1">
              <button 
                onClick={expandAllSectors} 
                className="hover:text-cyan-400 px-1 py-0.5 rounded cursor-pointer"
              >
                Expand all
              </button>
              <span>/</span>
              <button 
                onClick={collapseAllSectors} 
                className="hover:text-cyan-400 px-1 py-0.5 rounded cursor-pointer"
              >
                Collapse
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Main Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800/80 bg-slate-950/60 text-slate-400 font-semibold tracking-wider uppercase text-[11px]">
              <th 
                className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Particulars (Stock Name)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th 
                className="py-3 px-3 text-right cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('purchasePrice')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Purchase Price</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th 
                className="py-3 px-3 text-right cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('quantity')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Qty</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th 
                className="py-3 px-3 text-right cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('investment')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Investment (₹)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th 
                className="py-3 px-3 text-center cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('portfolioWeight')}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Port (%)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-3 text-center">NSE / BSE</th>
              <th 
                className="py-3 px-3 text-right cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('cmp')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span className="text-cyan-400 font-bold">CMP (Yahoo)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th 
                className="py-3 px-3 text-right cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('presentValue')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Present Value</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th 
                className="py-3 px-3 text-right cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('gainLoss')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Gain / Loss</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th 
                className="py-3 px-3 text-center cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('peRatio')}
              >
                <div className="flex items-center justify-center gap-1">
                  <span className="text-indigo-400">P/E (Google)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-3 text-left">Latest Earnings</th>
              <th className="py-3 px-3 text-center">Signal / Stage</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60 font-sans">
            {isGroupedView ? (
              // ================= SECTOR GROUPED VIEW =================
              groupedData.map((group) => {
                const isExpanded = expandedSectors[group.sector] !== false;
                const isGroupPositive = group.totalGainLoss >= 0;

                return (
                  <React.Fragment key={group.sector}>
                    {/* Sector Header Accordion Bar */}
                    <tr 
                      onClick={() => toggleSector(group.sector)}
                      className="bg-slate-900/90 hover:bg-slate-800/80 cursor-pointer transition-colors border-y border-slate-700/60"
                    >
                      <td colSpan={13} className="py-3 px-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-2.5">
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-cyan-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                            )}
                            <span className="font-bold text-sm text-white tracking-wide">
                              {group.sector} Sector
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                              {group.holdings.length} stocks
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                              Weight: {group.portfolioWeight}%
                            </span>
                          </div>

                          {/* Sector Level Summary Totals */}
                          <div className="flex items-center gap-4 text-xs font-mono">
                            <div>
                              <span className="text-slate-400 uppercase text-[10px]">Invested: </span>
                              <span className="font-bold text-slate-200">{formatINR(group.totalInvestment)}</span>
                            </div>
                            <span className="text-slate-600">•</span>
                            <div>
                              <span className="text-slate-400 uppercase text-[10px]">Present: </span>
                              <span className="font-bold text-white">{formatINR(group.totalPresentValue)}</span>
                            </div>
                            <span className="text-slate-600">•</span>
                            <div className="flex items-center gap-1">
                              <span className="text-slate-400 uppercase text-[10px]">P&L: </span>
                              <span className={`font-bold ${isGroupPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {formatINR(group.totalGainLoss, true)} ({formatPercent(group.totalGainLossPercentage, true)})
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>

                    {/* Stock Rows inside Sector */}
                    {isExpanded && group.holdings.map((stock) => (
                      <StockRow 
                        key={stock.id} 
                        stock={stock} 
                        onSelectStock={onSelectStock}
                        onDeleteStock={onDeleteStock}
                        flashType={priceFlashMap[stock.ticker]}
                      />
                    ))}
                  </React.Fragment>
                );
              })
            ) : (
              // ================= FLAT TABLE VIEW =================
              sortItems(filteredHoldings).map((stock) => (
                <StockRow 
                  key={stock.id} 
                  stock={stock} 
                  onSelectStock={onSelectStock}
                  onDeleteStock={onDeleteStock}
                  flashType={priceFlashMap[stock.ticker]}
                />
              ))
            )}

            {filteredHoldings.length === 0 && (
              <tr>
                <td colSpan={13} className="py-12 text-center text-slate-400 text-xs">
                  <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  No stocks match the search or filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

interface StockRowProps {
  stock: StockHolding;
  onSelectStock: (stock: StockHolding) => void;
  onDeleteStock: (id: string) => void;
  flashType?: 'up' | 'down';
}

const StockRow: React.FC<StockRowProps> = ({
  stock,
  onSelectStock,
  onDeleteStock,
  flashType,
}) => {
  const isPositive = stock.gainLoss >= 0;
  const flashClass = flashType === 'up' ? 'flash-up' : flashType === 'down' ? 'flash-down' : '';

  return (
    <tr className="hover:bg-slate-800/40 transition-colors group">
      
      {/* Particulars (Stock Name & Sector) */}
      <td className="py-3 px-4 font-medium text-white">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-6 rounded-full bg-slate-700 group-hover:bg-indigo-500 transition-colors"></div>
          <div>
            <div className="font-semibold text-slate-100 hover:text-cyan-300 transition-colors cursor-pointer" onClick={() => onSelectStock(stock)}>
              {stock.name}
            </div>
            <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
              <span>{stock.ticker}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-500">{stock.sector}</span>
            </div>
          </div>
        </div>
      </td>

      {/* Purchase Price */}
      <td className="py-3 px-3 text-right font-mono text-slate-300">
        {formatINR(stock.purchasePrice)}
      </td>

      {/* Quantity */}
      <td className="py-3 px-3 text-right font-mono text-slate-300">
        {stock.quantity.toLocaleString('en-IN')}
      </td>

      {/* Investment */}
      <td className="py-3 px-3 text-right font-mono font-semibold text-slate-200">
        {formatINR(stock.investment)}
      </td>

      {/* Portfolio % */}
      <td className="py-3 px-3 text-center font-mono">
        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
          {stock.portfolioWeight}%
        </span>
      </td>

      {/* NSE / BSE Code */}
      <td className="py-3 px-3 text-center">
        <div className="inline-flex items-center gap-1 text-[11px] font-mono">
          <span className="px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/50">
            {stock.ticker}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
            {stock.bseCode}
          </span>
        </div>
      </td>

      {/* CMP (Fetched from Yahoo Finance) */}
      <td className={`py-3 px-3 text-right font-mono font-bold text-white ${flashClass} transition-colors`}>
        <div className="flex items-center justify-end gap-1">
          <span>{formatINR(stock.cmp)}</span>
          {stock.dayChange !== undefined && stock.dayChange !== 0 && (
            <span className={`text-[10px] ${stock.dayChange > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {stock.dayChange > 0 ? '▲' : '▼'}
            </span>
          )}
        </div>
      </td>

      {/* Present Value (CMP * Qty) */}
      <td className="py-3 px-3 text-right font-mono font-bold text-slate-100">
        {formatINR(stock.presentValue)}
      </td>

      {/* Gain / Loss (Color Coded Green / Red) */}
      <td className="py-3 px-3 text-right font-mono">
        <div className={`font-bold flex items-center justify-end gap-1 ${
          isPositive ? 'text-emerald-400 glow-emerald' : 'text-rose-400 glow-rose'
        }`}>
          {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          <span>{formatINR(stock.gainLoss, true)}</span>
        </div>
        <div className={`text-[11px] font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          {formatPercent(stock.gainLossPercentage, true)}
        </div>
      </td>

      {/* P/E Ratio (Google Finance) */}
      <td className="py-3 px-3 text-center font-mono">
        {stock.peRatio ? (
          <span className="px-2 py-0.5 rounded bg-indigo-950/50 text-indigo-300 border border-indigo-800/40 font-semibold">
            {typeof stock.peRatio === 'number' ? stock.peRatio.toFixed(1) : stock.peRatio}
          </span>
        ) : (
          <span className="text-slate-600">-</span>
        )}
      </td>

      {/* Latest Earnings (Google Finance) */}
      <td className="py-3 px-3 text-left text-[11px] text-slate-300">
        <span className="truncate max-w-[120px] block" title={stock.latestEarnings}>
          {stock.latestEarnings || 'Q3 FY25'}
        </span>
      </td>

      {/* Signal / Stage Badge */}
      <td className="py-3 px-3 text-center">
        <div className="flex flex-col items-center gap-1">
          {stock.abhishekSignal && stock.abhishekSignal !== 'NA' && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
              stock.abhishekSignal === 'Must exit' || stock.abhishekSignal === 'Exit'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}>
              {stock.abhishekSignal}
            </span>
          )}
          {stock.stage2 === 'Yes' && (
            <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Stage-2
            </span>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="py-3 px-4 text-center">
        <div className="flex items-center justify-center gap-1.5">
          <button
            onClick={() => onSelectStock(stock)}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800 transition-colors cursor-pointer"
            title="View Full Fundamentals & Growth"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDeleteStock(stock.id)}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors cursor-pointer"
            title="Remove holding"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>

    </tr>
  );
};
