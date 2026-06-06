import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  ImageSourcePropType,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { HeroItem } from "@/utils/categories";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HERO_HEIGHT = 280;

interface Props {
  items: HeroItem[];
  onWatchNow: (categoryKey: string) => void;
}

export function HeroBanner({ items, onWatchNow }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<ScrollView>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMounted = useRef(true);

  const advance = useCallback(() => {
    if (!isMounted.current || items.length === 0) return;
    setActiveIndex((prev) => {
      const next = (prev + 1) % items.length;
      scrollRef.current?.scrollTo({ x: next * SCREEN_WIDTH, animated: true });
      return next;
    });
  }, [items.length]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(advance, 4500);
  }, [advance]);

  useEffect(() => {
    isMounted.current = true;
    resetTimer();
    return () => {
      isMounted.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (idx !== activeIndex && idx >= 0 && idx < items.length) {
      setActiveIndex(idx);
      resetTimer();
    }
  }

  function handleWatchNow(categoryKey: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onWatchNow(categoryKey);
  }

  if (items.length === 0) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={32}
      >
        {items.map((item) => {
          const hasError = imgErrors[item.id];
          let imageSource: ImageSourcePropType | null = null;
          if (item.localImage && !hasError) {
            imageSource = item.localImage as ImageSourcePropType;
          } else if (item.image && !hasError) {
            imageSource = { uri: item.image };
          }

          return (
            <View key={item.id} style={styles.slide}>
              {imageSource ? (
                <ImageBackground
                  source={imageSource}
                  style={styles.slideBg}
                  resizeMode="cover"
                  onError={() =>
                    setImgErrors((prev) => ({ ...prev, [item.id]: true }))
                  }
                >
                  <View style={styles.overlay} />
                  <SlideContent item={item} onWatchNow={handleWatchNow} />
                </ImageBackground>
              ) : (
                <View style={[styles.slideBg, styles.slideFallback]}>
                  <SlideContent item={item} onWatchNow={handleWatchNow} />
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.dots}>
        {items.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === activeIndex ? styles.dotActive : styles.dotInactive]}
          />
        ))}
      </View>
    </View>
  );
}

function SlideContent({
  item,
  onWatchNow,
}: {
  item: HeroItem;
  onWatchNow: (cat: string) => void;
}) {
  return (
    <View style={styles.slideContent}>
      <View style={styles.badge}>
        <View style={styles.badgeDot} />
        <Text style={styles.badgeText}>{item.badge}</Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      {!!item.subtitle && (
        <Text style={styles.subtitle} numberOfLines={2}>{item.subtitle}</Text>
      )}
      <Pressable
        style={({ pressed }) => [styles.watchBtn, { opacity: pressed ? 0.8 : 1 }]}
        onPress={() => onWatchNow(item.category)}
      >
        <Ionicons name="play" size={16} color="#09090d" />
        <Text style={styles.watchBtnText}>এখন দেখুন</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: SCREEN_WIDTH, height: HERO_HEIGHT },
  slide: { width: SCREEN_WIDTH, height: HERO_HEIGHT },
  slideBg: { width: SCREEN_WIDTH, height: HERO_HEIGHT, justifyContent: "flex-end" },
  slideFallback: { backgroundColor: "#0d1117" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(9,9,13,0.52)" },
  slideContent: { paddingHorizontal: 18, paddingBottom: 28, gap: 8, position: "relative" },
  badge: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#e11d48",
    alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 20, gap: 6, marginBottom: 4,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#fff" },
  badgeText: { color: "#fff", fontSize: 12, fontFamily: "Inter_600SemiBold" },
  title: { color: "#ffffff", fontSize: 24, fontFamily: "Inter_700Bold", lineHeight: 32 },
  subtitle: { color: "rgba(255,255,255,0.78)", fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
  watchBtn: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#ffffff",
    alignSelf: "flex-start", paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: 24, gap: 8, marginTop: 4,
  },
  watchBtnText: { color: "#09090d", fontSize: 14, fontFamily: "Inter_600SemiBold" },
  dots: { position: "absolute", bottom: 12, right: 16, flexDirection: "row", gap: 5 },
  dot: { height: 4, borderRadius: 2 },
  dotActive: { width: 20, backgroundColor: "#e11d48" },
  dotInactive: { width: 8, backgroundColor: "rgba(255,255,255,0.3)" },
});
