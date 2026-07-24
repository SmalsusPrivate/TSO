import { NextResponse } from 'next/server';
import { graphFetch } from '@/lib/graph';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await request.json();
    
    const fields: any = {
      Title: body.label,
      tso: body.tso,
      others: body.others,
      order0: body.order || 0
    };

    const payload = { fields };

    const response = await graphFetch(`/lists/features/items/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
       return NextResponse.json({ error: 'Failed to update feature' }, { status: 500 });
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const response = await graphFetch(`/lists/features/items/${params.id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
