import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAdminConfig } from "@/context/AdminConfigContext";

export default function AdminLayout() {
  const { config, isLoading } = useAdminConfig();
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  if (isLoading) return <View style={styles.root} />;

  if (!unlocked) {
    const locked = attempts >= 5;
    return (
      <View style={[styles.root, { paddingTop: insets.top + 32 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>

        <View style={styles.lockBox}>
          <View style={styles.lockIcon}>
            <Ionicons name="shield-checkmark" size={40} color="#e11d48" />
          </View>
          <Text style={styles.lockTitle}>Admin Panel</Text>
          <Text style={styles.lockSub}>পিন কোড দিন</Text>

          <TextInput
            style={[styles.pinInput, error && styles.pinInputError]}
            value={input}
            onChangeText={(v) => { setInput(v); setError(false); }}
            keyboardType="number-pad"
            secureTextEntry
            maxLength={8}
            placeholder="••••"
            placeholderTextColor="#444"
            autoFocus
            editable={!locked}
          />

          {error && !locked && (
            <Text style={styles.errorText}>ভুল পিন। আবার চেষ্টা করুন।</Text>
          )}
          {locked && (
            <Text style={styles.errorText}>অনেকবার ভুল হয়েছে। অ্যাপ রিস্টার্ট করুন।</Text>
          )}

          <Pressable
            style={({ pressed }) => [styles.unlockBtn, { opacity: pressed || locked ? 0.6 : 1 }]}
            onPress={() => {
              if (locked) return;
              if (input === config.pin) {
                setUnlocked(true);
                setError(false);
                setAttempts(0);
              } else {
                setError(true);
                setAttempts((a) => a + 1);
                setInput("");
              }
            }}
            disabled={locked}
          >
            <Text style={styles.unlockBtnText}>প্রবেশ করুন</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="banners" />
      <Stack.Screen name="sources" />
      <Stack.Screen name="channel-icons" />
      <Stack.Screen name="ads" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#09090d" },
  backBtn: { position: "absolute", top: 56, left: 16, zIndex: 10, padding: 8 },
  lockBox: {
    flex: 1, alignItems: "center", justifyContent: "center",
    paddingHorizontal: 40, gap: 14,
  },
  lockIcon: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: "#1a0610", alignItems: "center", justifyContent: "center",
    marginBottom: 8,
  },
  lockTitle: { color: "#fff", fontSize: 24, fontFamily: "Inter_700Bold" },
  lockSub: { color: "#71717a", fontSize: 15, fontFamily: "Inter_400Regular" },
  pinInput: {
    width: "100%", backgroundColor: "#111118", borderWidth: 1,
    borderColor: "#1e1e2a", borderRadius: 12, paddingHorizontal: 20,
    paddingVertical: 14, color: "#fff", fontSize: 22,
    fontFamily: "Inter_600SemiBold", textAlign: "center", letterSpacing: 8,
    marginTop: 8,
  },
  pinInputError: { borderColor: "#e11d48" },
  errorText: { color: "#e11d48", fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center" },
  unlockBtn: {
    width: "100%", backgroundColor: "#e11d48", borderRadius: 12,
    paddingVertical: 14, alignItems: "center", marginTop: 4,
  },
  unlockBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_600SemiBold" },
});
