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

type AdFormat = "banner_300x250" | "banner_728x90" | "banner_160x600" | "popunder" | "native" | "direct_link";

const AD_FORMATS: { key: AdFormat; label: string; size?: string }[] = [
  { key: "banner_300x250", label: "ব্যানার (300×250)", size: "সবচেয়ে জনপ্রিয়" },
  { key: "banner_728x90", label: "লিডারবোর্ড (728×90)", size: "ডেস্কটপ" },
  { key: "banner_160x600", label: "স্কাইস্ক্র্যাপার (160×600)", size: "সাইডবার" },
  { key: "popunder", label: "পপআন্ডার", size: "উচ্চ CPM" },
  { key: "native", label: "নেটিভ ব্যানার", size: "কন্টেন্ট-মিলানো" },
  { key: "direct_link", label: "ডাইরেক্ট লিংক", size: "" },
];

function generateAdsterraBannerCode(zoneKey: string, format: AdFormat): string {
  if (!zoneKey.trim()) return "";
  const k = zoneKey.trim();

  if (format === "banner_300x250") {
    return `<script type="text/javascript">
  atOptions = {
    'key' : '${k}',
    'format' : 'iframe',
    'height' : 250,
    'width' : 300,
    'params' : {}
  };
</script>
<script type="text/javascript" src="//www.highperformanceformat.com/${k}/invoke.js"></script>`;
  }
  if (format === "banner_728x90") {
    return `<script type="text/javascript">
  atOptions = {
    'key' : '${k}',
    'format' : 'iframe',
    'height' : 90,
    'width' : 728,
    'params' : {}
  };
</script>
<script type="text/javascript" src="//www.highperformanceformat.com/${k}/invoke.js"></script>`;
  }
  if (format === "banner_160x600") {
    return `<script type="text/javascript">
  atOptions = {
    'key' : '${k}',
    'format' : 'iframe',
    'height' : 600,
    'width' : 160,
    'params' : {}
  };
</script>
<script type="text/javascript" src="//www.highperformanceformat.com/${k}/invoke.js"></script>`;
  }
  if (format === "popunder") {
    return `<script type="text/javascript" src="//cat.sv.rkdms.com/avw.js?zoneid=${k}&cb=${Math.random()}"></script>`;
  }
  if (format === "native") {
    return `<script async="async" data-cfasync="false" src="//pl${k}.profitableratecpm.com/${k}/invoke.js"></script>`;
  }
  if (format === "direct_link") {
    return `<!-- Adsterra Direct Link: https://www.profitableratecpm.com/${k}/direct_link -->
<a href="https://www.profitableratecpm.com/${k}/direct_link" target="_blank" rel="nofollow">আপনার বিজ্ঞাপন টেক্সট</a>`;
  }
  return "";
}

export default function AdsAdmin() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { config, setAdsCode } = useAdminConfig();
  const [code, setCode] = useState(config.adsCode);
  const [enabled, setEnabled] = useState(config.adsEnabled);
  const [saved, setSaved] = useState(false);
  const [zoneKey, setZoneKey] = useState("");
  const [format, setFormat] = useState<AdFormat>("banner_300x250");
  const [showGenerator, setShowGenerator] = useState(true);
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

  function handleGenerate() {
    if (!zoneKey.trim()) { Alert.alert("ত্রুটি", "Adsterra Zone Key দিন।"); return; }
    const generated = generateAdsterraBannerCode(zoneKey, format);
    setCode(generated);
    Alert.alert("সফল", "কোড তৈরি হয়েছে! নিচে যাচাই করুন এবং সেভ করুন।");
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
          <Text style={styles.pageSub}>Adsterra সহ যেকোনো Ads কোড</Text>
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

      {/* ─── Adsterra Generator ─────────────────────────────────────── */}
      <Pressable
        style={styles.generatorHeader}
        onPress={() => setShowGenerator(!showGenerator)}
      >
        <View style={styles.adsterraBadge}>
          <Text style={styles.adsterraBadgeText}>Adsterra</Text>
        </View>
        <Text style={styles.generatorTitle}>কোড জেনারেটর</Text>
        <Ionicons name={showGenerator ? "chevron-up" : "chevron-down"} size={18} color="#71717a" style={{ marginLeft: "auto" }} />
      </Pressable>

      {showGenerator && (
        <View style={styles.generatorBox}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Zone Key / Publisher Key</Text>
            <TextInput
              style={styles.input}
              value={zoneKey}
              onChangeText={setZoneKey}
              placeholder="e.g. 8f2a1b3c4d5e6f7a8b9c..."
              placeholderTextColor="#333"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.fieldHint}>Adsterra ড্যাশবোর্ড → My Sites → Code → Zone Key কপি করুন</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>বিজ্ঞাপনের ধরন</Text>
            <View style={styles.formatGrid}>
              {AD_FORMATS.map((f) => (
                <Pressable
                  key={f.key}
                  style={[styles.formatBtn, format === f.key && styles.formatBtnActive]}
                  onPress={() => setFormat(f.key)}
                >
                  <Text style={[styles.formatBtnLabel, format === f.key && styles.formatBtnLabelActive]}>
                    {f.label}
                  </Text>
                  {f.size ? (
                    <Text style={[styles.formatBtnSize, format === f.key && { color: "#fff8" }]}>
                      {f.size}
                    </Text>
                  ) : null}
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable style={styles.generateBtn} onPress={handleGenerate}>
            <Ionicons name="code-slash" size={18} color="#fff" />
            <Text style={styles.generateBtnText}>কোড তৈরি করুন</Text>
          </Pressable>

          <View style={styles.adsterraTips}>
            <Ionicons name="bulb-outline" size={14} color="#d97706" />
            <Text style={styles.tipsText}>
              Adsterra → Dashboard → Publisher → My Sites → Get Code → Zone Key কপি করুন।
              Mobile-এর জন্য Banner 300×250 সবচেয়ে ভালো।
            </Text>
          </View>
        </View>
      )}

      {/* ─── Manual Code ────────────────────────────────────────────── */}
      <View style={styles.fieldBox}>
        <Text style={styles.fieldLabel}>বিজ্ঞাপন কোড (HTML/Script)</Text>
        <Text style={styles.fieldHint}>উপরের Generator ব্যবহার করুন অথবা সরাসরি কোড পেস্ট করুন</Text>
        <TextInput
          style={styles.codeInput}
          value={code}
          onChangeText={setCode}
          multiline
          placeholder={"<script type=\"text/javascript\">\n  atOptions = { 'key': '...' };\n</script>\n<script src=\"//www.highperformanceformat.com/.../invoke.js\"></script>"}
          placeholderTextColor="#2a2a3a"
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
            <Text style={styles.clearBtnText}>পরিষ্কার</Text>
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
          <ScrollView horizontal showsHorizontalScrollIndicator style={styles.codePreviewScroll}>
            <Text style={styles.codeText}>{code}</Text>
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#09090d" },
  content: { paddingHorizontal: 16, gap: 14 },
  header: { flexDirection: "row", alignItems: "center", gap: 10 },
  backBtn: { padding: 4 },
  pageTitle: { color: "#fff", fontSize: 20, fontFamily: "Inter_700Bold" },
  pageSub: { color: "#71717a", fontSize: 13, fontFamily: "Inter_400Regular" },
  toggleRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#111118", borderRadius: 12, borderWidth: 1, borderColor: "#1e1e2a", padding: 14 },
  toggleLabel: { color: "#fff", fontSize: 15, fontFamily: "Inter_500Medium" },
  toggleSub: { color: "#71717a", fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  generatorHeader: {
    flexDirection: "row", alignItems: "center", gap: 10,
    backgroundColor: "#111118", borderRadius: 12, borderWidth: 1, borderColor: "#d9770644",
    padding: 14,
  },
  adsterraBadge: { backgroundColor: "#d97706", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  adsterraBadgeText: { color: "#fff", fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  generatorTitle: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
  generatorBox: { backgroundColor: "#0d0d14", borderRadius: 12, borderWidth: 1, borderColor: "#1e1e2a", padding: 14, gap: 14 },
  field: { gap: 6 },
  fieldLabel: { color: "#71717a", fontSize: 12, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.8 },
  fieldHint: { color: "#444", fontSize: 11, fontFamily: "Inter_400Regular", lineHeight: 16 },
  input: { backgroundColor: "#111118", borderWidth: 1, borderColor: "#1e1e2a", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, color: "#fff", fontSize: 14, fontFamily: "Inter_400Regular" },
  formatGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  formatBtn: { backgroundColor: "#111118", borderWidth: 1, borderColor: "#1e1e2a", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, alignItems: "center", minWidth: 130 },
  formatBtnActive: { backgroundColor: "#d97706", borderColor: "#d97706" },
  formatBtnLabel: { color: "#71717a", fontSize: 12, fontFamily: "Inter_500Medium", textAlign: "center" },
  formatBtnLabelActive: { color: "#fff" },
  formatBtnSize: { color: "#444", fontSize: 10, fontFamily: "Inter_400Regular" },
  generateBtn: { backgroundColor: "#d97706", borderRadius: 10, paddingVertical: 13, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  generateBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
  adsterraTips: { flexDirection: "row", gap: 8, backgroundColor: "#d9770610", borderRadius: 8, padding: 10, alignItems: "flex-start" },
  tipsText: { flex: 1, color: "#fde68a", fontSize: 11, fontFamily: "Inter_400Regular", lineHeight: 17 },
  fieldBox: { gap: 6 },
  codeInput: {
    backgroundColor: "#0a0a10", borderWidth: 1, borderColor: "#1e1e2a", borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 14, color: "#a3e635",
    fontSize: 12, fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    minHeight: 180, lineHeight: 20,
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
  codePreviewScroll: { maxHeight: 120 },
  codeText: { color: "#a3e635", fontSize: 11, fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace", lineHeight: 18 },
});
