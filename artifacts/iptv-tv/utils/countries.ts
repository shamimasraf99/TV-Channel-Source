export interface Country {
  code: string;
  name: string;
  flag: string;
  region: string;
}

export const COUNTRIES: Country[] = [
  { code: "us", name: "United States", flag: "🇺🇸", region: "Americas" },
  { code: "gb", name: "United Kingdom", flag: "🇬🇧", region: "Europe" },
  { code: "ca", name: "Canada", flag: "🇨🇦", region: "Americas" },
  { code: "au", name: "Australia", flag: "🇦🇺", region: "Asia Pacific" },
  { code: "in", name: "India", flag: "🇮🇳", region: "Asia Pacific" },
  { code: "fr", name: "France", flag: "🇫🇷", region: "Europe" },
  { code: "de", name: "Germany", flag: "🇩🇪", region: "Europe" },
  { code: "es", name: "Spain", flag: "🇪🇸", region: "Europe" },
  { code: "it", name: "Italy", flag: "🇮🇹", region: "Europe" },
  { code: "br", name: "Brazil", flag: "🇧🇷", region: "Americas" },
  { code: "mx", name: "Mexico", flag: "🇲🇽", region: "Americas" },
  { code: "jp", name: "Japan", flag: "🇯🇵", region: "Asia Pacific" },
  { code: "kr", name: "South Korea", flag: "🇰🇷", region: "Asia Pacific" },
  { code: "ru", name: "Russia", flag: "🇷🇺", region: "Europe" },
  { code: "tr", name: "Turkey", flag: "🇹🇷", region: "Europe" },
  { code: "nl", name: "Netherlands", flag: "🇳🇱", region: "Europe" },
  { code: "pl", name: "Poland", flag: "🇵🇱", region: "Europe" },
  { code: "pt", name: "Portugal", flag: "🇵🇹", region: "Europe" },
  { code: "ar", name: "Argentina", flag: "🇦🇷", region: "Americas" },
  { code: "id", name: "Indonesia", flag: "🇮🇩", region: "Asia Pacific" },
  { code: "pk", name: "Pakistan", flag: "🇵🇰", region: "Asia Pacific" },
  { code: "sa", name: "Saudi Arabia", flag: "🇸🇦", region: "Middle East" },
  { code: "ae", name: "UAE", flag: "🇦🇪", region: "Middle East" },
  { code: "eg", name: "Egypt", flag: "🇪🇬", region: "Middle East" },
  { code: "za", name: "South Africa", flag: "🇿🇦", region: "Africa" },
  { code: "ng", name: "Nigeria", flag: "🇳🇬", region: "Africa" },
  { code: "ph", name: "Philippines", flag: "🇵🇭", region: "Asia Pacific" },
  { code: "my", name: "Malaysia", flag: "🇲🇾", region: "Asia Pacific" },
  { code: "th", name: "Thailand", flag: "🇹🇭", region: "Asia Pacific" },
  { code: "se", name: "Sweden", flag: "🇸🇪", region: "Europe" },
  { code: "no", name: "Norway", flag: "🇳🇴", region: "Europe" },
  { code: "dk", name: "Denmark", flag: "🇩🇰", region: "Europe" },
  { code: "fi", name: "Finland", flag: "🇫🇮", region: "Europe" },
  { code: "gr", name: "Greece", flag: "🇬🇷", region: "Europe" },
  { code: "ro", name: "Romania", flag: "🇷🇴", region: "Europe" },
  { code: "hu", name: "Hungary", flag: "🇭🇺", region: "Europe" },
  { code: "cz", name: "Czech Republic", flag: "🇨🇿", region: "Europe" },
  { code: "ua", name: "Ukraine", flag: "🇺🇦", region: "Europe" },
  { code: "rs", name: "Serbia", flag: "🇷🇸", region: "Europe" },
  { code: "co", name: "Colombia", flag: "🇨🇴", region: "Americas" },
  { code: "cl", name: "Chile", flag: "🇨🇱", region: "Americas" },
  { code: "pe", name: "Peru", flag: "🇵🇪", region: "Americas" },
  { code: "ve", name: "Venezuela", flag: "🇻🇪", region: "Americas" },
  { code: "cn", name: "China", flag: "🇨🇳", region: "Asia Pacific" },
  { code: "tw", name: "Taiwan", flag: "🇹🇼", region: "Asia Pacific" },
  { code: "hk", name: "Hong Kong", flag: "🇭🇰", region: "Asia Pacific" },
  { code: "sg", name: "Singapore", flag: "🇸🇬", region: "Asia Pacific" },
  { code: "vn", name: "Vietnam", flag: "🇻🇳", region: "Asia Pacific" },
  { code: "ir", name: "Iran", flag: "🇮🇷", region: "Middle East" },
  { code: "iq", name: "Iraq", flag: "🇮🇶", region: "Middle East" },
];

export const REGIONS = [...new Set(COUNTRIES.map((c) => c.region))];

export function getStreamUrl(countryCode: string): string {
  return `https://iptv-org.github.io/iptv/streams/${countryCode}.m3u`;
}

export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code);
}
