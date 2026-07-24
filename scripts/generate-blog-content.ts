import * as dotenv from 'dotenv';
import { resolve } from 'path';
import fetch from 'cross-fetch';

(global as any).fetch = fetch;
(global as any).FormData = class FormData {};

dotenv.config({ path: resolve(__dirname, '../.env.local') });

import { graphFetch } from '../lib/graph';

const blogContent: Record<string, string> = {
  'How to Land Your First Python Developer Job in 2025': 
`Landing your first Python developer job in 2025 requires more than just knowing syntax; it demands a strategic approach to showcasing your skills. The tech industry has evolved, and employers are increasingly looking for candidates who can demonstrate practical problem-solving abilities rather than just theoretical knowledge. Building a strong portfolio with real-world projects is the most effective way to stand out from the crowd.

Focus on mastering the core concepts of Python, but don't stop there. Dive into popular frameworks like Django or Flask for web development, or Pandas and NumPy for data analysis, depending on your career goals. Understanding version control with Git and basic deployment pipelines will also give you a significant edge over other entry-level applicants.

Networking remains a crucial part of the job search. Engage with the developer community on platforms like GitHub, LinkedIn, and local tech meetups. Don't be afraid to reach out to senior developers for informational interviews. Combine a solid portfolio with active networking, and you'll dramatically increase your chances of securing that coveted first role.`,

  'AI & Machine Learning: What Skills Do You Actually Need?':
`The hype surrounding Artificial Intelligence and Machine Learning is at an all-time high, leaving many aspiring tech professionals wondering what skills are actually required to break into the field. Contrary to popular belief, you don't always need a Ph.D. to get started. The foundation of AI and ML lies heavily in mathematics, specifically linear algebra, calculus, and probability, but practical coding skills are equally vital.

Python has emerged as the undisputed language of choice for AI and ML, thanks to its extensive ecosystem of libraries like TensorFlow, PyTorch, and Scikit-Learn. A strong grasp of these tools, combined with the ability to clean, manipulate, and analyze large datasets, is essential. Understanding the underlying algorithms is important, but knowing how to apply them to real-world data to generate actionable insights is what employers truly value.

Beyond technical skills, curiosity and continuous learning are your best assets. The field of AI is evolving at breakneck speed, with new models and techniques emerging constantly. Being adaptable and willing to experiment with new tools will ensure you remain relevant and valuable in this dynamic and exciting industry.`,

  'MERN vs Full Stack Python: Which Should You Learn in 2025?':
`Choosing between the MERN stack (MongoDB, Express.js, React, Node.js) and Full Stack Python (typically Python, Django/Flask, React/Vue, PostgreSQL) is a common dilemma for new developers. In 2025, both paths offer excellent career prospects, but they cater to slightly different types of projects and developer preferences. The MERN stack uses JavaScript across the entire application, making it a popular choice for developers who want a seamless, unified language experience.

Full Stack Python, on the other hand, shines when it comes to applications that require heavy data processing, machine learning integration, or rapid backend prototyping. Python's clean syntax and powerful frameworks like Django make it incredibly efficient for building robust, secure backend systems. If your career goals lean towards data science, AI, or fintech, Python provides a massive advantage.

Ultimately, the "best" stack depends on your goals and the local job market. MERN is fantastic for fast, dynamic, single-page applications and startups. Python is unbeatable for data-heavy applications and enterprise environments. Both are highly sought after, so pick the one that aligns best with the projects you enjoy building and stick with it until you achieve mastery.`,

  'Top 20 SharePoint Interview Questions for 2025':
`Preparing for a SharePoint developer or administrator interview requires a deep understanding of both classic architectures and modern cloud-based solutions. As organizations continue to migrate to Microsoft 365, interviewers are heavily focused on your ability to leverage the SharePoint Framework (SPFx), Power Automate, and the Microsoft Graph API. Knowing how to integrate SharePoint with the broader Microsoft ecosystem is a critical requirement.

Common questions often revolve around site architecture, permissions management, and custom web part development. You can expect to be asked how to design a scalable intranet, how to troubleshoot common synchronization issues, and how to implement document-level security. Interviewers also want to hear about your experience with modern list formatting and site templates, as these are the tools used to create engaging user experiences without heavy custom code.

Don't forget to prepare for scenario-based questions. You might be asked how you would handle a massive data migration, or how you would design an automated approval workflow for HR documents. Demonstrating your problem-solving process and your understanding of best practices regarding performance and security will confidently set you apart from other candidates.`,

  "From Non-Tech Background to Developer: Ridhi's Journey at TSO":
`Breaking into the tech industry without a computer science degree can feel intimidating, but Ridhi's journey proves that dedication and the right guidance can make it a reality. Coming from a purely administrative background, Ridhi had never written a line of code before joining Talent Shapers. However, she possessed a strong analytical mindset and an eagerness to learn, which are the true foundational skills of any great developer.

Through our intensive bootcamp, Ridhi started with the basics of HTML, CSS, and JavaScript, gradually building her confidence. She didn't just passively watch tutorials; she actively built projects, struggled through bugs, and learned how to read documentation. Her breakthrough came when she developed a fully functional inventory management system using React and Node.js for her final project, proving her capability to build real-world applications.

Today, Ridhi is a Junior Full Stack Developer at a leading tech firm. Her story highlights that tech is for everyone, regardless of past experience. It takes time, patience, and a willingness to embrace the struggle, but with structured learning and a supportive community, transitioning from a non-tech background to a successful developer is entirely possible.`,

  'Why Power Apps is the Most In-Demand Skill Right Now':
`The demand for rapid application development has skyrocketed, and Microsoft Power Apps has emerged as the leading platform in the low-code/no-code revolution. Businesses are under intense pressure to digitize their internal processes, but traditional software development is often too slow and expensive for everyday operational needs. Power Apps bridges this gap, allowing organizations to build custom, professional-grade apps in a fraction of the time.

What makes Power Apps so valuable is its deep integration with the Microsoft 365 ecosystem. You can easily connect to data stored in SharePoint, SQL Server, or Excel, and use Power Automate to trigger complex background workflows. This means employees who understand the business logic can now build the solutions they need themselves, without waiting months for the IT department.

For job seekers, learning Power Apps is incredibly lucrative. Companies are actively searching for "citizen developers" who can streamline operations and save money. Because the learning curve is much less steep than traditional coding, mastering Power Apps offers one of the fastest paths to a high-paying tech career in the current market, making it an essential skill to add to your resume.`,

  '7 Spoken English Mistakes That Will Cost You the Interview':
`In today's globalized job market, technical skills alone are often not enough; clear communication is the key that unlocks opportunities. During an interview, hiring managers are not just evaluating your coding abilities; they are assessing how well you will integrate with their team, explain your ideas, and communicate with clients. Unfortunately, many candidates stumble due to common spoken English mistakes that can inadvertently mask their true technical brilliance.

One of the most frequent mistakes is speaking too quickly in an attempt to sound fluent. This often leads to mumbling, poor pronunciation, and a loss of clarity. Remember that the goal is comprehension, not speed. Taking a breath, speaking at a measured pace, and clearly articulating your words projects confidence and ensures the interviewer actually understands the complex technical concepts you are trying to explain.

Another major pitfall is the overuse of filler words like "um," "like," and "you know." While natural in casual conversation, excessive use in an interview can make you appear unprepared or unsure of yourself. Practicing your answers out loud and recording yourself is a fantastic way to identify these habits. By focusing on clarity, pacing, and concise phrasing, you can ensure your communication skills highlight your technical expertise rather than distract from it.`,

  'How to Build a Tech Resume That Gets You Interviews':
`Your resume is the first, and sometimes only, chance you have to make an impression on a hiring manager or an automated Applicant Tracking System (ATS). In the competitive tech industry, a generic resume simply won't cut it. To land interviews, your resume must be tailored, concise, and laser-focused on the impact you've made, rather than just listing your responsibilities.

The most critical section of a tech resume is your experience and projects. Instead of saying "wrote code in Python," use the STAR method (Situation, Task, Action, Result) to quantify your achievements. For example, "Developed a Python-based automation script that reduced data processing time by 40%." Highlighting specific metrics and the technologies you used provides concrete evidence of your value and capabilities.

Finally, keep it clean and readable. Use a professional, single-column format that is easily parsed by ATS software. Create a dedicated "Skills" section that lists your programming languages, frameworks, and tools, making it easy for recruiters to scan. By focusing on measurable impact and a clean layout, you can transform your resume from a simple document into a powerful marketing tool that opens doors to new opportunities.`
};

async function updateBlogsContent() {
  console.log('Fetching blogs...');
  const getRes = await graphFetch('/lists/blogs/items?expand=fields(select=Title,id,content)');
  
  if (!getRes.ok) {
    console.error('Failed to fetch blogs:', await getRes.text());
    return;
  }
  
  const data = await getRes.json();
  const items = data.value || [];
  
  for (const item of items) {
    const title = item.fields.Title;
    const content = blogContent[title];
    
    if (content) {
      console.log(`Updating ${title} (ID: ${item.id})...`);
      
      const patchRes = await graphFetch(`/lists/blogs/items/${item.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ fields: { content } })
      });
      
      if (!patchRes.ok) {
        console.error(`  -> Failed to update ${title}:`, await patchRes.text());
      } else {
        console.log(`  -> Success!`);
      }
    }
  }
}

async function main() {
  try {
    await updateBlogsContent();
    console.log('\nAll done! Content populated.');
  } catch (error) {
    console.error('Fatal error:', error);
  }
}

main();
