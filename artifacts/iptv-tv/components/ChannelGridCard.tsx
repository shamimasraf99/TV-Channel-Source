import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFavorites } from "@/context/FavoritesContext";
import { useColors } from "@/hooks/useColors";
import { Channel } from "@/utils/m3u-parser";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

interface Props {
  channel: Channel;
}

export function ChannelGridCard({ channel }: Props) {
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
      <View style={styles.liveBadge}>
        <View style={styles.liveDot} />
        <Text style={styles.liveText}>লাইভ</Text>
      </View>

      <Pressable
        style={[styles.favBtn, { opacity: favorited ? 1 : 0.5 }]}
        onPress={handleFavorite}
        hitSlop={6}
      >
        <Ionicons
          name={favorited ? "heart" : "heart-outline"}
          size={14}
          color={favorited ? "#e11d48" : "#fff"}
        />
      </Pressable>

      <View style={styles.logoContainer}>
        {channel.logo && !imgError ? (
          <Image
            source={{ uri: channel.logo }}
            style={styles.logo}
            resizeMode="contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <View style={styles.logoFallback}>
            <Ionicons name="tv-outline" size={28} color="#444" />
          </View>
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
    position: "relative",
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e11d48",
  },
  liveText: {
    color: "#e11d48",
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.3,
  },
  favBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 64,
  },
  logo: {
    width: "100%",
    height: 64,
    borderRadius: 6,
    backgroundColor: "#1a1a24",
  },
  logoFallback: {
    width: "100%",
    height: 64,
    backgroundColor: "#1a1a24",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
    lineHeight: 18,
  },
});
