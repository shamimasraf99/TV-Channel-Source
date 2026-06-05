export interface Category {
  key: string;
  label: string;
  keywords: string[];
}

export const CATEGORIES: Category[] = [
  { key: "all", label: "সব চ্যানেল", keywords: [] },
  { key: "sports", label: "স্পোর্টস", keywords: ["sport", "cricket", "football", "soccer", "tennis", "ipl"] },
  { key: "ipl", label: "আইপিএল ২০২৬", keywords: ["ipl", "cricket", "cricket gold", "t sports", "willow", "star sports"] },
  { key: "news", label: "সংবাদ", keywords: ["news", "সংবাদ", "খবর", "newsx", "ndtv", "republic", "times now", "cnn", "bbc"] },
  { key: "entertainment", label: "বিনোদন", keywords: ["entertainment", "zee", "sony", "star", "colors", "sun", "drama"] },
  { key: "movies", label: "সিনেমা", keywords: ["movie", "cinema", "film", "hbo", "movies"] },
];

export function mapGroupToBengali(group: string): string {
  const g = group.toLowerCase();
  if (g.includes("sport") || g.includes("cricket")) return "স্পোর্টস";
  if (g.includes("news")) return "সংবাদ";
  if (g.includes("entertainment")) return "বিনোদন";
  if (g.includes("movie") || g.includes("film") || g.includes("cinema")) return "সিনেমা";
  if (g.includes("music")) return "সঙ্গীত";
  if (g.includes("kids") || g.includes("child")) return "শিশু";
  if (g.includes("religi") || g.includes("islam") || g.includes("spiritual")) return "ধর্মীয়";
  return "সাধারণ";
}

export function matchesCategory(name: string, group: string, category: Category): boolean {
  if (category.key === "all") return true;
  const combined = `${name} ${group}`.toLowerCase();
  return category.keywords.some((kw) => combined.includes(kw.toLowerCase()));
}

export const HERO_ITEMS = [
  {
    id: "hero1",
    badge: "লাইভ স্পোর্টস",
    title: "বাংলাদেশ বনাম ভারত",
    subtitle: "বিশ্বকাপের টানটান উত্তেজনা সরাসরি উপভোগ করুন এইচ-ডি কোয়ালিটিতে, বাফারিং ছাড়া।",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Cricket_Guyana.jpg/1280px-Cricket_Guyana.jpg",
    category: "sports",
  },
  {
    id: "hero2",
    badge: "লাইভ ক্রিকেট",
    title: "আইপিএল ২০২৬ সরাসরি",
    subtitle: "প্রিমিয়াম চ্যানেলে ক্রিকেটের সেরা লড়াই দেখুন একদম বিনামূল্যে।",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Cricket_field_in_Colombo.jpg/1280px-Cricket_field_in_Colombo.jpg",
    category: "ipl",
  },
  {
    id: "hero3",
    badge: "লাইভ নিউজ",
    title: "সর্বশেষ সংবাদ",
    subtitle: "দেশ ও বিশ্বের সর্বশেষ সংবাদ সরাসরি দেখুন সেরা চ্যানেলগুলোতে।",
    image: "",
    category: "news",
  },
];
