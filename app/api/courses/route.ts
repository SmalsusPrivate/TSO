import { NextResponse } from 'next/server';
import { graphFetch } from '@/lib/graph';

export async function GET() {
  try {
    // Fetch courses and expand the img lookup column to get the actual file URL
    const endpoint = `/lists/courses/items?expand=fields(select=Title,no,tagline,dur,description,level,category,topics,careers,highlights,stat_label,stat_val,color,accent,videoLookupId,imgLookupId)`;
    const response = await graphFetch(endpoint);

    if (!response.ok) {
      console.error("Failed to fetch courses:", await response.text());
      return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
    }

    const data = await response.json();
    
    // Map SharePoint structure to our expected frontend array format
    const courses = data.value.map((item: any) => {
      const f = item.fields;
      return {
        id: item.id,
        name: f.Title,
        no: f.no,
        tagline: f.tagline,
        dur: f.dur,
        description: f.description,
        level: f.level,
        category: f.category,
        topics: f.topics ? JSON.parse(f.topics) : [],
        careers: f.careers ? JSON.parse(f.careers) : [],
        highlights: f.highlights ? JSON.parse(f.highlights) : [],
        stat_label: f.stat_label,
        stat_val: f.stat_val,
        color: f.color,
        accent: f.accent,
        video: f.videoLookupId,
        // Since it's a lookup, Graph API requires a separate request to get the file download URL if we only have the ID.
        // However, if we expand correctly we might get the URL. For now we just return the ID.
        img: f.imgLookupId
      };
    });

    return NextResponse.json({ status: 'success', data: courses });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
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

    if (body.video) {
      fields.videoLookupId = parseInt(body.video, 10) || body.video; 
    }
    if (body.img) {
      fields.imgLookupId = parseInt(body.img, 10) || body.img;
    }

    const payload = { fields };

    const response = await graphFetch('/lists/courses/items', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
       console.error("Failed to create course:", await response.text());
       return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({ message: "Course created successfully", id: data.id }, { status: 201 });

  } catch (error) {
    console.error('API Error:', error);
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
      ids.map(id => graphFetch(`/lists/courses/items/${id}`, { method: 'DELETE' }))
    );

    return NextResponse.json({ status: 'success', message: `Deleted ${ids.length} courses` });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
