import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFavorites } from "@/context/FavoritesContext";

export default function PlayerScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { url, name, logo, group } = useLocalSearchParams<{
    url: string;
    name: string;
    logo: string;
    group: string;
  }>();

  const { isFavorite, toggleFavorite } = useFavorites();
  const [status, setStatus] = useState<"loading" | "playing" | "error">("loading");
  const [logoError, setLogoError] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRef = useRef<Video>(null);

  const channelId = `${name}-${(url ?? "").slice(-8)}`;
  const favorited = isFavorite(channelId);

  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => {
      setControlsVisible(false);
    }, 4000);
  }, []);

  useEffect(() => {
    showControls();
    return () => {
      if (controlsTimer.current) clearTimeout(controlsTimer.current);
    };
  }, [showControls]);

  function handleFavorite() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleFavorite({
      id: channelId,
      name: name ?? "",
      url: url ?? "",
      logo: logo ?? "",
      group: group ?? "",
      tvgId: "",
      channelId: "",
    });
  }

  return (
    <View style={styles.root}>
      <StatusBar hidden />

      <Pressable style={styles.videoArea} onPress={showControls}>
        {Platform.OS === "web" ? (
          <WebPlayer
            url={url ?? ""}
            onLoad={() => setStatus("playing")}
            onError={() => setStatus("error")}
          />
        ) : (
          <Video
            ref={videoRef}
            source={{ uri: url ?? "" }}
            style={styles.video}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
            isLooping={false}
            useNativeControls={false}
            onLoad={() => setStatus("playing")}
            onError={() => setStatus("error")}
            onPlaybackStatusUpdate={(s) => {
              if (s.isLoaded && !s.isBuffering && status === "loading") {
                setStatus("playing");
              }
            }}
          />
        )}

        {status === "loading" && (
          <View style={styles.overlay} pointerEvents="none">
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.overlayText}>স্ট্রিম লোড হচ্ছে...</Text>
          </View>
        )}

        {status === "error" && (
          <View style={styles.overlay}>
            <Ionicons name="alert-circle-outline" size={52} color="#fff" />
            <Text style={styles.errorTitle}>স্ট্রিম পাওয়া যাচ্ছে না</Text>
            <Text style={styles.errorSub}>
              {Platform.OS === "web"
                ? "এই চ্যানেলটি ব্রাউজারে চলছে না। মোবাইলে Expo Go দিয়ে দেখুন।"
                : "এই চ্যানেলটি এই মুহূর্তে উপলব্ধ নেই। অন্য চ্যানেল চেষ্টা করুন।"}
            </Text>
            <Pressable style={styles.backBtn} onPress={() => router.back()}>
              <Text style={styles.backBtnText}>ফিরে যান</Text>
            </Pressable>
          </View>
        )}
      </Pressable>

      {controlsVisible && status !== "error" && (
        <View style={styles.controls} pointerEvents="box-none">
          <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.iconBtn, { opacity: pressed ? 0.6 : 1 }]}
              hitSlop={12}
            >
              <Ionicons name="chevron-down" size={28} color="#fff" />
            </Pressable>

            <View style={styles.channelInfo}>
              {logo && !logoError ? (
                <Image
                  source={{ uri: logo }}
                  style={styles.channelLogo}
                  resizeMode="contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <ChannelInitials name={name ?? "TV"} />
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.channelName} numberOfLines={1}>
                  {name}
                </Text>
                <View style={styles.liveBadge}>
                  <View style={[styles.liveDot, { backgroundColor: status === "playing" ? "#22c55e" : "#f59e0b" }]} />
                  <Text style={[styles.liveText, { color: status === "playing" ? "#22c55e" : "#f59e0b" }]}>
                    {status === "playing" ? "লাইভ" : "লোড হচ্ছে..."}
                  </Text>
                </View>
              </View>
            </View>

            <Pressable
              onPress={handleFavorite}
              style={({ pressed }) => [styles.iconBtn, { opacity: pressed ? 0.6 : 1 }]}
              hitSlop={12}
            >
              <Ionicons
                name={favorited ? "heart" : "heart-outline"}
                size={24}
                color={favorited ? "#e11d48" : "#fff"}
              />
            </Pressable>
          </View>

          <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
            <Text style={styles.groupLabel}>{group}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

function ChannelInitials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  const colorList = ["#1d4ed8", "#7c3aed", "#be185d", "#0f766e", "#b45309"];
  const bg = colorList[name.charCodeAt(0) % colorList.length];
  return (
    <View style={[styles.channelLogoFallback, { backgroundColor: bg }]}>
      <Text style={styles.initialsText}>{initials}</Text>
    </View>
  );
}

function WebPlayer({
  url,
  onLoad,
  onError,
}: {
  url: string;
  onLoad: () => void;
  onError: () => void;
}) {
  return (
    <View style={styles.videoArea}>
      {React.createElement("video" as any, {
        src: url,
        autoPlay: true,
        controls: true,
        style: {
          width: "100%",
          height: "100%",
          objectFit: "contain",
          backgroundColor: "#000",
        },
        onCanPlay: onLoad,
        onError: onError,
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
  },
  videoArea: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.8)",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    paddingHorizontal: 32,
  },
  overlayText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  errorTitle: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  errorSub: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },
  backBtn: {
    backgroundColor: "#e11d48",
    paddingHorizontal: 28,
    paddingVertical: 11,
    borderRadius: 24,
    marginTop: 6,
  },
  backBtnText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  controls: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    pointerEvents: "box-none" as any,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  channelInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
  },
  channelLogo: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: "#222",
  },
  channelLogoFallback: {
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  initialsText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },
  channelName: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 3,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  liveText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.4,
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomBar: {
    paddingHorizontal: 18,
    paddingTop: 12,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  groupLabel: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
});
