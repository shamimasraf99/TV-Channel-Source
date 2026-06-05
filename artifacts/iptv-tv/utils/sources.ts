export interface StreamSource {
  url: string;
  label: string;
  countryCode: string;
}

export const PRIMARY_SOURCES: StreamSource[] = [
  {
    url: "https://raw.githubusercontent.com/FunctionError/PiratesTv/main/combined_playlist.m3u",
    label: "Bengali & South Asian",
    countryCode: "bd",
  },
];

export const SECONDARY_SOURCES: StreamSource[] = [
  {
    url: "https://raw.githubusercontent.com/iptv-org/iptv/master/streams/in.m3u",
    label: "India",
    countryCode: "in",
  },
  {
    url: "https://raw.githubusercontent.com/iptv-org/iptv/master/streams/pk.m3u",
    label: "Pakistan",
    countryCode: "pk",
  },
];

export const ALL_SOURCES = [...PRIMARY_SOURCES, ...SECONDARY_SOURCES];
