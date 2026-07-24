import { NextResponse } from 'next/server';
import { graphFetch } from '@/lib/graph';

export async function GET() {
  try {
    // This will fetch all lists in the site
    const response = await graphFetch('/lists');
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Test route error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
