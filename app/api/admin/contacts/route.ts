import { NextResponse } from 'next/server';
import { graphFetch } from '@/lib/graph';

export async function GET() {
  try {
    const endpoint = `/lists/contacts/items?expand=fields(select=Title,email,phone,message,course,Created)`;
    const response = await graphFetch(endpoint);

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
    }

    const data = await response.json();
    
    const contacts = data.value.map((item: any) => {
      const f = item.fields;
      return {
        id: item.id,
        name: f.Title,
        email: f.email,
        phone: f.phone,
        course: f.course,
        message: f.message,
        status: 'new', // Hardcoded as new since column doesn't exist
        created_at: f.Created
      };
    });

    return NextResponse.json({ status: 'success', data: contacts });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const payload = {
      fields: {
        Title: body.name,
        email: body.email,
        phone: body.phone,
        message: body.message,
        course: body.course
      }
    };

    const response = await graphFetch('/lists/contacts/items', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
       return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({ message: "Contact submitted successfully", id: data.id }, { status: 201 });
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

    // Delete items concurrently
    await Promise.all(
      ids.map(id => 
        graphFetch(`/lists/contacts/items/${id}`, { method: 'DELETE' })
      )
    );

    return NextResponse.json({ status: 'success', message: `Deleted ${ids.length} contacts` });
  } catch (error) {
    console.error('Failed to bulk delete contacts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
