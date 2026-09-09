import { streamText, tool } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { graphFetch } from '@/lib/graph';
import { getPineconeIndex, generateEmbedding } from '@/lib/vector-store';
import { z } from 'zod';

// Force max duration for edge functions if needed
export const maxDuration = 60;

const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY || '',
  baseURL: 'https://api.groq.com/openai/v1',
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const lastUserMsg = messages[messages.length - 1]?.content || '';
    let contextText = 'No specific context found.';

    if (lastUserMsg) {
      // 1. Generate Vector for User Query
      const embedding = await generateEmbedding(lastUserMsg);

      // 2. Query Pinecone for Semantic Matches AND explicitly fetch the Master Catalog
      const index = getPineconeIndex();
      
      const [queryResponse, fetchResponse] = await Promise.all([
        index.query({
          vector: embedding,
          topK: 10,
          includeMetadata: true,
        }),
        index.fetch({ ids: ['course_master_catalog'] })
      ]);

      // 3. Construct Context from Matches
      let masterCatalogText = '';
      if (fetchResponse.records && fetchResponse.records['course_master_catalog']) {
         masterCatalogText = (fetchResponse.records['course_master_catalog'].metadata?.text as string) || '';
      }

      const semanticChunks = queryResponse.matches && queryResponse.matches.length > 0
        ? queryResponse.matches.map((match: any) => match.metadata?.text || '').filter(Boolean).join('\n\n')
        : '';
        
      contextText = `${masterCatalogText}\n\n${semanticChunks}`;
    }
    const systemPrompt = `
      You are a highly polite and professional virtual assistant for "Talent Shapers Orbit", an IT training institute in Greater Noida.
      Your goal is to answer student enquiries accurately using ONLY the provided WEBSITE CONTEXT below.
      If a user asks a question that is not covered by the context, politely apologize and instruct them to email info@talentshapersorbit.in or call +91-9560952733.
      NEVER invent prices, durations, or course names that are not in the context.

      CRITICAL LISTING RULE:
      When a user asks you to list courses by a specific duration (e.g., "list 3 month courses"), you MUST look at the Master Catalog and ONLY include courses that EXACTLY match that duration. 
      If a course is 2 months, NEVER put it in a 3-month list. Double-check your list before answering to ensure perfect accuracy!
      
      WEBSITE CONTEXT (CRITICAL):
      - The user is currently chatting with you ON the official Talent Shapers Orbit website. NEVER tell them to "visit our website".
      
      WEBSITE NAVIGATION MAP:
      Use this map to direct users to the appropriate pages on this website when they want to navigate:
      - /courses : Use for browsing all IT courses, reading curriculum, checking prices and durations, and applying.
      - /contact : Use for human assistance, finding phone numbers, email, location, and offline registration.
      - /about   : Use for information about Talent Shapers Orbit, our mission, and our faculty.
      - /blogs   : Use for reading IT articles, tech news, and student success stories.
      
      FORMATTING RULES:
      - Always keep your answers concise and well-structured.
      - Use markdown bullet points and bold text for readability.
      - Never output massive walls of text. Break them into short, scannable paragraphs.
      - NEVER mention internal IDs of anything (like Course IDs, FAQ IDs, etc.) to the user.
      - When referring users to website pages, use natural names (e.g. "the Blogs page" or "the Courses tab").
      - CRITICAL RULE: Do NOT explain the website's User Interface, buttons, or navigation mechanics.

      ### RELEVANT KNOWLEDGE BASE SECTIONS:
      ${contextText}
    `;

    // 5. Generate Stream via Groq
    const result = await streamText({
      model: groq('openai/gpt-oss-120b'),
      system: systemPrompt,
      messages,
      onFinish: async ({ text }) => {
        try {
          const payload = {
            fields: {
              Title: `Chat Session - ${new Date().toISOString()}`,
              userMessage: lastUserMsg,
              botResponse: text || 'Unknown',
            }
          };
          graphFetch('/lists/chat_logs/items', { method: 'POST', body: JSON.stringify(payload) })
            .catch(e => console.error("Failed to log chat:", e));
        } catch (e) {
          console.error('Error logging chat:', e);
        }
      }
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
