import { NextResponse } from 'next/server';
import { graphFetch } from '@/lib/graph';

export async function GET() {
  try {
    const endpoint = `/lists/testimonials/items?expand=fields(select=Title,role,text,rating)`;
    const response = await graphFetch(endpoint);

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
    }

    const data = await response.json();
    
    const testimonials = data.value.map((item: any) => {
      const f = item.fields;
      return {
        id: item.id,
        name: f.Title,
        role: f.role,
        text: f.text,
        rating: f.rating,
        video: '',
        color: '#007AFF',
        img: ''
      };
    });

    return NextResponse.json({ status: 'success', data: testimonials });
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
      text: body.text,
      rating: body.rating
    };

    const payload = { fields };

    const response = await graphFetch('/lists/testimonials/items', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
       return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({ message: "Testimonial created successfully", id: data.id }, { status: 201 });
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
      ids.map(id => graphFetch(`/lists/testimonials/items/${id}`, { method: 'DELETE' }))
    );

    return NextResponse.json({ status: 'success', message: `Deleted ${ids.length} testimonials` });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
