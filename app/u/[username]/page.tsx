import Link from "next/link";
import { notFound } from "next/navigation";
import { FeedPage } from "@/components/feed-page";
import { buildTagOptions, getFeedData } from "@/lib/github";

export const revalidate = 60;

export default async function UserProfilePage({
  params
}: {
  params: { username: string };
}) {
  const data = await getFeedData();
  const handle = decodeURIComponent(params.username).toLowerCase();
  const issues = data.issues.filter((issue) => issue.authorLogin.toLowerCase() === handle);

  if (!issues.length) {
    notFound();
  }

  const display = issues[0]?.reporter ?? handle;
  const tags = buildTagOptions(issues);

  return (
    <FeedPage
      channels={data.channels}
      description={`Reports opened on GitHub by ${display} (@${handle}).`}
      githubConfigured={data.githubConfigured}
      issues={issues}
      showFeatured={false}
      tags={tags}
      title={`@${handle}`}
    />
  );
}
