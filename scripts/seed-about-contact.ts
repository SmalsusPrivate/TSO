import 'cross-fetch/polyfill';
import { graphFetch } from '../lib/graph';

export const NEW_SITE_CONTENT_DICTIONARY: Record<string, string> = {
  // ----------------------------------------------------
  // ABOUT PAGE
  // ----------------------------------------------------
  'about_hero_label': "About Talent Shapers Orbit",
  'about_hero_title': "The institute that",
  'about_hero_title_highlight': "shapes futures.",
  'about_hero_desc': "Located at Tech Zone 4, Greater Noida West — Talent Shapers Orbit bridges the gap between education and employment through world-class, hands-on IT training.",
  
  'about_story_label': "Our Story",
  'about_story_title1': "Built for the",
  'about_story_title2': "ambitious.",
  'about_story_p1': "Talent Shapers Orbit was founded with one conviction: every aspiring tech professional deserves access to world-class, practical training — regardless of their background or previous experience.",
  'about_story_p2': "We operate at the intersection of technology and human potential. Our programs go far beyond lectures and textbooks. Every student leaves with a portfolio of real projects, interview-ready skills, and direct connections to our hiring network.",
  'about_story_p3': "From computer fundamentals to advanced AI and machine learning, our curriculum is continuously updated by industry practitioners who live and breathe the technologies they teach.",
  'about_story_btn': "Explore Our Programs",
  'about_story_stat1_num': "500+",
  'about_story_stat1_desc': "Careers transformed",
  'about_story_stat2_num': "100%",
  'about_story_stat2_desc': "Placement support",

  'about_mv_mission_label': "Mission",
  'about_mv_mission_desc': "To provide practical, industry-aligned IT education that empowers every individual to build a successful tech career, regardless of background.",
  'about_mv_vision_label': "Vision",
  'about_mv_vision_desc': "To become India's most trusted IT training partner, known for producing work-ready engineers who drive technological innovation.",
  'about_mv_values_label': "Values",
  'about_mv_values_desc': "Excellence, integrity, student-first thinking, continuous innovation, and the relentless pursuit of career outcomes for every student.",

  'about_method_label': "How We Teach",
  'about_method_title': "A proven six-step method.",
  'about_method_1_title': "Concept Clarity",
  'about_method_1_desc': "Crystal-clear fundamentals through interactive, demo-driven sessions that build unshakeable foundations.",
  'about_method_2_title': "Hands-On Labs",
  'about_method_2_desc': "Every session includes live coding or communication exercises — understanding is proven by doing.",
  'about_method_3_title': "Real Projects",
  'about_method_3_desc': "Work on industry-standard projects that go directly into your portfolio and impress hiring managers.",
  'about_method_4_title': "Mock Assessments",
  'about_method_4_desc': "Weekly tests, code reviews, and mock interviews calibrated to the standards of top IT companies.",
  'about_method_5_title': "Career Coaching",
  'about_method_5_desc': "Resume crafting, LinkedIn optimization, personal branding, and company-specific interview preparation.",
  'about_method_6_title': "Placement Drive",
  'about_method_6_desc': "Active referrals, networking sessions, and connections to our growing network of hiring partners.",

  'about_trainers_label': "The Faculty",
  'about_trainers_title': "Experts who've walked the path.",

  'about_cta_label': "Begin Your Journey",
  'about_cta_title': "Ready to join the orbit?",
  'about_cta_desc': "Book a free demo class and experience the TSO difference for yourself.",
  'about_cta_btn1': "Book Free Demo",
  'about_cta_btn2': "View Courses",

  // ----------------------------------------------------
  // CONTACT PAGE
  // ----------------------------------------------------
  'contact_hero_label': "Get in Touch",
  'contact_hero_title': "Start your orbit",
  'contact_hero_title_highlight': "today.",
  
  'contact_info_address_label': "Address",
  'contact_info_address_line1': "2, Tech Zone 4, opposite Amrapali Dream Valley",
  'contact_info_address_line2': "Greater Noida, Uttar Pradesh 201318",
  'contact_info_phone_label': "Phone",
  'contact_info_phone_line1': "+91 9560 952733",
  'contact_info_email_label': "Email",
  'contact_info_email_line1': "tsogreaternoida@gmail.com",
  'contact_info_hours_label': "Hours",
  'contact_info_hours_line1': "Mon–Sat: 9:00 AM – 8:00 PM",
  'contact_info_hours_line2': "Sunday: 10:00 AM – 4:00 PM",
  
  'contact_form_label': "Send a Message",
  'contact_form_title1': "We'll get back to you",
  'contact_form_title2': "within 24 hours.",
  'contact_form_success_title': "Message Received",
  'contact_form_success_desc': "We'll reach out within 24 hours. For faster response, message us on WhatsApp.",
  'contact_form_btn_wa': "Chat on WhatsApp",
  'contact_form_input_name': "Full Name *",
  'contact_form_input_phone': "Phone Number *",
  'contact_form_input_email': "Email",
  'contact_form_input_course': "Course of Interest",
  'contact_form_input_msg': "Message",
  'contact_form_btn_submit': "Send Message",
  
  'contact_sidebar_wa_title': "WhatsApp — Fastest Response",
  'contact_sidebar_wa_desc': "Usually within minutes",
  'contact_sidebar_expect_label': "What to Expect",
  'contact_sidebar_expect_1': "Free career counselling session",
  'contact_sidebar_expect_2': "Course details & fee structure",
  'contact_sidebar_expect_3': "Batch schedule & timings",
  'contact_sidebar_expect_4': "Live demo class arrangement",
  'contact_sidebar_expect_5': "Placement track record discussion",
  'contact_sidebar_social_label': "Follow Us",
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
