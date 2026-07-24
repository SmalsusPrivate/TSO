import 'cross-fetch/polyfill';
import { graphFetch } from '../lib/graph';

export const NEW_SITE_CONTENT_DICTIONARY: Record<string, string> = {
  blog_hero_label: 'Knowledge Hub',
  blog_hero_title1: 'Insights for the',
  blog_hero_title2: 'ambitious.',
  blog_hero_search_placeholder: 'Search articles...',
  blog_featured_label: 'Featured',
  blog_latest_label: 'Latest Articles',
  blog_empty_state: 'No articles found for',
  blog_clear_search: 'Clear search',
  blog_read_btn: 'Read',

  blog_post_loading: 'Loading article...',
  blog_post_404_label: '404',
  blog_post_404_title: 'Article not found',
  blog_post_404_desc: "This article doesn't exist or has been moved.",
  blog_post_back_btn: 'Back to Blog',
  blog_post_cta_label: 'Ready to Start?',
  blog_post_cta_title: 'Join Talent Shapers Orbit',
  blog_post_cta_desc: 'Book a free demo class and experience the TSO difference.',
  blog_post_cta_btn: 'Book Free Demo Class',
  blog_post_related_label: 'Related Articles',
};

async function seedContent() {
  console.log('Seeding NEW items to SharePoint SiteContent list...');
  
  const keys = Object.keys(NEW_SITE_CONTENT_DICTIONARY);
  let successCount = 0;
  let errorCount = 0;

  for (const key of keys) {
    const value = NEW_SITE_CONTENT_DICTIONARY[key];
    console.log(`Pushing [${key}]...`);
    
    try {
      const response = await graphFetch('/lists/SiteContent/items', {
        method: 'POST',
        body: JSON.stringify({
          fields: {
            Title: key,
            Value: value
          }
        })
      });

      if (response.ok) {
        successCount++;
      } else {
        console.error(`Failed to push ${key}:`, await response.text());
        errorCount++;
      }
    } catch (e) {
      console.error(`Error pushing ${key}:`, e);
      errorCount++;
    }
  }

  console.log(`\nSeeding Complete! Success: ${successCount}, Errors: ${errorCount}`);
}

if (require.main === module) {
  seedContent().catch(console.error);
}
