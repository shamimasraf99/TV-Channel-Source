import { ImageSourcePropType } from "react-native";

const LOGO_MAP: Array<{ patterns: string[]; source: ImageSourcePropType }> = [
  {
    patterns: ["t sports", "tsports", "t-sports"],
    source: require("@/assets/logos/t_sports.png"),
  },
];

export function getLocalLogo(channelName: string): ImageSourcePropType | null {
  const lower = channelName.toLowerCase();
  for (const entry of LOGO_MAP) {
    if (entry.patterns.some((p) => lower.includes(p))) {
      return entry.source;
    }
  }
  return null;
}
