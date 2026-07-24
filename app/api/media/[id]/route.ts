import { NextResponse } from 'next/server';
import { getSiteId, getAccessToken } from '@/lib/graph';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    // If id is not a number, it might be an external URL (fallback)
    if (isNaN(Number(id))) {
      return NextResponse.redirect(id);
    }

    const token = await getAccessToken();
    const siteId = await getSiteId(token);
    
    const driveItemUrl = `https://graph.microsoft.com/v1.0/sites/${siteId}/drive/list/items/${id}/driveItem`;
    const res = await fetch(driveItemUrl, { 
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });
    
    if (!res.ok) {
      console.error(`Media resolver error for ID ${id}:`, await res.text());
      return NextResponse.redirect('/placeholder-image.png');
    }
    
    const driveItem = await res.json();
    const downloadUrl = driveItem['@microsoft.graph.downloadUrl'];
    
    if (downloadUrl) {
      return NextResponse.redirect(downloadUrl);
    }
    
    return NextResponse.redirect('/placeholder-image.png');
  } catch (error) {
    console.error('Media resolver exception:', error);
    return NextResponse.redirect('/placeholder-image.png');
  }
}
