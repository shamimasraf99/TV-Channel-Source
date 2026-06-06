import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAdminConfig } from "@/context/AdminConfigContext";

const SECTIONS = [
  { id: "banners", icon: "images-outline" as const, label: "ব্যানার ম্যানেজার", sub: "হোম স্ক্রিনের ব্যানার যোগ/পরিবর্তন করুন", color: "#7c3aed" },
  { id: "sources", icon: "link-outline" as const, label: "M3U সোর্স", sub: "চ্যানেলের M3U লিংক যোগ/পরিবর্তন করুন", color: "#0284c7" },
  { id: "channel-icons", icon: "image-outline" as const, label: "চ্যানেল আইকন", sub: "নির্দিষ্ট চ্যানেলের লোগো বদলান", color: "#059669" },
  { id: "ads", icon: "code-slash-outline" as const, label: "বিজ্ঞাপন কোড", sub: "Ads HTML/Script কোড পেস্ট করুন", color: "#d97706" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { config, setPin } = useAdminConfig();
  const [showPinChange, setShowPinChange] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  async function handlePinChange() {
    if (newPin.length < 4) {
      Alert.alert("ত্রুটি", "পিন কমপক্ষে ৪ সংখ্যার হতে হবে।");
      return;
    }
    if (newPin !== confirmPin) {
      Alert.alert("ত্রুটি", "পিন মিলছে না।");
      return;
    }
    await setPin(newPin);
    setNewPin(""); setConfirmPin("");
    setShowPinChange(false);
    Alert.alert("সফল", "পিন পরিবর্তন হয়েছে।");
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[styles.content, { paddingTop: topPad + 8, paddingBottom: insets.bottom + 32 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>
        <View>
          <Text style={styles.title}>Admin Panel</Text>
          <Text style={styles.sub}>StreamTV কনফিগারেশন</Text>
        </View>
        <View style={styles.adminBadge}>
          <Ionicons name="shield-checkmark" size={16} color="#e11d48" />
        </View>
      </View>

      <View style={styles.grid}>
        {SECTIONS.map((s) => (
          <Pressable
            key={s.id}
            style={({ pressed }) => [styles.card, { opacity: pressed ? 0.75 : 1 }]}
            onPress={() => router.push(`/admin/${s.id}` as any)}
          >
            <View style={[styles.cardIcon, { backgroundColor: s.color + "22" }]}>
              <Ionicons name={s.icon} size={26} color={s.color} />
            </View>
            <Text style={styles.cardLabel}>{s.label}</Text>
            <Text style={styles.cardSub} numberOfLines={2}>{s.sub}</Text>
            <View style={styles.cardArrow}>
              <Ionicons name="chevron-forward" size={16} color="#71717a" />
            </View>
          </Pressable>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>নিরাপত্তা</Text>
        <Pressable style={styles.row} onPress={() => setShowPinChange(!showPinChange)}>
          <Ionicons name="key-outline" size={20} color="#71717a" />
          <Text style={styles.rowLabel}>পিন পরিবর্তন করুন</Text>
          <Ionicons name={showPinChange ? "chevron-up" : "chevron-down"} size={16} color="#71717a" />
        </Pressable>

        {showPinChange && (
          <View style={styles.pinForm}>
            <TextInput
              style={styles.pinInput}
              placeholder="নতুন পিন"
              placeholderTextColor="#444"
              value={newPin}
              onChangeText={setNewPin}
              keyboardType="number-pad"
              secureTextEntry
              maxLength={8}
            />
            <TextInput
              style={styles.pinInput}
              placeholder="পিন নিশ্চিত করুন"
              placeholderTextColor="#444"
              value={confirmPin}
              onChangeText={setConfirmPin}
              keyboardType="number-pad"
              secureTextEntry
              maxLength={8}
            />
            <Pressable style={styles.saveBtn} onPress={handlePinChange}>
              <Text style={styles.saveBtnText}>সেভ করুন</Text>
            </Pressable>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.infoText}>বর্তমান পিন: {"•".repeat(config.pin.length)}</Text>
        <Text style={styles.infoText}>ব্যানার: {config.bannersEnabled ? `${config.banners.length}টি কাস্টম` : "ডিফল্ট"}</Text>
        <Text style={styles.infoText}>সোর্স: {config.sourcesEnabled ? `${config.sources.filter(s => s.enabled).length}টি সক্রিয়` : "ডিফল্ট"}</Text>
        <Text style={styles.infoText}>আইকন: {config.channelIcons.length}টি ওভাররাইড</Text>
        <Text style={styles.infoText}>বিজ্ঞাপন: {config.adsEnabled ? "চালু" : "বন্ধ"}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#09090d" },
  content: { paddingHorizontal: 16, gap: 20 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingBottom: 8 },
  backBtn: { padding: 4 },
  title: { color: "#fff", fontSize: 22, fontFamily: "Inter_700Bold" },
  sub: { color: "#71717a", fontSize: 13, fontFamily: "Inter_400Regular" },
  adminBadge: { marginLeft: "auto" },
  grid: { gap: 12 },
  card: {
    backgroundColor: "#111118", borderRadius: 14, borderWidth: 1,
    borderColor: "#1e1e2a", padding: 16, gap: 6,
  },
  cardIcon: { width: 48, height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  cardLabel: { color: "#fff", fontSize: 16, fontFamily: "Inter_600SemiBold" },
  cardSub: { color: "#71717a", fontSize: 13, fontFamily: "Inter_400Regular" },
  cardArrow: { position: "absolute", right: 16, top: "50%" },
  section: { backgroundColor: "#111118", borderRadius: 14, borderWidth: 1, borderColor: "#1e1e2a", overflow: "hidden" },
  sectionTitle: { color: "#71717a", fontSize: 12, fontFamily: "Inter_600SemiBold", paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4, textTransform: "uppercase", letterSpacing: 0.8 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16 },
  rowLabel: { flex: 1, color: "#fff", fontSize: 15, fontFamily: "Inter_500Medium" },
  pinForm: { padding: 16, gap: 10, borderTopWidth: 1, borderTopColor: "#1e1e2a" },
  pinInput: {
    backgroundColor: "#0d0d14", borderWidth: 1, borderColor: "#1e1e2a",
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
    color: "#fff", fontSize: 15, fontFamily: "Inter_400Regular",
  },
  saveBtn: { backgroundColor: "#e11d48", borderRadius: 10, paddingVertical: 12, alignItems: "center" },
  saveBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
  info: { backgroundColor: "#111118", borderRadius: 14, borderWidth: 1, borderColor: "#1e1e2a", padding: 16, gap: 8 },
  infoText: { color: "#71717a", fontSize: 13, fontFamily: "Inter_400Regular" },
});
