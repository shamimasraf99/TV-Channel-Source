export interface Channel {
  id: string;
  name: string;
  url: string;
  logo: string;
  group: string;
  tvgId: string;
  countryCode?: string;
}

function extractAttribute(line: string, attr: string): string {
  const regex = new RegExp(`${attr}="([^"]*)"`, "i");
  const match = line.match(regex);
  return match ? match[1] : "";
}

export function parseM3U(content: string, countryCode?: string): Channel[] {
  const lines = content.split("\n").map((l) => l.trim());
  const channels: Channel[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("#EXTINF:")) {
      const commaIdx = line.lastIndexOf(",");
      const name = commaIdx >= 0 ? line.substring(commaIdx + 1).trim() : "Unknown";
      const logo = extractAttribute(line, "tvg-logo");
      const group = extractAttribute(line, "group-title");
      const tvgId = extractAttribute(line, "tvg-id");

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
        const id = `${countryCode ?? ""}-${tvgId || name}-${url.slice(-12)}`;
        channels.push({
          id,
          name,
          url,
          logo,
          group: group || "General",
          tvgId,
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
