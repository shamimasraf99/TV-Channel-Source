export interface Channel {
  id: string;
  name: string;
  url: string;
  logo: string;
  group: string;
  tvgId: string;
  channelId: string;
  countryCode?: string;
}

function extractAttribute(line: string, attr: string): string {
  const regex = new RegExp(`${attr}="([^"]*)"`, "gi");
  let lastValue = "";
  let match: RegExpExecArray | null;
  while ((match = regex.exec(line)) !== null) {
    if (match[1]) lastValue = match[1];
  }
  if (!lastValue) {
    const firstMatch = line.match(new RegExp(`${attr}="([^"]*)"`, "i"));
    return firstMatch ? firstMatch[1] : "";
  }
  return lastValue;
}

function extractBaseChannelId(tvgId: string): string {
  return tvgId.split("@")[0].trim();
}

export function getLogoUrl(channel: Channel): string {
  if (channel.logo) return channel.logo;
  if (channel.channelId) {
    return `https://raw.githubusercontent.com/iptv-org/database/master/images/${channel.channelId}.png`;
  }
  return "";
}

export function parseM3U(content: string, countryCode?: string): Channel[] {
  const lines = content.split("\n").map((l) => l.trim());
  const channels: Channel[] = [];
  const seenIds = new Set<string>();
  let idx = 0;

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("#EXTINF:")) {
      const commaIdx = line.lastIndexOf(",");
      const name = commaIdx >= 0 ? line.substring(commaIdx + 1).trim() : "Unknown";
      const logo = extractAttribute(line, "tvg-logo");
      const group = extractAttribute(line, "group-title");
      const tvgId = extractAttribute(line, "tvg-id");
      const channelId = extractBaseChannelId(tvgId);

      let url = "";
      let j = i + 1;
      while (j < lines.length) {
        const nextLine = lines[j];
        if (nextLine && !nextLine.startsWith("#")) {
          url = nextLine.trim();
          i = j;
          break;
        }
        j++;
      }

      if (url && name) {
        const safeId = (channelId || name).replace(/[^a-zA-Z0-9._-]/g, "_");
        const urlSuffix = url.replace(/[^a-zA-Z0-9]/g, "").slice(-12);
        let id = `${countryCode ?? "x"}-${safeId}-${urlSuffix}`;
        if (seenIds.has(id)) {
          id = `${id}-${++idx}`;
        }
        seenIds.add(id);
        channels.push({
          id,
          name,
          url,
          logo,
          group: group || "General",
          tvgId,
          channelId,
          countryCode,
        });
      }
    }

    i++;
  }

  return channels;
}

export function filterChannels(channels: Channel[], query: string): Channel[] {
  const q = query.toLowerCase().trim();
  if (!q) return channels;
  return channels.filter(
    (ch) =>
      ch.name.toLowerCase().includes(q) ||
      ch.group.toLowerCase().includes(q)
  );
}

export function groupByCategory(channels: Channel[]): Record<string, Channel[]> {
  return channels.reduce(
    (acc, ch) => {
      const group = ch.group || "General";
      if (!acc[group]) acc[group] = [];
      acc[group].push(ch);
      return acc;
    },
    {} as Record<string, Channel[]>
  );
}
