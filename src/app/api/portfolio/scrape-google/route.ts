import { NextResponse } from 'next/server';
import { scrapeGoogleFinance } from '@/lib/finance-service';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get('ticker') || 'HDFCBANK';
    const exchange = (searchParams.get('exchange') as 'NSE' | 'BSE') || 'NSE';

    const scrapedData = await scrapeGoogleFinance(ticker, exchange);

    return NextResponse.json({
      success: true,
      ticker,
      exchange,
      data: scrapedData,
      sourceUrl: `https://www.google.com/finance/quote/${ticker}:${exchange === 'BSE' ? 'BOM' : 'NSE'}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Scrape failed' },
      { status: 500 }
    );
  }
}
