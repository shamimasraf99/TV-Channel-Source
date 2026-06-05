import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { HERO_ITEMS } from "@/utils/categories";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HERO_HEIGHT = 280;

interface Props {
  onWatchNow: (categoryKey: string) => void;
}

export function HeroBanner({ onWatchNow }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatRef = useRef<FlatList<(typeof HERO_ITEMS)[0]>>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % HERO_ITEMS.length;
        flatRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(idx);
    startTimer();
  }

  function handleWatchNow(categoryKey: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onWatchNow(categoryKey);
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatRef}
        data={HERO_ITEMS}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <HeroSlide item={item} onWatchNow={handleWatchNow} />
        )}
      />
      <View style={styles.dots}>
        {HERO_ITEMS.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === activeIndex ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

function HeroSlide({
  item,
  onWatchNow,
}: {
  item: (typeof HERO_ITEMS)[0];
  onWatchNow: (cat: string) => void;
}) {
  const [imgError, setImgError] = useState(false);

  const content = (
    <LinearGradient
      colors={["transparent", "rgba(9,9,13,0.85)", "#09090d"]}
      locations={[0, 0.55, 1]}
      style={styles.gradient}
    >
      <View style={styles.slideContent}>
        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>{item.badge}</Text>
        </View>
        <Text style={styles.title}>{item.title}</Text>
        {item.subtitle ? (
          <Text style={styles.subtitle} numberOfLines={2}>
            {item.subtitle}
          </Text>
        ) : null}
        <Pressable
          style={({ pressed }) => [styles.watchBtn, { opacity: pressed ? 0.8 : 1 }]}
          onPress={() => onWatchNow(item.category)}
        >
          <Ionicons name="play" size={16} color="#09090d" />
          <Text style={styles.watchBtnText}>এখন দেখুন</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );

  if (item.image && !imgError) {
    return (
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.slide}
        resizeMode="cover"
        onError={() => setImgError(true)}
      >
        {content}
      </ImageBackground>
    );
  }

  return (
    <View style={[styles.slide, styles.slideFallback]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: HERO_HEIGHT,
  },
  slide: {
    width: SCREEN_WIDTH,
    height: HERO_HEIGHT,
    backgroundColor: "#14141e",
  },
  slideFallback: {
    backgroundColor: "#0d1117",
  },
  gradient: {
    flex: 1,
    justifyContent: "flex-end",
  },
  slideContent: {
    paddingHorizontal: 18,
    paddingBottom: 28,
    gap: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e11d48",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
    marginBottom: 4,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#fff",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  title: {
    color: "#ffffff",
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    lineHeight: 34,
  },
  subtitle: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
  },
  watchBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    alignSelf: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
    marginTop: 4,
  },
  watchBtnText: {
    color: "#09090d",
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  dots: {
    position: "absolute",
    bottom: 12,
    right: 16,
    flexDirection: "row",
    gap: 5,
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
  dotActive: {
    width: 20,
    backgroundColor: "#e11d48",
  },
  dotInactive: {
    width: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
});
