import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChannelCard } from "@/components/ChannelCard";
import { useColors } from "@/hooks/useColors";
import { getStreamUrl } from "@/utils/countries";
import { Channel, filterChannels, groupByCategory, parseM3U } from "@/utils/m3u-parser";

export default function ChannelsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { country, name, flag } = useLocalSearchParams<{
    country: string;
    name: string;
    flag: string;
  }>();

  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const loadChannels = useCallback(async () => {
    if (!country) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(getStreamUrl(country));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const parsed = parseM3U(text, country);
      setChannels(parsed);
    } catch (e) {
      setError("Failed to load channels. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [country]);

  useEffect(() => {
    loadChannels();
  }, [loadChannels]);

  const categories = useMemo(() => {
    const groups = groupByCategory(channels);
    return Object.keys(groups).sort();
  }, [channels]);

  const filtered = useMemo(() => {
    let list = channels;
    if (selectedCategory) list = list.filter((ch) => ch.group === selectedCategory);
    if (query.trim()) list = filterChannels(list, query);
    return list;
  }, [channels, selectedCategory, query]);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 12,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.titleRow}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            hitSlop={8}
          >
            <Ionicons name="chevron-back" size={24} color={colors.foreground} />
          </Pressable>
          <View style={styles.titleContent}>
            <Text style={styles.flagText}>{flag}</Text>
            <View>
              <Text style={[styles.title, { color: colors.foreground }]}>{name}</Text>
              {!loading && (
                <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
                  {channels.length} channels
                </Text>
              )}
            </View>
          </View>
        </View>

        <View
          style={[
            styles.searchBox,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Ionicons name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Search channels..."
            placeholderTextColor={colors.mutedForeground}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>

        {categories.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesRow}
          >
            <Pressable
              style={[
                styles.categoryPill,
                {
                  backgroundColor:
                    selectedCategory === null ? colors.primary : colors.card,
                  borderColor:
                    selectedCategory === null ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    color:
                      selectedCategory === null
                        ? colors.primaryForeground
                        : colors.mutedForeground,
                  },
                ]}
              >
                All
              </Text>
            </Pressable>
            {categories.map((cat) => (
              <Pressable
                key={cat}
                style={[
                  styles.categoryPill,
                  {
                    backgroundColor:
                      selectedCategory === cat ? colors.primary : colors.card,
                    borderColor:
                      selectedCategory === cat ? colors.primary : colors.border,
                  },
                ]}
                onPress={() =>
                  setSelectedCategory(cat === selectedCategory ? null : cat)
                }
              >
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color:
                        selectedCategory === cat
                          ? colors.primaryForeground
                          : colors.mutedForeground,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {cat}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
            Loading channels...
          </Text>
        </View>
      )}

      {error && !loading && (
        <View style={styles.center}>
          <Ionicons name="cloud-offline-outline" size={44} color={colors.mutedForeground} />
          <Text style={[styles.errorText, { color: colors.mutedForeground }]}>
            {error}
          </Text>
          <Pressable
            style={[styles.retryBtn, { backgroundColor: colors.primary }]}
            onPress={loadChannels}
          >
            <Text style={[styles.retryBtnText, { color: colors.primaryForeground }]}>
              Retry
            </Text>
          </Pressable>
        </View>
      )}

      {!loading && !error && (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChannelCard channel={item} />}
          contentContainerStyle={[
            styles.list,
            {
              paddingBottom:
                Platform.OS === "web" ? 34 + 84 : insets.bottom + 84,
            },
          ]}
          scrollEnabled={!!filtered.length}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="tv-outline" size={40} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                {query ? `No channels match "${query}"` : "No channels available"}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
    borderBottomWidth: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  titleContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  flagText: {
    fontSize: 32,
  },
  title: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  categoriesRow: {
    paddingRight: 4,
    gap: 8,
    flexDirection: "row",
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    maxWidth: 160,
  },
  categoryText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  list: {
    paddingTop: 8,
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
  emptyText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});
