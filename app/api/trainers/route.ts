import { NextResponse } from 'next/server';
import { graphFetch } from '@/lib/graph';

export async function GET() {
  try {
    const endpoint = `/lists/trainers/items?expand=fields(select=Title,role,exp,past,cert,bio,color,imgLookupId,isActive,isFeatured)`;
    const response = await graphFetch(endpoint);

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch trainers' }, { status: 500 });
    }

    const data = await response.json();
    
    const trainers = data.value.map((item: any) => {
      const f = item.fields;
      return {
        id: item.id,
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
    });

    return NextResponse.json({ status: 'success', data: trainers });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const fields: any = {
      Title: body.name,
      role: body.role,
      exp: body.exp,
      past: body.past,
      cert: body.cert,
      bio: body.bio,
      color: body.color,
      isActive: true,
      isFeatured: false
    };

    if (body.img) {
      fields.imgLookupId = parseInt(body.img, 10) || body.img;
    }

    const payload = { fields };

    const response = await graphFetch('/lists/trainers/items', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
       return NextResponse.json({ error: 'Failed to create trainer' }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({ message: "Trainer created successfully", id: data.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { ids } = body;
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
    }

    await Promise.all(
      ids.map(id => graphFetch(`/lists/trainers/items/${id}`, { method: 'DELETE' }))
    );

    return NextResponse.json({ status: 'success', message: `Deleted ${ids.length} trainers` });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
