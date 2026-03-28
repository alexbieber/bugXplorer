# BugXplorer (BugFeed)

A **Medium-style** public site for community bug reports. It reads from **GitHub Issues** (for example, issues created by a Telegram bot) and never exposes Telegram chat IDs in the browser—only friendly channel names and report metadata.

**Repository:** [github.com/alexbieber/bugXplorer](https://github.com/alexbieber/bugXplorer)

**Live site:** after you deploy to Vercel, replace `YOUR-APP` in the badge below with your deployment hostname.

[![BugFeed on Vercel](https://img.shields.io/badge/BugFeed-deploy-black?style=flat-square&logo=vercel)](https://YOUR-APP.vercel.app)

## Features

- Home feed with search and channel filter
- Per-channel pages (`/channel/[slug]`)
- Article-style issue pages (`/issue/[number]`) with screenshots and severity
- ISR: data revalidates every 60 seconds

## Requirements

- Node.js 18+
- A GitHub repository with **issues** (any labels). By default **all open issues** are shown. Optional labels: `channel: …`, severity (`high`, `medium`, `low`, `critical`), reporter (`reporter: …`).

## Setup

1. Copy environment variables:

   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in:

   | Variable        | Description |
   |----------------|-------------|
   | `GITHUB_OWNER` | User or organization name |
   | `GITHUB_REPO`  | Repository containing the issues |
   | `GITHUB_TOKEN` | Fine-grained or classic PAT with `Issues: Read` (private repos need this) |
   | `GITHUB_ISSUE_STATE` | Optional. `open` (default), `closed`, or `all`. Use `all` if reports are closed and the feed looks empty. |
   | `BUGFEED_REQUIRED_LABELS` | Optional. Comma-separated labels; an issue must have at least one. If unset, every issue is listed. |

3. Map Telegram sources to display names in `lib/channels.ts` (server-side only). Issue labels like `channel: main` are resolved to these names.

4. Install and run:

   ```bash
   npm install
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com) and add the same three environment variables.
3. Deploy. Optionally set the production URL in the badge above.

## Scripts

| Command        | Description |
|----------------|-------------|
| `npm run dev`  | Development server |
| `npm run build`| Production build |
| `npm run start`| Start production server |
| `npm run lint` | ESLint |

## Architecture

```
Telegram (optional bot) → GitHub Issues → Next.js (server-side GitHub API) → public site
```

This repository is the **Next.js reader** only. A separate Telegram webhook/bot service can create issues in your target repo.

## License

MIT
