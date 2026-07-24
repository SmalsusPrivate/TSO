import 'cross-fetch/polyfill';
import { graphFetch } from '../lib/graph';

export const NEW_SITE_CONTENT_DICTIONARY: Record<string, string> = {
  courses_hero_label: 'Training Programs',
  courses_hero_title1: 'Eight courses.',
  courses_hero_title2: 'One destination.',
  courses_hero_desc: 'From complete beginner to industry-ready engineer — every program is designed around one goal: getting you hired.',
  courses_hero_stat1_val: '500+',
  courses_hero_stat1_label: 'Students',
  courses_hero_stat2_val: '8',
  courses_hero_stat2_label: 'Courses',
  courses_hero_stat3_val: '100%',
  courses_hero_stat3_label: 'Placement Support',
  courses_hero_stat4_val: '1–4 Mo',
  courses_hero_stat4_label: 'Flexible Duration',
  courses_hero_scroll: 'Scroll to explore',

  courses_showcase_label: 'Explore All Courses',

  courses_interlude_label: 'The TSO Difference',
  courses_interlude_title1: 'Learn by building.',
  courses_interlude_title2: 'Graduate by shipping.',
  courses_interlude_desc: 'Every course ends with production-ready projects that go straight into your portfolio and get you hired.',

  courses_orbit_label: 'The TSO Universe',
  courses_orbit_title1: 'Every course',
  courses_orbit_title2: 'orbits one goal.',
  courses_orbit_desc: 'Whether Python, AI, MERN, or communication — every program connects to the same outcome: a job you are proud of.',
  courses_orbit_btn: 'Start Your Journey',

  courses_why_label: 'Why TSO?',
  courses_why_title: 'The difference is real.',
  courses_why_col1: 'Feature',
  courses_why_col2: 'TSO',
  courses_why_col3: 'Others',

  courses_cta_label: 'Not Sure Where to Start?',
  courses_cta_title: 'Let us guide you.',
  courses_cta_desc: 'Book a free counselling session and our experts will map the perfect learning path to your dream job.',
  courses_cta_btn1: 'Book Free Counselling',
  courses_cta_btn2: 'Contact Us',

  courses_card_btn_explore: 'Explore',
  courses_card_btn_close: 'Close',
  courses_panel_learn_label: "What You'll Learn",
  courses_panel_outcomes_label: 'Career Outcomes',
  courses_panel_duration: 'Duration',
  courses_panel_level: 'Level',
  courses_panel_batches: 'Batches',
  courses_panel_batches_val: 'Morning / Evening / Weekend',
  courses_panel_btn_enroll: 'Enroll Now',
  courses_panel_btn_demo: 'Book Free Demo',
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
