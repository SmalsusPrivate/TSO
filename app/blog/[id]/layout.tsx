import { Metadata } from 'next';
import { graphFetch } from '@/lib/graph';
import { resolveMediaUrl } from '@/lib/utils';

type Props = {
  params: { id: string };
  children: React.ReactNode;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const id = params.id;
  
  try {
    const endpoint = `/lists/blogs/items/${id}?expand=fields(select=Title,excerpt,author0,tags,category,publishDate,coverImageLookupId)`;
    const response = await graphFetch(endpoint);
    
    if (response.ok) {
      const data = await response.json();
      const f = data.fields;
      
      const title = `${f.Title} | TSO Blog`;
      const description = f.excerpt || 'Read this article on Talent Shapers Orbit.';
      const images = f.coverImageLookupId ? [resolveMediaUrl(f.coverImageLookupId)] : [];

      return {
        title,
        description,
        authors: [{ name: f.author0 }],
        category: f.category,
        openGraph: {
          title,
          description,
          type: 'article',
          publishedTime: f.publishDate,
          authors: [f.author0],
          images,
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images,
        },
      };
    }
  } catch (error) {
    console.error('Error fetching metadata for blog post:', error);
  }

  // Fallback metadata
  return {
    title: 'Blog Post',
    description: 'Read the latest updates and articles from Talent Shapers Orbit.',
  };
}

export default async function BlogPostLayout({ children, params }: Props) {
  let schema = null;
  
  try {
    const endpoint = `/lists/blogs/items/${params.id}?expand=fields(select=Title,excerpt,author0,publishDate,coverImageLookupId)`;
    const response = await graphFetch(endpoint);
    if (response.ok) {
      const data = await response.json();
      const f = data.fields;
      schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": f.Title,
        "description": f.excerpt,
        "author": [{
          "@type": "Person",
          "name": f.author0
        }],
        "datePublished": f.publishDate,
        "image": f.coverImageLookupId ? [resolveMediaUrl(f.coverImageLookupId)] : []
      };
    }
  } catch (e) {
    // ignore
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://talentshapersorbit.in" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://talentshapersorbit.in/blog" },
      { "@type": "ListItem", "position": 3, "name": schema ? schema.headline : "Post" }
    ]
  };

  return (
    <>
      {schema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {children}
    </>
  );
}
