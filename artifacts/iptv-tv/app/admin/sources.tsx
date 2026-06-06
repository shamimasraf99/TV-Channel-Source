import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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
import { AdminSource } from "@/utils/adminConfig";
import { ALL_SOURCES } from "@/utils/sources";

const EMPTY: AdminSource = { id: "", label: "", url: "", countryCode: "BD", enabled: true };

export default function SourcesAdmin() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { config, setSources, updateConfig } = useAdminConfig();
  const [editing, setEditing] = useState<AdminSource | null>(null);
  const [form, setForm] = useState<AdminSource>(EMPTY);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  function openNew() {
    const s = { ...EMPTY, id: Date.now().toString() };
    setForm(s); setEditing(s);
  }
  function openEdit(s: AdminSource) { setForm({ ...s }); setEditing(s); }

  async function handleSave() {
    if (!form.label.trim()) { Alert.alert("ত্রুটি", "নাম দিন।"); return; }
    if (!form.url.trim()) { Alert.alert("ত্রুটি", "URL দিন।"); return; }
    const isNew = !config.sources.find((s) => s.id === form.id);
    const next = isNew ? [...config.sources, form] : config.sources.map((s) => (s.id === form.id ? form : s));
    await setSources(next);
    setEditing(null);
  }

  async function handleDelete(id: string) {
    Alert.alert("মুছুন", "এই সোর্সটি মুছে ফেলবেন?", [
      { text: "না", style: "cancel" },
      { text: "হ্যাঁ", style: "destructive", onPress: async () => { await setSources(config.sources.filter((s) => s.id !== id)); } },
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
        <Pressable onPress={() => { setEditing(null); router.back(); }} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.pageTitle}>M3U সোর্স</Text>
          <Text style={styles.pageSub}>চ্যানেল সোর্স ম্যানেজ করুন</Text>
        </View>
      </View>

      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>কাস্টম সোর্স ব্যবহার করুন</Text>
        <Switch
          value={config.sourcesEnabled}
          onValueChange={(v) => updateConfig({ sourcesEnabled: v })}
          trackColor={{ true: "#e11d48", false: "#333" }}
          thumbColor="#fff"
        />
      </View>
      <Text style={styles.helpText}>
        {config.sourcesEnabled ? "কাস্টম সোর্স সক্রিয়।" : "বন্ধ থাকলে ডিফল্ট সোর্স ব্যবহার হবে।"}
      </Text>

      {!editing && (
        <>
          <Text style={styles.sectionLabel}>ডিফল্ট সোর্স</Text>
          {ALL_SOURCES.map((s) => (
            <View key={s.url} style={[styles.card, { opacity: 0.55 }]}>
              <Ionicons name="link" size={16} color="#71717a" />
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{s.label}</Text>
                <Text style={styles.cardUrl} numberOfLines={1}>{s.url}</Text>
              </View>
              <View style={styles.defaultBadge}><Text style={styles.defaultBadgeText}>ডিফল্ট</Text></View>
            </View>
          ))}

          <Text style={styles.sectionLabel}>কাস্টম সোর্স</Text>
          {config.sources.length === 0 && <Text style={styles.emptyText}>কোনো কাস্টম সোর্স নেই।</Text>}
          {config.sources.map((s) => (
            <View key={s.id} style={styles.card}>
              <Ionicons name="link" size={16} color={s.enabled ? "#0284c7" : "#444"} />
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{s.label}</Text>
                <Text style={styles.cardUrl} numberOfLines={1}>{s.url}</Text>
              </View>
              <View style={styles.cardActions}>
                <Switch
                  value={s.enabled}
                  onValueChange={() => setSources(config.sources.map((x) => (x.id === s.id ? { ...x, enabled: !x.enabled } : x)))}
                  trackColor={{ true: "#0284c7", false: "#333" }}
                  thumbColor="#fff"
                  style={{ transform: [{ scale: 0.8 }] }}
                />
                <Pressable onPress={() => openEdit(s)} hitSlop={10}><Ionicons name="pencil" size={18} color="#71717a" /></Pressable>
                <Pressable onPress={() => handleDelete(s.id)} hitSlop={10}><Ionicons name="trash" size={18} color="#e11d48" /></Pressable>
              </View>
            </View>
          ))}
          <Pressable style={styles.addBtn} onPress={openNew}>
            <Ionicons name="add-circle" size={20} color="#0284c7" />
            <Text style={[styles.addBtnText, { color: "#0284c7" }]}>নতুন সোর্স যোগ করুন</Text>
          </Pressable>
        </>
      )}

      {editing && (
        <View style={styles.formBox}>
          <Text style={styles.formTitle}>{config.sources.find((s) => s.id === form.id) ? "সোর্স সম্পাদনা" : "নতুন সোর্স"}</Text>
          {[
            { label: "নাম *", key: "label" as const, placeholder: "যেমন: My IPTV" },
            { label: "M3U URL *", key: "url" as const, placeholder: "https://example.com/playlist.m3u" },
            { label: "দেশ কোড", key: "countryCode" as const, placeholder: "BD" },
          ].map(({ label, key, placeholder }) => (
            <View key={key} style={styles.field}>
              <Text style={styles.fieldLabel}>{label}</Text>
              <TextInput
                style={styles.input}
                value={form[key]}
                onChangeText={(v) => setForm((p) => ({ ...p, [key]: v }))}
                placeholder={placeholder}
                placeholderTextColor="#444"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          ))}
          <View style={styles.formActions}>
            <Pressable style={styles.cancelBtn} onPress={() => setEditing(null)}>
              <Text style={styles.cancelBtnText}>বাতিল</Text>
            </Pressable>
            <Pressable style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>সেভ করুন</Text>
            </Pressable>
          </View>
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
  toggleLabel: { flex: 1, color: "#fff", fontSize: 15, fontFamily: "Inter_500Medium" },
  helpText: { color: "#71717a", fontSize: 12, fontFamily: "Inter_400Regular" },
  sectionLabel: { color: "#71717a", fontSize: 12, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.8, marginTop: 4 },
  card: { backgroundColor: "#111118", borderRadius: 12, borderWidth: 1, borderColor: "#1e1e2a", padding: 12, flexDirection: "row", alignItems: "center", gap: 10 },
  cardTitle: { color: "#fff", fontSize: 14, fontFamily: "Inter_500Medium" },
  cardUrl: { color: "#71717a", fontSize: 12, fontFamily: "Inter_400Regular" },
  cardActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  defaultBadge: { backgroundColor: "#1e1e2a", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  defaultBadgeText: { color: "#71717a", fontSize: 11, fontFamily: "Inter_500Medium" },
  emptyText: { color: "#444", fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", paddingVertical: 8 },
  addBtn: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#111118", borderRadius: 12, borderWidth: 1, borderColor: "#0284c72a", borderStyle: "dashed", padding: 14, justifyContent: "center" },
  addBtnText: { fontSize: 15, fontFamily: "Inter_500Medium" },
  formBox: { backgroundColor: "#111118", borderRadius: 14, borderWidth: 1, borderColor: "#1e1e2a", padding: 16, gap: 14 },
  formTitle: { color: "#fff", fontSize: 17, fontFamily: "Inter_700Bold" },
  field: { gap: 6 },
  fieldLabel: { color: "#71717a", fontSize: 12, fontFamily: "Inter_500Medium" },
  input: { backgroundColor: "#0d0d14", borderWidth: 1, borderColor: "#1e1e2a", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, color: "#fff", fontSize: 14, fontFamily: "Inter_400Regular" },
  formActions: { flexDirection: "row", gap: 10 },
  cancelBtn: { flex: 1, backgroundColor: "#1e1e2a", borderRadius: 10, paddingVertical: 12, alignItems: "center" },
  cancelBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
  saveBtn: { flex: 1, backgroundColor: "#0284c7", borderRadius: 10, paddingVertical: 12, alignItems: "center" },
  saveBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
});
