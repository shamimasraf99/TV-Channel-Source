import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFavorites } from "@/context/FavoritesContext";
import { useColors } from "@/hooks/useColors";
import { Channel } from "@/utils/m3u-parser";

interface Props {
  channel: Channel;
  showCountry?: boolean;
}

export function ChannelCard({ channel, showCountry }: Props) {
  const colors = useColors();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [imgError, setImgError] = useState(false);
  const favorited = isFavorite(channel.id);

  function handlePress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "/player",
      params: {
        url: channel.url,
        name: channel.name,
        logo: channel.logo,
        group: channel.group,
      },
    });
  }

  function handleFavorite() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleFavorite(channel);
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
      testID={`channel-card-${channel.id}`}
    >
      <View style={styles.logoContainer}>
        {channel.logo && !imgError ? (
          <Image
            source={{ uri: channel.logo }}
            style={styles.logo}
            resizeMode="contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <View style={[styles.logoFallback, { backgroundColor: colors.muted }]}>
            <Ionicons name="tv-outline" size={22} color={colors.mutedForeground} />
          </View>
        )}
        <View style={[styles.liveDot, { backgroundColor: colors.live }]} />
      </View>

      <View style={styles.info}>
        <Text
          style={[styles.name, { color: colors.foreground, fontFamily: "Inter_600SemiBold" }]}
          numberOfLines={1}
        >
          {channel.name}
        </Text>
        <Text
          style={[styles.group, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}
          numberOfLines={1}
        >
          {channel.group}
          {showCountry && channel.countryCode
            ? ` · ${channel.countryCode.toUpperCase()}`
            : ""}
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={handleFavorite}
          hitSlop={8}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <Ionicons
            name={favorited ? "heart" : "heart-outline"}
            size={20}
            color={favorited ? colors.primary : colors.mutedForeground}
          />
        </Pressable>
        <Ionicons
          name="chevron-forward"
          size={16}
          color={colors.mutedForeground}
          style={{ marginLeft: 6 }}
        />
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
