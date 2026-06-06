import { ImageSourcePropType } from "react-native";

// ── Local assets (bundled in the app) ───────────────────────────────────────
const LOCAL_LOGO_MAP: Array<{ patterns: string[]; source: ImageSourcePropType }> = [
  {
    patterns: ["t sports", "tsports", "t-sports"],
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    source: require("@/assets/logos/t_sports.png"),
  },
];

// ── Remote URL logos (reliable Wikipedia/CDN sources) ───────────────────────
// These are FALLBACK only — used when a channel has no tvg-logo in the M3U.
// Patterns are matched case-insensitively with String.includes().
const URL_LOGO_MAP: Array<{ patterns: string[]; url: string }> = [

  // ═══ বাংলাদেশ ═══════════════════════════════════════════════════════════════
  {
    patterns: ["bangladesh television", "btv world", "btv national", "btv"],
    url: "https://upload.wikimedia.org/wikipedia/en/f/fb/Bangladesh_Television.svg",
  },
  {
    patterns: ["atn bangla"],
    url: "https://upload.wikimedia.org/wikipedia/en/5/51/ATN_Bangla_Logo.jpg",
  },
  {
    patterns: ["atn news"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/3/3a/ATN_News_Logo.svg/200px-ATN_News_Logo.svg.png",
  },
  {
    patterns: ["jamuna television", "jamuna tv"],
    url: "https://upload.wikimedia.org/wikipedia/en/3/33/Jamuna_Television_Logo.png",
  },
  {
    patterns: ["channel i", "channeli", "channel-i"],
    url: "https://upload.wikimedia.org/wikipedia/en/b/bf/Channel_i_logo.png",
  },
  {
    patterns: ["somoy tv", "somoy television"],
    url: "https://upload.wikimedia.org/wikipedia/en/e/ef/Somoy_tv.png",
  },
  {
    patterns: ["ntv bangladesh", "ntv bangla", " ntv "],
    url: "https://upload.wikimedia.org/wikipedia/en/7/70/NTV_Bangladesh.png",
  },
  {
    patterns: ["rtv bangladesh", "r tv bangladesh"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/b/bd/RTV_Bangladesh_Logo.svg/200px-RTV_Bangladesh_Logo.svg.png",
  },
  {
    patterns: ["maasranga", "masranga tv"],
    url: "https://upload.wikimedia.org/wikipedia/en/7/73/Maasranga_Television_logo.png",
  },
  {
    patterns: ["independent television", "independent tv"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/3/38/ITV_Logo_%28Bangladesh%29.svg/200px-ITV_Logo_%28Bangladesh%29.svg.png",
  },
  {
    patterns: ["sa tv", "satv"],
    url: "https://upload.wikimedia.org/wikipedia/en/b/b9/SA_TV_logo.png",
  },
  {
    patterns: ["boishakhi", "baishakhi"],
    url: "https://upload.wikimedia.org/wikipedia/en/7/71/Boishakhi_TV_logo.png",
  },
  {
    patterns: ["desh tv", "desh television"],
    url: "https://upload.wikimedia.org/wikipedia/en/8/89/Desh_TV_Logo.png",
  },
  {
    patterns: ["news24 bangla", "news24 bangladesh", "news24bd"],
    url: "https://upload.wikimedia.org/wikipedia/en/6/60/News24_Bangladesh.png",
  },
  {
    patterns: ["ekhon tv", "ekhon"],
    url: "https://upload.wikimedia.org/wikipedia/en/1/1c/Ekhon_TV_Logo.png",
  },
  {
    patterns: ["banglavision", "bangla vision"],
    url: "https://upload.wikimedia.org/wikipedia/en/b/b5/Banglavision_Logo.png",
  },
  {
    patterns: ["gazi tv", "gazi television"],
    url: "https://upload.wikimedia.org/wikipedia/en/3/37/Gazi_TV_Logo.png",
  },
  {
    patterns: ["channel 24", "channel24"],
    url: "https://upload.wikimedia.org/wikipedia/en/0/0b/Channel_24_BD_logo.png",
  },

  // ═══ স্পোর্টস ═══════════════════════════════════════════════════════════════
  {
    patterns: ["star sports 1 hd", "star sports 1", "star sports1", "starsports1"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Star_Sports_India_logo.svg/200px-Star_Sports_India_logo.svg.png",
  },
  {
    patterns: ["star sports 2 hd", "star sports 2", "star sports2", "starsports2"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Star_Sports_India_logo.svg/200px-Star_Sports_India_logo.svg.png",
  },
  {
    patterns: ["star sports 3", "star sports3"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Star_Sports_India_logo.svg/200px-Star_Sports_India_logo.svg.png",
  },
  {
    patterns: ["star sports select", "star sports"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Star_Sports_India_logo.svg/200px-Star_Sports_India_logo.svg.png",
  },
  {
    patterns: ["dd sports", "dd sport"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1f/DD_Sports_logo.svg/200px-DD_Sports_logo.svg.png",
  },
  {
    patterns: ["espn hd", "espn"],
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/ESPN_wordmark.svg/200px-ESPN_wordmark.svg.png",
  },
  {
    patterns: ["bein sports", "bein sport", "beinsports"],
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/BeIN_Sports_logo.svg/200px-BeIN_Sports_logo.svg.png",
  },
  {
    patterns: ["willow hd", "willow tv", "willow cricket", "willow"],
    url: "https://upload.wikimedia.org/wikipedia/en/4/4a/Willow_logo.png",
  },
  {
    patterns: ["ptv sports", "ptv sport"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/8/82/PTV_Sports_logo.svg/200px-PTV_Sports_logo.svg.png",
  },
  {
    patterns: ["ten sports", "tensports"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/1/12/TEN_Sports_logo.svg/200px-TEN_Sports_logo.svg.png",
  },
  {
    patterns: ["sony sports 1", "sony sports1", "sony ten 1", "ten1 hd"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/Sony_Sports_Network_logo.svg/200px-Sony_Sports_Network_logo.svg.png",
  },
  {
    patterns: ["sony sports 2", "sony sports2", "sony ten 2", "ten2 hd"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/Sony_Sports_Network_logo.svg/200px-Sony_Sports_Network_logo.svg.png",
  },
  {
    patterns: ["sony sports 3", "sony sports3", "sony ten 3", "ten3 hd"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/Sony_Sports_Network_logo.svg/200px-Sony_Sports_Network_logo.svg.png",
  },
  {
    patterns: ["sony sports 5", "sony ten 5", "ten5"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/Sony_Sports_Network_logo.svg/200px-Sony_Sports_Network_logo.svg.png",
  },
  {
    patterns: ["cricket 24", "cricket24"],
    url: "https://upload.wikimedia.org/wikipedia/en/d/d4/Cricket24_logo.png",
  },
  {
    patterns: ["sky sports"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/Sky_Sports_logo_2020.svg/200px-Sky_Sports_logo_2020.svg.png",
  },
  {
    patterns: ["eurosport"],
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Eurosport_logo_2015.svg/200px-Eurosport_logo_2015.svg.png",
  },
  {
    patterns: ["football world cup", "world cup 2026", "fifa world cup"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/2026_FIFA_World_Cup_emblem.svg/200px-2026_FIFA_World_Cup_emblem.svg.png",
  },
  {
    patterns: ["live sports", "live sport"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Star_Sports_India_logo.svg/200px-Star_Sports_India_logo.svg.png",
  },

  // ═══ ভারতীয় বিনোদন ══════════════════════════════════════════════════════
  {
    patterns: ["star plus hd", "star plus", "starplus"],
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Star_Plus_logo.svg/200px-Star_Plus_logo.svg.png",
  },
  {
    patterns: ["zee tv hd", "zee tv", "zee television"],
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Zee_TV_logo.svg/200px-Zee_TV_logo.svg.png",
  },
  {
    patterns: ["sony entertainment", "sony set", "set india"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/e/ef/Sony_Entertainment_Television_2017_logo.svg/200px-Sony_Entertainment_Television_2017_logo.svg.png",
  },
  {
    patterns: ["colors hd", "colors tv", "colours tv"],
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Colors_TV_logo.svg/200px-Colors_TV_logo.svg.png",
  },
  {
    patterns: ["star vijay", "vijay tv"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6a/Star_Vijay_logo.svg/200px-Star_Vijay_logo.svg.png",
  },
  {
    patterns: ["star jalsha", "jalsha"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Star_Jalsha_Logo.svg/200px-Star_Jalsha_Logo.svg.png",
  },
  {
    patterns: ["zee bangla", "zee banla"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/Zee_Bangla_logo.svg/200px-Zee_Bangla_logo.svg.png",
  },
  {
    patterns: ["colors bangla", "colours bangla"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Colors_Bangla.svg/200px-Colors_Bangla.svg.png",
  },
  {
    patterns: ["sony aath", "aath"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/b/bc/Sony_Aath_Logo.svg/200px-Sony_Aath_Logo.svg.png",
  },
  {
    patterns: ["star gold", "stargold"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b7/Star_Gold_logo.svg/200px-Star_Gold_logo.svg.png",
  },
  {
    patterns: ["zee cinema hd", "zee cinema"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Zee_Cinema.svg/200px-Zee_Cinema.svg.png",
  },
  {
    patterns: ["sony max hd", "sony max"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d2/Sony_Max_2017_Logo.svg/200px-Sony_Max_2017_Logo.svg.png",
  },
  {
    patterns: ["&pictures", "and pictures"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/%26pictures_logo.svg/200px-%26pictures_logo.svg.png",
  },
  {
    patterns: ["star movies hd", "star movies"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/7/73/Star_Movies_India_logo.svg/200px-Star_Movies_India_logo.svg.png",
  },
  {
    patterns: ["&tv", "and tv", "andtv"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/%26TV_logo.svg/200px-%26TV_logo.svg.png",
  },
  {
    patterns: ["sony pal"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/7/79/Sony_Pal_Logo.svg/200px-Sony_Pal_Logo.svg.png",
  },
  {
    patterns: ["sun tv"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Sun_TV_logo.svg/200px-Sun_TV_logo.svg.png",
  },
  {
    patterns: ["asianet hd", "asianet"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c0/Asianet_logo.svg/200px-Asianet_logo.svg.png",
  },
  {
    patterns: ["dd national", "doordarshan", "dd india"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/2/2c/DD_National_logo.svg/200px-DD_National_logo.svg.png",
  },
  {
    patterns: ["hbo hd", "hbo"],
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/HBO_logo.svg/200px-HBO_logo.svg.png",
  },
  {
    patterns: ["national geographic hd", "nat geo wild", "national geographic", "nat geo"],
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Logo_of_National_Geographic.svg/200px-Logo_of_National_Geographic.svg.png",
  },
  {
    patterns: ["discovery channel hd", "discovery channel", "discovery"],
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Discovery_Channel_logo.svg/200px-Discovery_Channel_logo.svg.png",
  },
  {
    patterns: ["cartoon network hd", "cartoon network"],
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Cartoon_Network_2010_logo.svg/200px-Cartoon_Network_2010_logo.svg.png",
  },
  {
    patterns: ["nickelodeon hd", "nickelodeon", "nick hd"],
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Nickelodeon_2023_logo_%28outline%29.svg/200px-Nickelodeon_2023_logo_%28outline%29.svg.png",
  },
  {
    patterns: ["pogo tv", "pogo"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6d/POGO_2019_Logo.svg/200px-POGO_2019_Logo.svg.png",
  },
  {
    patterns: ["mtv hd", "mtv"],
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/MTV_2021_logo.svg/200px-MTV_2021_logo.svg.png",
  },

  // ═══ সংবাদ ══════════════════════════════════════════════════════════════════
  {
    patterns: ["bbc world news", "bbc world", "bbc news", "bbc"],
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/BBC_Logo_2021.svg/200px-BBC_Logo_2021.svg.png",
  },
  {
    patterns: ["cnn international", "cnn"],
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/CNN.svg/200px-CNN.svg.png",
  },
  {
    patterns: ["al jazeera english", "al jazeera", "aljazeera"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Al_Jazeera_Media_Network_Logo.svg/200px-Al_Jazeera_Media_Network_Logo.svg.png",
  },
  {
    patterns: ["ndtv 24x7", "ndtv profit", "ndtv"],
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/NDTV-logo.svg/200px-NDTV-logo.svg.png",
  },
  {
    patterns: ["republic tv", "republic bharat", "republic"],
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Republic_TV_Logo.svg/200px-Republic_TV_Logo.svg.png",
  },
  {
    patterns: ["times now navbharat", "times now world", "times now"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7b/Times_Now_logo.svg/200px-Times_Now_logo.svg.png",
  },
  {
    patterns: ["aaj tak hd", "aaj tak"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7d/Aaj_Tak_logo.svg/200px-Aaj_Tak_logo.svg.png",
  },
  {
    patterns: ["india today"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/a/ad/IndiaToday_logo.svg/200px-IndiaToday_logo.svg.png",
  },
  {
    patterns: ["abp news", "abp live", "abp ananda"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/ABP_News_India_logo.svg/200px-ABP_News_India_logo.svg.png",
  },
  {
    patterns: ["news18 india", "news18 bangla", "cnn news18", "news18", "news 18"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7f/News18_India_logo.svg/200px-News18_India_logo.svg.png",
  },
  {
    patterns: ["wion"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a0/WION_Logo.svg/200px-WION_Logo.svg.png",
  },
  {
    patterns: ["france 24"],
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/France_24_Logo.svg/200px-France_24_Logo.svg.png",
  },
  {
    patterns: ["dw news", "deutsche welle", "dw english", "dw"],
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Deutsche_Welle_symbol_2012.svg/200px-Deutsche_Welle_symbol_2012.svg.png",
  },
  {
    patterns: ["sky news"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/8/87/Sky_News_logo_2020.svg/200px-Sky_News_logo_2020.svg.png",
  },
  {
    patterns: ["euronews"],
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Euronews_logo.svg/200px-Euronews_logo.svg.png",
  },
  {
    patterns: ["channel news asia", "cna"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/7/73/CNA_logo.svg/200px-CNA_logo.svg.png",
  },

  // ═══ পাকিস্তানি ══════════════════════════════════════════════════════════════
  {
    patterns: ["ary news"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/a/ac/ARY_News_Logo.svg/200px-ARY_News_Logo.svg.png",
  },
  {
    patterns: ["ary digital", "ary drama", "ary zindagi"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/ARY_Digital_Logo.svg/200px-ARY_Digital_Logo.svg.png",
  },
  {
    patterns: ["geo news"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/5/55/Geo_News_logo.svg/200px-Geo_News_logo.svg.png",
  },
  {
    patterns: ["geo entertainment", "geo kahani", "geo tv"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Geo_Entertainment_Logo.svg/200px-Geo_Entertainment_Logo.svg.png",
  },
  {
    patterns: ["hum tv"],
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Hum_TV_logo.svg/200px-Hum_TV_logo.svg.png",
  },
  {
    patterns: ["ptv home", "ptv news", "ptv national", "ptv"],
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Pakistan_Television_Corporation_logo.svg/200px-Pakistan_Television_Corporation_logo.svg.png",
  },
  {
    patterns: ["samaa tv", "samaa news", "samaa"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/5/54/Samaa_TV_logo.svg/200px-Samaa_TV_logo.svg.png",
  },
  {
    patterns: ["dawn news", "dawn tv"],
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Dawn_News_Logo.svg/200px-Dawn_News_Logo.svg.png",
  },
  {
    patterns: ["express news", "express entertainment", "express tv"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/Express_News_Pakistan_logo.svg/200px-Express_News_Pakistan_logo.svg.png",
  },
  {
    patterns: ["a plus entertainment", "a plus", "aplus"],
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/A_Plus_Entertainment.svg/200px-A_Plus_Entertainment.svg.png",
  },
];

export function getLocalLogo(channelName: string): ImageSourcePropType | null {
  const lower = channelName.toLowerCase();
  for (const entry of LOCAL_LOGO_MAP) {
    if (entry.patterns.some((p) => lower.includes(p))) return entry.source;
  }
  return null;
}

export function getUrlLogo(channelName: string): string | null {
  const lower = channelName.toLowerCase();
  for (const entry of URL_LOGO_MAP) {
    if (entry.patterns.some((p) => lower.includes(p))) return entry.url;
  }
  return null;
}
