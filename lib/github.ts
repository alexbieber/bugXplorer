import "server-only";

import { CHANNELS, resolveChannel } from "@/lib/channels";
import { BugIssue, ChannelOption, IssueComment, TagOption } from "@/lib/types";
import { tagsFromLabels } from "@/lib/tag-utils";
import { dedupe, slugify } from "@/lib/utils";

const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

/** Comma-separated label names; issue must have at least one (case-insensitive). If unset, all issues are shown. */
function getRequiredLabels(): string[] | null {
  const raw = process.env.BUGFEED_REQUIRED_LABELS?.trim();
  if (!raw) {
    return null;
  }
  const list = raw
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  return list.length ? list : null;
}

/** GitHub API: open, closed, or all. Default `all` so closed/triaged reports still appear. */
function getIssueState(): "open" | "closed" | "all" {
  const raw = process.env.GITHUB_ISSUE_STATE?.trim().toLowerCase();
  if (raw === "open" || raw === "closed" || raw === "all") {
    return raw;
  }
  return "all";
}

function passesLabelFilter(loweredLabels: string[]): boolean {
  const required = getRequiredLabels();
  if (!required) {
    return true;
  }
  return required.some((label) => loweredLabels.includes(label));
}

type GitHubLabel = {
  name: string;
};

type GitHubIssue = {
  id: number;
  number: number;
  state: "open" | "closed";
  title: string;
  body: string | null;
  html_url: string;
  created_at: string;
  updated_at: string;
  comments: number;
  labels: GitHubLabel[];
  user: {
    login: string;
    avatar_url: string;
  };
  pull_request?: unknown;
};

function getHeaders() {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "bugfeed"
  };

  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  return headers;
}

function getSeverity(labels: string[]): BugIssue["severity"] {
  if (labels.includes("critical")) {
    return "critical";
  }
  if (labels.includes("high")) {
    return "high";
  }
  if (labels.includes("low")) {
    return "low";
  }
  return "medium";
}

function getChannel(labels: string[]) {
  const label = labels.find((item) => item.toLowerCase().startsWith("channel:"));

  if (!label) {
    return { channelName: null, channelSlug: null };
  }

  const rawChannel = label.replace(/^channel:/i, "").trim();
  const resolved = resolveChannel(rawChannel);

  if (resolved) {
    return {
      channelName: resolved.name,
      channelSlug: resolved.slug
    };
  }

  const channelName = rawChannel;

  return {
    channelName,
    channelSlug: slugify(channelName)
  };
}

function getReporter(labels: string[], fallback: string) {
  const reporterLabel = labels.find((item) =>
    /^(reporter|reported-by|submitted-by):/i.test(item)
  );

  if (!reporterLabel) {
    return fallback;
  }

  return reporterLabel.replace(/^(reporter|reported-by|submitted-by):/i, "").trim() || fallback;
}

function getScreenshotUrls(body: string) {
  const markdownMatches = Array.from(
    body.matchAll(/!\[[^\]]*]\((https?:\/\/[^)\s]+\.(?:png|jpe?g|gif|webp)[^)]*)\)/gi),
    (match) => match[1]
  );
  const plainMatches = body.match(/https?:\/\/\S+\.(?:png|jpe?g|gif|webp)(?:\?\S*)?/gi) ?? [];
  return dedupe([...markdownMatches, ...plainMatches]);
}

function cleanBody(body: string) {
  return body
    .replace(/!\[[^\]]*]\(([^)]+)\)/g, "")
    .replace(/https?:\/\/\S+\.(?:png|jpe?g|gif|webp)/gi, "")
    .trim();
}

function splitBody(body: string) {
  return cleanBody(body)
    .split(/\n\s*\n/g)
    .map((section) => section.trim())
    .filter(Boolean);
}

function toIssue(issue: GitHubIssue): BugIssue {
  const labels = issue.labels.map((label) => label.name);
  const loweredLabels = labels.map((label) => label.toLowerCase());
  const body = issue.body ?? "";
  const channel = getChannel(labels);

  return {
    id: issue.id,
    number: issue.number,
    state: issue.state,
    title: issue.title,
    body,
    bodySections: splitBody(body),
    excerpt: cleanBody(body).slice(0, 220) || "Open the issue for the full report.",
    createdAt: issue.created_at,
    updatedAt: issue.updated_at,
    commentCount: issue.comments,
    url: issue.html_url,
    reporter: getReporter(labels, issue.user.login),
    authorLogin: issue.user.login,
    severity: getSeverity(loweredLabels),
    labels: loweredLabels,
    tags: tagsFromLabels(labels),
    channelName: channel.channelName,
    channelSlug: channel.channelSlug,
    screenshotUrls: getScreenshotUrls(body)
  };
}

async function fetchIssuesPage(page: number, state: "open" | "closed" | "all") {
  if (!GITHUB_OWNER || !GITHUB_REPO) {
    return [];
  }

  const response = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues?state=${state}&per_page=100&page=${page}`,
    {
      headers: getHeaders(),
      next: { revalidate: 60 }
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub Issues fetch failed with status ${response.status}`);
  }

  const data = (await response.json()) as GitHubIssue[];
  return data.filter((item) => !item.pull_request);
}

export function buildTagOptions(issues: BugIssue[]): TagOption[] {
  const counts = new Map<string, { tag: TagOption }>();
  for (const issue of issues) {
    for (const tag of issue.tags) {
      const prev = counts.get(tag.slug);
      if (prev) {
        prev.tag.count += 1;
      } else {
        counts.set(tag.slug, { tag: { ...tag, count: 1 } });
      }
    }
  }
  return Array.from(counts.values())
    .map((item) => item.tag)
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export async function getFeedData(): Promise<{
  issues: BugIssue[];
  channels: ChannelOption[];
  tags: TagOption[];
  githubConfigured: boolean;
}> {
  if (!GITHUB_OWNER || !GITHUB_REPO) {
    return {
      issues: [],
      channels: [],
      tags: [],
      githubConfigured: false
    };
  }

  const state = getIssueState();
  const pages = await Promise.all([fetchIssuesPage(1, state), fetchIssuesPage(2, state)]);
  const issues = pages
    .flat()
    .map(toIssue)
    .filter((issue) => passesLabelFilter(issue.labels))
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  const tags = buildTagOptions(issues);

  const issueChannels = issues
    .filter((issue) => issue.channelName && issue.channelSlug)
    .map((issue) => ({
      name: issue.channelName as string,
      slug: issue.channelSlug as string
    }));

  const configuredChannels = CHANNELS.map((channel) => ({
    name: channel.name,
    slug: channel.slug
  }));

  const channels = [...issueChannels, ...configuredChannels]
    .filter(
      (channel, index, all) =>
        all.findIndex((item) => item.slug === channel.slug) === index
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return { issues, channels, tags, githubConfigured: true };
}

export async function getIssueComments(issueNumber: number): Promise<IssueComment[]> {
  if (!GITHUB_OWNER || !GITHUB_REPO) {
    return [];
  }

  const response = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${issueNumber}/comments?per_page=100`,
    {
      headers: getHeaders(),
      next: { revalidate: 60 }
    }
  );

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as {
    id: number;
    body: string;
    created_at: string;
    html_url: string;
    user: { login: string; avatar_url: string };
  }[];

  return data.map((comment) => ({
    id: comment.id,
    body: comment.body,
    authorLogin: comment.user.login,
    authorAvatarUrl: comment.user.avatar_url,
    createdAt: comment.created_at,
    url: comment.html_url
  }));
}
