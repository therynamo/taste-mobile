import SwiftUI

/// One game per row on the plain ground. The opponent's code sits behind it as an ink watermark.
struct GameRow<Accessory: View>: View {
    let match: Match
    @ViewBuilder var accessory: () -> Accessory
    @Environment(\.dynamicTypeSize) private var typeSize

    private var venue: String { match.isHome ? "Home" : "Away" }

    private var detail: String {
        switch match.phase {
        case .upcoming: return "\(venue) \u{00B7} \(match.ground)"
        case .live(let minute): return "\(venue) \u{00B7} \(minute)\u{2032} played"
        case .final: return "\(venue) \u{00B7} \(match.outcomeWord ?? "")"
        }
    }

    private var scoreText: String? {
        guard let h = match.homeGoals, let a = match.awayGoals else { return nil }
        return "\(h)\u{2013}\(a)"
    }

    var body: some View {
        let layout = typeSize.isAccessibilitySize
            ? AnyLayout(VStackLayout(alignment: .leading, spacing: Space.xs))
            : AnyLayout(HStackLayout(alignment: .center, spacing: Space.m))
        layout {
            VStack(alignment: .leading, spacing: Space.xs) {
                Text("\(match.dateLabel) \u{00B7} \(match.competition)")
                    .font(TypeStyle.label)
                    .foregroundStyle(Palette.inkSecondary)
                Text(match.opponent.name)
                    .font(.title3.weight(.semibold))
                    .foregroundStyle(Palette.ink)
                Text(detail)
                    .font(.subheadline)
                    .foregroundStyle(Palette.inkSecondary)
            }
            .fixedSize(horizontal: false, vertical: true)
            .frame(maxWidth: .infinity, alignment: .leading)
            .accessibilityElement(children: .combine)

            HStack(spacing: Space.s) {
                if let scoreText {
                    ScoreNumeral(text: scoreText, base: 40, color: Palette.ink)
                        .padding(.trailing, Space.s)
                        .accessibilityLabel("\(match.home.name) \(match.homeGoals ?? 0), \(match.away.name) \(match.awayGoals ?? 0)")
                } else {
                    Text(match.kickoff)
                        .font(.title3.weight(.semibold))
                        .monospacedDigit()
                        .foregroundStyle(Palette.ink)
                        .accessibilityLabel("Kick-off \(match.kickoff)")
                }
                accessory()
            }
        }
        .padding(.vertical, Space.m)
        .frame(maxWidth: .infinity, minHeight: 84, alignment: .leading)
        .background(alignment: .trailing) {
            CodeWatermark(code: match.opponent.code, size: 92)
                .offset(x: Space.m)
        }
        .clipped()
        .contentShape(Rectangle())
    }
}

extension GameRow where Accessory == EmptyView {
    init(match: Match) {
        self.init(match: match, accessory: { EmptyView() })
    }
}

/// Rows get an opacity change on press, not a scale.
struct RowPressStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .opacity(configuration.isPressed ? 0.55 : 1)
            .animation(.easeOut(duration: 0.12), value: configuration.isPressed)
    }
}

struct RowRule: View {
    var body: some View { Rectangle().fill(Palette.hairline).frame(height: 1) }
}

struct FixturesView: View {
    @State private var path: [String]
    @State private var pinnedID: String? = Sample.defaultPinned
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    init(openMatch: Match?) {
        _path = State(initialValue: openMatch.map { [$0.id] } ?? [])
    }

    private var pinned: Match? { Sample.upcoming.first { $0.id == pinnedID } }
    private var upcoming: [Match] { Sample.upcoming.filter { $0.id != pinnedID } }

    private func match(id: String) -> Match? {
        ([Sample.today] + Sample.results + Sample.upcoming).first { $0.id == id }
    }

    // Hero moment 1: a game is pinned to the top of the board. The flooded surface arrives on
    // an expressive spring and the haptic fires when it has landed. Reduce Motion: a crossfade.
    private func setPinned(_ id: String?) {
        withAnimation(Motion.hero(Motion.pin, reduceMotion: reduceMotion), completionCriteria: .logicallyComplete) {
            pinnedID = id
        } completion: {
            if id != nil { Haptics.pinLanded(screen: "fixtures") }
        }
    }

    var body: some View {
        NavigationStack(path: $path) {
            ScrollView {
                VStack(alignment: .leading, spacing: Space.xl) {
                    PageNote(text: "2026\u{2013}27 \u{00B7} \(Sample.division) and \(Sample.cup)", short: "2026\u{2013}27 season")

                    if let pinned {
                        GameBoard(match: pinned) {
                            VStack(alignment: .leading, spacing: Space.m) {
                                BoardLine(text: "Pinned \u{00B7} \(pinned.dateLabel) \u{00B7} \(pinned.isHome ? "At home" : "Away")")
                                Button("Unpin") { setPinned(nil) }
                                    .buttonStyle(BoardButtonStyle())
                            }
                        }
                        .transition(reduceMotion ? .opacity : .scale(scale: 0.94, anchor: .top).combined(with: .opacity))
                    }

                    section("Today") {
                        NavigationLink(value: Sample.today.id) {
                            GameRow(match: Sample.today) { chevron }
                        }
                        .buttonStyle(RowPressStyle())
                    }

                    section("Upcoming") {
                        ForEach(Array(upcoming.enumerated()), id: \.element.id) { index, game in
                            if index > 0 { RowRule() }
                            GameRow(match: game) {
                                Button {
                                    setPinned(game.id)
                                } label: {
                                    Image(systemName: "pin")
                                        .font(.body.weight(.medium))
                                        .foregroundStyle(Palette.ink)
                                        .frame(minWidth: 44, minHeight: 44)
                                        .contentShape(Rectangle())
                                }
                                .buttonStyle(RowPressStyle())
                                .accessibilityLabel("Pin \(game.opponent.name), \(game.dateLabel)")
                            }
                        }
                    }

                    section("Results") {
                        ForEach(Array(Sample.results.enumerated()), id: \.element.id) { index, game in
                            if index > 0 { RowRule() }
                            NavigationLink(value: game.id) {
                                GameRow(match: game) { chevron }
                            }
                            .buttonStyle(RowPressStyle())
                        }
                    }
                }
                .padding(.horizontal, Space.l)
                .padding(.bottom, Space.xl)
            }
            .background(Palette.ground)
            .navigationTitle("Fixtures")
            .navigationDestination(for: String.self) { id in
                if let found = match(id: id) { MatchView(match: found) }
            }
        }
    }

    private var chevron: some View {
        Image(systemName: "chevron.right")
            .font(.footnote.weight(.semibold))
            .foregroundStyle(Palette.inkSecondary)
            .accessibilityHidden(true)
    }

    private func section<Content: View>(_ title: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 0) {
            SectionHeading(title: title)
            content()
        }
    }
}

struct MatchView: View {
    let match: Match

    private func scorers(home: Bool) -> String {
        match.events.filter { $0.kind == .goal && $0.home == home }
            .map { "\($0.text.components(separatedBy: ",")[0]) \($0.minute)\u{2032}" }
            .joined(separator: ", ")
    }

    private var boardLine: String {
        if case .live = match.phase { return match.play ?? "" }
        let ours = scorers(home: match.isHome), theirs = scorers(home: !match.isHome)
        var parts: [String] = []
        if let word = match.outcomeWord { parts.append("\(word) \(match.isHome ? "at home" : "away").") }
        if !ours.isEmpty { parts.append("\(ours).") }
        if !theirs.isEmpty { parts.append("\(match.opponent.name): \(theirs).") }
        return parts.joined(separator: " ")
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: Space.xl) {
                GameBoard(match: match) {
                    BoardLine(text: boardLine)
                }
                if match.events.isEmpty {
                    VStack(alignment: .leading, spacing: Space.s) {
                        SectionHeading(title: "Timeline")
                        Text("No events were recorded for this match.")
                            .font(.body)
                            .foregroundStyle(Palette.inkSecondary)
                    }
                } else {
                    VStack(alignment: .leading, spacing: Space.l) {
                        SectionHeading(title: "Timeline")
                        MatchTimeline(match: match)
                    }
                    VStack(alignment: .leading, spacing: Space.xs) {
                        SectionHeading(title: "Events")
                        EventList(match: match)
                    }
                }
                VStack(alignment: .leading, spacing: Space.m) {
                    SectionHeading(title: "Match")
                    fact("Competition", match.competition)
                    fact("Date", "\(match.dateLabel), kick-off \(match.kickoff)")
                    fact("Ground", match.ground)
                }
            }
            .padding(.horizontal, Space.l)
            .padding(.vertical, Space.l)
        }
        .background(Palette.ground)
        .navigationTitle("\(match.home.code) v \(match.away.code)")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func fact(_ label: String, _ value: String) -> some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(label).font(TypeStyle.label).foregroundStyle(Palette.inkSecondary)
            Text(value).font(.body).foregroundStyle(Palette.ink)
        }
        .accessibilityElement(children: .combine)
    }
}
