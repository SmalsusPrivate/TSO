import { MetadataRoute } from 'next';
import { graphFetch } from '@/lib/graph';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://talentshapersorbit.in';

  // Static routes
  const staticRoutes = ['', '/about', '/contact', '/courses', '/blog'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Fetch dynamic blogs directly from SharePoint graph API
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const endpoint = `/lists/blogs/items?expand=fields(select=Title,publishDate)`;
    const response = await graphFetch(endpoint);
    
    if (response.ok) {
      const data = await response.json();
      blogRoutes = data.value.map((item: any) => {
        // Fallback to current date if publishDate is missing
        const lastMod = item.fields.publishDate ? new Date(item.fields.publishDate).toISOString() : new Date().toISOString();
        return {
          url: `${baseUrl}/blog/${item.id}`,
          lastModified: lastMod,
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        };
      });
    }
  } catch (error) {
    console.error('Error generating blog sitemap:', error);
  }

  // Combine and return all routes
  return [...staticRoutes, ...blogRoutes];
}
