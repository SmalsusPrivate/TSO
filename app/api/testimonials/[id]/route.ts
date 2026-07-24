import { NextResponse } from 'next/server';
import { graphFetch } from '@/lib/graph';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await request.json();
    
    const fields: any = {
      Title: body.name,
      role: body.role,
      text: body.text,
      rating: body.rating
    };

    const payload = fields;

    const response = await graphFetch(`/lists/testimonials/items/${id}/fields`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
       return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const endpoint = `/lists/testimonials/items/${params.id}?expand=fields(select=Title,role,text,rating)`;
    const response = await graphFetch(endpoint);

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch testimonial' }, { status: 500 });
    }

    const data = await response.json();
    const f = data.fields;
    
    const testimonial = {
      id: data.id,
      name: f.Title,
      role: f.role,
      text: f.text,
      rating: f.rating,
      video: '',
      color: '#007AFF',
      img: ''
    };

    return NextResponse.json({ status: 'success', data: testimonial });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const response = await graphFetch(`/lists/testimonials/items/${params.id}`, {
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
