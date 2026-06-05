---
name: StreamTV expo-av player
description: How to correctly import and use expo-av Video in the StreamTV player
---

## Rule
Always use STATIC import for expo-av in player.tsx:
```ts
import { ResizeMode, Video } from "expo-av";
```

**Why:** Dynamic `import("expo-av")` in a useEffect fails silently on native Expo Go — the Video component never mounts and the player shows a blank screen. Static import is required for Expo Go compatibility.

**How to apply:** Any time the player is modified, ensure the import remains static at the top of the file.

## expo-av deprecation note
expo-av logs a deprecation warning (SDK 54 will remove it). When upgrading to SDK 54, migrate to `expo-video` (useVideoPlayer hook). expo-video requires a dev build, not compatible with Expo Go's bare workflow.

## Web behavior
On web, HLS streams often fail due to CORS. Use a `<video>` element (createElement hack) with `onCanPlay`/`onError` callbacks. Show a helpful Bengali error message for web failures.
