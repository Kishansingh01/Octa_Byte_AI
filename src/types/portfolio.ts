export interface StockHolding {
  id: string;
  name: string;
  ticker: string; // e.g. HDFCBANK
  exchange: 'NSE' | 'BSE' | 'BOTH';
  nseSymbol?: string; // e.g. HDFCBANK.NS
  bseCode: string; // e.g. 500180
  sector: 'Financial' | 'Tech' | 'Consumer' | 'Power' | 'Pipe' | 'Others';
  purchasePrice: number;
  quantity: number;
  investment: number;
  portfolioWeight: number; // percentage in total portfolio
  cmp: number; // Current Market Price
  previousCmp?: number;
  dayChange?: number;
  dayChangePercentage?: number;
  presentValue: number;
  gainLoss: number;
  gainLossPercentage: number;
  peRatio: number | string;
  latestEarnings: string;
  marketCap?: string;
  
  // Extra fundamental metrics from the case study Excel
  revTTM?: number; // In Cr
  ebitdaTTM?: number;
  ebitdaMargin?: number; // e.g. 0.33 -> 33%
  pat?: number;
  patMargin?: number;
  cfoMar24?: number;
  cfo5yr?: number;
  fcf5yr?: number;
  debtToEquity?: number;
  bookValue?: number;
  revGrowth3y?: number;
  ebitdaGrowth3y?: number;
  profitGrowth3y?: number;
  priceToSales?: number | string;
  cfoToEbitda?: string;
  cfoToPat?: string;
  priceToBook?: number | string;
  stage2?: 'Yes' | 'No' | 'NA';
  abhishekSignal?: 'Exit' | 'Must exit' | 'NA' | 'Hold' | 'Accumulate';
  targetSalePrice?: number;
  soldPrice?: number;
  
  // Status and metadata
  dataSource?: 'Yahoo Finance (Live)' | 'Google Finance' | 'Cached' | 'Fallback/Simulated';
  lastUpdated?: string;
}

export interface SectorSummary {
  sector: string;
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
  portfolioWeight: number;
  stocksCount: number;
  gainersCount: number;
  losersCount: number;
  holdings: StockHolding[];
}

export interface PortfolioSummary {
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
  dayChange: number;
  dayChangePercentage: number;
  topGainer: StockHolding | null;
  topLoser: StockHolding | null;
  sectorSummaries: SectorSummary[];
  totalHoldingsCount: number;
  lastUpdated: string;
  status: 'live' | 'refreshing' | 'cached' | 'error';
}

export interface LiveQuoteResponse {
  ticker: string;
  cmp: number;
  previousClose?: number;
  dayChange?: number;
  dayChangePercentage?: number;
  peRatio?: number | string;
  latestEarnings?: string;
  marketCap?: string;
  high52?: number;
  low52?: number;
  source: 'yahoo' | 'google' | 'cached' | 'fallback';
  timestamp: string;
}

export interface RefreshSettings {
  intervalSeconds: number; // 0 for paused, 5, 15, 30, 60
  isAutoRefreshEnabled: boolean;
  soundAlerts: boolean;
}
