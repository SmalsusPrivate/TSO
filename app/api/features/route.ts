import { NextResponse } from 'next/server';
import { graphFetch } from '@/lib/graph';

export async function GET() {
  try {
    const endpoint = '/lists/features/items?expand=fields(select=Title,tso,others,order0)';
    const response = await graphFetch(endpoint);

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch features' }, { status: 500 });
    }

    const data = await response.json();
    
    // Sort by order ascending
    const features = data.value.map((item: any) => {
      const f = item.fields;
      return {
        id: item.id,
        label: f.Title,
        tso: f.tso,
        others: f.others,
        order: f.order0 || 0
      };
    }).sort((a: any, b: any) => a.order - b.order);

    return NextResponse.json({ status: 'success', data: features });
  } catch (error) {
    console.error('Error fetching features:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const fields: any = {
      Title: body.label,
      tso: body.tso,
      others: body.others,
      order0: body.order || 0
    };

    const payload = { fields };

    const response = await graphFetch('/lists/features/items', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
       return NextResponse.json({ error: 'Failed to create feature' }, { status: 500 });
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
