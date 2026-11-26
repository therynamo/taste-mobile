# Feed Core module

The fixed grammar of a feed screen, which holds whatever art direction is dealt. Open it before
building a timeline, a pin or poster grid, media shelves, or the shell around any of them.

**Applies when:** the main surface is a scrolling feed or catalog of other people's content:
posts, pins, tracks, films, podcasts.

Feed Core is a category grammar, not an art direction. Seen across Threads, Bluesky, Pinterest,
Letterboxd and Spotify. A direction cannot override it.

## The six rules

| # | Rule | Values and evidence | Do not, and instead |
|---|---|---|---|
| 1 | **Neutral chrome.** Achromatic, or exactly one owned action colour | Seen: black (Threads), blue `~#1083fe` (Bluesky), a red Save pill (Pinterest), green `#1ed760` (Spotify) | No second chrome hue. Instead, carry emphasis with fill and weight (a filled Follow pill, a filled home tab) |
| 2 | **Content imagery is the only multi-hue element** | Avatars, posts, pins, covers and posters carry all the colour | No tinted cards, gradient headers or coloured section fills. Instead, let the media colour the screen |
| 3 | **A fixed action row** | Outline icons at 1.5 to 2 pt stroke, filled only on selection. A liked heart turns red or pink | No filled or multi-colour icons at rest. Instead, use fill as the selected state only |
| 4 | **One feed-item anatomy** | Avatar or artwork on the left, a bold primary line, a grey secondary line, then the body | No second item layout for the same content type. Instead, vary the body, never the frame |
| 5 | **Chrome never crops, overlays, animates or brands creator media** (text-sourced) | Spotify's partner rules, generalised: "Artwork must be kept in its original form"; "Don't overlay images or text on top of the artwork" | No cropped art in a tight slot. Instead, drop the art: "it's OK to not include any album artwork" |
| 6 | **Feed choice and moderation stay in the UI** (text-sourced) | A Following or Latest feed next to For You (Bluesky Following and Discover). First-class moderation and reply controls (Bluesky labels and "hide reposts in feeds", Threads Hidden Words, Letterboxd "Who can reply") | No algorithm-only feed and no moderation buried in settings. Instead, keep the feed switch and the controls visible in the main UI |

Rules 1 to 4 are confirmed on screen. Rules 5 and 6 rest on partner guidelines and store text.

## Split by stage luminance

Pick the stage first. It decides whether any direction applies to the feed at all.

| Stage | Treatment | Seen in |
|---|---|---|
| Light text feed | **Posture-only.** Platform fidelity plus one signature mechanic. No direction is dealt to the feed. Monochrome or one-accent chrome is the module default | Threads, Bluesky |
| Light image feed | Same default at its content-dominant extreme: masonry tiles nearly edge to edge with about 8 pt gutters, almost no chrome, a floating three-capsule bottom bar | Pinterest |
| Dark stage with artwork-derived colour | The one feed shape that earns a direction: **Dark Content Stage** (next section) | Spotify, Letterboxd, Calm |

- Light text feeds share one timeline anatomy "almost pixel for pixel". Do not try to brand the
  timeline. Instead, put the brand in the mark, the one accent, and the marketing wrapper.
- Label a posture-only app on the posture axis in `MOBILE-DESIGN.md`, so no direction is dealt later.

## Dark Content Stage

Dark here exists to make media glow, not to support density. That is the difference from Dark Pro
Minimal.

| Part | Value |
|---|---|
| Stage | Near-black neutral: `#121212`, `#181b20`. A deep tint (`#185d91`, seen in Calm) puts brand hue on the stage and trips the warning below |
| Accent | One, used only on play, log or selection. Seen: green `#1ed760`; a `#00e054` / `#ff8000` / `#40bcf4` action triad (Letterboxd) |
| Surfaces | Tinted from the artwork (a Now Playing background takes its colour from the cover) |
| Shape | 2 to 8 pt radius on artwork, pill chips, a circular play button |
| Layout | Medium to high density: horizontal shelves with See All, 4-across poster grids |
| Chrome | Custom; a floating back circle over hero art |
| Type | A brand face with black-weight hero titles; a semibold title over a light year |

Warn on, and do instead:

- Brand hue on the stage itself. Instead, keep the stage neutral and take colour from artwork.
- Chrome or text overlaid on artwork. Instead, place controls beside or below it.
- The accent used beyond play, log or selection. Instead, keep every other control neutral.

Evidence strength: Spotify high; Letterboxd medium (stale store frames); Calm medium (tinted
variant). Tab bars are cropped out of the Spotify frames, so tab structure is unverified.

## What a direction may and may not touch

| May touch | May not touch |
|---|---|
| The shell: the mark, the one accent, and a typeface tuned to recede | The feed-item anatomy (rule 4) |
| Non-feed signature objects (seen: Letterboxd's diary, Luma's poster) | The action row (rule 3) |
| The Dark Content Stage values above, when the stage is dark | Creator media: no crop, overlay, animation or brand mark (rule 5) |
| | The neutrality of feed chrome (rules 1 and 2) |

- Spend the direction on the signature object, not on the timeline.
- Keep the typeface quiet at small sizes; it must not compete with the content.
- Do not add heavy card chrome, shadows or captions under every image tile. Instead, let tiles sit
  on the ground with gutters only.

## Anti-reference: Format-Borrowed Feed (text-sourced)

A full-screen autoplay vertical feed grafted onto an app whose content is not short video. Seen
in Substack's TikTok-style tab and Spotify's 2023 home feed; there is no visual exemplar in the
corpus. Critics rejected both ("Please don't turn into Twitter", "even more like TikTok"). It is
the feed sibling of the Feed-Grafted Assistant in `modules/chat-ai.md`.

- Never deal it. Warn when a plan adds a vertical video feed to a text, audio or catalog app.
- Instead, present the content in its own format: an article list, shelves, a poster grid.

## Other tells seen in feed apps

- A left-arrow back button on iOS. Instead, use the platform back control.
- An Inter-like generic face on a native app. Instead, use the system face or one tuned brand face.
- An unlabelled sparkle button on a media detail screen. Instead, add a text label; an AI summary
  with a text label ("summarized by AI") is fine.

See `tells.md` for scopes and detection codes.

## Lint and checks

- G: count distinct hues in chrome tokens. Fail on more than one beyond the achromatic set.
- S: mask all media in a feed screenshot. What remains is achromatic plus at most one hue.
- G/T: action-row icons are outline at rest and filled only when selected; the liked heart is red
  or pink.
- X: every feed cell for one content type uses the same anatomy.
- G: no overlay, crop, animation or logo layered on creator media. Tight slots drop the art.
- T/R: a Following or Latest choice and the moderation and reply controls are reachable in the
  main UI, not only in settings.
- G (dark stage): stage colour is neutral; the accent token appears only on play, log and
  selection components.
- R: no full-screen autoplay vertical feed unless the content is short video.
- X: `MOBILE-DESIGN.md` states the stage (light or dark) and, for light text feeds, the posture.

## Sources

- https://developer.spotify.com/documentation/design
- https://itsnicethat.com/news/grilli-type-made-thought-pinterest-sans-typography-graphic-design-120521
- https://www.itsnicethat.com/news/instagram-threads-graphic-design-270723
- https://apps.apple.com/us/app/6444370199
- https://apps.apple.com/us/app/threads/id6446901002
- https://ixd.prattsi.org/2026/09/design-critique-letterboxd-ios-app/
- https://www.engadget.com/spotify-debuts-its-tiktok-style-music-discovery-feed-183359654.html
- https://www.engadget.com/social-media/substack-updated-its-app-to-make-it-even-more-like-tiktok-193415204.html
- https://www.creativebloq.com/news/substack-redesign
