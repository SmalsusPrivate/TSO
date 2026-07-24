import 'cross-fetch/polyfill';
import { graphFetch } from '../lib/graph';

// This dictionary contains all the hardcoded text extracted from the website.
// The keys match the dynamic variable names we will use in the React components.
export const SITE_CONTENT_DICTIONARY: Record<string, string> = {
  // ----------------------------------------------------
  // HERO SECTION (Homepage)
  // ----------------------------------------------------
  'home_hero_badge': "Greater Noida's Premier IT Training Institute",
  'home_hero_badge_year': "Est. 2020",
  'home_hero_title': "Master",
  'home_hero_words': "Python,AI & ML,MERN Stack,ReactJS,SharePoint",
  'home_hero_subtitle': "Hands-on coding. Industry mentors. Real projects.",
  'home_hero_subtitle2': "100% placement support — Greater Noida.",
  'home_hero_cta_primary': "Book Free Demo Class",
  'home_hero_cta_secondary': "Explore Courses",
  
  // ----------------------------------------------------
  // TRUST STRIP (Homepage)
  // ----------------------------------------------------
  'home_trust_label': "Our students work at",
  'home_trust_companies': "Google, Amazon, Microsoft, Wipro, Infosys, TCS, HCL, Cognizant, Accenture, IBM",

  // ----------------------------------------------------
  // PHILOSOPHY SECTION (Homepage)
  // ----------------------------------------------------
  'home_philosophy_label': "Our Philosophy",
  'home_philosophy_headline': "We don't just teach technology — we build careers.",
  'home_philosophy_desc': "At Tech Zone 4, Greater Noida West — we've built an ecosystem where aspiring professionals transform into industry-ready engineers.",
  
  // ----------------------------------------------------
  // STATS SECTION (Homepage)
  // ----------------------------------------------------
  'home_stat_1_num': "500",
  'home_stat_1_sfx': "+",
  'home_stat_1_label': "Students Trained",
  'home_stat_1_sub': "Across all programs",
  'home_stat_2_num': "10",
  'home_stat_2_sfx': "+",
  'home_stat_2_label': "Expert Courses",
  'home_stat_2_sub': "Industry-aligned curriculum",
  'home_stat_3_num': "100",
  'home_stat_3_sfx': "%",
  'home_stat_3_label': "Placement Support",
  'home_stat_3_sub': "Dedicated career team",
  'home_stat_4_num': "4",
  'home_stat_4_sfx': "+",
  'home_stat_4_label': "Industry Trainers",
  'home_stat_4_sub': "Corporate experience",

  // ----------------------------------------------------
  // ECOSYSTEM SECTION (Homepage)
  // ----------------------------------------------------
  'home_eco_label': "Why TSO",
  'home_eco_headline': "A complete ecosystem. Not just a class.",
  'home_eco_1_title': "Expert-Led Training",
  'home_eco_1_desc': "Learn from trainers with 10+ years at Wipro, Amazon, Infosys, and the British Council.",
  'home_eco_2_title': "Hands-on Coding Labs",
  'home_eco_2_desc': "Every concept applied immediately — live coding sessions and real industry-grade projects.",
  'home_eco_3_title': "Flexible Batches",
  'home_eco_3_desc': "Morning, evening, and weekend batches. Learn at your pace without disrupting life.",
  'home_eco_4_title': "Placement Ecosystem",
  'home_eco_4_desc': "Resume building, mock interviews, LinkedIn optimization, and direct referrals to hiring partners.",

  // ----------------------------------------------------
  // FOOTER
  // ----------------------------------------------------
  'footer_brand_desc': "Greater Noida's premier IT training institute. From fundamentals to advanced engineering — your career transformation starts here.",
  'footer_nav_heading': "Navigation",
  'footer_nav_1': "Home",
  'footer_nav_2': "About",
  'footer_nav_3': "Courses",
  'footer_nav_4': "Blog",
  'footer_nav_5': "Contact",
  'footer_prog_heading': "Programs",
  'footer_prog_1': "Python Programming",
  'footer_prog_2': "AI & Machine Learning",
  'footer_prog_3': "MERN Stack",
  'footer_prog_4': "ReactJS",
  'footer_prog_5': "SharePoint & Power Apps",
  'footer_prog_6': "Spoken English",
  'footer_contact_heading': "Contact",
  'footer_address': "2, Tech Zone 4, opposite Amrapali Dream Valley, Greater Noida, UP 201318",
  'footer_phone': "+91 9560 952733",
  'footer_email': "tsogreaternoida@gmail.com",
};

async function seedContent() {
  console.log('Seeding SharePoint SiteContent list...');
  
  const keys = Object.keys(SITE_CONTENT_DICTIONARY);
  let successCount = 0;
  let errorCount = 0;

  for (const key of keys) {
    const value = SITE_CONTENT_DICTIONARY[key];
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

  console.log(`\\nSeeding Complete! Success: ${successCount}, Errors: ${errorCount}`);
}

// To execute:
// npx ts-node --transpileOnly scripts/seed-site-content.ts
if (require.main === module) {
  seedContent().catch(console.error);
}
