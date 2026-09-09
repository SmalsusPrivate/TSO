import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Courses',
  description: 'Explore our IT training courses including Python, AI/ML, MERN Stack, ReactJS, SharePoint, and Spoken English. Build your career with Talent Shapers Orbit.',
  openGraph: {
    title: 'Courses | Talent Shapers Orbit',
    description: 'Explore our IT training courses and build your career.',
    url: 'https://talentshapersorbit.in/courses',
  },
};

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://talentshapersorbit.in" },
      { "@type": "ListItem", "position": 2, "name": "Courses", "item": "https://talentshapersorbit.in/courses" }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {children}
    </>
  );
}
