import { NextResponse } from 'next/server';
import { graphFetch } from '@/lib/graph';
import { getPineconeIndex, generateEmbedding } from '@/lib/vector-store';

export const maxDuration = 300; // Allow max duration for embedding generation

export async function POST(req: Request) {
  try {
    // 1. Fetch data from SharePoint
    const [coursesRes, faqsRes, contentRes, trainersRes, blogsRes] = await Promise.all([
      graphFetch('/lists/courses/items?expand=fields(select=Title,no,tagline,dur,description,level,category,topics,careers,highlights)'),
      graphFetch('/lists/faqs/items?expand=fields(select=Title,answer,category)'),
      graphFetch('/lists/SiteContent/items?expand=fields(select=Title,Value)&$top=500'),
      graphFetch('/lists/trainers/items?expand=fields(select=Title,role,exp,past,cert,bio)'),
      graphFetch('/lists/blogs/items?expand=fields(select=Title,status,excerpt,category,tags)')
    ]);

    if (!coursesRes.ok || !faqsRes.ok) {
      throw new Error('Failed to fetch data from SharePoint');
    }

    const coursesData = await coursesRes.json();
    const faqsData = await faqsRes.json();

    const index = getPineconeIndex();
    
    // Instead of generating embeddings sequentially, we gather all raw text chunks first.
    const rawVectors: { id: string; text: string; metadata: any }[] = [];

    // 2. Process Courses
    if (coursesData.value) {
      // Master Chunk
      const masterSummaries = coursesData.value.map((item: any, idx: number) => {
        const f = item.fields;
        return `${idx + 1}. ${f.Title} (Duration: ${f.dur || 'N/A'}, Level: ${f.level || 'N/A'}, Category: ${f.category || 'N/A'})`;
      });
      const masterText = `Master Catalog of all Courses offered at Talent Shapers Orbit:\n${masterSummaries.join('\n')}`;
      rawVectors.push({
        id: `course_master_catalog`,
        text: masterText,
        metadata: { type: 'course', title: 'Course Master Catalog', text: masterText }
      });

      // Individual Chunks
      for (const item of coursesData.value) {
        const f = item.fields;
        const text = `Detailed Course Information for ${f.Title || 'N/A'}. Category: ${f.category || 'N/A'}. Duration: ${f.dur || 'N/A'}. Level: ${f.level || 'N/A'}. Description: ${f.description || 'N/A'}. Topics Covered: ${f.topics || 'N/A'}. Career Outcomes: ${f.careers || 'N/A'}. Highlights: ${f.highlights || 'N/A'}.`;
        rawVectors.push({
          id: `course_${item.id}`,
          text: text,
          metadata: { type: 'course', title: f.Title || '', text: text }
        });
      }
    }

    // 3. Process FAQs
    if (faqsData.value) {
      for (const item of faqsData.value) {
        const f = item.fields;
        const text = `Q: ${f.Title}\nA: ${f.answer}`;
        rawVectors.push({
          id: `faq_${item.id}`,
          text: text,
          metadata: { type: 'faq', title: f.Title || '', text: text }
        });
      }
    }

    const contentData = contentRes.ok ? await contentRes.json() : { value: [] };
    const trainersData = trainersRes.ok ? await trainersRes.json() : { value: [] };
    const blogsData = blogsRes.ok ? await blogsRes.json() : { value: [] };

    // 4. Process Site Content
    if (contentData.value) {
      const siteContentMap: Record<string, string> = {};
      for (const item of contentData.value) {
        if (item.fields.Title && item.fields.Value) {
          siteContentMap[item.fields.Title] = item.fields.Value;
        }
      }

      for (let i = 1; i <= 4; i++) {
        const num = siteContentMap[`home_stat_${i}_num`];
        const sfx = siteContentMap[`home_stat_${i}_sfx`] || '';
        const label = siteContentMap[`home_stat_${i}_label`];
        const sub = siteContentMap[`home_stat_${i}_sub`];
        
        if (num && label) {
          const text = `Institute Statistic: We proudly have ${num}${sfx} ${label}. ${sub || ''}`;
          rawVectors.push({
            id: `content_stat_${i}`,
            text: text,
            metadata: { type: 'content', title: label, text: text }
          });
        }
      }

      const phone = siteContentMap['footer_phone'];
      const email = siteContentMap['footer_email'];
      const address = siteContentMap['footer_address'];
      if (phone || email || address) {
        const text = `Contact Information: Our phone number is ${phone || 'N/A'}, email is ${email || 'N/A'}, and our address is ${address || 'N/A'}.`;
        rawVectors.push({
          id: `content_contact_info`,
          text: text,
          metadata: { type: 'content', title: `Contact Info`, text: text }
        });
      }

      const philoHead = siteContentMap['home_philosophy_headline'];
      const philoDesc = siteContentMap['home_philosophy_desc'];
      if (philoHead || philoDesc) {
        const text = `Our Philosophy: ${philoHead || ''} - ${philoDesc || ''}`;
        rawVectors.push({
          id: `content_philosophy`,
          text: text,
          metadata: { type: 'content', title: `Our Philosophy`, text: text }
        });
      }

      const skipPrefixes = ['home_stat_', 'footer_phone', 'footer_email', 'footer_address', 'home_philosophy_', 'footer_nav_', 'footer_prog_'];
      for (const item of contentData.value) {
        const title = item.fields.Title;
        const val = item.fields.Value;
        if (!title || !val) continue;
        if (skipPrefixes.some(prefix => title.startsWith(prefix))) continue;

        const text = `General Info about ${title}: ${val}`;
        rawVectors.push({
          id: `content_${item.id}`,
          text: text,
          metadata: { type: 'content', title: title, text: text }
        });
      }
    }

    // 5. Process Trainers
    if (trainersData.value) {
      for (const item of trainersData.value) {
        const f = item.fields;
        const text = `Trainer: ${f.Title}. Role: ${f.role}. Experience: ${f.exp}. Bio: ${f.bio}. Certifications: ${f.cert}`;
        rawVectors.push({
          id: `trainer_${item.id}`,
          text: text,
          metadata: { type: 'trainer', title: f.Title || '', text: text }
        });
      }
    }

    // 6. Process Blogs
    if (blogsData.value) {
      for (const item of blogsData.value) {
        const f = item.fields;
        if (f.status !== 'Published') continue;
        const text = `Blog Article: ${f.Title}. Category: ${f.category}. Tags: ${f.tags}. Excerpt: ${f.excerpt}`;
        rawVectors.push({
          id: `blog_${item.id}`,
          text: text,
          metadata: { type: 'blog', title: f.Title || '', text: text }
        });
      }
    }

    if (rawVectors.length === 0) {
      return NextResponse.json({ message: 'No data found to sync' });
    }

    // 7. Generate Embeddings in PARALLEL BATCHES (Massive performance boost)
    const vectors: any[] = [];
    const embeddingBatchSize = 20; // 20 simultaneous requests to HF to avoid rate limits
    
    console.log(`Generating embeddings for ${rawVectors.length} chunks...`);
    
    for (let i = 0; i < rawVectors.length; i += embeddingBatchSize) {
      const batch = rawVectors.slice(i, i + embeddingBatchSize);
      console.log(`Processing embeddings batch ${Math.floor(i / embeddingBatchSize) + 1} of ${Math.ceil(rawVectors.length / embeddingBatchSize)}...`);
      
      const embeddings = await Promise.all(
        batch.map(item => generateEmbedding(item.text))
      );
      
      batch.forEach((item, index) => {
        vectors.push({
          id: item.id,
          values: embeddings[index],
          metadata: item.metadata
        });
      });
    }

    // 8. Upsert vectors to Pinecone
    const pineconeBatchSize = 100;
    console.log(`Upserting ${vectors.length} vectors to Pinecone...`);

    for (let i = 0; i < vectors.length; i += pineconeBatchSize) {
      const batch = vectors.slice(i, i + pineconeBatchSize);
      console.log(`Pushing batch to Pinecone (${batch.length} vectors)...`);
      await index.upsert({ records: batch });
    }

    return NextResponse.json({ success: true, count: vectors.length });
  } catch (error) {
    console.error('Sync Vectors Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
