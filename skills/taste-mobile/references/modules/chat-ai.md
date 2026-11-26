# Chat and AI module

The parts of a chat, assistant, agent or messaging app that hold whatever art direction is dealt.
Open it before laying out a conversation screen, a composer, a voice mode or an agent task view.

**Applies when:** the main surface is a conversation with an AI assistant or agent, or
person-to-person messaging.

## The converged skeleton

In 2026 the template is the whole screen, not just the composer. Seen in ChatGPT, Claude, Gemini,
Meta AI and Grok.

| Position | Part |
|---|---|
| Top-left | Circular menu button |
| Top-right | Capsule holding new-chat plus overflow |
| Thread | Right-aligned tinted user bubble over bubble-less assistant prose |
| Composer | "+" on the left, mic, and a filled voice disc on the right |

- A screen that matches all four parts reads as a template, whatever its colours. Meta AI's screens
  are nearly pixel-equivalent to ChatGPT's, with `#006bf1` in place of `#0279ff`.
- Reskinning the skeleton is a weak escape. The structure is what reads as the default.
- The centred greeting and the voice orb belong to the same template (text-sourced; only one
  store set shows each).

## Require one structural lever

Do not ship a chat screen that changes only the skin. Instead, pull at least one of these:

1. **Page structure.** Change what a turn or a thread is on screen.
2. **A status visual that encodes state.** Thinking, searching, recording or speaking each look
   different, and the difference carries information.

Skin levers still help, but they do not count alone: type genre, accent temperature, a metaphor
drawn from the mark, a voice personality.

| Escape | What changes | Seen in | Counts as the lever |
|---|---|---|---|
| By skin | Serif replies with the user in sans; terracotta `#da7756` send on cream `#f8f7f3` | Claude | No |
| By skin | A pixel mark, pixel loader and pixel glyphs on a standard composer | Le Chat | No (its stepped progress rail does) |
| By structure | Question-as-title answer pages, step disclosures, favicon stacks, numbered citation pills, one turquoise `#20b8cd` | Perplexity | Yes |
| By structure | No visible composer, a nearly blank voice screen with horizon arcs, painted tiles instead of icons | Pi | Yes |

Also seen: unbubbled full-width answers with numbered citation dots (Raycast), AI output as a
structured note (Granola), a store-like bot card opening every thread (Poe). These are evidence
of the two routes. Derive the structure from the app's own governing asset; do not reproduce one
of these apps.

## Required patterns

| Pattern | Rule | Evidence |
|---|---|---|
| Thinking as status lines | Show short status lines with a spinner on the active step ("Ran 2 web searches", "Thought for 3s"). Keep full reasoning behind a disclosure row | Le Chat step rail, Meta AI "Show thinking", Perplexity "Pro Search · 3 steps" |
| State-encoding voice visual | The voice visual must tell listening from speaking, or recording from idle | Raycast: a red core inside concentric red rings while recording |
| Voice in the thread | Run voice inside the thread with a live transcript, not on a separate screen | ChatGPT, Nov 25 2025 (text-sourced) |
| "+" sheet | Each tool in the sheet carries a description | Le Chat's connector list |
| Tool calls | Render each as a card with pending, done and error states. Never as plain text | Vendor component docs (text-sourced) |
| History | Bottom tabs instead of a hamburger drawer | Nov 2026 redesigns (text-sourced; no store set shows them) |
| Object model | Define each noun once and use it one way | "What is the difference between a project, a task and a chat?" (text-sourced) |
| Conversation rows | Show a title. Never raw prompt or persona text | Character.AI's list rows (text-sourced) |

## Streaming and agents (text-sourced)

No agent UI and no streaming state appears in any store screenshot. Treat this section as
text-sourced requirements, not observed practice.

**Streaming.** No source documents token fade, cursor or chunk-reveal values. Do not invent
timings; pick them on a device and record them. What vendor guidance does give:

- Show short status lines, not raw reasoning.
- Mark step boundaries. Show a live task list for a multi-step plan.
- Let the user reconnect to a running stream without losing progress.

**Agents.** The phone is a dispatcher: it hands off work, gets notified, reviews, and approves.

| Requirement | Rule |
|---|---|
| Progress | A running task shows its current step and finished steps. It runs off the device and notifies on completion (Manus runs "asynchronously in the cloud, notifying you when your task is complete") |
| Approval | Put deliberate friction before complex execution: show the plan and wait for the user (Claude's Plan Mode checks the plan first) |
| Live Activities | Surface long-running task progress as a Live Activity. No AI app was found doing this, so it is an open opportunity, not a finding |

## Sparkle, shimmer and glow

- **No unlabelled sparkle.** Instead, pair the icon with a text label. In NN/g's study no
  participant tied the icon to AI, and 73% read a star as save or favourite.
- **No sparkle for a non-AI meaning.** Instead, use the icon that names the action.
- **No shimmer "thinking" text on ordinary async work.** Instead, keep shimmer for AI generation
  and use a normal loading state elsewhere.
- **No decorative glow or orb.** Instead, allow a glow only when it encodes listening versus
  speaking, or thinking versus done.

## Anti-references (warn, never deal)

| Name | Shape | Instead |
|---|---|---|
| Neutral Hyper-Minimal Assistant | The skeleton with one accent or none (seen in ChatGPT, Gemini, Grok, Meta AI, Manus; Poe in a messenger variant) | Pull a structural lever |
| Feed-Grafted Assistant | Chat plus a For You social or short-video feed tab (seen in Character.AI; Meta AI's feed is text-sourced) | Differentiate inside the conversation, not with a feed |
| Custom Glass Replica | A platform material re-implemented by hand and shipped where the platform lacks it (Telegram; text-sourced, undetectable in stills) | Use each platform's own material and components |

**Literary Warm Assistant** (serif reading face on warm paper) may be dealt only with a mandatory
divergence: a non-orange accent or a non-cream ground, plus one structural escape from the
skeleton. Seen: lime on warm grey `#eaebe5` (Granola), forest green on cream `#faf3e9` (Pi).

## Messaging apps: posture carries the art direction

Person-to-person messaging gets platform fidelity plus one signature mechanic, not a dealt
direction. The chrome is system type, one accent and a wallpaper.

| Posture | What it means | Seen in |
|---|---|---|
| Native adopter | Platform bars, sheets, menus and keyboard | Beeper (most complete), WhatsApp (partial) |
| Custom cross-platform system | One owned system on every platform, no platform chrome conventions | Discord |
| Custom replica | Hand-built copy of a platform material | Telegram (anti-reference above) |

- Declare the posture in `MOBILE-DESIGN.md`. Screenshots cannot assign it; check the view tree and
  device recordings.
- Bubbles are 14 to 18 pt, with a small tail on the last bubble of a run, or no tail.
- Time and read ticks sit inside the bubble, bottom right. Reactions are a pill hanging off the
  bubble's lower edge.
- Composer row: "+" or attach, a capsule field with a sticker glyph inside, then camera and mic
  outside.
- Colour comes from three places only: the outgoing bubble (seen: `#d0fecf` or `#024e34`
  WhatsApp, `#2463fe` Signal, `#104cfc` Beeper), the wallpaper, and per-member name colours.
- A semantic shape rule is a reusable technique: circles for people, squircles for things
  (seen in Discord).

## Lint and checks

- X/S: compare the chat screen with the four skeleton parts. If all four match, fail unless the
  design names its structural lever.
- R: a thinking state shows status lines, and reasoning opens on demand.
- R/S: capture the voice visual in two states. Fail if the frames do not differ.
- G/T: every sparkle icon has an adjacent text label. No sparkle on a non-AI action.
- G: shimmer text components are used only for AI generation.
- T: each "+" sheet row has a description. Each tool-call card has pending, done and error states.
- G: one noun per object across strings (chat, project, task, space).
- R: conversation list rows show titles, not raw prompt or persona text.
- R: an agent task shows progress, notifies on completion and asks before complex execution.
- G: with Literary Warm dealt, fail on an orange or terracotta accent over a cream ground.
- T: the posture is declared, and bar material matches it on each platform.
- X: no feed tab grafted onto an assistant.

## Sources

- https://www.nngroup.com/articles/ai-sparkles-icon-problem/
- https://techcrunch.com/2025/11/25/chatgpts-voice-mode-is-no-longer-a-separate-interface/
- https://9to5google.com/2026/05/03/gemini-full-redesign/
- https://www.eweek.com/news/google-gemini-ui-redesign-tools-menu/
- https://daringfireball.net/linked/2026/07/11/evans-chatgpt
- https://apps.apple.com/us/app/id6740909540
- https://support.claude.com/en/articles/12138966-release-notes
- https://docs.langchain.com/oss/javascript/langchain/streaming/frontend
- https://www.techradar.com/computing/artificial-intelligence/i-compared-the-new-meta-ai-app-to-chatgpt-on-my-iphone-and-the-only-difference-i-noticed-was-the-discovery-feed
- https://9to5google.com/2026/02/07/telegram-for-android-redesign-goes-all-in-on-liquid-glass-rolling-out-now/
- https://discord.com/blog/improving-mobile-with-squircles-styles-and-spacing
