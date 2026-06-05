---
name: StreamTV IPTV data sources
description: Logo and channel data sources for the StreamTV Bengali IPTV app
---

## Rule
Use `https://raw.githubusercontent.com/FunctionError/PiratesTv/main/combined_playlist.m3u` as the PRIMARY source (loaded first sequentially). It has proper `tvg-logo` URLs and Bengali channel groups (Bangla, Bangla News, Live Sports, etc.).

**Why:** iptv-org streams (in.m3u, pk.m3u) never include `tvg-logo` attributes — logos would all be missing. The PiratesTv community playlist includes logo URLs pointing to `raw.githubusercontent.com/subirkumarpaul/Logo/` and other CDNs.

**How to apply:** Load PRIMARY_SOURCES before SECONDARY_SOURCES sequentially so Bengali channels with logos appear first in filtered sections.

## Logo URL construction
- PiratesTv channels: have `tvg-logo` attribute directly in M3U → parser uses it
- iptv-org channels: no logo in M3U → `getLogoUrl()` constructs `https://raw.githubusercontent.com/iptv-org/database/master/images/{channelId}.png` — these 404 but fallback to colored initials

## M3U parser quirks (PiratesTv format)
- Some lines have `tvg-logo=""` followed by real `tvg-logo="actual_url"` — use last non-empty value
- `group-title` is sometimes doubled: `group-title="Bangla" group-title=""` — use last non-empty value
- Space may be missing between attributes: `tvg-logo="..."group-title="..."` — regex still matches
