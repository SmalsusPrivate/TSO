import { NextResponse } from 'next/server';
import { graphFetch } from '@/lib/graph';
import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY || '',
  baseURL: 'https://api.groq.com/openai/v1',
});

// Force max duration for Vercel edge/lambda if needed
export const maxDuration = 60;

export async function POST() {
  try {
    let topicToWrite = null;
    let topicIdToMarkUsed = null;

    // 1. Check blog_topics SharePoint list for an unused topic
    try {
      const topicRes = await graphFetch('/lists/blog_topics/items?expand=fields(select=Title,Status)&$filter=fields/Status ne \'Used\'&$top=1');
      if (topicRes.ok) {
        const data = await topicRes.json();
        if (data.value && data.value.length > 0) {
          topicToWrite = data.value[0].fields.Title;
          topicIdToMarkUsed = data.value[0].id;
        }
      }
    } catch (e) {
      console.warn("Could not fetch blog_topics, falling back to AI generated topic:", e);
    }

    if (!topicToWrite) {
      topicToWrite = "The growing demand for IT skills in India (Web Development, AI, or Cloud Computing)";
    }

    // 2. Generate the Blog Post using Groq
    const { object: blogData } = await generateObject({
      model: groq('llama-3.3-70b-versatile'), // Switched to 3.3-70b as 3.1 was deprecated by Groq
      schema: z.object({
        title: z.string().describe("A catchy, SEO-friendly title for the blog post."),
        excerpt: z.string().describe("A 2-3 sentence introduction/excerpt."),
        content: z.string().describe("The full blog post content in HTML format. Use <h2>, <h3>, <p>, <ul>, <li>, and <strong> tags. Minimum 1200 words."),
        tags: z.array(z.string()).describe("3 to 5 relevant tags (e.g. ['AI', 'Career', 'Python'])."),
        category: z.string().describe("The category (e.g., 'Career', 'Programming', 'Technology')."),
        readTime: z.string().describe("Estimated read time (e.g. '6 min').")
      }),
      prompt: `Write a highly engaging, deep-technical, and SEO-optimized blog post for "Talent Shapers Orbit", an IT training institute in Greater Noida.
The topic of the blog is: "${topicToWrite}"

CRITICAL INSTRUCTIONS:
1. WORD COUNT: The content MUST be extremely detailed, deep, and informative. Aim for a minimum of 1,200 words. Provide real-world examples, statistics, and technical depth.
2. SEO LINKS: You MUST embed at least 2 relevant external links (e.g., to official docs like AWS, Microsoft, ReactJS, or Wikipedia) and 2 internal links (e.g. to "/courses" or "/contact") natively inside the text using standard <a href="..."> tags.
3. STRUCTURE: Do NOT include an <h1> tag anywhere in the content! The title is already handled. Start directly with <h2> tags.
4. FORMATTING: Ensure the HTML is perfectly structured using <h2>, <h3>, <p>, <ul>, <li>, and <strong>. 
5. Do not include markdown \`\`\`html blocks, just output the raw HTML directly. DO NOT escape HTML tags (e.g., output <h2>, NEVER &lt;h2&gt;).`
    });

    // Strip markdown formatting if the LLM hallucinated it
    let cleanContent = blogData.content;
    cleanContent = cleanContent.replace(/^```(?:html|markdown)?\s*/i, '').replace(/```\s*$/i, '');

    // Unescape common encodings just in case
    cleanContent = cleanContent
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/\\</g, '<')
      .replace(/\\>/g, '>');

    // Force it to be a clean, single-line HTML string wrapped in a parent div
    // This prevents ReactQuill or SharePoint from misinterpreting bare tags or newlines
    cleanContent = `<div class="ai-generated-blog">${cleanContent.replace(/\n/g, '')}</div>`;

    // 3. Save to SharePoint blogs list
    const payload = {
      fields: {
        Title: blogData.title,
        status: 'draft',
        excerpt: blogData.excerpt,
        content: cleanContent,
        author0: 'AI Assistant',
        tags: JSON.stringify(blogData.tags),
        category: blogData.category,
        readTime: blogData.readTime,
        featured: 'No',
        color: '#007AFF',
        publishDate: new Date().toISOString()
      }
    };

    const saveRes = await graphFetch('/lists/blogs/items', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (!saveRes.ok) {
      throw new Error(`Failed to save blog to SharePoint: ${await saveRes.text()}`);
    }

    // 4. Mark the topic as used (if applicable)
    if (topicIdToMarkUsed) {
      await graphFetch(`/lists/blog_topics/items/${topicIdToMarkUsed}`, {
        method: 'PATCH',
        body: JSON.stringify({
          fields: {
            Status: 'Used'
          }
        })
      }).catch(e => console.error("Failed to mark topic as used:", e));
    }

    return NextResponse.json({ status: 'success', message: 'Blog generated successfully', topic: topicToWrite });
  } catch (error) {
    console.error('Blog Generation Error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
