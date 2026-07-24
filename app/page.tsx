import { getAllSiteContent } from '@/lib/content';
import HomeClient from './HomeClient';

export default async function HomePage() {
  const content = await getAllSiteContent();
  return <HomeClient content={content} />;
}
