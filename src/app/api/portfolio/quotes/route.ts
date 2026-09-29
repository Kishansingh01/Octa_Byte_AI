import { NextResponse } from 'next/server';
import { updatePortfolioHoldings, calculatePortfolioSummary } from '@/lib/finance-service';
import { INITIAL_HOLDINGS } from '@/data/initialHoldings';
import { StockHolding } from '@/types/portfolio';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get('ticker');

    let holdingsToUpdate = INITIAL_HOLDINGS;

    if (ticker) {
      const filtered = INITIAL_HOLDINGS.filter(
        h => h.ticker.toLowerCase() === ticker.toLowerCase()
      );
      if (filtered.length > 0) {
        holdingsToUpdate = filtered;
      }
    }

    const updatedHoldings = await updatePortfolioHoldings(holdingsToUpdate);
    const summary = calculatePortfolioSummary(updatedHoldings);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary,
      holdings: updatedHoldings,
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    });
  } catch (error: any) {
    console.error('Error updating quotes:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to update quotes',
        holdings: INITIAL_HOLDINGS,
        summary: calculatePortfolioSummary(INITIAL_HOLDINGS),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const clientHoldings: StockHolding[] = body.holdings || INITIAL_HOLDINGS;

    const updatedHoldings = await updatePortfolioHoldings(clientHoldings);
    const summary = calculatePortfolioSummary(updatedHoldings);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary,
      holdings: updatedHoldings,
    });
  } catch (error: any) {
    console.error('Error processing POST quotes:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to process quotes update',
      },
      { status: 500 }
    );
  }
}
