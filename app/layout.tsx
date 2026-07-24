import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://talentshapersorbit.in'),
  title: 'Talent Shapers Orbit | Master Python, AI, MERN Stack & More',
  description:
    'Transform your career with hands-on IT training at Talent Shapers Orbit, Greater Noida. Expert-led courses in Python, AI/ML, MERN Stack, ReactJS, SharePoint, Power Apps, Spoken English & Interview Preparation with 100% placement support.',
  keywords:
    'IT training Greater Noida, Python course, AI Machine Learning, MERN Stack, ReactJS, SharePoint, Power Apps, Spoken English, interview preparation, Talent Shapers Orbit',
  openGraph: {
    title: 'Talent Shapers Orbit | Master Python, AI, MERN Stack & More',
    description: 'Transform your career with hands-on IT training in Greater Noida.',
    url: 'https://talentshapersorbit.in',
    siteName: 'Talent Shapers Orbit',
    type: 'website',
  },
};

import { getAllSiteContent } from '@/lib/content';
import { ContentProvider } from '@/components/ContentContext';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const content = await getAllSiteContent();
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme */}
        <script dangerouslySetInnerHTML={{ __html: "(function(){try{var s=localStorage.getItem('tso-theme');var t=s==='light'||s==='dark'?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();" }} />
      </head>
      <body className={`${inter.className} antialiased overflow-x-hidden`} style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <ThemeProvider>
          <SmoothScroll>
            <ContentProvider content={content}>
              <Navbar />
              <main>{children}</main>
              <Footer content={content} />
              <WhatsAppFloat />
            </ContentProvider>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
