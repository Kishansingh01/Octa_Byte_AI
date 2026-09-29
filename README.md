# Octa Byte AI - Dynamic Portfolio Dashboard

**Company**: Octa Byte AI Pvt Ltd  
**CIN**: `U62099KA2025PTC201620`  
**Address**: WeWork Prestige Cube, Site no :26, Laskar Hosur Rd, Adugodi, Bangalore South, Bangalore - 560030, Karnataka  

---

## 📌 Executive Summary

A full-stack financial portfolio dashboard built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **Node.js**. The application displays real-time equity holdings, dynamic pricing from **Yahoo Finance**, and valuation multiples (P/E Ratio, Latest Earnings) from **Google Finance**.

It fully satisfies the case study requirements by implementing:
- Real-time stock prices (CMP) with 15-second automatic updates and price tick animations.
- Sector-level grouping with summaries (Investment, Present Value, Net Gain/Loss, Portfolio Weight).
- Color-coded Gain/Loss metrics (Green for gains, Red for losses).
- Visual charts (Recharts) for Sector Allocation and Sector P&L %.
- Interactive drill-down modal for 3-Year Growth & Fundamental metrics (Revenue TTM, EBITDA Margin, PAT Margin, Cash Flows, Stage-2 & Exit recommendations).
- Resilient API architecture addressing unofficial scraping, rate-limiting, batching, caching, and graceful fallbacks.

---

## 🚀 Key Features

1. **Portfolio Holdings Table**:
   - Tabular view with: Particulars, Purchase Price, Quantity, Investment, Portfolio Weight %, NSE/BSE Code, CMP, Present Value, Gain/Loss (₹ and %), P/E Ratio, Latest Earnings, and Strategy Signals.
   - Dual view modes: **Sector Grouped Mode** (expandable accordion per sector with aggregate metrics) and **Flat Table Mode**.
   - Sortable columns, live search filter, and quick filters (Gains, Losses, Must Exit).

2. **Dynamic Live Updates**:
   - Automated refresh cycle (5s, 15s default, 30s, 60s, or pause).
   - Real-time countdown timer and manual "Sync Now" button.
   - Visual price-tick flashes (green flash for upward ticks, red flash for downward ticks).

3. **Sector Analytics (Recharts)**:
   - Sector Allocation Donut Chart with interactive tooltip data.
   - Sector P&L Performance Bar Chart.
   - Top Movers ranking cards (Top 3 Gainers & Top 3 Underperformers).

4. **Deep Fundamentals & Strategic Insights**:
   - Stock detail modal featuring 3-year historical growth (Revenue, EBITDA, Profit) and core fundamentals (TTM Revenue, EBITDA Margin, PAT Margin, 5-Yr CFO, Free Cash Flow, Debt-to-Equity, Book Value).
   - Strategic tagging: "Stage-2" momentum flags and "Must Exit" advisory badges.

5. **Dynamic Portfolio Management**:
   - "Add Holding" modal to inject new stocks into any sector with automatic live pricing.
   - "Export" functionality supporting CSV and JSON downloads.
   - "API Inspector" diagnostic modal to test and inspect Google Finance and Yahoo Finance scraper outputs in real-time.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js 16.3 (App Router)](https://nextjs.org/)
- **Runtime**: Node.js v22+
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4, Glassmorphism, Custom CSS Keyframes
- **Visualizations**: [Recharts](https://recharts.org/)
- **Data Scraping & Extraction**: Cheerio, Yahoo Finance v8 API (`yahoo-finance2`)
- **Icons**: Lucide React

---

## 💻 Getting Started

### Prerequisites
- Node.js `v18+` or `v20+` or `v22+`
- npm `v9+` or `v10+`

### Installation

```bash
# Clone or navigate to the project directory
cd c:\Bank\stock_Market

# Install dependencies (already completed in workspace)
npm install
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run start
```

---

## 📡 API Endpoints

- `GET /api/portfolio/quotes`: Returns current quotes and recalculates portfolio summary.
- `POST /api/portfolio/quotes`: Accepts custom client holdings list and returns real-time quotes, CMP, P/E, and sector summaries.
- `GET /api/portfolio/scrape-google?ticker=HDFCBANK&exchange=NSE`: Direct diagnostic endpoint testing server-side Cheerio scraping against Google Finance.

---

## 📄 Deliverables Summary

- **Source Code**: Full Next.js 16 application in `/src`.
- **README.md**: Complete project guide and setup instructions.
- **TECHNICAL_DOCUMENT.md**: Technical design document covering scraping strategies, rate limiting, asynchronous operations, and performance optimization.
