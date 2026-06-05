import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
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
import { useColors } from "@/hooks/useColors";
import { CATEGORIES, Category, matchesCategory } from "@/utils/categories";
import { getStreamUrl } from "@/utils/countries";
import { Channel, parseM3U } from "@/utils/m3u-parser";

const SOURCE_COUNTRIES = ["in", "pk", "us", "gb"];

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>(CATEGORIES[0]);
  const pillsRef = useRef<ScrollView>(null);

  const loadChannels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const all: Channel[] = [];
      await Promise.all(
        SOURCE_COUNTRIES.map(async (code) => {
          try {
            const res = await fetch(getStreamUrl(code));
            if (!res.ok) return;
            const text = await res.text();
            const parsed = parseM3U(text, code);
            all.push(...parsed);
          } catch {
          }
        })
      );
      setChannels(all);
    } catch {
      setError("চ্যানেল লোড হয়নি। পুনরায় চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChannels();
  }, [loadChannels]);

  const filtered = useMemo(() => {
    if (selectedCategory.key === "all") return channels;
    return channels.filter((ch) =>
      matchesCategory(ch.name, ch.group, selectedCategory)
    );
  }, [channels, selectedCategory]);

  const sportsChannels = useMemo(
    () => channels.filter((ch) => matchesCategory(ch.name, ch.group, CATEGORIES[1])).slice(0, 12),
    [channels]
  );

  const newsChannels = useMemo(
    () => channels.filter((ch) => matchesCategory(ch.name, ch.group, CATEGORIES[3])).slice(0, 12),
    [channels]
  );

  const iplChannels = useMemo(
    () => channels.filter((ch) => matchesCategory(ch.name, ch.group, CATEGORIES[2])).slice(0, 12),
    [channels]
  );

  function handleCategorySelect(cat: Category) {
    setSelectedCategory(cat);
  }

  function handleWatchNow(categoryKey: string) {
    const cat = CATEGORIES.find((c) => c.key === categoryKey) ?? CATEGORIES[0];
    setSelectedCategory(cat);
  }

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : insets.bottom + 84;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 8, backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.appName, { color: colors.primary }]}>StreamTV</Text>
        <Pressable hitSlop={8}>
          <Ionicons name="menu" size={26} color={colors.foreground} />
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
            চ্যানেল লোড হচ্ছে...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Ionicons name="wifi-outline" size={44} color={colors.mutedForeground} />
          <Text style={[styles.errorText, { color: colors.mutedForeground }]}>{error}</Text>
          <Pressable
            onPress={loadChannels}
            style={[styles.retryBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.retryBtnText, { color: "#fff" }]}>পুনরায় চেষ্টা করুন</Text>
          </Pressable>
        </View>
      ) : selectedCategory.key === "all" ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: bottomPad }}
          stickyHeaderIndices={[1]}
        >
          <HeroBanner onWatchNow={handleWatchNow} />
          <CategoryPills
            selected={selectedCategory}
            onSelect={handleCategorySelect}
            backgroundColor={colors.background}
          />
          <ChannelSection title="স্পোর্টস" channels={sportsChannels} onSeeAll={() => handleCategorySelect(CATEGORIES[1])} />
          <ChannelSection title="আইপিএল ২০২৬" channels={iplChannels} onSeeAll={() => handleCategorySelect(CATEGORIES[2])} />
          <ChannelSection title="সংবাদ" channels={newsChannels} onSeeAll={() => handleCategorySelect(CATEGORIES[3])} />
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
            <CategoryPills
              selected={selectedCategory}
              onSelect={handleCategorySelect}
              backgroundColor={colors.background}
            />
          }
          stickyHeaderIndices={[0]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="tv-outline" size={40} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                কোনো চ্যানেল পাওয়া যায়নি
              </Text>
            </View>
          }
          renderItem={({ item }) => <ChannelGridCard channel={item} />}
        />
      )}
    </View>
  );
}

function CategoryPills({
  selected,
  onSelect,
  backgroundColor,
}: {
  selected: Category;
  onSelect: (cat: Category) => void;
  backgroundColor: string;
}) {
  const colors = useColors();
  return (
    <View style={[styles.pillsWrapper, { backgroundColor }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillsRow}
      >
        {CATEGORIES.map((cat) => {
          const active = selected.key === cat.key;
          return (
            <Pressable
              key={cat.key}
              style={[
                styles.pill,
                {
                  backgroundColor: active ? colors.pillActive : colors.pill,
                  borderColor: active ? colors.pillActive : colors.border,
                },
              ]}
              onPress={() => onSelect(cat)}
            >
              <Text
                style={[
                  styles.pillText,
                  { color: active ? "#fff" : colors.mutedForeground },
                ]}
              >
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

function ChannelSection({
  title,
  channels,
  onSeeAll,
}: {
  title: string;
  channels: Channel[];
  onSeeAll: () => void;
}) {
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
  root: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingBottom: 10,
  },
  appName: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.3,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 32,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  errorText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  retryBtnText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  pillsWrapper: {
    paddingVertical: 12,
  },
  pillsRow: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: "row",
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 22,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  section: {
    marginTop: 8,
    marginBottom: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
  },
  seeAll: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  gridWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
  },
  row: {
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 12,
  },
  gridContent: {
    paddingTop: 4,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginTop: 32,
  },
});
