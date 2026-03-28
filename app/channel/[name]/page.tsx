import { notFound } from "next/navigation";
import { FeedPage } from "@/components/feed-page";
import { getFeedData } from "@/lib/github";

export const revalidate = 60;

export default async function ChannelPage({
  params
}: {
  params: { name: string };
}) {
  const data = await getFeedData();
  const channel = decodeURIComponent(params.name);
  const issues = data.issues.filter((issue) => issue.channelSlug === channel);

  if (!issues.length) {
    notFound();
  }

  const channelMeta = data.channels.find((item) => item.slug === channel);

  return (
    <FeedPage
      issues={issues}
      channels={data.channels}
      activeChannel={channel}
      title={channelMeta ? `${channelMeta.name} bugs` : "Channel bugs"}
      description={`Latest issues reported in the ${channelMeta?.name ?? channel} channel.`}
    />
  );
}
