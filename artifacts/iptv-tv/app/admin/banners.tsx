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
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAdminConfig } from "@/context/AdminConfigContext";
import { AdminBanner } from "@/utils/adminConfig";
import { HERO_ITEMS } from "@/utils/categories";

const EMPTY_BANNER: AdminBanner = {
  id: "", badge: "", title: "", subtitle: "", imageUrl: "", category: "sports", enabled: true,
};

export default function BannersAdmin() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { config, setBanners, updateConfig } = useAdminConfig();
  const [editing, setEditing] = useState<AdminBanner | null>(null);
  const [form, setForm] = useState<AdminBanner>(EMPTY_BANNER);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  function openNew() {
    setForm({ ...EMPTY_BANNER, id: Date.now().toString() });
    setEditing({ ...EMPTY_BANNER, id: Date.now().toString() });
  }

  function openEdit(b: AdminBanner) {
    setForm({ ...b });
    setEditing(b);
  }

  async function handleSave() {
    if (!form.title.trim()) { Alert.alert("ত্রুটি", "শিরোনাম দিন।"); return; }
    if (!form.imageUrl.trim()) { Alert.alert("ত্রুটি", "ছবির URL দিন।"); return; }
    const isNew = !config.banners.find((b) => b.id === form.id);
    const next = isNew
      ? [...config.banners, form]
      : config.banners.map((b) => (b.id === form.id ? form : b));
    await setBanners(next);
    setEditing(null);
  }

  async function handleDelete(id: string) {
    Alert.alert("মুছে ফেলুন", "এই ব্যানারটি মুছে ফেলবেন?", [
      { text: "না", style: "cancel" },
      { text: "হ্যাঁ", style: "destructive", onPress: async () => {
        await setBanners(config.banners.filter((b) => b.id !== id));
      }},
    ]);
  }

  async function toggleItem(id: string) {
    await setBanners(config.banners.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b)));
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
          <Text style={styles.pageTitle}>ব্যানার ম্যানেজার</Text>
          <Text style={styles.pageSub}>হোম স্ক্রিনের হিরো ব্যানার</Text>
        </View>
      </View>

      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>কাস্টম ব্যানার ব্যবহার করুন</Text>
        <Switch
          value={config.bannersEnabled}
          onValueChange={(v) => updateConfig({ bannersEnabled: v })}
          trackColor={{ true: "#e11d48", false: "#333" }}
          thumbColor="#fff"
        />
      </View>
      <Text style={styles.helpText}>
        {config.bannersEnabled ? "কাস্টম ব্যানার সক্রিয় — নিচের ব্যানারগুলো দেখাবে।" : "বন্ধ থাকলে ডিফল্ট FIFA/ক্রিকেট ব্যানার দেখাবে।"}
      </Text>

      {!editing && (
        <>
          <Text style={styles.sectionLabel}>ডিফল্ট ব্যানার (পরিবর্তনযোগ্য নয়)</Text>
          {HERO_ITEMS.map((item) => (
            <View key={item.id} style={[styles.card, { opacity: 0.55 }]}>
              <View style={styles.cardLeft}>
                <View style={styles.thumbPlaceholder}>
                  <Ionicons name="images" size={20} color="#444" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardBadge}>{item.badge}</Text>
                  <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                </View>
              </View>
              <View style={styles.defaultBadge}><Text style={styles.defaultBadgeText}>ডিফল্ট</Text></View>
            </View>
          ))}

          <Text style={styles.sectionLabel}>কাস্টম ব্যানার</Text>
          {config.banners.length === 0 && (
            <Text style={styles.emptyText}>কোনো কাস্টম ব্যানার নেই।</Text>
          )}
          {config.banners.map((b) => (
            <View key={b.id} style={styles.card}>
              <View style={styles.cardLeft}>
                {b.imageUrl ? (
                  <Image source={{ uri: b.imageUrl }} style={styles.thumb} />
                ) : (
                  <View style={styles.thumbPlaceholder}>
                    <Ionicons name="image" size={20} color="#444" />
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardBadge}>{b.badge || "—"}</Text>
                  <Text style={styles.cardTitle} numberOfLines={1}>{b.title}</Text>
                </View>
              </View>
              <View style={styles.cardActions}>
                <Switch
                  value={b.enabled}
                  onValueChange={() => toggleItem(b.id)}
                  trackColor={{ true: "#e11d48", false: "#333" }}
                  thumbColor="#fff"
                  style={{ transform: [{ scale: 0.8 }] }}
                />
                <Pressable onPress={() => openEdit(b)} hitSlop={10}>
                  <Ionicons name="pencil" size={18} color="#71717a" />
                </Pressable>
                <Pressable onPress={() => handleDelete(b.id)} hitSlop={10}>
                  <Ionicons name="trash" size={18} color="#e11d48" />
                </Pressable>
              </View>
            </View>
          ))}

          <Pressable style={styles.addBtn} onPress={openNew}>
            <Ionicons name="add-circle" size={20} color="#e11d48" />
            <Text style={styles.addBtnText}>নতুন ব্যানার যোগ করুন</Text>
          </Pressable>
        </>
      )}

      {editing && (
        <View style={styles.formBox}>
          <Text style={styles.formTitle}>{config.banners.find((b) => b.id === form.id) ? "ব্যানার সম্পাদনা" : "নতুন ব্যানার"}</Text>
          {[
            { label: "ব্যাজ টেক্সট (যেমন: লাইভ স্পোর্টস)", key: "badge" as const },
            { label: "শিরোনাম *", key: "title" as const },
            { label: "বিবরণ", key: "subtitle" as const },
            { label: "ছবির URL *", key: "imageUrl" as const },
            { label: "ক্যাটাগরি (sports/bangla/news/all)", key: "category" as const },
          ].map(({ label, key }) => (
            <View key={key} style={styles.field}>
              <Text style={styles.fieldLabel}>{label}</Text>
              <TextInput
                style={styles.input}
                value={form[key]}
                onChangeText={(v) => setForm((p) => ({ ...p, [key]: v }))}
                placeholder={label}
                placeholderTextColor="#444"
              />
            </View>
          ))}

          {form.imageUrl ? (
            <Image source={{ uri: form.imageUrl }} style={styles.preview} resizeMode="cover" />
          ) : null}

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
  cardLeft: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  thumb: { width: 52, height: 36, borderRadius: 6, backgroundColor: "#0d0d14" },
  thumbPlaceholder: { width: 52, height: 36, borderRadius: 6, backgroundColor: "#0d0d14", alignItems: "center", justifyContent: "center" },
  cardBadge: { color: "#e11d48", fontSize: 11, fontFamily: "Inter_600SemiBold" },
  cardTitle: { color: "#fff", fontSize: 14, fontFamily: "Inter_500Medium" },
  cardActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  defaultBadge: { backgroundColor: "#1e1e2a", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  defaultBadgeText: { color: "#71717a", fontSize: 11, fontFamily: "Inter_500Medium" },
  emptyText: { color: "#444", fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", paddingVertical: 8 },
  addBtn: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#111118", borderRadius: 12, borderWidth: 1, borderColor: "#e11d482a", borderStyle: "dashed", padding: 14, justifyContent: "center" },
  addBtnText: { color: "#e11d48", fontSize: 15, fontFamily: "Inter_500Medium" },
  formBox: { backgroundColor: "#111118", borderRadius: 14, borderWidth: 1, borderColor: "#1e1e2a", padding: 16, gap: 14 },
  formTitle: { color: "#fff", fontSize: 17, fontFamily: "Inter_700Bold" },
  field: { gap: 6 },
  fieldLabel: { color: "#71717a", fontSize: 12, fontFamily: "Inter_500Medium" },
  input: { backgroundColor: "#0d0d14", borderWidth: 1, borderColor: "#1e1e2a", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, color: "#fff", fontSize: 14, fontFamily: "Inter_400Regular" },
  preview: { width: "100%", height: 120, borderRadius: 10 },
  formActions: { flexDirection: "row", gap: 10 },
  cancelBtn: { flex: 1, backgroundColor: "#1e1e2a", borderRadius: 10, paddingVertical: 12, alignItems: "center" },
  cancelBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
  saveBtn: { flex: 1, backgroundColor: "#e11d48", borderRadius: 10, paddingVertical: 12, alignItems: "center" },
  saveBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
});
