import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AdminBanner {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  category: string;
  enabled: boolean;
}

export interface AdminSource {
  id: string;
  label: string;
  url: string;
  countryCode: string;
  enabled: boolean;
}

export interface AdminChannelIcon {
  id: string;
  pattern: string;
  logoUrl: string;
}

export interface AdminConfig {
  pin: string;
  bannersEnabled: boolean;
  banners: AdminBanner[];
  sourcesEnabled: boolean;
  sources: AdminSource[];
  channelIcons: AdminChannelIcon[];
  adsCode: string;
  adsEnabled: boolean;
}

const KEY = "@streamtv_admin_config";

export const DEFAULT_ADMIN_CONFIG: AdminConfig = {
  pin: "1234",
  bannersEnabled: false,
  banners: [],
  sourcesEnabled: false,
  sources: [],
  channelIcons: [],
  adsCode: "",
  adsEnabled: false,
};

export async function loadAdminConfig(): Promise<AdminConfig> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_ADMIN_CONFIG };
    return { ...DEFAULT_ADMIN_CONFIG, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_ADMIN_CONFIG };
  }
}

export async function saveAdminConfig(config: AdminConfig): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(config));
  } catch {}
}
