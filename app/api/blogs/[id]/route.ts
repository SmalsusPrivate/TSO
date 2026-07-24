import { NextResponse } from 'next/server';
import { graphFetch } from '@/lib/graph';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await request.json();
    
    const fields: any = {
      Title: body.title,
      status: body.status,
      excerpt: body.excerpt,
      content: body.content,
      author0: body.author, // Map author back to author0
      tags: JSON.stringify(body.tags || []),
      category: body.category,
      readTime: body.readTime,
      featured: body.featured ? 'Yes' : 'No', // Choice column requires string
      color: body.color,
      publishDate: body.publishDate || new Date().toISOString() // Fallback if undefined
    };

    if (body.coverImage !== undefined) {
      fields.coverImageLookupId = body.coverImage ? (parseInt(body.coverImage, 10) || body.coverImage) : null;
    }

    const payload = fields;

    const response = await graphFetch(`/lists/blogs/items/${id}/fields`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
       console.error("Failed to update blog:", await response.text());
       return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const endpoint = `/lists/blogs/items/${params.id}?expand=fields(select=Title,status,excerpt,content,author0,tags,category,readTime,featured,color,publishDate,coverImageLookupId)`;
    const response = await graphFetch(endpoint);

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 });
    }

    const data = await response.json();
    const f = data.fields;
    
    const blog = {
      id: data.id,
      title: f.Title,
      status: f.status,
      excerpt: f.excerpt,
      content: f.content,
      author: f.author0, // Map author0 to author
      tags: f.tags ? JSON.parse(f.tags) : [],
      category: f.category,
      readTime: f.readTime,
      featured: f.featured === 'Yes', // Convert Yes/No string to boolean
      color: f.color,
      publishDate: f.publishDate,
      coverImage: f.coverImageLookupId
    };

    return NextResponse.json({ status: 'success', data: blog });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const response = await graphFetch(`/lists/blogs/items/${params.id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      console.error("Failed to delete blog:", await response.text());
      return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
