export type BugIssue = {
  id: number;
  number: number;
  /** GitHub issue open or closed — drives workflow badges (OPEN / INVESTIGATING / RESOLVED). */
  state: "open" | "closed";
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
