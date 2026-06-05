import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Channel } from "@/utils/m3u-parser";

const FAVORITES_KEY = "@streamtv_favorites";

interface FavoritesContextValue {
  favorites: Channel[];
  isFavorite: (channelId: string) => boolean;
  addFavorite: (channel: Channel) => void;
  removeFavorite: (channelId: string) => void;
  toggleFavorite: (channel: Channel) => void;
}

const FavoritesContext = createContext<FavoritesContextValue>({
  favorites: [],
  isFavorite: () => false,
  addFavorite: () => {},
  removeFavorite: () => {},
  toggleFavorite: () => {},
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Channel[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(FAVORITES_KEY)
      .then((data) => {
        if (data) setFavorites(JSON.parse(data));
      })
      .catch(() => {});
  }, []);

  const persist = useCallback((channels: Channel[]) => {
    AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(channels)).catch(() => {});
  }, []);

  const isFavorite = useCallback(
    (channelId: string) => favorites.some((f) => f.id === channelId),
    [favorites]
  );

  const addFavorite = useCallback(
    (channel: Channel) => {
      setFavorites((prev) => {
        if (prev.some((f) => f.id === channel.id)) return prev;
        const next = [channel, ...prev];
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const removeFavorite = useCallback(
    (channelId: string) => {
      setFavorites((prev) => {
        const next = prev.filter((f) => f.id !== channelId);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const toggleFavorite = useCallback(
    (channel: Channel) => {
      if (isFavorite(channel.id)) {
        removeFavorite(channel.id);
      } else {
        addFavorite(channel);
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  return (
    <FavoritesContext.Provider
      value={{ favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
