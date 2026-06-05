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
import { ChannelCard } from "@/components/ChannelCard";
import { useColors } from "@/hooks/useColors";
import { COUNTRIES, getStreamUrl } from "@/utils/countries";
import { Channel, parseM3U, filterChannels } from "@/utils/m3u-parser";

const SEARCH_COUNTRIES = ["us", "gb", "in", "fr", "de", "br", "jp", "au", "ca", "au"];

export default function SearchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadChannels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results: Channel[] = [];
      const codes = SEARCH_COUNTRIES.slice(0, 4);
      await Promise.all(
        codes.map(async (code) => {
          try {
            const res = await fetch(getStreamUrl(code), {
              headers: { "Cache-Control": "max-age=3600" },
            });
            if (!res.ok) return;
            const text = await res.text();
            const parsed = parseM3U(text, code);
            results.push(...parsed);
          } catch {
          }
        })
      );
      setChannels(results);
      setLoaded(true);
    } catch {
      setError("Failed to load channels");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChannels();
  }, [loadChannels]);

  const filtered = query.trim() ? filterChannels(channels, query) : [];
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
        <Text style={[styles.title, { color: colors.foreground }]}>Search</Text>
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
            autoCapitalize="none"
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {query.length > 0 && (
            <Text style={[styles.count, { color: colors.mutedForeground }]}>
              {filtered.length}
            </Text>
          )}
        </View>
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
            Loading channel index...
          </Text>
        </View>
      )}

      {error && !loading && (
        <View style={styles.center}>
          <Ionicons name="wifi-outline" size={40} color={colors.mutedForeground} />
          <Text style={[styles.errorText, { color: colors.mutedForeground }]}>
            {error}
          </Text>
          <Text
            style={[styles.retryText, { color: colors.primary }]}
            onPress={loadChannels}
          >
            Retry
          </Text>
        </View>
      )}

      {!loading && !error && query.trim() === "" && loaded && (
        <View style={styles.center}>
          <Ionicons name="search-outline" size={48} color={colors.mutedForeground} />
          <Text style={[styles.hintTitle, { color: colors.foreground }]}>
            Search {channels.length.toLocaleString()} channels
          </Text>
          <Text style={[styles.hintSub, { color: colors.mutedForeground }]}>
            From US, UK, India, France, Germany and more
          </Text>
        </View>
      )}

      {!loading && query.trim().length > 0 && (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChannelCard channel={item} showCountry />}
          contentContainerStyle={[
            styles.list,
            {
              paddingBottom:
                Platform.OS === "web" ? 34 + 84 : insets.bottom + 84,
            },
          ]}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="tv-outline" size={40} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                No channels match "{query}"
              </Text>
            </View>
          }
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
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
  title: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
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
  count: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
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
  retryText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginTop: 8,
  },
  hintTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  hintSub: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  list: {
    paddingTop: 8,
  },
});
