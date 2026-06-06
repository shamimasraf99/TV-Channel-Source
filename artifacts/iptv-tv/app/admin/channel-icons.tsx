import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
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
import { AdminChannelIcon } from "@/utils/adminConfig";

const EMPTY: AdminChannelIcon = { id: "", pattern: "", logoUrl: "" };

export default function ChannelIconsAdmin() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { config, setChannelIcons } = useAdminConfig();
  const [editing, setEditing] = useState<AdminChannelIcon | null>(null);
  const [form, setForm] = useState<AdminChannelIcon>(EMPTY);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  function openNew() { const e = { ...EMPTY, id: Date.now().toString() }; setForm(e); setEditing(e); }
  function openEdit(ic: AdminChannelIcon) { setForm({ ...ic }); setEditing(ic); }

  async function handleSave() {
    if (!form.pattern.trim()) { Alert.alert("ত্রুটি", "চ্যানেলের নাম/প্যাটার্ন দিন।"); return; }
    if (!form.logoUrl.trim()) { Alert.alert("ত্রুটি", "লোগো URL দিন।"); return; }
    const isNew = !config.channelIcons.find((ic) => ic.id === form.id);
    const next = isNew ? [...config.channelIcons, form] : config.channelIcons.map((ic) => (ic.id === form.id ? form : ic));
    await setChannelIcons(next);
    setEditing(null);
  }

  async function handleDelete(id: string) {
    Alert.alert("মুছুন", "এই আইকন ওভাররাইডটি মুছবেন?", [
      { text: "না", style: "cancel" },
      { text: "হ্যাঁ", style: "destructive", onPress: async () => { await setChannelIcons(config.channelIcons.filter((ic) => ic.id !== id)); } },
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
          <Text style={styles.pageTitle}>চ্যানেল আইকন</Text>
          <Text style={styles.pageSub}>চ্যানেলের লোগো কাস্টমাইজ করুন</Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={18} color="#0284c7" />
        <Text style={styles.infoText}>
          চ্যানেলের নামের অংশ লিখুন (যেমন: "t sports", "btv", "star sports 1")। মিলে গেলে এই লোগো দেখাবে।
        </Text>
      </View>

      {!editing && (
        <>
          {config.channelIcons.length === 0 && (
            <Text style={styles.emptyText}>কোনো আইকন ওভাররাইড নেই।</Text>
          )}
          {config.channelIcons.map((ic) => (
            <View key={ic.id} style={styles.card}>
              {ic.logoUrl ? (
                <Image source={{ uri: ic.logoUrl }} style={styles.logo} resizeMode="contain" />
              ) : (
                <View style={styles.logoPlaceholder}>
                  <Ionicons name="image" size={20} color="#444" />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.cardPattern}>{ic.pattern}</Text>
                <Text style={styles.cardUrl} numberOfLines={1}>{ic.logoUrl}</Text>
              </View>
              <View style={styles.cardActions}>
                <Pressable onPress={() => openEdit(ic)} hitSlop={10}><Ionicons name="pencil" size={18} color="#71717a" /></Pressable>
                <Pressable onPress={() => handleDelete(ic.id)} hitSlop={10}><Ionicons name="trash" size={18} color="#e11d48" /></Pressable>
              </View>
            </View>
          ))}

          <Pressable style={styles.addBtn} onPress={openNew}>
            <Ionicons name="add-circle" size={20} color="#059669" />
            <Text style={styles.addBtnText}>নতুন আইকন ওভাররাইড যোগ করুন</Text>
          </Pressable>
        </>
      )}

      {editing && (
        <View style={styles.formBox}>
          <Text style={styles.formTitle}>{config.channelIcons.find((ic) => ic.id === form.id) ? "আইকন সম্পাদনা" : "নতুন আইকন ওভাররাইড"}</Text>
          {[
            { label: "চ্যানেল নাম / প্যাটার্ন *", key: "pattern" as const, placeholder: "যেমন: t sports, btv, ntv" },
            { label: "লোগো URL *", key: "logoUrl" as const, placeholder: "https://example.com/logo.png" },
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
          {form.logoUrl ? (
            <View style={styles.previewRow}>
              <Image source={{ uri: form.logoUrl }} style={styles.previewImg} resizeMode="contain" />
              <Text style={styles.previewLabel}>প্রিভিউ</Text>
            </View>
          ) : null}
          <View style={styles.formActions}>
            <Pressable style={styles.cancelBtn} onPress={() => setEditing(null)}>
              <Text style={styles.cancelBtnText}>বাতিল</Text>
            </Pressable>
            <Pressable style={[styles.saveBtn, { backgroundColor: "#059669" }]} onPress={handleSave}>
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
  infoBox: { flexDirection: "row", gap: 10, backgroundColor: "#0284c711", borderRadius: 10, borderWidth: 1, borderColor: "#0284c733", padding: 12, alignItems: "flex-start" },
  infoText: { flex: 1, color: "#7dd3fc", fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
  emptyText: { color: "#444", fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", paddingVertical: 16 },
  card: { backgroundColor: "#111118", borderRadius: 12, borderWidth: 1, borderColor: "#1e1e2a", padding: 12, flexDirection: "row", alignItems: "center", gap: 12 },
  logo: { width: 48, height: 36, borderRadius: 6, backgroundColor: "#0d0d14" },
  logoPlaceholder: { width: 48, height: 36, borderRadius: 6, backgroundColor: "#0d0d14", alignItems: "center", justifyContent: "center" },
  cardPattern: { color: "#fff", fontSize: 14, fontFamily: "Inter_500Medium" },
  cardUrl: { color: "#71717a", fontSize: 12, fontFamily: "Inter_400Regular" },
  cardActions: { flexDirection: "row", alignItems: "center", gap: 12 },
  addBtn: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#111118", borderRadius: 12, borderWidth: 1, borderColor: "#05996922", borderStyle: "dashed", padding: 14, justifyContent: "center" },
  addBtnText: { color: "#059669", fontSize: 15, fontFamily: "Inter_500Medium" },
  formBox: { backgroundColor: "#111118", borderRadius: 14, borderWidth: 1, borderColor: "#1e1e2a", padding: 16, gap: 14 },
  formTitle: { color: "#fff", fontSize: 17, fontFamily: "Inter_700Bold" },
  field: { gap: 6 },
  fieldLabel: { color: "#71717a", fontSize: 12, fontFamily: "Inter_500Medium" },
  input: { backgroundColor: "#0d0d14", borderWidth: 1, borderColor: "#1e1e2a", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, color: "#fff", fontSize: 14, fontFamily: "Inter_400Regular" },
  previewRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  previewImg: { width: 80, height: 56, borderRadius: 8, backgroundColor: "#0d0d14" },
  previewLabel: { color: "#71717a", fontSize: 12, fontFamily: "Inter_500Medium" },
  formActions: { flexDirection: "row", gap: 10 },
  cancelBtn: { flex: 1, backgroundColor: "#1e1e2a", borderRadius: 10, paddingVertical: 12, alignItems: "center" },
  cancelBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
  saveBtn: { flex: 1, borderRadius: 10, paddingVertical: 12, alignItems: "center" },
  saveBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
});
