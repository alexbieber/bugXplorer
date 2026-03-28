import "server-only";

import { CHANNELS, resolveChannel } from "@/lib/channels";
import { BugIssue, ChannelOption } from "@/lib/types";
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

/** GitHub API: open, closed, or all (default open). Use `all` to include closed bug reports. */
function getIssueState(): "open" | "closed" | "all" {
  const raw = process.env.GITHUB_ISSUE_STATE?.trim().toLowerCase();
  if (raw === "closed" || raw === "all") {
    return raw;
  }
  return "open";
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
  title: string;
  body: string | null;
  html_url: string;
  created_at: string;
  labels: GitHubLabel[];
  user: {
    login: string;
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
    title: issue.title,
    body,
    bodySections: splitBody(body),
    excerpt: cleanBody(body).slice(0, 220) || "Open the issue for the full report.",
    createdAt: issue.created_at,
    url: issue.html_url,
    reporter: getReporter(labels, issue.user.login),
    severity: getSeverity(loweredLabels),
    labels: loweredLabels,
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

export async function getFeedData(): Promise<{
  issues: BugIssue[];
  channels: ChannelOption[];
  githubConfigured: boolean;
}> {
  if (!GITHUB_OWNER || !GITHUB_REPO) {
    return {
      issues: [],
      channels: [],
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

  return { issues, channels, githubConfigured: true };
}
