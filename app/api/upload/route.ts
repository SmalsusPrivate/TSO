import { NextResponse } from 'next/server';
import { getSiteId, getAccessToken } from '@/lib/graph';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const token = await getAccessToken();
    const siteId = await getSiteId(token);

    // Read the file into a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // To prevent duplicate names, prepend a timestamp
    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;

    // Upload to the default Document Library (Shared Documents)
    const uploadUrl = `https://graph.microsoft.com/v1.0/sites/${siteId}/drive/root:/${safeName}:/content`;

    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': file.type,
      },
      body: buffer
    });

    if (!uploadRes.ok) {
      console.error("Upload failed:", await uploadRes.text());
      return NextResponse.json({ error: 'Failed to upload file to SharePoint' }, { status: 500 });
    }

    const driveItem = await uploadRes.json();

    // To use this file as a lookup column in a SharePoint List, we need its ListItem ID.
    const listItemUrl = `https://graph.microsoft.com/v1.0/sites/${siteId}/drive/items/${driveItem.id}/listItem?$select=id`;
    
    const listItemRes = await fetch(listItemUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!listItemRes.ok) {
       console.error("Failed to get ListItem ID:", await listItemRes.text());
       return NextResponse.json({ error: 'Failed to link file' }, { status: 500 });
    }

    const listItem = await listItemRes.json();

    return NextResponse.json({ 
      message: 'Upload successful', 
      url: driveItem.webUrl, 
      lookupId: listItem.id 
    });

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: String(error?.stack || error?.message || error) }, { status: 500 });
  }
}
