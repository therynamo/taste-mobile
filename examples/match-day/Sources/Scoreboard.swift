import SwiftUI

// The governing asset and the display treatment, defined once.

/// San Francisco has no italic in its condensed and expanded widths, so the slant is a fixed
/// 10 degree shear, the same on the score numerals and on the watermark.
extension View {
    func oblique() -> some View {
        visualEffect { content, proxy in
            content.transformEffect(
                CGAffineTransform(a: 1, b: 0, c: -Slant.shear, d: 1, tx: Slant.shear * proxy.size.height / 2, ty: 0)
            )
        }
    }
}

enum Slant {
    static let shear: CGFloat = 0.176
}

/// The governing asset: a club code as a giant heavy italic watermark, cropped by its container.
struct CodeWatermark: View {
    let code: String
    var size: CGFloat = 132
    var color: Color = Palette.watermark

    var body: some View {
        Text(code)
            .font(TypeStyle.watermark(size: size))
            .fontWidth(.expanded)
            .oblique()
            .foregroundStyle(color)
            .lineLimit(1)
            .fixedSize()
            .accessibilityHidden(true)
            .allowsHitTesting(false)
    }
}

/// The display treatment: condensed heavy italic score numerals. Used for scores only.
struct ScoreNumeral: View {
    let text: String
    let color: Color
    private let cap: CGFloat
    @ScaledMetric private var size: CGFloat

    init(_ value: Int?, base: CGFloat = 92, color: Color = Palette.onFlood) {
        self.init(text: value.map(String.init) ?? "\u{2013}", base: base, color: color)
    }

    init(text: String, base: CGFloat, color: Color) {
        self.text = text
        self.color = color
        self.cap = base * 1.45
        _size = ScaledMetric(wrappedValue: base, relativeTo: .largeTitle)
    }

    var body: some View {
        Text(text)
            .font(TypeStyle.score(size: min(size, cap)))
            .fontWidth(.condensed)
            .oblique()
            .foregroundStyle(color)
            .lineLimit(1)
            .fixedSize()
    }
}

/// The dots beneath the score: one per half. Filled is played, ringed is in play, hollow is to come.
struct HalfDots: View {
    let phase: MatchPhase
    @ScaledMetric(relativeTo: .caption) private var dot: CGFloat = 9

    private enum DotState { case played, inPlay, toCome }

    private var states: [DotState] {
        switch phase {
        case .upcoming: return [.toCome, .toCome]
        case .live(let minute): return minute <= 45 ? [.inPlay, .toCome] : [.played, .inPlay]
        case .final: return [.played, .played]
        }
    }

    var body: some View {
        HStack(spacing: dot * 0.7) {
            ForEach(Array(states.enumerated()), id: \.offset) { _, state in
                ZStack {
                    Circle().strokeBorder(Palette.onFlood, lineWidth: 1.5)
                        .opacity(state == .toCome ? 0.5 : 1)
                    if state == .played { Circle().fill(Palette.onFlood) }
                    if state == .inPlay { Circle().fill(Palette.onFlood).padding(dot * 0.28) }
                }
                .frame(width: dot, height: dot)
            }
        }
        .accessibilityHidden(true)
    }
}

/// The game surface. The only thing in the app that team colour floods.
struct GameBoard<Footer: View>: View {
    let match: Match
    @ViewBuilder var footer: () -> Footer
    @Environment(\.dynamicTypeSize) private var typeSize

    private var isFinal: Bool { match.phase == .final }

    private var clockText: String {
        switch match.phase {
        case .upcoming: return match.kickoff
        case .live(let minute): return "\(minute)\u{2032}"
        case .final: return "FT"
        }
    }

    private var spokenSummary: String {
        let score = "\(match.home.name) \(match.homeGoals ?? 0), \(match.away.name) \(match.awayGoals ?? 0)."
        switch match.phase {
        case .upcoming: return "\(match.home.name) against \(match.away.name), kick-off \(match.kickoff)."
        case .live(let minute): return "\(score) \(minute) minutes played."
        case .final: return "\(score) Full time."
        }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: Space.m) {
            Group {
                if typeSize.isAccessibilitySize { stacked } else { sideBySide }
            }
            .accessibilityElement(children: .ignore)
            .accessibilityLabel(spokenSummary)
            footer()
        }
        .padding(Radius.boardPadding)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(flood)
        .clipShape(RoundedRectangle(cornerRadius: Radius.board, style: .continuous))
    }

    private var flood: some View {
        ZStack {
            LinearGradient(
                stops: [
                    .init(color: Palette.team(match.home.code), location: 0),
                    .init(color: Palette.team(match.home.code), location: 0.34),
                    .init(color: Palette.team(match.away.code), location: 0.66),
                    .init(color: Palette.team(match.away.code), location: 1),
                ],
                startPoint: typeSize.isAccessibilitySize ? .top : .leading,
                endPoint: typeSize.isAccessibilitySize ? .bottom : .trailing
            )
            if isFinal { Palette.settle }
            CodeWatermark(code: match.home.code, size: 116, color: Palette.onFloodWatermark)
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
                .offset(x: -Space.xl, y: Space.l)
            CodeWatermark(code: match.away.code, size: 116, color: Palette.onFloodWatermark)
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottomTrailing)
                .offset(x: Space.xl, y: Space.xl)
        }
    }

    private var competitionLine: some View {
        Text("\(match.competition) \u{00B7} \(match.ground)")
            .font(TypeStyle.label)
            .foregroundStyle(Palette.onFloodSecondary)
    }

    private var clock: some View {
        VStack(spacing: Space.s) {
            Text(clockText)
                .font(.title2.weight(.bold))
                .monospacedDigit()
                .foregroundStyle(Palette.onFlood)
                .contentTransition(.numericText())
            HalfDots(phase: match.phase)
        }
    }

    private func name(_ club: Club, alignment: TextAlignment) -> some View {
        Text(club.name)
            .font(.headline)
            .foregroundStyle(Palette.onFlood)
            .multilineTextAlignment(alignment)
    }

    private var sideBySide: some View {
        VStack(alignment: .leading, spacing: Space.s) {
            competitionLine
            HStack(alignment: .top) {
                name(match.home, alignment: .leading)
                Spacer(minLength: Space.l)
                name(match.away, alignment: .trailing)
            }
            .padding(.top, Space.s)
            if match.phase == .upcoming {
                clock
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, Space.m)
            } else {
                HStack(alignment: .center) {
                    ScoreNumeral(match.homeGoals)
                    Spacer(minLength: Space.s)
                    clock
                    Spacer(minLength: Space.s)
                    ScoreNumeral(match.awayGoals)
                }
                .padding(.horizontal, Space.s)
            }
        }
    }

    // Largest text sizes: the clock first, then one line per club with its score leading, so both
    // scores stay on the first screen and the names are free to wrap.
    private var stacked: some View {
        VStack(alignment: .leading, spacing: Space.s) {
            HStack(spacing: Space.m) {
                Text(clockText)
                    .font(.title2.weight(.bold))
                    .monospacedDigit()
                    .foregroundStyle(Palette.onFlood)
                HalfDots(phase: match.phase)
            }
            ForEach([(match.home, match.homeGoals), (match.away, match.awayGoals)], id: \.0) { club, goals in
                HStack(alignment: .center, spacing: Space.l) {
                    if match.phase != .upcoming { ScoreNumeral(goals, base: 60) }
                    Text(club.name)
                        .font(.title3.weight(.semibold))
                        .foregroundStyle(Palette.onFlood)
                        .fixedSize(horizontal: false, vertical: true)
                }
            }
            competitionLine
                .fixedSize(horizontal: false, vertical: true)
        }
    }
}

extension GameBoard where Footer == EmptyView {
    init(match: Match) {
        self.init(match: match, footer: { EmptyView() })
    }
}

/// A line on a flooded surface, under a rule. The play sentence, the scorers, a notice.
struct BoardLine: View {
    let text: String
    var body: some View {
        VStack(alignment: .leading, spacing: Space.m) {
            Rectangle().fill(Palette.onFloodRule).frame(height: 1)
            Text(text)
                .font(.subheadline.weight(.medium))
                .foregroundStyle(Palette.onFlood)
                .fixedSize(horizontal: false, vertical: true)
        }
    }
}

// MARK: - Signature visualisation: the match timeline

struct Diamond: Shape {
    func path(in rect: CGRect) -> Path {
        var p = Path()
        p.move(to: CGPoint(x: rect.midX, y: rect.minY))
        p.addLine(to: CGPoint(x: rect.maxX, y: rect.midY))
        p.addLine(to: CGPoint(x: rect.midX, y: rect.maxY))
        p.addLine(to: CGPoint(x: rect.minX, y: rect.midY))
        p.closeSubpath()
        return p
    }
}

struct EventMark: View {
    let kind: EventKind
    var size: CGFloat = 12

    var body: some View {
        Group {
            switch kind {
            case .goal:
                Circle().fill(Palette.ink)
            case .yellow:
                RoundedRectangle(cornerRadius: 2, style: .continuous)
                    .strokeBorder(Palette.ink, lineWidth: 1.5)
                    .frame(width: size * 0.72)
            case .substitution:
                Diamond().stroke(Palette.ink, lineWidth: 1.5).padding(1)
            }
        }
        .frame(width: size, height: size)
        .accessibilityHidden(true)
    }
}

/// Ninety minutes on one line. Home events above it, away events below, each at its minute.
struct MatchTimeline: View {
    let match: Match
    @Environment(\.dynamicTypeSize) private var typeSize
    @ScaledMetric(relativeTo: .caption) private var mark: CGFloat = 13

    private var nowMinute: Int? {
        if case .live(let minute) = match.phase { return minute }
        return nil
    }

    private var spoken: String {
        let parts = match.events.map { e in
            "\(e.minute) minutes, \(e.kind.label), \(e.home ? match.home.name : match.away.name), \(e.text)"
        }
        return "Match timeline. " + parts.joined(separator: ". ")
    }

    var body: some View {
        VStack(alignment: .leading, spacing: Space.m) {
            GeometryReader { geo in
                let w = geo.size.width
                let mid = geo.size.height / 2
                let lane = mark * 1.15
                ZStack(alignment: .topLeading) {
                    Rectangle().fill(Palette.hairline)
                        .frame(width: w, height: 2)
                        .offset(y: mid - 1)
                    if let now = nowMinute {
                        Rectangle().fill(Palette.ink)
                            .frame(width: w * CGFloat(now) / 90, height: 2)
                            .offset(y: mid - 1)
                        Rectangle().fill(Palette.ink)
                            .frame(width: 2, height: lane * 2.6)
                            .offset(x: w * CGFloat(now) / 90 - 1, y: mid - lane * 1.3)
                    } else if match.phase == .final {
                        Rectangle().fill(Palette.ink).frame(width: w, height: 2).offset(y: mid - 1)
                    }
                    ForEach([0, 45, 90], id: \.self) { tick in
                        Rectangle().fill(Palette.inkSecondary)
                            .frame(width: 1, height: 9)
                            .offset(x: min(w - 1, w * CGFloat(tick) / 90), y: mid - 4.5)
                    }
                    ForEach(match.events) { event in
                        EventMark(kind: event.kind, size: mark)
                            .offset(
                                x: min(w - mark, max(0, w * CGFloat(event.minute) / 90 - mark / 2)),
                                y: event.home ? mid - lane - mark / 2 - 1 : mid + lane - mark / 2 + 1
                            )
                    }
                }
            }
            .frame(height: mark * 4.6)
            .accessibilityElement(children: .ignore)
            .accessibilityLabel(spoken)

            HStack {
                Text("Kick-off")
                Spacer()
                Text("Half-time")
                Spacer()
                Text("90\u{2032}")
            }
            .font(.caption2)
            .foregroundStyle(Palette.inkSecondary)
            .accessibilityHidden(true)

            let layout = typeSize.isAccessibilitySize
                ? AnyLayout(VStackLayout(alignment: .leading, spacing: Space.s))
                : AnyLayout(HStackLayout(spacing: Space.l))
            layout {
                legendItem(.goal)
                legendItem(.yellow)
                legendItem(.substitution)
            }
            Text("\(match.home.name) above the line, \(match.away.name) below.")
                .font(.caption)
                .foregroundStyle(Palette.inkSecondary)
                .fixedSize(horizontal: false, vertical: true)
        }
    }

    private func legendItem(_ kind: EventKind) -> some View {
        HStack(spacing: Space.xs + 2) {
            EventMark(kind: kind, size: mark)
            Text(kind.label).font(.caption).foregroundStyle(Palette.ink)
        }
    }
}

/// Events as plain rows: minute, mark, what happened, the score after a goal.
struct EventList: View {
    let match: Match

    var body: some View {
        VStack(spacing: 0) {
            ForEach(Array(match.events.reversed().enumerated()), id: \.element.id) { index, event in
                if index > 0 { Rectangle().fill(Palette.hairline).frame(height: 1) }
                HStack(alignment: .firstTextBaseline, spacing: Space.m) {
                    Text("\(event.minute)\u{2032}")
                        .font(TypeStyle.figures.weight(.semibold))
                        .foregroundStyle(Palette.ink)
                        .frame(minWidth: 40, alignment: .leading)
                    VStack(alignment: .leading, spacing: 2) {
                        HStack(spacing: Space.s) {
                            EventMark(kind: event.kind)
                            Text(event.kind.label).font(.body.weight(event.kind == .goal ? .semibold : .regular))
                        }
                        Text("\(event.text) \u{00B7} \(event.home ? match.home.name : match.away.name)")
                            .font(.subheadline)
                            .foregroundStyle(Palette.inkSecondary)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                    Spacer(minLength: Space.s)
                    if let score = event.scoreAfter {
                        Text(score).font(TypeStyle.figures.weight(.semibold))
                    }
                }
                .foregroundStyle(Palette.ink)
                .padding(.vertical, Space.m)
                .accessibilityElement(children: .combine)
            }
        }
    }
}

/// The one line under a large title. It has a short form for the largest text sizes.
struct PageNote: View {
    let text: String
    let short: String
    @Environment(\.dynamicTypeSize) private var typeSize

    var body: some View {
        Text(typeSize.isAccessibilitySize ? short : text)
            .font(.subheadline.weight(.medium))
            .foregroundStyle(Palette.inkSecondary)
            .frame(maxWidth: .infinity, alignment: .leading)
            .fixedSize(horizontal: false, vertical: true)
            .padding(.bottom, -Space.m)
    }
}

/// A section heading on the plain ground. Platform face.
struct SectionHeading: View {
    let title: String
    var body: some View {
        Text(title)
            .font(.title3.weight(.bold))
            .foregroundStyle(Palette.ink)
            .frame(maxWidth: .infinity, alignment: .leading)
            .accessibilityAddTraits(.isHeader)
    }
}
