import { NextResponse } from 'next/server';
import { graphFetch } from '@/lib/graph';

export async function GET() {
  try {
    const endpoint = `/lists/blogs/items?expand=fields(select=Title,status,excerpt,content,author0,tags,category,readTime,featured,color,publishDate,coverImageLookupId)`;
    const response = await graphFetch(endpoint);

    if (!response.ok) {
      console.error("Failed to fetch blogs:", await response.text());
      return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
    }

    const data = await response.json();
    
    const blogs = data.value.map((item: any) => {
      const f = item.fields;
      return {
        id: item.id,
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
    });

    return NextResponse.json({ status: 'success', data: blogs });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
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

    if (body.coverImage) {
      fields.coverImageLookupId = parseInt(body.coverImage, 10) || body.coverImage;
    }

    const payload = { fields };

    const response = await graphFetch('/lists/blogs/items', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
       return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({ message: "Blog created successfully", id: data.id }, { status: 201 });
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
      ids.map(id => graphFetch(`/lists/blogs/items/${id}`, { method: 'DELETE' }))
    );

    return NextResponse.json({ status: 'success', message: `Deleted ${ids.length} blogs` });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
