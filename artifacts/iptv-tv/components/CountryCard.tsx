import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { Country } from "@/utils/countries";

interface Props {
  country: Country;
}

export function CountryCard({ country }: Props) {
  const colors = useColors();

  function handlePress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "/channels/[country]",
      params: { country: country.code, name: country.name, flag: country.flag },
    });
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.75 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
      ]}
      onPress={handlePress}
      testID={`country-card-${country.code}`}
    >
      <Text style={styles.flag}>{country.flag}</Text>
      <Text
        style={[
          styles.name,
          { color: colors.foreground, fontFamily: "Inter_600SemiBold" },
        ]}
        numberOfLines={2}
      >
        {country.name}
      </Text>
      <View style={[styles.chip, { backgroundColor: colors.muted }]}>
        <Ionicons name="tv-outline" size={10} color={colors.mutedForeground} />
        <Text style={[styles.chipText, { color: colors.mutedForeground }]}>
          LIVE
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "46%",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    gap: 8,
    alignItems: "flex-start",
  },
  flag: {
    fontSize: 36,
  },
  name: {
    fontSize: 14,
    lineHeight: 19,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  chipText: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.5,
  },
});
