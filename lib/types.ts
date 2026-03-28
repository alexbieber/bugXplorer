export type BugIssue = {
  id: number;
  number: number;
  title: string;
  body: string;
  bodySections: string[];
  excerpt: string;
  createdAt: string;
  url: string;
  reporter: string;
  severity: "critical" | "high" | "medium" | "low";
  labels: string[];
  channelName: string | null;
  channelSlug: string | null;
  screenshotUrls: string[];
};

export type ChannelOption = {
  name: string;
  slug: string;
};
