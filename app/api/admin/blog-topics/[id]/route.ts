import { NextResponse } from 'next/server';
import { graphFetch } from '@/lib/graph';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await request.json();
    
    if (!body.title) {
      return NextResponse.json({ status: 'error', message: 'Keyword title is required' }, { status: 400 });
    }

    const payload = {
      fields: {
        Title: body.title,
        Status: body.status || 'Pending'
      }
    };

    const res = await graphFetch(`/lists/blog_topics/items/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Failed to update topic: ${await res.text()}`);
    }

    return NextResponse.json({ status: 'success', message: 'Topic updated successfully' });
  } catch (error) {
    console.error('Error updating blog topic:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to update blog topic' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    const res = await graphFetch(`/lists/blog_topics/items/${id}`, {
      method: 'DELETE'
    });

    if (!res.ok) {
      throw new Error(`Failed to delete topic: ${await res.text()}`);
    }

    return NextResponse.json({ status: 'success', message: 'Topic deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog topic:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to delete blog topic' }, { status: 500 });
  }
}
