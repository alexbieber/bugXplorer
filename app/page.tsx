import { FeedPage } from "@/components/feed-page";
import { getFeedData } from "@/lib/github";

export const revalidate = 60;

export default async function HomePage() {
  const data = await getFeedData();

  return (
    <FeedPage
      channels={data.channels}
      description="Fresh issues from your community, published from GitHub without exposing Telegram identities."
      githubConfigured={data.githubConfigured}
      issues={data.issues}
      tags={data.tags}
      title="Public bug reports"
    />
  );
}
