import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFavorites } from "@/context/FavoritesContext";
import { useAdminConfig } from "@/context/AdminConfigContext";
import { useColors } from "@/hooks/useColors";
import { Channel, getLogoUrl } from "@/utils/m3u-parser";
import { getLocalLogo } from "@/utils/logoMap";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

interface Props {
  channel: Channel;
}

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
  const colorIndex = name.charCodeAt(0) % colors.length;
  const bg = colors[colorIndex];

  return (
    <View style={[styles.initialsBox, { backgroundColor: bg }]}>
      <Text style={styles.initialsText}>{initials}</Text>
    </View>
  );
}

export function ChannelGridCard({ channel }: Props) {
  const colors = useColors();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { config } = useAdminConfig();
  const [imgError, setImgError] = useState(false);
  const favorited = isFavorite(channel.id);

  const adminOverrideLogo = useMemo(() => {
    if (config.channelIcons.length === 0) return null;
    const nameLower = channel.name.toLowerCase();
    const match = config.channelIcons.find((ic) => nameLower.includes(ic.pattern.toLowerCase()));
    return match?.logoUrl ?? null;
  }, [config.channelIcons, channel.name]);

  const localLogo = getLocalLogo(channel.name);
  const logoUrl = adminOverrideLogo ?? getLogoUrl(channel);

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

  const useAdminImg = !!adminOverrideLogo && !imgError;
  const showRemoteImage = !useAdminImg && !localLogo && !!logoUrl && !imgError;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.8 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
      ]}
      onPress={handlePress}
      testID={`channel-grid-${channel.id}`}
    >
      <View style={styles.topRow}>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>লাইভ</Text>
        </View>
        <Pressable
          onPress={handleFavorite}
          hitSlop={8}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <Ionicons
            name={favorited ? "heart" : "heart-outline"}
            size={14}
            color={favorited ? "#e11d48" : "#71717a"}
          />
        </Pressable>
      </View>

      <View style={styles.logoContainer}>
        {useAdminImg ? (
          <Image
            source={{ uri: adminOverrideLogo! }}
            style={styles.logo}
            resizeMode="contain"
            onError={() => setImgError(true)}
          />
        ) : localLogo ? (
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
      </View>

      <Text
        style={[styles.name, { color: colors.foreground }]}
        numberOfLines={2}
      >
        {channel.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    gap: 8,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#e11d48",
  },
  liveText: {
    color: "#e11d48",
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.3,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 64,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#1a1a24",
  },
  logo: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  initialsBox: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  initialsText: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1,
  },
  name: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
    lineHeight: 17,
  },
});
