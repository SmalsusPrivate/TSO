import * as dotenv from 'dotenv';
import { resolve } from 'path';
import fetch from 'cross-fetch';
(global as any).fetch = fetch;
(global as any).FormData = class FormData {};



dotenv.config({ path: resolve(__dirname, '../.env.local') });

import { graphFetch } from '../lib/graph';

// Data from init.sql
const courses = [
  {
    Title: 'Python Programming', no: '01', tagline: 'The language powering the future.', dur: '2–3 Months',
    color: '#007AFF', description: 'From zero to production-ready Python developer. Build web applications, automate workflows, and lay the foundation for AI/ML development.',
    accent: '#4da6ff', level: 'Beginner → Advanced', category: 'Programming',
    topics: JSON.stringify(["Core Python & OOP", "Django & Flask", "REST APIs", "SQL & NoSQL", "Automation Scripts", "Deployment"]),
    careers: JSON.stringify(["Python Developer", "Backend Engineer", "Automation Engineer", "Data Analyst"]),
    highlights: JSON.stringify(["Beginner friendly — zero experience needed", "Build 3 real-world projects", "Industry expert trainers"]),
    stat_label: 'Students Placed', stat_val: '80+'
  },
  {
    Title: 'AI & Machine Learning', no: '02', tagline: 'Build minds. Code intelligence.', dur: '3–4 Months',
    color: '#34AADC', description: 'Master TensorFlow, Neural Networks, NLP, and Computer Vision. Deploy real ML models used in production at top tech companies.',
    accent: '#6fcfff', level: 'Intermediate', category: 'Data Science',
    topics: JSON.stringify(["NumPy & Pandas", "TensorFlow / Keras", "Deep Learning", "NLP & Computer Vision", "Model Evaluation", "Cloud Deploy"]),
    careers: JSON.stringify(["ML Engineer", "Data Scientist", "AI Researcher", "Data Analyst"]),
    highlights: JSON.stringify(["Real industry datasets", "5 ML projects for portfolio", "Cloud deployment training"]),
    stat_label: 'Avg. Salary', stat_val: '₹6–18 LPA'
  },
  {
    Title: 'MERN Stack', no: '03', tagline: 'One stack. Full power.', dur: '3 Months',
    color: '#30D158', description: 'Become a complete full-stack developer with MongoDB, Express, React, and Node.js. Build and ship scalable web applications end-to-end.',
    accent: '#70e88a', level: 'Beginner → Expert', category: 'Full Stack',
    topics: JSON.stringify(["MongoDB & Mongoose", "Express.js", "React & Redux", "Node.js", "JWT Auth", "AWS / Vercel"]),
    careers: JSON.stringify(["Full Stack Developer", "MERN Developer", "Frontend Engineer", "Backend Engineer"]),
    highlights: JSON.stringify(["Full e-commerce app project", "Authentication & security", "Deploy to production"]),
    stat_label: 'Hiring Partners', stat_val: '40+'
  },
  {
    Title: 'ReactJS', no: '04', tagline: 'The UI layer. Mastered.', dur: '2 Months',
    color: '#0AC8B9', description: 'Modern React with TypeScript, Next.js, Redux Toolkit, and performance optimization. Build the interfaces millions interact with daily.',
    accent: '#5ee8de', level: 'Intermediate', category: 'Frontend',
    topics: JSON.stringify(["React Hooks & Patterns", "TypeScript", "Next.js App Router", "Redux Toolkit", "Performance", "Testing"]),
    careers: JSON.stringify(["React Developer", "Frontend Engineer", "UI Developer", "Next.js Developer"]),
    highlights: JSON.stringify(["Production patterns & best practices", "Portfolio of React apps", "TypeScript throughout"]),
    stat_label: 'Completion Rate', stat_val: '96%'
  },
  {
    Title: 'SharePoint & Power Apps', no: '05', tagline: 'Enterprise apps. Low code. High impact.', dur: '2 Months',
    color: '#FF9F0A', description: 'Build mission-critical enterprise solutions with Microsoft 365 — SharePoint, Power Apps, Power Automate, and Teams integration.',
    accent: '#ffc75a', level: 'Intermediate', category: 'Microsoft 365',
    topics: JSON.stringify(["SharePoint Online", "Power Apps Canvas", "Power Automate", "Teams Integration", "Power BI", "SPFx Dev"]),
    careers: JSON.stringify(["SharePoint Dev", "Power Platform Dev", "M365 Consultant", "Business Analyst"]),
    highlights: JSON.stringify(["Microsoft cert prep included", "High-demand enterprise skills", "Real business app projects"]),
    stat_label: 'Salary Premium', stat_val: '+35%'
  },
  {
    Title: 'Spoken English', no: '06', tagline: 'Speak. Lead. Succeed.', dur: '1–2 Months',
    color: '#FF2D55', description: 'Professional communication skills taught by corporate trainers. From grammar fundamentals to boardroom presentations and job interviews.',
    accent: '#ff7a93', level: 'All Levels', category: 'Communication',
    topics: JSON.stringify(["Grammar & Vocabulary", "Pronunciation", "Group Discussions", "Public Speaking", "Business English", "Mock Interviews"]),
    careers: JSON.stringify(["Any IT Role", "Team Lead", "Manager", "Business Professional"]),
    highlights: JSON.stringify(["Ex-Wipro, Amazon, British Council trainers", "Daily conversation practice", "Mock GD & interview rounds"]),
    stat_label: 'Confidence Score', stat_val: '4.9★'
  },
  {
    Title: 'Interview Preparation', no: '07', tagline: 'Get ready. Get hired.', dur: '1 Month',
    color: '#BF5AF2', description: 'Crack any IT interview with DSA, system design, HR rounds, resume optimization, and offer negotiation mastery.',
    accent: '#d98eff', level: 'All Levels', category: 'Career',
    topics: JSON.stringify(["DSA", "System Design", "Aptitude", "Resume Writing", "LinkedIn", "HR Mastery"]),
    careers: JSON.stringify(["Software Developer", "Any IT Role", "Product Manager", "Business Analyst"]),
    highlights: JSON.stringify(["Company-specific prep", "10+ mock interviews", "Offer negotiation tips"]),
    stat_label: 'Offer Rate', stat_val: '88%'
  },
  {
    Title: 'Computer Fundamentals', no: '08', tagline: 'Start here. Go anywhere.', dur: '1 Month',
    color: '#636366', description: 'The perfect foundation for beginners. Master MS Office, internet essentials, basic programming concepts, and digital communication.',
    accent: '#a0a0a5', level: 'Beginner', category: 'Basics',
    topics: JSON.stringify(["MS Office Suite", "Internet & Email", "Basic Typing", "Cloud Storage", "Digital Comm.", "Cybersecurity"]),
    careers: JSON.stringify(["Office Executive", "Data Entry", "Admin", "Any Digital Role"]),
    highlights: JSON.stringify(["Zero prior knowledge needed", "Practical daily exercises", "Bridge to advanced courses"]),
    stat_label: 'Enrolled', stat_val: '200+'
  }
];

const trainers = [
  {
    Title: 'Vicky Singh', role: 'Senior Spoken English Trainer', exp: '11 Years', past: 'Wipro · HCL',
    color: '#007AFF', cert: 'TESOL Certified (USA)', bio: 'Specialized in grammar, fluency building, and interview preparation. Coached thousands of working professionals in corporate communication.'
  },
  {
    Title: 'Rahul Verma', role: 'Communication & Soft Skills', exp: '4 Years', past: 'Amazon India',
    color: '#34AADC', cert: 'Public Speaking Coach', bio: 'Helped over 1,000 learners become confident in spoken English through practical and interactive training methodology.'
  },
  {
    Title: 'Priya Deshmukh', role: 'English & Personality Dev.', exp: '5 Years', past: 'British Council India',
    color: '#FF2D55', cert: 'Personality Dev. Certified', bio: 'Former communication trainer with the British Council. Specializes in group discussions, public speaking, and personality development.'
  },
  {
    Title: 'Arjun Nair', role: 'Soft Skills & Spoken English', exp: '13 Years', past: 'Infosys · TCS',
    color: '#30D158', cert: 'Certified Soft Skills Trainer', bio: 'Communication Coach for Infosys and TCS learning programs. Trained over 500 learners in workshops across India.'
  }
];

const testimonials = [
  { Title: 'Vivek Kumar', role: 'College Student', text: 'I never thought learning computers and spoken English could be this fun. The step-by-step guidance made all the difference. Highly recommend TSO.', rating: 5 },
  { Title: 'Rahul Chaudhary', role: 'Network Engineer', text: 'The personalized attention and well-structured curriculum at TSO greatly boosted my confidence. Truly a game-changer for my career.', rating: 5 },
  { Title: 'Ridhi Bhargav', role: 'Marketing Executive', text: 'These classes are a great combination! Improved my computer skills and spoken English, boosting confidence in the workplace.', rating: 5 },
  { Title: 'Shubham Sharma', role: 'Job Seeker', text: 'Learning both computers and spoken English in one place is so convenient. The interactive sessions and helpful trainers made it enjoyable.', rating: 5 },
  { Title: 'Divya Verma', role: 'Student', text: 'These classes changed my life! I learned essential computer skills and improved my spoken English with ease — perfect for beginners.', rating: 5 }
];

const blogs = [
  {
    Title: 'How to Land Your First Python Developer Job in 2025', author0: 'TSO Placement Team', status: 'published',
    tags: JSON.stringify(["Python", "Career", "Job Search"]), excerpt: 'A complete roadmap from building your portfolio to acing the technical interview — from our placement team at TSO.',
    category: 'Career Tips', readTime: '8 min', featured: 'Yes', color: '#007AFF', publishDate: '2025-05-28T10:00:00Z', content: ''
  },
  {
    Title: 'AI & Machine Learning: What Skills Do You Actually Need?', author0: 'TSO Data Science Team', status: 'published',
    tags: JSON.stringify(["AI", "Machine Learning", "Skills"]), excerpt: 'Breaking down the real-world skills required to become an ML engineer — from fundamentals to specializations that companies hire for.',
    category: 'Tech Insights', readTime: '12 min', featured: 'Yes', color: '#34AADC', publishDate: '2025-05-20T10:00:00Z', content: ''
  },
  {
    Title: 'MERN vs Full Stack Python: Which Should You Learn in 2025?', author0: 'TSO Development Team', status: 'published',
    tags: JSON.stringify(["MERN", "Python", "Comparison"]), excerpt: 'An honest, data-backed comparison of two of the most popular full-stack paths to help you make an informed career decision.',
    category: 'Tech Insights', readTime: '7 min', featured: 'No', color: '#30D158', publishDate: '2025-05-15T10:00:00Z', content: ''
  },
  {
    Title: 'Top 20 SharePoint Interview Questions for 2025', author0: 'TSO Microsoft Team', status: 'published',
    tags: JSON.stringify(["SharePoint", "Interview", "Microsoft"]), excerpt: 'Prepare for your SharePoint developer interview with this comprehensive list of commonly asked questions and expert answers.',
    category: 'Interview Prep', readTime: '10 min', featured: 'No', color: '#FF9F0A', publishDate: '2025-05-10T10:00:00Z', content: ''
  },
  {
    Title: "From Non-Tech Background to Developer: Ridhi's Journey at TSO", author0: 'TSO Community', status: 'published',
    tags: JSON.stringify(["Success Story", "Career Change", "TSO"]), excerpt: 'How Ridhi transitioned from a marketing executive to a SharePoint developer at a top MNC within 5 months of joining TSO.',
    category: 'Student Stories', readTime: '5 min', featured: 'No', color: '#FF2D55', publishDate: '2025-05-05T10:00:00Z', content: ''
  },
  {
    Title: 'Why Power Apps is the Most In-Demand Skill Right Now', author0: 'TSO Microsoft Team', status: 'published',
    tags: JSON.stringify(["Power Apps", "Microsoft", "Demand"]), excerpt: 'Microsoft Power Apps has exploded in demand. Here\'s why learning low-code development is one of the smartest moves you can make.',
    category: 'Industry News', readTime: '6 min', featured: 'No', color: '#BF5AF2', publishDate: '2025-04-28T10:00:00Z', content: ''
  },
  {
    Title: '7 Spoken English Mistakes That Will Cost You the Interview', author0: 'Vicky Singh', status: 'published',
    tags: JSON.stringify(["Spoken English", "Interview", "Communication"]), excerpt: 'Our ex-Wipro communication trainer reveals the 7 spoken English mistakes that kill candidates\' chances in technical and HR interviews.',
    category: 'Career Tips', readTime: '6 min', featured: 'No', color: '#FF2D55', publishDate: '2025-04-20T10:00:00Z', content: ''
  },
  {
    Title: 'How to Build a Tech Resume That Gets You Interviews', author0: 'TSO Placement Team', status: 'published',
    tags: JSON.stringify(["Resume", "Career", "Job Search"]), excerpt: 'Expert tips from our placement team on crafting a resume that passes ATS filters and impresses hiring managers at top IT companies.',
    category: 'Career Tips', readTime: '8 min', featured: 'No', color: '#007AFF', publishDate: '2025-04-15T10:00:00Z', content: ''
  }
];

async function seedList(listName: string, items: any[]) {
  console.log(`\nStarting seeding for ${listName}...`);
  for (const item of items) {
    try {
      const payload = { fields: item };
      const response = await graphFetch(`/lists/${listName}/items`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        console.error(`Failed to create item in ${listName}:`, await response.text());
      } else {
        const data = await response.json();
        console.log(`✅ Created ${item.Title} (ID: ${data.id})`);
      }
    } catch (e) {
      console.error(`Error creating ${item.Title}:`, e);
    }
  }
}

async function main() {
  try {
    await seedList('courses', courses);
    await seedList('trainers', trainers);
    await seedList('testimonials', testimonials);
    await seedList('blogs', blogs);
    console.log('\nAll done!');
  } catch (error) {
    console.error('Fatal error:', error);
  }
}

main();
