import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAdminConfig } from "@/context/AdminConfigContext";

export default function AdsAdmin() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { config, setAdsCode } = useAdminConfig();
  const [code, setCode] = useState(config.adsCode);
  const [enabled, setEnabled] = useState(config.adsEnabled);
  const [saved, setSaved] = useState(false);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  useEffect(() => {
    setCode(config.adsCode);
    setEnabled(config.adsEnabled);
  }, [config.adsCode, config.adsEnabled]);

  async function handleSave() {
    await setAdsCode(code, enabled);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleClear() {
    Alert.alert("পরিষ্কার করুন", "সব বিজ্ঞাপন কোড মুছে ফেলবেন?", [
      { text: "না", style: "cancel" },
      { text: "হ্যাঁ", style: "destructive", onPress: async () => { setCode(""); await setAdsCode("", false); } },
    ]);
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[styles.content, { paddingTop: topPad + 8, paddingBottom: insets.bottom + 32 }]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.pageTitle}>বিজ্ঞাপন কোড</Text>
          <Text style={styles.pageSub}>Ads HTML/Script ম্যানেজ করুন</Text>
        </View>
      </View>

      <View style={styles.toggleRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.toggleLabel}>বিজ্ঞাপন সক্রিয় করুন</Text>
          <Text style={styles.toggleSub}>হোম স্ক্রিনে বিজ্ঞাপন দেখাবে</Text>
        </View>
        <Switch
          value={enabled}
          onValueChange={setEnabled}
          trackColor={{ true: "#d97706", false: "#333" }}
          thumbColor="#fff"
        />
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={18} color="#d97706" />
        <Text style={styles.infoText}>
          Google AdSense, AdMob বা যেকোনো বিজ্ঞাপন কোড এখানে পেস্ট করুন। কোডটি WebView-এ রেন্ডার হবে।
        </Text>
      </View>

      <View style={styles.fieldBox}>
        <Text style={styles.fieldLabel}>বিজ্ঞাপন কোড (HTML/Script)</Text>
        <TextInput
          style={styles.codeInput}
          value={code}
          onChangeText={setCode}
          multiline
          placeholder={"<script async src=\"https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js\">\n</script>\n<ins class=\"adsbygoogle\" ...>"}
          placeholderTextColor="#333"
          autoCapitalize="none"
          autoCorrect={false}
          textAlignVertical="top"
        />
        <Text style={styles.charCount}>{code.length} অক্ষর</Text>
      </View>

      <View style={styles.actions}>
        {code.length > 0 && (
          <Pressable style={styles.clearBtn} onPress={handleClear}>
            <Ionicons name="trash-outline" size={18} color="#e11d48" />
            <Text style={styles.clearBtnText}>পরিষ্কার করুন</Text>
          </Pressable>
        )}
        <Pressable
          style={[styles.saveBtn, saved && styles.savedBtn]}
          onPress={handleSave}
        >
          <Ionicons name={saved ? "checkmark-circle" : "save-outline"} size={18} color="#fff" />
          <Text style={styles.saveBtnText}>{saved ? "সেভ হয়েছে!" : "সেভ করুন"}</Text>
        </Pressable>
      </View>

      {code.length > 0 && (
        <View style={styles.previewBox}>
          <Text style={styles.previewTitle}>কোড প্রিভিউ</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator style={styles.codePreview}>
            <Text style={styles.codeText}>{code}</Text>
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#09090d" },
  content: { paddingHorizontal: 16, gap: 16 },
  header: { flexDirection: "row", alignItems: "center", gap: 10 },
  backBtn: { padding: 4 },
  pageTitle: { color: "#fff", fontSize: 20, fontFamily: "Inter_700Bold" },
  pageSub: { color: "#71717a", fontSize: 13, fontFamily: "Inter_400Regular" },
  toggleRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#111118", borderRadius: 12, borderWidth: 1, borderColor: "#1e1e2a", padding: 14 },
  toggleLabel: { color: "#fff", fontSize: 15, fontFamily: "Inter_500Medium" },
  toggleSub: { color: "#71717a", fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  infoBox: { flexDirection: "row", gap: 10, backgroundColor: "#d9770611", borderRadius: 10, borderWidth: 1, borderColor: "#d9770633", padding: 12, alignItems: "flex-start" },
  infoText: { flex: 1, color: "#fde68a", fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
  fieldBox: { gap: 8 },
  fieldLabel: { color: "#71717a", fontSize: 12, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.8 },
  codeInput: {
    backgroundColor: "#0a0a10", borderWidth: 1, borderColor: "#1e1e2a",
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14,
    color: "#a3e635", fontSize: 13, fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    minHeight: 200, lineHeight: 20,
  },
  charCount: { color: "#444", fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "right" },
  actions: { flexDirection: "row", gap: 10 },
  clearBtn: { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderColor: "#e11d4833", borderRadius: 10, paddingVertical: 12, paddingHorizontal: 16 },
  clearBtnText: { color: "#e11d48", fontSize: 14, fontFamily: "Inter_500Medium" },
  saveBtn: { flex: 1, backgroundColor: "#d97706", borderRadius: 10, paddingVertical: 12, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 8 },
  savedBtn: { backgroundColor: "#059669" },
  saveBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
  previewBox: { backgroundColor: "#0a0a10", borderRadius: 12, borderWidth: 1, borderColor: "#1e1e2a", padding: 14, gap: 8 },
  previewTitle: { color: "#71717a", fontSize: 12, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.8 },
  codePreview: { maxHeight: 120 },
  codeText: { color: "#a3e635", fontSize: 12, fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace", lineHeight: 18 },
});
