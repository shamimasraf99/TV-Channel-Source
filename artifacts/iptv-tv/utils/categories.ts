export interface Category {
  key: string;
  label: string;
  keywords: string[];
}

export const CATEGORIES: Category[] = [
  { key: "all", label: "সব চ্যানেল", keywords: [] },
  {
    key: "sports",
    label: "স্পোর্টস",
    keywords: ["sport", "cricket", "football", "soccer", "tennis", "live sports", "world cup", "ipl", "tsports", "t sports", "willow", "star sport", "sony sport", "dd sport", "ptv sport"],
  },
  {
    key: "ipl",
    label: "আইপিএল ২০২৬",
    keywords: ["ipl", "cricket gold", "t sports", "willow", "star sports", "sony sports", "world cup 2026"],
  },
  {
    key: "bangla",
    label: "বাংলা",
    keywords: ["bangla", "bangladesh", "atn", "ntv", "jamuna", "btv", "channel i", "rtv", "desh", "ekhon", "boishakhi", "sa tv", "kaler"],
  },
  {
    key: "news",
    label: "সংবাদ",
    keywords: ["news", "bangla news", "সংবাদ", "newsx", "ndtv", "republic", "times now", "cnn", "bbc", "al jazeera"],
  },
  {
    key: "movies",
    label: "সিনেমা",
    keywords: ["movie", "cinema", "film", "bangla movie", "kolkata", "hbo", "movies now"],
  },
];

export function mapGroupToBengali(group: string): string {
  const g = group.toLowerCase();
  if (g.includes("sport") || g.includes("cricket") || g.includes("live sport")) return "স্পোর্টস";
  if (g.includes("bangla news") || g.includes("news")) return "সংবাদ";
  if (g.includes("bangla movie") || g.includes("movie") || g.includes("kolkata bangla movie")) return "সিনেমা";
  if (g.includes("bangla") || g.includes("kolkata bangla")) return "বাংলা";
  if (g.includes("music")) return "সঙ্গীত";
  if (g.includes("religi") || g.includes("islamic") || g.includes("islam")) return "ধর্মীয়";
  if (g.includes("kids") || g.includes("child")) return "শিশু";
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
    badge: "বাংলা চ্যানেল",
    title: "সেরা বাংলা চ্যানেল",
    subtitle: "এটিএন বাংলা, এনটিভি, যমুনা টিভি সহ সকল বাংলা চ্যানেল একসাথে।",
    image: "",
    category: "bangla",
  },
];
