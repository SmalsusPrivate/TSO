import { NextResponse } from 'next/server';
import { graphFetch } from '@/lib/graph';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await request.json();
    
    const fields: any = {
      Title: body.name,
      no: body.no,
      tagline: body.tagline,
      dur: body.dur,
      description: body.description,
      level: body.level,
      category: body.category,
      topics: JSON.stringify(body.topics || []),
      careers: JSON.stringify(body.careers || []),
      highlights: JSON.stringify(body.highlights || []),
      stat_label: body.stat_label,
      stat_val: body.stat_val,
      color: body.color,
      accent: body.accent
    };

    if (body.video !== undefined) {
      fields.videoLookupId = body.video ? (parseInt(body.video, 10) || body.video) : null; 
    }
    if (body.img !== undefined) {
      fields.imgLookupId = body.img ? (parseInt(body.img, 10) || body.img) : null;
    }

    const payload = fields;

    const response = await graphFetch(`/lists/courses/items/${id}/fields`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
       const text = await response.text();
       console.error("Failed to update course:", text);
       return NextResponse.json({ error: 'Failed to update course', details: text }, { status: 500 });
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const response = await graphFetch(`/lists/courses/items/${params.id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      console.error("Failed to delete course:", await response.text());
      return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
