import { NextResponse } from 'next/server';
import { graphFetch } from '@/lib/graph';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await request.json();
    
    const fields: any = {
      Title: body.name,
      role: body.role,
      exp: body.exp,
      past: body.past,
      cert: body.cert,
      bio: body.bio,
      color: body.color
    };

    if (body.isActive !== undefined) fields.isActive = body.isActive;
    if (body.isFeatured !== undefined) fields.isFeatured = body.isFeatured;

    if (body.img !== undefined) {
      fields.imgLookupId = body.img ? (parseInt(body.img, 10) || body.img) : null;
    }

    const payload = fields;

    const response = await graphFetch(`/lists/trainers/items/${id}/fields`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
       return NextResponse.json({ error: 'Failed to update trainer' }, { status: 500 });
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const endpoint = `/lists/trainers/items/${params.id}?expand=fields(select=Title,role,exp,past,cert,bio,color,imgLookupId,isActive,isFeatured)`;
    const response = await graphFetch(endpoint);

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch trainer' }, { status: 500 });
    }

    const data = await response.json();
    const f = data.fields;
    
    const trainer = {
      id: data.id,
      name: f.Title,
      role: f.role,
      exp: f.exp,
      past: f.past,
      cert: f.cert,
      bio: f.bio,
      color: f.color,
      img: f.imgLookupId,
      isActive: f.isActive ?? true,
      isFeatured: f.isFeatured ?? false
    };

    return NextResponse.json({ status: 'success', data: trainer });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const response = await graphFetch(`/lists/trainers/items/${params.id}`, {
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
