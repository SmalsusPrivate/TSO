import 'cross-fetch/polyfill';
import { graphFetch } from '../lib/graph';

export const NEW_SITE_CONTENT_DICTIONARY: Record<string, string> = {
  nav_logo_title: 'Talent Shapers',
  nav_logo_subtitle: 'Orbit',
  nav_home: 'Home',
  nav_about: 'About',
  nav_courses: 'Courses',
  nav_blog: 'Blog',
  nav_contact: 'Contact',
  nav_demo_btn: 'Free Demo',
  nav_demo_btn_mobile: 'Book Free Demo Class',
  nav_theme_dark: 'Dark',
  nav_theme_light: 'Light',
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
