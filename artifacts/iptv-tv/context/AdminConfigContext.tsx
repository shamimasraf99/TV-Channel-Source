import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  AdminBanner,
  AdminChannelIcon,
  AdminConfig,
  AdminSource,
  DEFAULT_ADMIN_CONFIG,
  loadAdminConfig,
  saveAdminConfig,
} from "@/utils/adminConfig";

interface AdminConfigContextValue {
  config: AdminConfig;
  isLoading: boolean;
  updateConfig: (partial: Partial<AdminConfig>) => Promise<void>;
  setBanners: (banners: AdminBanner[]) => Promise<void>;
  setSources: (sources: AdminSource[]) => Promise<void>;
  setChannelIcons: (icons: AdminChannelIcon[]) => Promise<void>;
  setAdsCode: (code: string, enabled: boolean) => Promise<void>;
  setPin: (pin: string) => Promise<void>;
}

const AdminConfigContext = createContext<AdminConfigContextValue>({
  config: DEFAULT_ADMIN_CONFIG,
  isLoading: true,
  updateConfig: async () => {},
  setBanners: async () => {},
  setSources: async () => {},
  setChannelIcons: async () => {},
  setAdsCode: async () => {},
  setPin: async () => {},
});

export function AdminConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<AdminConfig>(DEFAULT_ADMIN_CONFIG);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAdminConfig().then((c) => {
      setConfig(c);
      setIsLoading(false);
    });
  }, []);

  const updateConfig = useCallback(async (partial: Partial<AdminConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...partial };
      saveAdminConfig(next);
      return next;
    });
  }, []);

  const setBanners = useCallback(async (banners: AdminBanner[]) => {
    await updateConfig({ banners, bannersEnabled: banners.length > 0 });
  }, [updateConfig]);

  const setSources = useCallback(async (sources: AdminSource[]) => {
    await updateConfig({ sources, sourcesEnabled: sources.length > 0 });
  }, [updateConfig]);

  const setChannelIcons = useCallback(async (channelIcons: AdminChannelIcon[]) => {
    await updateConfig({ channelIcons });
  }, [updateConfig]);

  const setAdsCode = useCallback(async (adsCode: string, adsEnabled: boolean) => {
    await updateConfig({ adsCode, adsEnabled });
  }, [updateConfig]);

  const setPin = useCallback(async (pin: string) => {
    await updateConfig({ pin });
  }, [updateConfig]);

  return (
    <AdminConfigContext.Provider
      value={{ config, isLoading, updateConfig, setBanners, setSources, setChannelIcons, setAdsCode, setPin }}
    >
      {children}
    </AdminConfigContext.Provider>
  );
}

export function useAdminConfig() {
  return useContext(AdminConfigContext);
}
