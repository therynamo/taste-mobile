# Directions

Every direction the corpus produced, with its status. Open it to read a full signature, or to
recognise an anti-reference. The dealer picks for you: do not choose from this file.

Generated from `data/directions.json` by `tools/gen-directions.mjs`. Do not edit by hand.

- **Ready** directions are dealt. Each was seen on screen in apps from at least two makers.
- **Held** directions are not dealt: store screenshots could not show what defines them.
- **Anti-references** are never built. They are named so you can recognise them.
- **Overlays** are platform materials, applied to chrome whatever is dealt.
- Signatures describe what was visible in store screenshots. Motion and haptics notes are
  text-sourced. The apps listed are evidence, not targets: do not copy one.

## Ready (16)

### Glance Board

`glance-board` · dealt for: money, crypto, sports, fitness, health, utility

- **Type.** System SF (or the brand's text face) with bold values and smaller same-baseline unit suffixes ('8h 28m', '4:57a', '33 %'); small all-caps tracked labels for state or category set above the value ('IN AIR', 'RISING TIDE', 'ACRES', 'TOTAL BUDGET'). Tabular or monospaced figures are NOT part of the confirmed signature: only the-outsiders shows a monospaced face (likely SF Mono).
- **Colour.** Neutral base (white, near-white #f3f2f8-#f7f5f4, or near-black) or one single-hue base (tide-guide slate #354c67, whoop navy-slate #12171a). Status colour strictly semantic: green on time / optimal / under budget, amber tight or alert, red late / fire / over budget, blue rising. Brand hue confined to one chrome element (watch-duty amber header, copilot-money blue header gradient) or absent.
- **Shape.** Large card radii about 16-24pt, sheets up to about 30pt and concentric with the display; pill filters, period selectors and range chips.
- **Density.** A variant axis, not a signature: low (crouton cook mode, paku one reading) to high (flighty one line per leg, watch-duty stat grids, whoop 5-up tiles).
- **Navigation.** 3-4 labelled tabs in a floating Liquid Glass capsule, often with a detached circular button (flighty, tide-guide, the-outsiders, fotmob), or one entity per sheet over a map (watch-duty, paku).
- **Imagery.** Data visuals instead of imagery: labelled curves, semantic map pins, score rings, rating chips. The same readout line or curve reappears on Live Activities, the Dynamic Island, widgets and Watch faces (flighty, tide-guide, paku, the-outsiders).
- **How it goes wrong.** Warning, not a gate: flag a screen that shows more than one competing entity per line or sheet, status colour used decoratively, or brand hue leaking into status.
- **Seen in.** flighty, watch-duty, paku, the-outsiders, tide-guide, fotmob, sofascore, whoop, bevel, crouton, mela, copilot-money

### Broadcast Scoreboard (fandom variant of Glance Board)

`broadcast-scoreboard` · dealt for: sports

- **Type.** Heavy, width-condensed score numerals at about 30-40pt set directly on the team surface (apple-sports: SF on the width axis; sleeper: condensed italic), with timeout dashes or dots beneath. nba shows the same condensed heavy score numerals but not the team-colour surface.
- **Colour.** Tinted dark base (apple-sports Home deep green #002c00; sleeper navy #0c174b). Team colour floods the identity surface: a left-to-right two-team gradient fills the Live Activity and game sheet (apple-sports); giant italic team-code watermarks in team colour sit behind the score (sleeper). No other hue. No red LIVE badge in apple-sports: the clock and play sentence carry liveness.
- **Shape.** Large concentric radii about 20-24pt on the game sheet and Live Activity cards; glass capsule buttons.
- **Density.** Medium: one game per row of about 100pt; the detail sheet stacks line score, field graphic and stat bars.
- **Navigation.** Minimal chrome: wordmark plus a Home glass capsule and a day switcher; no tab bar visible in apple-sports.
- **Imagery.** Official crests, a possession glyph and a field graphic only. No photography or illustration.
- **How it goes wrong.** Warning: the only non-Apple exemplar (sleeper) sits inside the Pick'em Arcade anti-reference, so deal the scoreboard component only. Flag any multiplier, wallet-in-top-bar, promo chip, MORE/LESS pick button, 3D jersey or neon glow on or near the scoreboard. Team colour stays on identity surfaces, never on status.
- **Seen in.** apple-sports, sleeper

### Toy / Game-Engine Tactile

`toy-game-engine-tactile` · dealt for: productivity, utility, learning

- **Type.** Chrome on system SF or a plain sans; one custom display treatment for titles or readouts (blocky heavy rounded titles in rooms; very condensed numerals plus all-caps monospaced labels in not-boring-weather; a seven-segment LCD timer in opal).
- **Colour.** Dark base (#000000 rooms, #08080a opal, #191919 not-boring-camera, #1d1d1d not-boring-weather) with lit rims. Chrome near-monochrome with one accent (system blue in rooms, ice blue #93c0d8 in opal). Saturation lives in the rendered object, is data-mapped (red sun, cyan precipitation, amber alerts in not-boring-weather), or is user-chosen (17 colourway swatches in not-boring-camera).
- **Shape.** Large radii about 16-28pt and pills on chrome; a chunky physical deck with about 40pt corners in not-boring-camera; real-time shading, grain or voxel lighting on the toy layer only.
- **Density.** Low to medium: a hero 3D scene takes about half the screen, then a compact readout or card row.
- **Navigation.** Conventional and visibly separate from the toy layer: a 3-item floating glass tab bar (rooms), large-title headers (opal), or timeline scrubbing with no bar (not-boring-weather).
- **Imagery.** Rendered 3D objects are the score or the UI: voxel dioramas on per-room gradients, a gem on a stone plinth, a knurled camera body, a grainy weather diorama. Emoji tiles are acceptable as toy-box icons (rooms).
- **Motion and haptics.** Not visible in stills. Text-sourced only: per-detent haptics paired with stereo sound in Not Boring apps.
- **How it goes wrong.** Warning: flag a toy surface that is not a visibly separate layer from the chrome, or a rendered effect that maps to no data value or user choice.
- **Seen in.** rooms, not-boring-camera, not-boring-weather, opal

### Dark Pro Minimal

`dark-pro-minimal` · dealt for: money, crypto, chat-ai, messaging, productivity

- **Type.** A neutral grotesque with grey sentence-case section labels and no display flourish (Inter-like in linear, SF in raycast, an FK-Grotesk-like face plus mono metadata numerals in perplexity).
- **Colour.** Dark surfaces stepped by lightness rather than shadow (linear app #18181a with chips on #1c1c1e/#2b2b2b; raycast #0f0f0f; perplexity #1a1a1a; coinbase-wallet navy #0a0f15; phantom pure black). Colour semantic only (health green/yellow/red). One reserved accent: linear periwinkle #7b80f0 for the swipe action, perplexity turquoise #20b8cd, raycast red #ff3647 only on the record state, phantom pastel lavender.
- **Shape.** Capsules for every control (linear), 44pt circular header buttons (raycast), about 12pt cards; borders and lightness steps instead of shadows.
- **Density.** Medium to high: single-line rows of about 56pt.
- **Navigation.** Dark glass capsules: a custom floating 4-icon tab bar with a detached circular create button and grouped top-right capsules (linear, bespoke glass); circular glass header buttons and a floating composer (raycast, native glass). No visible refraction over text.
- **Imagery.** Thin outline icons. No illustration. User-chosen emoji project icons are the only colour in linear's lists.
- **How it goes wrong.** Warning: flag refraction over dense text, decorative colour, or mascots and 3D art in the shell (discord carries these and reads louder than the direction).
- **Seen in.** linear, raycast, perplexity, phantom, coinbase-wallet, discord

### Loud Owned Shell

`loud-owned-shell` · dealt for: money, crypto, messaging, fitness, commerce

- **Type.** A custom face carries the shell (Cash Sans; Monzo Sans with split-size pounds and pence on every amount; NuSans; Klarna Title, a condensed display face used for the hero balance; ladder's extended caps; kraken's bold italic section headers). List text uses the same family at regular weight.
- **Colour.** One owned colour floods one shell surface: cash-app green #01e013 on the pay screen, monzo coral #ff4f40 on the account card, klarna aubergine #2c2342 home header plus a pink token, nubank purple #8e0de3 on the confirm button, ladder lime #e8ff11 on pure black, kraken purple #7132f5 on promo cards. Transaction and activity lists stay ink on white.
- **Shape.** Large cards about 16-20pt, full-pill buttons, round action buttons.
- **Density.** Low to medium: a large balance and one or two data points per card.
- **Navigation.** Conventional placement; monzo shows a floating glass tab bar, the rest flat bars or none visible.
- **Imagery.** An authored image system: 3D coins and 3D object avatars inside UI cards (kraken), card renders, campaign photography, the brand's own glyph set.
- **How it goes wrong.** Warning: flag the owned colour or display face reaching the transaction list, status colour, or a confirm or signing sheet. nubank breaks this (purple confirm button) and still ships.
- **Seen in.** cash-app, monzo, nubank, klarna, venmo, kraken, ladder, nike-run-club

### Coach Character

`coach-character` · dealt for: health, utility, learning

- **Type.** Heavy rounded display type (lowercase Feather-Bold-like in duolingo; Rubik-like bold in finch) over a rounded or squarish body face.
- **Colour.** White or near-white base (#ffffff, #f3f4f4). Many hues, each mapped to one system (duolingo: green progress #58cc02, blue selection #1cb0f6, orange streak #ff9600, pink energy); finch floods illustrated scene backgrounds per context while list cards stay white.
- **Shape.** About 14-18pt radii with a darker thick bottom lip on every tappable element, so buttons read as physical slabs.
- **Density.** Low to medium: one task per screen in duolingo; an illustrated scene over roomy 56pt goal rows in finch.
- **Navigation.** Modal lesson and celebration states without a tab bar in the store frames; bottom sheets with grab handles.
- **Imagery.** One consistent flat-vector character cast on every screen, acting out the current state, with speech bubbles.
- **Motion and haptics.** Not visible in stills.
- **How it goes wrong.** Warning: flag the character on money, signing or error sheets, and flag the absence of a personality off-switch. Neither is verifiable from store frames. A cloned flame-streak screen reads as Duolingo pastiche.
- **Seen in.** duolingo, finch

### User-Authored Poster

`user-authored-poster` · dealt for: social

- **Type.** Two registers. Loud: a custom wide grotesque with lowercase event titles (partiful). Quiet: SF Bold only (apple-invites, luma, universe).
- **Colour.** The user's cover sets the page: apple-invites bleeds the cover photo into a blurred gradient behind every card; luma tints the event page from its cover; partiful's page background follows the chosen theme (iridescent lavender, violet grid glow). Chrome otherwise neutral.
- **Shape.** Large concentric radii (about 36pt invite cards in apple-invites, 16-20pt cover cards in luma); pill chips and RSVP controls.
- **Density.** Low: one invite or event card per screen.
- **Navigation.** Conventional: RSVP, guest lists and sheets stay native. apple-invites and luma use Liquid Glass (close circle, action capsule, segmented RSVP; floating 3-tab bar in luma). partiful uses no system glass.
- **Imagery.** The user's cover art or photo is the only expression; sticker and torn-paper collage in partiful.
- **How it goes wrong.** Warning: flag expression leaking from the user's artifact into RSVP, lists or chrome. Emoji, purple glow and gradients are allowed on the user's artifact and should not trip the tell catalog there.
- **Seen in.** partiful, apple-invites, luma, universe

### Authored Illustration

`authored-illustration` · dealt for: chat-ai, health, notes, learning, commerce

- **Type.** Splits two ways: custom type matched to the hand (grug's handwriting face, vocabulary's bold slab-ish serif with a humanist sans, headspace's rounded custom face, likely SF Rounded in bears-gratitude) or plain SF that lets the art carry identity (katha-room).
- **Colour.** A fixed small illustration palette (vocabulary cream #efebe0, teal #93c1c1, salmon #f49484), a per-screen pastel flood with tinted text and controls (bears-gratitude #fde28b), or per-content hues per tile (headspace, katha-room). Text avoids pure black (warm dark brown in headspace, tinted text in bears-gratitude).
- **Shape.** Large radii about 16-24pt, flat, no shadows; no glass in the identity layer. grug draws no code shapes at all.
- **Density.** Low: one illustration per card or tile, centred single columns.
- **Navigation.** Conventional placement and labelled; custom in three of six (bears-gratitude text-tab top bar, grug day strip, vocabulary cream pill tab bar), native 3-tab bar in headspace.
- **Imagery.** One consistent hand on every content surface (headspace flat rounded blobs, bears-gratitude outline bears, grug scribbles, katha-room folk art with mixed traditions). Dimensional variant: small glossy 3D objects as icons in flat, photo-led white chrome (airbnb).
- **How it goes wrong.** Warning: flag a second illustration style on content surfaces. The text rule 'navigation stays native' is broken by three award winners; soften to 'navigation stays conventional in placement and labelled'.
- **Seen in.** headspace, bears-gratitude, grug, vocabulary, katha-room, airbnb

### Body-State Companion

`body-state-companion` · dealt for: fitness, health

- **Type.** Not part of the signature: SF with SF Rounded heavy numerals (gentler-streak), a bold serif with bold italic on true black (how-we-feel), SF semibold with small grey units (harvee), a serif headline over light-weight large numerals (oura).
- **Colour.** A closed colour-meaning set rather than decoration: gentler-streak's green healthy corridor band, how-we-feel's four mood quadrants (red, yellow, blue, green), oura's state words (Optimal blue, Good teal, Needs care coral). Status text in semantic green with a check ('Normal', 'As Usual'). Mode varies: light (harvee warm off-white #f5f2e9), dark (how-we-feel #000000, oura #18191d), both (gentler-streak).
- **Shape.** Large continuous corners about 20-32pt; capsule tab bars and chips.
- **Density.** Low to medium with a hero state block on top.
- **Navigation.** Floating glass capsule tab bar in gentler-streak, harvee and oura.
- **Imagery.** The day's state as a plain-language headline ('Today Feels Great', 'I'm feeling grateful') plus one non-colour state carrier: a mascot (gentler-streak), a photoreal plush mascot whose colour and pose track state (harvee), a custom glyph per emotion (how-we-feel), drawn mood faces (daylio).
- **How it goes wrong.** Warning: flag nagging copy and alarm red on imprecise data. harvee (red 'Insufficient' chip) and daylio (red for 'awful') break the alarm-red rule.
- **Seen in.** gentler-streak, how-we-feel, harvee, oura, daylio

### Shareable Artifact Studio

`shareable-artifact-studio` · dealt for: fitness, media, social, learning

- **Type.** Chrome on SF or a neutral sans; the artifact has its own type separate from the chrome (a wide display face on any-distance cards; a chunky outlined rounded sans on capwords stickers; user-chosen fonts on denim covers).
- **Colour.** Quiet, near-monochrome chrome (any-distance #080707, denim #f3f3f3 with system blue, strava #141414 with orange #fc5200 reserved for route, selected tab and primary actions); all saturation lives in the artifact.
- **Shape.** Selectable masks and die-cuts on the artifact (Circle, Arch, Dip, Rounded in any-distance; thick white sticker edge in capwords); fanned shadowed cover stacks in denim; ordinary radii in chrome.
- **Density.** Medium.
- **Navigation.** Native or near-native chrome; denim is pre-iOS 26 chrome with grey circular toolbar buttons.
- **Imagery.** The designed object is the product: route-on-photo story cards, photo stickers, mesh-gradient playlist covers. The store wrapper reuses the artifact as brand evidence.
- **How it goes wrong.** Warning: flag saturation or display type in the chrome rather than the artifact. Privacy defaults on the artifact (route clipping) are text-sourced and not visible in stills.
- **Seen in.** any-distance, denim, capwords, strava

### Ambient Sky

`ambient-sky` · dealt for: health, utility

- **Type.** SF Pro semibold, centred countdown or state copy over the sky ('Sunset / IN / 9 hours, 27 minutes'); time labels in white pills.
- **Colour.** Dark near-monochrome sky (lumy navy #000711 under a rendered sky gradient; moonlitt indigo #10194c to #25307d). Colour comes from data, not brand: each light phase has its hue in lumy (teal noon, yellow golden hour, orange sunset, magenta last light, blue hour); moonlitt's only warm colour is a copper-red eclipse moon.
- **Shape.** Large list cards about 20-24pt; capsule and circular buttons; grouped glass capsule toolbars in moonlitt.
- **Density.** Low on the main view; medium-high only in calendars.
- **Navigation.** Two floating top buttons (lumy) or a floating 3-icon glass tab bar with glass toolbar groups (moonlitt).
- **Imagery.** A rendered or photographic sky object on a dotted path (sun arc, moon orbit) with a scrubbable time axis (lumy tick scrubber; moonlitt edge rails with pill time labels).
- **How it goes wrong.** Warning: flag palette colour that does not follow the real sky or data. Legibility at the most opaque glass setting and Reduce Motion are text-sourced requirements, not visible in stills.
- **Seen in.** lumy, moonlitt

### Rationed Ritual (behaviour direction)

`rationed-ritual` · dealt for: messaging, notes, social

- **Type.** Not shared. Retro uses a tight high-contrast serif display over SF body; bereal a bold wordmark over a grotesque; lapse is not judgeable in-app. Deal no typeface from this direction.
- **Colour.** Achromatic chrome (white or black) so user photos are the only hue; a single red used only for a count badge (retro, bereal) or red-orange for focus brackets and flash (lapse).
- **Shape.** Large radii on photos and strips (about 16-18pt; a black-bordered 14pt selfie inset in bereal; about 36pt viewfinder corners in lapse); pills and circles for controls.
- **Density.** Low: one post or one week per screen height.
- **Navigation.** Ordinary: a 5-icon unlabelled tab bar (retro), top text segments (bereal).
- **Imagery.** The constraint drawn as UI state, which is what gets dealt: a week-number serif title over a film strip with one card per friend per week (retro); a blurred friend photo with an eye-slash and 'Share to view', plus lateness stamps (bereal); undeveloped shots as blurred gradient tiles with a padlock (lapse).
- **How it goes wrong.** Warning: flag a design that drops the constraint state (lock, blur, date stamp) or adds likes, editing or captions as requirements. This direction deals a behaviour plus its constraint-state component, never a palette or typeface.
- **Seen in.** retro, bereal, lapse

### Chromatic Timeline

`chromatic-timeline` · dealt for: productivity

- **Type.** SF Pro with a heavy bold date header (structured) or an Inter-like grotesque (notion-calendar, amie).
- **Colour.** Near-white neutral (structured #f4f3f7, amie #f5f5f5, notion-calendar warm off-white grid #f9f8f6) with per-block hue as the reading layer. Two variants: saturated duration-scaled capsules with a white glyph (structured: salmon, slate, navy, green, plum), or pale tint blocks with a 3pt left bar and saturated same-hue text (notion-calendar, amie). A red current-time line and today marker in both pale-tint apps.
- **Shape.** Vertical capsules whose length equals duration (structured); about 4-10pt event blocks (notion-calendar, amie); large sheets.
- **Density.** Medium (structured, amie) to high (notion-calendar multi-day views).
- **Navigation.** Floating glass capsule tab bar plus a separate circular + button (structured); a floating circular menu button and no tab bar (notion-calendar).
- **Imagery.** A glyph library inside task capsules (structured); none in the pale-tint variant.
- **How it goes wrong.** Warning: no exemplar satisfies the whole text rule. structured uses its salmon CTA as a default task hue; notion-calendar and amie carry no per-block icon. The non-colour cue is still required by the platform accessibility lint (Differentiate Without Color), which is separate from this taste warning.
- **Seen in.** structured, notion-calendar, amie

### Dark Content Stage

`dark-content-stage` · dealt for: media

- **Type.** A custom brand face with black-weight hero titles over regular rows (spotify); a Graphik-like semibold title over a light year (letterboxd); a light geometric sans for screen titles (calm).
- **Colour.** Near-black neutral stage (spotify #121212, letterboxd slate #181b20) or a deep tinted stage (calm #185d91). The brand shrinks to one or a few action colours: spotify green #1ed760 on play, selection and saved; letterboxd green #00e054 rating and watched, orange #ff8000 liked, blue #40bcf4 patron; calm a white-lavender Play pill. Surfaces take per-content tints sampled from the artwork (spotify mini player and audiobook cards).
- **Shape.** Small radii on artwork (about 4pt in spotify and 2-4pt on letterboxd posters, about 8pt cards); pill chips; circular play buttons; artwork gradients fading into the stage.
- **Density.** Medium to medium-high: 2x4 shortcut grid and 3-up shelves (spotify), 4-across poster grid and about 75pt diary rows (letterboxd); low in calm.
- **Navigation.** Custom chrome; horizontal shelves with See All; floating round back button over hero art. Tab bars are cropped out of spotify frames; letterboxd frames are iOS 10 era.
- **Imagery.** Artwork, posters and stills are the hero and the only multi-hue element; chrome never overlays them.
- **How it goes wrong.** Warning: flag brand hue on the stage itself, chrome or text overlaid on artwork, or the accent used for anything but play, log or selection. calm partly breaks the first clause (the night-sky blue stage is its brand).
- **Seen in.** spotify, letterboxd, calm

### Typographic Writing Surface

`typographic-writing-surface` · dealt for: chat-ai, productivity, notes

- **Type.** The type is the interface. A custom geometric-humanist sans with about 1.6 line height and hybrid Markdown that keeps faint ** markers visible beside rendered bold (bear); a per-document serif or sans style (craft); a user choice of SF, a book serif or mono (tot).
- **Colour.** One theme accent for links, cursor and headings (bear red #dd4c4f on light, green on charcoal, amber); user-chosen document backdrops and page tints (craft); seven fixed dot colours each repainting its page (tot). Chrome otherwise grey or near-white.
- **Shape.** A rounded page card about 20pt floating on a backdrop with concentric inner radii (craft); otherwise few drawn shapes: about 8-10pt tag pills, capsule and circle floating controls.
- **Density.** Low: one note per screen, wide 28-30pt side margins.
- **Navigation.** Chrome shrinks to floating capsules: a back circle and an info/more capsule (bear), a glass back circle, share capsule and a 3-icon glass capsule tab bar (craft), or seven coloured rings as the entire navigation with no tab bar (tot).
- **Imagery.** None beyond the user's own covers (craft) and thin outline icons.
- **How it goes wrong.** Warning: flag persistent formatting toolbars, tab bars or feature chrome that compete with the page. Advanced features stay hidden until invoked (text-sourced from bear).
- **Seen in.** bear, craft, tot

### Literary Warm Assistant

`literary-warm-assistant` · dealt for: chat-ai, notes

- **Type.** A text serif carries reading: assistant replies in a book serif with the user's words in sans (claude); regular-weight serif note titles at about 28-32pt over a sans for UI (granola); one warm serif for both speakers (pi).
- **Colour.** Warm paper ground (claude cream #f8f7f3, granola warm grey #eaebe5, pi cream #faf3e9), warm-grey and near-black text, and one muted accent or none: claude terracotta #da7756 on the send button only, granola lime #b2c248 only on recording surfaces, pi forest green #1c472d line icons.
- **Shape.** Flat paper; large radii (user bubbles about 16-20pt, composer a 24pt rounded rectangle in claude); 44pt circular buttons.
- **Density.** Low: wide margins, large serif body, generous empty space.
- **Navigation.** Reduced to top-corner circular buttons and capsules; no tab bar visible in any of the three store sets. claude's chrome is the shared chat skeleton.
- **Imagery.** None in claude and granola beyond outline icons; painted illustration tiles instead of icons in pi.
- **How it goes wrong.** Warning: this direction overlaps the 2026 cream-plus-serif-plus-orange default. Flag a generated brief that uses cream, serif and an orange accent together without a governing asset; require a non-orange accent or a non-cream ground, plus one structural escape from the chat skeleton.
- **Seen in.** claude, granola, pi

## Held (8)

| Direction | What blocks it |
|---|---|
| **Cinematic Dark Data** `cinematic-dark-data` | copilot-money dark mode: Dashboard, Transactions, Budgets, Investments; mercury dark mode: Home with chart, account detail, Send flow; If neither has a tinted not-black dark mode, merge the direction into the money core plus the quiet end of the shell-loudness axis |
| **Analog Instrument** `analog-instrument` | not-boring-camera full shooting screen and settings (second-maker candidate: mono all-caps readouts and knurled dials); kino while recording (red perimeter, disabled controls); halide Mark III Look picker and editor (store frames are Mark II); A second-maker pro capture app added to the corpus by the user |
| **Fluid Continuity** `fluid-continuity` | things screen recordings: Magic Plus drag, to-do unfolding, Upcoming scroll; family send and connect flows recorded (app is winding down; may be unavailable); A second current exemplar recorded on device, because family's store frames are iPhone 8 era |
| **Sensory-First** `sensory-first` | oko on device with screen, audio and a person noting haptics; A non-visual capture protocol (audio recording plus haptic log), since stills cannot settle this direction |
| **Private-Bank Editorial** `private-bank-editorial` | nubank Ultravioleta screens from a Brazilian account; robinhood Gold member surfaces beyond the upsell; wealthsimple premium or Generation tier screens |
| **Pixel Heritage** `pixel-heritage` | A second-maker exemplar with a heritage pixel identity reaching in-app UI |
| **Research Index** `research-index` | perplexity current build (store frames predate iOS 26 and show a 'perplexity pro' header); A second-maker citation-first answer app |
| **Collector's Shelf** `collectors-shelf` | letterboxd on iOS 26: film page, diary, profile; A second-maker collection app |

## Anti-references (7)

| Pattern | Why it is never built |
|---|---|
| **Neutral Hyper-Minimal Assistant** `neutral-hyper-minimal-assistant` | Never deal. Warn when a chat design reuses the skeleton and changes only the skin; require at least one structural lever (page structure or a state-encoding status visual). |
| **Feed-Grafted Assistant** `feed-grafted-assistant` | Never deal. meta-ai's Discover/Vibes feed is not in its store frames, so meta-ai is no longer visual evidence for this shape. |
| **Funnel-First Utility** `funnel-first-utility` | Never deal. The quiz funnel itself is text-sourced; the store frames show only the generic dashboard. |
| **Pick'em Arcade** `pickem-arcade` | Never deal. Hidden payouts and goblin/demon modifiers (text-sourced for prizepicks) were not visible; underdog, sleeper and draftkings show payouts up front. |
| **Social Ledger** `social-ledger` | Never deal. No visual exemplar remains: venmo and coinbase-wallet store frames show no social feed, which supports the text finding that the pattern is in retreat. |
| **Custom Glass Replica** `custom-glass-replica` | Never deal on a platform without native glass. Posture must be declared in MOBILE-DESIGN.md or checked against the view tree, because screenshots cannot assign it. |
| **Format-Borrowed Feed** `format-borrowed-feed` | Never deal. No visual exemplar in the corpus. |

## Overlays (2)

| Overlay | Rule |
|---|---|
| **Platform material overlay (Liquid Glass)** `platform-material-liquid-glass` | Overlay on any direction; never the identity. No app's primary direction is glass. |
| **Depth modifier** `depth-modifier` | Secondary seasoning only; dropped under Reduce Motion. |
