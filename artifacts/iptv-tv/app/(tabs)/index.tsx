import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChannelGridCard } from "@/components/ChannelGridCard";
import { HeroBanner } from "@/components/HeroBanner";
import { useAdminConfig } from "@/context/AdminConfigContext";
import { useColors } from "@/hooks/useColors";
import { AdminBanner } from "@/utils/adminConfig";
import { CATEGORIES, Category, HERO_ITEMS, HeroItem, matchesCategory } from "@/utils/categories";
import { Channel, parseM3U } from "@/utils/m3u-parser";
import { ALL_SOURCES, StreamSource } from "@/utils/sources";

function adminBannerToHeroItem(b: AdminBanner): HeroItem {
  return { id: b.id, badge: b.badge, title: b.title, subtitle: b.subtitle, image: b.imageUrl, category: b.category };
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { config } = useAdminConfig();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>(CATEGORIES[0]);
  const [menuVisible, setMenuVisible] = useState(false);
  const sourcesRef = useRef<StreamSource[]>(ALL_SOURCES);

  const activeSources: StreamSource[] = useMemo(() => {
    if (config.sourcesEnabled && config.sources.length > 0) {
      return config.sources
        .filter((s) => s.enabled)
        .map((s) => ({ url: s.url, label: s.label, countryCode: s.countryCode }));
    }
    return ALL_SOURCES;
  }, [config.sourcesEnabled, config.sources]);

  const heroBanners: HeroItem[] = useMemo(() => {
    if (config.bannersEnabled && config.banners.length > 0) {
      return config.banners.filter((b) => b.enabled).map(adminBannerToHeroItem);
    }
    return HERO_ITEMS;
  }, [config.bannersEnabled, config.banners]);

  const loadChannels = useCallback(async () => {
    setLoading(true);
    setError(null);
    const sources = sourcesRef.current;

    const buckets: Channel[][] = sources.map(() => []);
    let resolved = 0;

    const fetches = sources.map(async (source, i) => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      try {
        const res = await fetch(source.url, { signal: controller.signal });
        clearTimeout(timer);
        if (!res.ok) return;
        const text = await res.text();
        buckets[i] = parseM3U(text, source.countryCode);
        resolved++;
        const merged = ([] as Channel[]).concat(...buckets);
        setChannels([...merged]);
        if (resolved === 1) setLoading(false);
      } catch {
        clearTimeout(timer);
      }
    });

    await Promise.all(fetches);

    const merged = ([] as Channel[]).concat(...buckets);
    if (merged.length === 0) {
      setError("চ্যানেল লোড হয়নি। পুনরায় চেষ্টা করুন।");
    } else {
      setChannels([...merged]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    sourcesRef.current = activeSources;
    loadChannels();
  }, [activeSources, loadChannels]);

  const filtered = useMemo(() => {
    if (selectedCategory.key === "all") return channels;
    return channels.filter((ch) => matchesCategory(ch.name, ch.group, selectedCategory));
  }, [channels, selectedCategory]);

  const dedupe = useCallback((list: Channel[]) => {
    const seen = new Set<string>();
    return list.filter((ch) => {
      if (seen.has(ch.url)) return false;
      seen.add(ch.url);
      return true;
    });
  }, []);

  const sportsChannels = useMemo(
    () => dedupe(channels.filter((ch) => matchesCategory(ch.name, ch.group, CATEGORIES[1]))).slice(0, 12),
    [channels, dedupe]
  );
  const banglaChannels = useMemo(
    () => dedupe(channels.filter((ch) => matchesCategory(ch.name, ch.group, CATEGORIES[3]))).slice(0, 12),
    [channels, dedupe]
  );
  const newsChannels = useMemo(
    () => dedupe(channels.filter((ch) => matchesCategory(ch.name, ch.group, CATEGORIES[4]))).slice(0, 12),
    [channels, dedupe]
  );

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : insets.bottom + 84;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8, backgroundColor: colors.background }]}>
        <Text style={[styles.appName, { color: colors.primary }]}>StreamTV</Text>
        <Pressable onPress={() => setMenuVisible(true)} hitSlop={8}>
          <Ionicons name="menu" size={26} color={colors.foreground} />
        </Pressable>
      </View>

      {config.adsEnabled && !!config.adsCode && Platform.OS === "web" && (
        <AdsInjector code={config.adsCode} />
      )}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>চ্যানেল লোড হচ্ছে...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Ionicons name="wifi-outline" size={44} color={colors.mutedForeground} />
          <Text style={[styles.errorText, { color: colors.mutedForeground }]}>{error}</Text>
          <Pressable onPress={loadChannels} style={[styles.retryBtn, { backgroundColor: colors.primary }]}>
            <Text style={{ color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" }}>পুনরায় চেষ্টা করুন</Text>
          </Pressable>
        </View>
      ) : selectedCategory.key === "all" ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: bottomPad }}
          stickyHeaderIndices={[1]}
        >
          <HeroBanner
            items={heroBanners}
            onWatchNow={(cat) => {
              const found = CATEGORIES.find((c) => c.key === cat) ?? CATEGORIES[0];
              setSelectedCategory(found);
            }}
          />
          <CategoryPills selected={selectedCategory} onSelect={setSelectedCategory} bg={colors.background} />
          <ChannelSection title="স্পোর্টস" channels={sportsChannels} onSeeAll={() => setSelectedCategory(CATEGORIES[1])} />
          <ChannelSection title="বাংলা চ্যানেল" channels={banglaChannels} onSeeAll={() => setSelectedCategory(CATEGORIES[3])} />
          <ChannelSection title="সংবাদ" channels={newsChannels} onSeeAll={() => setSelectedCategory(CATEGORIES[4])} />
        </ScrollView>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={[styles.gridContent, { paddingBottom: bottomPad }]}
          scrollEnabled={!!filtered.length}
          ListHeaderComponent={
            <CategoryPills selected={selectedCategory} onSelect={setSelectedCategory} bg={colors.background} />
          }
          stickyHeaderIndices={[0]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="tv-outline" size={40} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>কোনো চ্যানেল পাওয়া যায়নি</Text>
            </View>
          }
          renderItem={({ item }) => <ChannelGridCard channel={item} />}
        />
      )}

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.menuOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuBox}>
            <Text style={styles.menuTitle}>StreamTV</Text>
            <Pressable
              style={styles.menuItem}
              onPress={() => { setMenuVisible(false); router.push("/admin"); }}
            >
              <Ionicons name="shield-checkmark-outline" size={20} color="#e11d48" />
              <Text style={styles.menuItemText}>Admin Panel</Text>
              <Ionicons name="chevron-forward" size={16} color="#444" />
            </Pressable>
            <Pressable style={styles.menuItem} onPress={() => { setMenuVisible(false); loadChannels(); }}>
              <Ionicons name="refresh-outline" size={20} color="#71717a" />
              <Text style={styles.menuItemText}>চ্যানেল রিফ্রেশ</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

function AdsInjector({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = code;
    const scripts = ref.current.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) => newScript.setAttribute(attr.name, attr.value));
      newScript.textContent = oldScript.textContent;
      oldScript.replaceWith(newScript);
    });
  }, [code]);
  if (Platform.OS !== "web") return null;
  return <div ref={ref as any} style={{ width: "100%", overflow: "hidden" }} />;
}

function CategoryPills({ selected, onSelect, bg }: { selected: Category; onSelect: (c: Category) => void; bg: string }) {
  const colors = useColors();
  return (
    <View style={[styles.pillsWrapper, { backgroundColor: bg }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsRow}>
        {CATEGORIES.map((cat) => {
          const active = selected.key === cat.key;
          return (
            <Pressable
              key={cat.key}
              style={[styles.pill, { backgroundColor: active ? colors.pillActive : colors.pill, borderColor: active ? colors.pillActive : colors.border }]}
              onPress={() => onSelect(cat)}
            >
              <Text style={[styles.pillText, { color: active ? "#fff" : colors.mutedForeground }]}>{cat.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

function ChannelSection({ title, channels, onSeeAll }: { title: string; channels: Channel[]; onSeeAll: () => void }) {
  const colors = useColors();
  if (channels.length === 0) return null;
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
        <Pressable onPress={onSeeAll} hitSlop={8}>
          <Text style={[styles.seeAll, { color: colors.primary }]}>সব দেখুন &gt;</Text>
        </Pressable>
      </View>
      <View style={styles.gridWrap}>
        {channels.slice(0, 6).map((ch) => (
          <ChannelGridCard key={ch.id} channel={ch} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 18, paddingBottom: 10,
  },
  appName: { fontSize: 20, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, paddingHorizontal: 32 },
  loadingText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  errorText: { fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center" },
  retryBtn: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10, marginTop: 4 },
  pillsWrapper: { paddingVertical: 12 },
  pillsRow: { paddingHorizontal: 16, gap: 8, flexDirection: "row" },
  pill: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 22, borderWidth: 1 },
  pillText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  section: { marginTop: 8, marginBottom: 4 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  seeAll: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  gridWrap: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 16, gap: 12 },
  row: { paddingHorizontal: 16, gap: 12, marginBottom: 12 },
  gridContent: { paddingTop: 4 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center", marginTop: 32 },
  menuOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-start", alignItems: "flex-end", paddingTop: 80, paddingRight: 16 },
  menuBox: { backgroundColor: "#111118", borderRadius: 14, borderWidth: 1, borderColor: "#1e1e2a", minWidth: 220, overflow: "hidden" },
  menuTitle: { color: "#71717a", fontSize: 12, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.8, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  menuItem: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: 1, borderTopColor: "#1e1e2a" },
  menuItemText: { flex: 1, color: "#fff", fontSize: 15, fontFamily: "Inter_500Medium" },
});
