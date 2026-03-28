import type { ContentTag } from "@/lib/tag-utils";

export type { ContentTag };

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
  /** Last update — used for “trending” style sorts. */
  updatedAt: string;
  /** GitHub issue comment count. */
  commentCount: number;
  url: string;
  /** Display reporter (label or GitHub login). */
  reporter: string;
  /** GitHub user who opened the issue. */
  authorLogin: string;
  severity: "critical" | "high" | "medium" | "low";
  labels: string[];
  /** Topic tags derived from labels (excludes channel, severity, etc.). */
  tags: ContentTag[];
  channelName: string | null;
  channelSlug: string | null;
  screenshotUrls: string[];
};

export type IssueComment = {
  id: number;
  body: string;
  authorLogin: string;
  authorAvatarUrl: string;
  createdAt: string;
  url: string;
};

export type TagOption = ContentTag & {
  count: number;
};

export type ChannelOption = {
  name: string;
  slug: string;
};
