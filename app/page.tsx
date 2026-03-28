import { FeedPage } from "@/components/feed-page";
import { getFeedData } from "@/lib/github";

export const revalidate = 60;

export default async function HomePage() {
  const data = await getFeedData();

  return (
    <FeedPage
      githubConfigured={data.githubConfigured}
      issues={data.issues}
      channels={data.channels}
      title="Public bug reports"
      description="Fresh issues from your community, published from GitHub without exposing Telegram identities."
    />
  );
}
