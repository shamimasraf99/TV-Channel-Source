import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFavorites } from "@/context/FavoritesContext";
import { useColors } from "@/hooks/useColors";
import { Channel, getLogoUrl } from "@/utils/m3u-parser";
import { getLocalLogo } from "@/utils/logoMap";

function ChannelInitials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  const colors = [
    "#1d4ed8", "#7c3aed", "#be185d", "#0f766e",
    "#b45309", "#15803d", "#9333ea", "#0369a1",
  ];
  const bg = colors[name.charCodeAt(0) % colors.length];
  return (
    <View style={[styles.logoFallback, { backgroundColor: bg }]}>
      <Text style={styles.initialsText}>{initials}</Text>
    </View>
  );
}

interface Props {
  channel: Channel;
  showCountry?: boolean;
}

export function ChannelCard({ channel, showCountry }: Props) {
  const colors = useColors();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [imgError, setImgError] = useState(false);
  const favorited = isFavorite(channel.id);
  const localLogo = getLocalLogo(channel.name);
  const logoUrl = getLogoUrl(channel);
  const showRemoteImage = !localLogo && !!logoUrl && !imgError;

  function handlePress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "/player",
      params: {
        url: channel.url,
        name: channel.name,
        logo: logoUrl,
        group: channel.group,
      },
    });
  }

  function handleFavorite() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleFavorite({ ...channel, logo: logoUrl });
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.75 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
      onPress={handlePress}
    >
      <View style={styles.logoContainer}>
        {localLogo ? (
          <Image source={localLogo} style={styles.logo} resizeMode="contain" />
        ) : showRemoteImage ? (
          <Image
            source={{ uri: logoUrl }}
            style={styles.logo}
            resizeMode="contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <ChannelInitials name={channel.name} />
        )}
        <View style={[styles.liveDot, { backgroundColor: colors.live }]} />
      </View>

      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.foreground, fontFamily: "Inter_600SemiBold" }]} numberOfLines={1}>
          {channel.name}
        </Text>
        <Text style={[styles.group, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]} numberOfLines={1}>
          {channel.group}
          {showCountry && channel.countryCode ? ` · ${channel.countryCode.toUpperCase()}` : ""}
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable onPress={handleFavorite} hitSlop={8} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
          <Ionicons name={favorited ? "heart" : "heart-outline"} size={20} color={favorited ? colors.primary : colors.mutedForeground} />
        </Pressable>
        <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} style={{ marginLeft: 6 }} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    borderWidth: 1,
    gap: 12,
  },
  logoContainer: {
    position: "relative",
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#1a1a2e",
  },
  logoFallback: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  initialsText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  liveDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#09090b",
  },
  info: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: 15,
  },
  group: {
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
});
