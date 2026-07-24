import { graphFetch } from './graph';

export interface SiteContentMap {
  [key: string]: string;
}

export async function getAllSiteContent(): Promise<SiteContentMap> {
  try {
    // The endpoint to get items from the SiteContent list
    const endpoint = '/lists/SiteContent/items?expand=fields(select=Title,Value)&$top=500';
    
    // We use next: { revalidate: 60 } to cache the content for 60 seconds.
    // This makes the website incredibly fast, only hitting SharePoint once a minute at most.
    const response = await graphFetch(endpoint, {
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      console.error('Failed to fetch SiteContent from SharePoint', response.status, await response.text());
      return {};
    }

    const data = await response.json();
    const contentMap: SiteContentMap = {};

    if (data.value && Array.isArray(data.value)) {
      data.value.forEach((item: any) => {
        const title = item.fields?.Title;
        const value = item.fields?.Value;
        if (title && value !== undefined) {
          contentMap[title] = value;
        }
      });
    }

    return contentMap;
  } catch (error) {
    console.error('Error fetching SiteContent:', error);
    return {};
  }
}
