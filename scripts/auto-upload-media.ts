import * as dotenv from 'dotenv';
import { resolve } from 'path';
import fetch from 'cross-fetch';

(global as any).fetch = fetch;
(global as any).FormData = class FormData {};

dotenv.config({ path: resolve(__dirname, '../.env.local') });

import { graphFetch, getAccessToken, getSiteId } from '../lib/graph';

// Media maps containing the external URLs
const courseMedia: Record<string, any> = {
  'Python Programming': { imgLookupId: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1400', videoLookupId: 'https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4' },
  'AI & Machine Learning': { imgLookupId: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=1400', videoLookupId: 'https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_25fps.mp4' },
  'MERN Stack': { imgLookupId: 'https://images.pexels.com/photos/270360/pexels-photo-270360.jpeg?auto=compress&cs=tinysrgb&w=1400', videoLookupId: 'https://videos.pexels.com/video-files/3130284/3130284-uhd_2560_1440_25fps.mp4' },
  'ReactJS': { imgLookupId: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1400', videoLookupId: 'https://videos.pexels.com/video-files/3249283/3249283-uhd_2560_1440_25fps.mp4' },
  'SharePoint & Power Apps': { imgLookupId: 'https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg?auto=compress&cs=tinysrgb&w=1400', videoLookupId: 'https://videos.pexels.com/video-files/3205567/3205567-uhd_2560_1440_25fps.mp4' },
  'Spoken English': { imgLookupId: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1400', videoLookupId: 'https://videos.pexels.com/video-files/3253701/3253701-uhd_2560_1440_25fps.mp4' },
  'Interview Preparation': { imgLookupId: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=1400', videoLookupId: 'https://videos.pexels.com/video-files/3044954/3044954-uhd_2560_1440_25fps.mp4' },
  'Computer Fundamentals': { imgLookupId: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1400', videoLookupId: 'https://videos.pexels.com/video-files/3209828/3209828-uhd_2560_1440_25fps.mp4' }
};

const trainerMedia: Record<string, any> = {
  'Vicky Singh': { imgLookupId: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400' },
  'Rahul Verma': { imgLookupId: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400' },
  'Priya Deshmukh': { imgLookupId: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=400' },
  'Arjun Nair': { imgLookupId: 'https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=400' }
};

const blogMedia: Record<string, any> = {
  'How to Land Your First Python Developer Job in 2025': { coverImageLookupId: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800' },
  'AI & Machine Learning: What Skills Do You Actually Need?': { coverImageLookupId: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=800' },
  'MERN vs Full Stack Python: Which Should You Learn in 2025?': { coverImageLookupId: 'https://images.pexels.com/photos/270360/pexels-photo-270360.jpeg?auto=compress&cs=tinysrgb&w=800' },
  'Top 20 SharePoint Interview Questions for 2025': { coverImageLookupId: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800' },
  "From Non-Tech Background to Developer: Ridhi's Journey at TSO": { coverImageLookupId: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=800' },
  'Why Power Apps is the Most In-Demand Skill Right Now': { coverImageLookupId: 'https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg?auto=compress&cs=tinysrgb&w=800' },
  '7 Spoken English Mistakes That Will Cost You the Interview': { coverImageLookupId: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800' },
  'How to Build a Tech Resume That Gets You Interviews': { coverImageLookupId: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=800' }
};

// Map of external URLs to SharePoint ListItem IDs to avoid re-uploading the same image
const uploadedCache: Record<string, number> = {};

async function uploadToSharePoint(url: string, token: string, siteId: string): Promise<number | null> {
  if (uploadedCache[url]) return uploadedCache[url];
  
  console.log(`    -> Downloading from ${url.substring(0, 50)}...`);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to download: ${res.status}`);
    const buffer = await res.arrayBuffer();
    
    // Determine content type and safe name
    const contentType = res.headers.get('content-type') || 'application/octet-stream';
    const ext = contentType.includes('video') ? 'mp4' : 'jpg';
    const safeName = `seed-${Date.now()}.${ext}`;
    
    console.log(`    -> Uploading to SharePoint as ${safeName}...`);
    const uploadUrl = `https://graph.microsoft.com/v1.0/sites/${siteId}/drive/root:/${safeName}:/content`;
    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': contentType,
      },
      body: Buffer.from(buffer)
    });
    
    if (!uploadRes.ok) throw new Error(`Upload failed: ${await uploadRes.text()}`);
    const driveItem = await uploadRes.json();
    
    // Get ListItem ID for lookup
    const listItemUrl = `https://graph.microsoft.com/v1.0/sites/${siteId}/drive/items/${driveItem.id}/listItem?$select=id`;
    const listItemRes = await fetch(listItemUrl, { headers: { 'Authorization': `Bearer ${token}` } });
    
    if (!listItemRes.ok) throw new Error(`Failed to get ListItem ID: ${await listItemRes.text()}`);
    const listItem = await listItemRes.json();
    
    uploadedCache[url] = listItem.id;
    return listItem.id;
  } catch (error) {
    console.error(`    -> Error processing ${url}:`, error);
    return null;
  }
}

async function updateList(listName: string, mediaMap: Record<string, any>, token: string, siteId: string) {
  console.log(`\nFetching ${listName}...`);
  const getRes = await graphFetch(`/lists/${listName}/items?expand=fields(select=Title,id)`);
  
  if (!getRes.ok) {
    console.error(`Failed to fetch ${listName}:`, await getRes.text());
    return;
  }
  
  const data = await getRes.json();
  const items = data.value || [];
  
  for (const item of items) {
    const title = item.fields.Title;
    const media = mediaMap[title];
    
    if (media) {
      console.log(`\nProcessing ${title} (ID: ${item.id})...`);
      
      const payloadFields: any = {};
      
      for (const [field, url] of Object.entries(media)) {
        if (typeof url === 'string' && url.startsWith('http')) {
          const lookupId = await uploadToSharePoint(url, token, siteId);
          if (lookupId) {
            payloadFields[field] = lookupId;
          }
        }
      }
      
      if (Object.keys(payloadFields).length > 0) {
        console.log(`  -> Patching item in SharePoint...`);
        const patchRes = await graphFetch(`/lists/${listName}/items/${item.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ fields: payloadFields })
        });
        
        if (!patchRes.ok) {
          console.error(`  -> Failed to update ${title}:`, await patchRes.text());
        } else {
          console.log(`  -> Success!`);
        }
      }
    }
  }
}

async function main() {
  try {
    const token = await getAccessToken();
    const siteId = await getSiteId(token);
    
    await updateList('courses', courseMedia, token, siteId as string);
    await updateList('trainers', trainerMedia, token, siteId as string);
    await updateList('blogs', blogMedia, token, siteId as string);
    
    console.log('\nAll done!');
  } catch (error) {
    console.error('Fatal error:', error);
  }
}

main();
