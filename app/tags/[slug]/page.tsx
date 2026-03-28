import { notFound } from "next/navigation";
import { FeedPage } from "@/components/feed-page";
import { buildTagOptions, getFeedData } from "@/lib/github";

export const revalidate = 60;

export default async function TagDetailPage({
  params
}: {
  params: { slug: string };
}) {
  const data = await getFeedData();
  const slug = decodeURIComponent(params.slug).toLowerCase();
  const issues = data.issues.filter((issue) => issue.tags.some((t) => t.slug === slug));
  const meta = data.tags.find((t) => t.slug === slug);

  if (!issues.length) {
    notFound();
  }

  const tags = buildTagOptions(issues);

  return (
    <FeedPage
      activeChannel={undefined}
      channels={data.channels}
      description={`All reports tagged ${meta?.name ?? slug} in your GitHub repository.`}
      githubConfigured={data.githubConfigured}
      issues={issues}
      showFeatured={false}
      tags={tags}
      title={`#${meta?.name ?? slug}`}
    />
  );
}
