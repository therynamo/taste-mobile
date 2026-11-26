# Asset licensing for bundled mobile assets

Open this before you add any photo, illustration, icon set or font to a mobile project, and
before you draw the app icon. A mobile app bundles assets into a binary, and some licences
forbid that.

## The honesty rule

A found picture is never presented as the client's own product, room, dish, person or team.

- Do not use a stock or museum image as "our shop", "our team" or "our dish". Instead, use it as
  atmosphere, texture or editorial illustration, or leave a clearly marked slot for the client's
  own photo.
- Do not skip pictures because finding them is work. Instead, search a bundle-safe source below.

## Sources

| Source | Licence | Bundle in the binary? | Attribution | Key constraint |
|---|---|---|---|---|
| The Met Open Access | CC0 | Yes | Not required | - |
| Wikimedia Commons | Per file | Check each file page | Credit the author (not the uploader); honour share-alike | Trademark and personality rights still apply |
| Openverse | Filterable CC | Yes, with a CC0 or public-domain filter | Per licence | Rate-limited (HTTP 429) |
| Pexels | Pexels License | Yes | Not required | No redistribution on wallpaper or stock platforms |
| Unsplash API | API terms | No. Runtime only | Photographer and Unsplash, with UTM links | Hotlink the returned URLs; ping `download_location`; no wallpaper apps |
| SF Symbols | Apple SDK licence | iOS builds only | - | Apple platforms only; no Android or web glyphs (text-sourced: forum consensus) |
| Material Symbols | Apache-2.0 | Yes, cross-platform | Licence notice | - |
| Lucide | ISC | Yes, cross-platform | Licence notice | - |
| Phosphor | MIT | Yes, cross-platform | Licence notice | Its React Native package is thinly maintained |
| Google Fonts | OFL 1.1 or Apache 2.0, per directory | Yes | Licence notice | Check each family's directory |

Image rules:

- For bundled images, prefer CC0 and public-domain sources (The Met, CC0-filtered Openverse,
  Wikimedia public-domain files) and Pexels.
- Never download an Unsplash photo into the bundle. Instead, load it at runtime from the
  returned `photo.urls`, hit `photo.links.download_location`, and credit the photographer and
  Unsplash with `?utm_source=your_app_name&utm_medium=referral` on the links.
- Do not use Pexels or Unsplash in a wallpaper-style app. Instead, use CC0 or public-domain
  sources.
- Pexels also forbids showing identifiable people "in a bad light", selling unaltered copies,
  trademark use and implying endorsement.
- On Commons, read each file page. Attribution is recommended even for public-domain files.
- A licence covers copyright only. Do not ship a recognisable person or a trademark as if it
  endorsed the app. Instead, pick an image without either.
- Export every bundled image at @2x and @3x, cropped per aspect ratio.

Font rules:

- In the google/fonts repository the top-level directory names the licence: `ofl/`, `apache/`,
  `ufl/`, `cc-by-sa/`. Check the family's directory before bundling.
- Google Sans Flex is published under the OFL.
- In Expo, a dealt display face must ship a named instance for every weight it uses. See
  `stacks.md`.

## Cross-platform icon policy

1. Pick one open family for the whole app: Lucide, Phosphor or Material Symbols.
2. Use SF Symbols only through native iOS rendering, with the open family as the Android
   fallback.
3. Never ship SF Symbol glyphs as PNG or SVG in an Android or web build. It is a licence risk.
   Instead, use the open family's glyph there.
4. Do not mix icon families on one screen. Instead, keep the one family from step 1.

React Native / Expo: `lucide-react-native` for the open family; `expo-symbols` for SF Symbols on
iOS.

## Record every asset

Write an `ASSETS.json` sidecar next to the bundled assets. Add an entry for every found asset,
even when the licence needs no credit.

| Field | Content |
|---|---|
| Source URL | The page the file came from |
| Author | The creator's name |
| Licence | The licence name as stated on that page |

## Acknowledgements screen

Credits need a home inside the app; there is no web footer. Put an Acknowledgements screen in
Settings (unverified: an inference, not a sourced platform rule).

- List each image that needs credit: title, author, licence, source.
- List the licence notices for icon families and fonts (Apache-2.0, ISC, MIT, OFL).
- Honour share-alike terms for any derivative of a share-alike file.
- Build the screen from `ASSETS.json` so it cannot drift from the bundle.
- Do not hide required credits in a repository file only. Instead, show them in the app.

## App icon layers (iOS)

| Rule | Instead of |
|---|---|
| A background layer plus one or more foreground layers | A single flattened image |
| Square, unmasked layers; the system applies the mask | Pre-masked art (jagged edges, broken highlights) |
| Flat art; the system adds highlights, blur and shadow | Baked-in highlights, drop shadows, bevels or glows |
| Clearly defined edges on foreground layers | Feathered edges |
| A few filled, overlapping shapes | Many small shapes or thin lines |
| Illustration | Photos or UI screenshots |
| No text unless it is essential | A wordmark squeezed into the icon |
| Works in default, dark, clear and tinted | An icon tuned for one appearance |

- Master size: 1024x1024 px.
- Use the light icon as the basis for the dark one.
- Build layered icons in Icon Composer.
- The HIG reportedly also names a "default, dark, and mono" set in one section. Confirm the
  variant names in Xcode (unverified).

## Checkable rules

1. Every bundled image, icon set and font has an `ASSETS.json` entry with source, author and
   licence.
2. No Unsplash file is in the bundle.
3. No SF Symbol PNG or SVG is in the Android or web build.
4. One icon family per app, plus SF Symbols on iOS only if rendered natively.
5. The Acknowledgements screen exists and lists every required credit and licence notice.
6. No found picture is captioned or placed as the client's own product, place or people.
7. Icon layers are square, unmasked and free of baked effects.

## Sources

- [The Met: Open Access](https://www.metmuseum.org/hubs/open-access)
- [Commons: Reusing content outside Wikimedia](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia)
- [Openverse: out-of-terms API usage](https://make.wordpress.org/openverse/2022/06/17/mitigating-out-of-terms-api-usage/)
- [Pexels License](https://www.pexels.com/license/)
- [Unsplash API terms](https://unsplash.com/api-terms)
- [Unsplash API guidelines](https://help.unsplash.com/en/articles/2511245-unsplash-api-guidelines)
- [Apple Developer Forums: SF Symbols licensing](https://developer.apple.com/forums/thread/757407)
- [Material Symbols repository](https://github.com/google/material-design-icons)
- [Lucide LICENSE](https://github.com/lucide-icons/lucide/blob/main/LICENSE)
- [google/fonts](https://github.com/google/fonts)
- [Expo: Fonts](https://docs.expo.dev/develop/user-interface/fonts/)
- [HIG: App icons](https://developer.apple.com/design/human-interface-guidelines/app-icons)
