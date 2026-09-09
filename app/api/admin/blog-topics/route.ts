import { NextResponse } from 'next/server';
import { graphFetch } from '@/lib/graph';

export async function GET() {
  try {
    const res = await graphFetch('/lists/blog_topics/items?expand=fields(select=Title,Status)&$orderby=createdDateTime desc');
    if (!res.ok) {
      throw new Error(`SharePoint API error: ${res.statusText}`);
    }
    const data = await res.json();
    const topics = data.value.map((item: any) => ({
      id: item.id,
      title: item.fields.Title,
      status: item.fields.Status || 'Pending',
      createdAt: item.createdDateTime
    }));
    return NextResponse.json({ status: 'success', data: topics });
  } catch (error) {
    console.error('Error fetching blog topics:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to fetch blog topics' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
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

    const res = await graphFetch('/lists/blog_topics/items', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Failed to create topic: ${await res.text()}`);
    }

    return NextResponse.json({ status: 'success', message: 'Topic created successfully' });
  } catch (error) {
    console.error('Error creating blog topic:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to create blog topic' }, { status: 500 });
  }
}
