import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChannelGridCard } from "@/components/ChannelGridCard";
import { useColors } from "@/hooks/useColors";
import { ALL_SOURCES } from "@/utils/sources";
import { Channel, filterChannels, parseM3U } from "@/utils/m3u-parser";

export default function SearchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : insets.bottom + 84;

  const loadChannels = useCallback(async () => {
    setLoading(true);
    const buckets: Channel[][] = ALL_SOURCES.map(() => []);
    let first = true;

    await Promise.all(
      ALL_SOURCES.map(async (source, i) => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 8000);
        try {
          const res = await fetch(source.url, { signal: controller.signal });
          clearTimeout(timer);
          if (!res.ok) return;
          const text = await res.text();
          buckets[i] = parseM3U(text, source.countryCode);
          const merged = ([] as Channel[]).concat(...buckets);
          setChannels([...merged]);
          if (first) { first = false; setLoading(false); setLoaded(true); }
        } catch {
          clearTimeout(timer);
        }
      })
    );

    const merged = ([] as Channel[]).concat(...buckets);
    setChannels([...merged]);
    setLoaded(true);
    setLoading(false);
  }, []);

  useEffect(() => { loadChannels(); }, [loadChannels]);

  const filtered = query.trim() ? filterChannels(channels, query) : [];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>খুঁজুন</Text>
        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            style={[styles.input, { color: colors.foreground }]}
            placeholder="চ্যানেল খুঁজুন..."
            placeholderTextColor={colors.mutedForeground}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {query.length > 0 && (
            <Text style={[styles.countText, { color: colors.mutedForeground }]}>{filtered.length}</Text>
          )}
        </View>
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.hint, { color: colors.mutedForeground }]}>চ্যানেল লোড হচ্ছে...</Text>
        </View>
      )}

      {!loading && query.trim() === "" && (
        <View style={styles.center}>
          <Ionicons name="search-outline" size={48} color={colors.mutedForeground} />
          <Text style={[styles.hintTitle, { color: colors.foreground }]}>
            {loaded ? `${channels.length.toLocaleString()} টি চ্যানেল খুঁজুন` : "লোড হচ্ছে..."}
          </Text>
          <Text style={[styles.hint, { color: colors.mutedForeground }]}>
            বাংলা, স্পোর্টস, সংবাদ এবং আরও অনেক কিছু
          </Text>
        </View>
      )}

      {!loading && query.trim().length > 0 && (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={[styles.gridContent, { paddingBottom: bottomPad }]}
          scrollEnabled={!!filtered.length}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="tv-outline" size={40} color={colors.mutedForeground} />
              <Text style={[styles.hint, { color: colors.mutedForeground }]}>
                "{query}" এর জন্য কিছু পাওয়া যায়নি
              </Text>
            </View>
          }
          renderItem={({ item }) => <ChannelGridCard channel={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 18, paddingBottom: 14, gap: 10 },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  searchBox: { flexDirection: "row", alignItems: "center", borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10, gap: 8 },
  input: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular" },
  countText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10, paddingHorizontal: 32 },
  hintTitle: { fontSize: 18, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  hint: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 20 },
  row: { paddingHorizontal: 16, gap: 12, marginBottom: 12 },
  gridContent: { paddingTop: 8 },
});
