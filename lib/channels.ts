import { slugify } from "@/lib/utils";

type ChannelRecord = {
  id: string;
  name: string;
  slug: string;
};

const rawChannels = [
  {
    id: "-1001360607953",
    name: "Channel 1"
  },
  {
    id: "-1001082665434",
    name: "Channel 2"
  },
  {
    id: "-1001137382253",
    name: "Channel 3"
  },
  {
    id: "-1001001492837",
    name: "Channel 4"
  },
  {
    id: "-1001124398363",
    name: "Channel 5"
  },
  {
    id: "-1001786997021",
    name: "Channel 6"
  }
] as const;

export const CHANNELS: ChannelRecord[] = rawChannels.map((channel) => ({
  ...channel,
  slug: slugify(channel.name)
}));

function extractTelegramId(value: string) {
  const trimmed = value.trim();
  const fromUrl = trimmed.match(/#(-100\d+)/);

  if (fromUrl) {
    return fromUrl[1];
  }

  const fromId = trimmed.match(/^-100\d+$/);
  return fromId ? fromId[0] : null;
}

export function resolveChannel(value: string) {
  const telegramId = extractTelegramId(value);

  if (telegramId) {
    return CHANNELS.find((channel) => channel.id === telegramId) ?? null;
  }

  const normalized = value.replace(/^channel:/i, "").trim().toLowerCase();

  return (
    CHANNELS.find(
      (channel) =>
        channel.name.toLowerCase() === normalized || channel.slug.toLowerCase() === slugify(normalized)
    ) ?? null
  );
}
