import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
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
import { CountryCard } from "@/components/CountryCard";
import { useColors } from "@/hooks/useColors";
import { COUNTRIES, REGIONS, Country } from "@/utils/countries";

const FEATURED_CODES = ["us", "gb", "in", "fr", "de", "br", "jp", "au"];
const FEATURED = COUNTRIES.filter((c) => FEATURED_CODES.includes(c.code));

export default function BrowseScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = COUNTRIES;
    if (selectedRegion) list = list.filter((c) => c.region === selectedRegion);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q));
    }
    return list;
  }, [search, selectedRegion]);

  const isSearching = search.trim().length > 0 || selectedRegion !== null;

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
        <Text style={[styles.title, { color: colors.foreground }]}>StreamTV</Text>

        <View
          style={[
            styles.searchBox,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Ionicons name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Search countries..."
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")} hitSlop={8}>
              <Ionicons name="close-circle" size={16} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.regionsRow}
        >
          <Pressable
            style={[
              styles.regionPill,
              {
                backgroundColor:
                  selectedRegion === null ? colors.primary : colors.card,
                borderColor:
                  selectedRegion === null ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setSelectedRegion(null)}
          >
            <Text
              style={[
                styles.regionText,
                {
                  color:
                    selectedRegion === null
                      ? colors.primaryForeground
                      : colors.mutedForeground,
                },
              ]}
            >
              All
            </Text>
          </Pressable>
          {REGIONS.map((r) => (
            <Pressable
              key={r}
              style={[
                styles.regionPill,
                {
                  backgroundColor:
                    selectedRegion === r ? colors.primary : colors.card,
                  borderColor:
                    selectedRegion === r ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setSelectedRegion(r === selectedRegion ? null : r)}
            >
              <Text
                style={[
                  styles.regionText,
                  {
                    color:
                      selectedRegion === r
                        ? colors.primaryForeground
                        : colors.mutedForeground,
                  },
                ]}
              >
                {r}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {isSearching ? (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.code}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="globe-outline" size={40} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                No countries found
              </Text>
            </View>
          }
          renderItem={({ item }) => <CountryCard country={item} />}
        />
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom:
                Platform.OS === "web" ? 34 + 84 : insets.bottom + 84,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Popular
            </Text>
            <View style={styles.grid2}>
              {FEATURED.map((c) => (
                <CountryCard key={c.code} country={c} />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              All Countries
            </Text>
            <View style={styles.grid2}>
              {COUNTRIES.map((c) => (
                <CountryCard key={c.code} country={c} />
              ))}
            </View>
          </View>
        </ScrollView>
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
  regionsRow: {
    paddingRight: 4,
    gap: 8,
    flexDirection: "row",
  },
  regionPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  regionText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  scrollContent: {
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  grid2: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    gap: 8,
    justifyContent: "center",
  },
  grid: {
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  row: {
    justifyContent: "space-between",
    gap: 8,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
});
