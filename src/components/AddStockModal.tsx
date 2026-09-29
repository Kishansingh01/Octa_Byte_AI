'use client';

import React, { useState } from 'react';
import { StockHolding } from '@/types/portfolio';
import { X, PlusCircle, Sparkles } from 'lucide-react';
import { formatINR } from '@/lib/formatters';

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStock: (stock: StockHolding) => void;
}

export const AddStockModal: React.FC<AddStockModalProps> = ({
  isOpen,
  onClose,
  onAddStock,
}) => {
  const [name, setName] = useState('');
  const [ticker, setTicker] = useState('');
  const [bseCode, setBseCode] = useState('');
  const [sector, setSector] = useState<'Financial' | 'Tech' | 'Consumer' | 'Power' | 'Pipe' | 'Others'>('Tech');
  const [purchasePrice, setPurchasePrice] = useState<number>(1000);
  const [quantity, setQuantity] = useState<number>(10);
  const [abhishekSignal, setAbhishekSignal] = useState<'Hold' | 'Must exit' | 'Exit' | 'NA'>('Hold');

  if (!isOpen) return null;

  const totalInvestment = purchasePrice * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !ticker) return;

    const newStock: StockHolding = {
      id: `stock-${Date.now()}`,
      name: name.trim(),
      ticker: ticker.trim().toUpperCase(),
      nseSymbol: `${ticker.trim().toUpperCase()}.NS`,
      bseCode: bseCode.trim() || '500000',
      exchange: 'NSE',
      sector,
      purchasePrice: Number(purchasePrice),
      quantity: Number(quantity),
      investment: totalInvestment,
      portfolioWeight: 2.0,
      cmp: Number(purchasePrice),
      presentValue: totalInvestment,
      gainLoss: 0,
      gainLossPercentage: 0,
      peRatio: 25.0,
      latestEarnings: 'Q3 FY25',
      abhishekSignal,
      dataSource: 'Yahoo Finance (Live)',
    };

    onAddStock(newStock);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel-elevated rounded-3xl border border-slate-700 p-6 md:p-8 bg-slate-950 text-white shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Add Holding</h2>
            <p className="text-xs text-slate-400">Add an NSE/BSE stock to your portfolio</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Company / Stock Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Reliance Industries, TCS, Zomato"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">NSE Ticker</label>
              <input
                type="text"
                required
                placeholder="e.g. RELIANCE, TCS"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 font-mono uppercase focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">BSE Code (Optional)</label>
              <input
                type="text"
                placeholder="e.g. 500325"
                value={bseCode}
                onChange={(e) => setBseCode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Sector</label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Financial">Financial Sector</option>
                <option value="Tech">Tech Sector</option>
                <option value="Consumer">Consumer Sector</option>
                <option value="Power">Power Sector</option>
                <option value="Pipe">Pipe Sector</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Advisory Signal</label>
              <select
                value={abhishekSignal}
                onChange={(e) => setAbhishekSignal(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Hold">Hold / Buy</option>
                <option value="Must exit">Must Exit</option>
                <option value="Exit">Exit</option>
                <option value="NA">Not Assessed (NA)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Purchase Price (₹)</label>
              <input
                type="number"
                min="0.1"
                step="any"
                required
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Quantity (Shares)</label>
              <input
                type="number"
                min="1"
                step="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Investment Preview */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Total Capital Outlay:</span>
            <span className="font-bold font-mono text-cyan-400 text-sm">{formatINR(totalInvestment)}</span>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer border border-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-700/20 cursor-pointer transition-all"
            >
              Add to Portfolio
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
