import { NextResponse } from 'next/server';
import { graphFetch } from '@/lib/graph';

export async function GET() {
  try {
    const endpoint = '/lists/SiteContent/items?expand=fields(select=Title,Value)&$top=500';
    const response = await graphFetch(endpoint);

    if (!response.ok) {
      console.error('Failed to fetch SiteContent:', await response.text());
      return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
    }

    const data = await response.json();
    
    const items = data.value.map((item: any) => ({
      id: item.id,
      title: item.fields.Title,
      value: item.fields.Value || ''
    }));

    return NextResponse.json({ status: 'success', data: items });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, value } = body;

    if (!id || value === undefined) {
      return NextResponse.json({ error: 'Missing id or value' }, { status: 400 });
    }

    const endpoint = `/lists/SiteContent/items/${id}`;
    const payload = {
      fields: {
        Value: value
      }
    };

    const response = await graphFetch(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error('Failed to update SiteContent:', await response.text());
      return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
    }

    return NextResponse.json({ status: 'success', message: 'Content updated successfully' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, value } = body;

    if (!title || value === undefined) {
      return NextResponse.json({ error: 'Missing title or value' }, { status: 400 });
    }

    const payload = {
      fields: {
        Title: title,
        Value: value
      }
    };

    const response = await graphFetch('/lists/SiteContent/items', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error('Failed to create SiteContent:', await response.text());
      return NextResponse.json({ error: 'Failed to create content' }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({ status: 'success', message: 'Content created successfully', id: data.id }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
