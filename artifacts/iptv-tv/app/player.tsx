import { Ionicons } from "@expo/vector-icons";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    });
  }

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      <Pressable style={styles.videoArea} onPress={showControls}>
        {Platform.OS === "web" ? (
          <WebVideoPlayer
            url={url ?? ""}
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(
                "This stream may not be available in the browser. Scan the QR code to watch on your phone."
              );
            }}
          />
        ) : (
          <NativeVideoPlayer
            url={url ?? ""}
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError("Stream unavailable. Try another channel.");
            }}
          />
        )}

        {loading && !error && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Loading stream...</Text>
          </View>
        )}

        {error && (
          <View style={styles.overlay}>
            <Ionicons name="alert-circle-outline" size={48} color="#fff" />
            <Text style={styles.errorTitle}>Stream Unavailable</Text>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.backBtn} onPress={() => router.back()}>
              <Text style={styles.backBtnText}>Go Back</Text>
            </Pressable>
          </View>
        )}
      </Pressable>

      {controlsVisible && !error && (
        <View style={[styles.controls]} pointerEvents="box-none">
          <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.iconBtn, { opacity: pressed ? 0.6 : 1 }]}
              hitSlop={8}
            >
              <Ionicons name="chevron-down" size={26} color="#fff" />
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
                <View style={styles.channelLogoFallback}>
                  <Ionicons name="tv" size={18} color="#fff" />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.channelName} numberOfLines={1}>
                  {name}
                </Text>
                <View style={styles.liveBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              </View>
            </View>

            <Pressable
              onPress={handleFavorite}
              style={({ pressed }) => [styles.iconBtn, { opacity: pressed ? 0.6 : 1 }]}
              hitSlop={8}
            >
              <Ionicons
                name={favorited ? "heart" : "heart-outline"}
                size={24}
                color={favorited ? "#e11d48" : "#fff"}
              />
            </Pressable>
          </View>

          <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
            <Text style={styles.groupText}>{group}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

function WebVideoPlayer({
  url,
  onLoad,
  onError,
}: {
  url: string;
  onLoad: () => void;
  onError: () => void;
}) {
  const videoEl = React.createElement("video" as any, {
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
  });
  return <View style={styles.videoArea}>{videoEl}</View>;
}

function NativeVideoPlayer({
  url,
  onLoad,
  onError,
}: {
  url: string;
  onLoad: () => void;
  onError: () => void;
}) {
  const [mod, setMod] = useState<{
    Video: any;
    ResizeMode: any;
  } | null>(null);
  const [importFailed, setImportFailed] = useState(false);
  const videoRef = useRef<any>(null);

  useEffect(() => {
    import("expo-av")
      .then((m) => {
        setMod({ Video: m.Video, ResizeMode: m.ResizeMode });
      })
      .catch(() => {
        setImportFailed(true);
        onError();
      });
  }, []);

  if (importFailed) {
    return (
      <View style={styles.videoArea}>
        <Ionicons name="tv-outline" size={40} color="#555" />
      </View>
    );
  }

  if (!mod) {
    return (
      <View style={styles.videoArea}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  const { Video, ResizeMode } = mod;

  return (
    <Video
      ref={videoRef}
      source={{ uri: url }}
      style={styles.nativeVideo}
      resizeMode={ResizeMode.CONTAIN}
      shouldPlay
      isLooping
      useNativeControls={false}
      onLoad={onLoad}
      onError={onError}
    />
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
  nativeVideo: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.75)",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 32,
  },
  loadingText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  errorTitle: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  errorText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },
  backBtn: {
    backgroundColor: "#e11d48",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 8,
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
    paddingBottom: 12,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  channelInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
  },
  channelLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#222",
  },
  channelLogoFallback: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  channelName: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22c55e",
  },
  liveText: {
    color: "#22c55e",
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.5,
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  groupText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
});
