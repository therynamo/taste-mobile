import SwiftUI

enum TodayState: Equatable {
    case live, final, empty, error

    static var fromLaunch: TodayState {
        switch Launch.state {
        case "empty": return .empty
        case "error": return .error
        case "final": return .final
        default: return .live
        }
    }
}

struct TodayView: View {
    var showFixtures: () -> Void
    @State private var state = TodayState.fromLaunch
    @State private var showSettings = false
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    private var match: Match {
        var m = Sample.today
        if state == .final {
            m.phase = .final
            m.play = nil
        }
        return m
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: Space.xl) {
                    PageNote(text: Sample.todayLabel, short: Sample.today.dateLabel)

                    if state == .empty {
                        emptyBoard
                        SectionHeading(title: "Last result")
                        GameRow(match: Sample.results[0])
                            .padding(.top, -Space.m)
                    } else {
                        board
                        VStack(alignment: .leading, spacing: Space.l) {
                            SectionHeading(title: "Timeline")
                            MatchTimeline(match: match)
                        }
                        VStack(alignment: .leading, spacing: Space.xs) {
                            SectionHeading(title: "Events")
                            EventList(match: match)
                        }
                        VStack(alignment: .leading, spacing: Space.xs) {
                            SectionHeading(title: "Next")
                            GameRow(match: Sample.next)
                        }
                    }
                }
                .padding(.horizontal, Space.l)
                .padding(.bottom, Space.xl)
            }
            .background(Palette.ground)
            .navigationTitle("Today")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        showSettings = true
                    } label: {
                        Label("Settings", systemImage: "gearshape")
                    }
                    .tint(Palette.ink)
                }
            }
            .sheet(isPresented: $showSettings) {
                SettingsSheet()
                    .presentationDetents([.medium, .large])
            }
        }
    }

    // Hero moment 2: when the phase changes from live to final the clock block and the
    // flood settle on an expressive spring; under Reduce Motion it is a short crossfade.
    private var board: some View {
        GameBoard(match: match) {
            switch state {
            case .error:
                VStack(alignment: .leading, spacing: Space.m) {
                    BoardLine(text: "The score is not updating. This is the last score we received, at 67\u{2032}.")
                    Button("Try again") {
                        withAnimation(Motion.hero(Motion.effects, reduceMotion: reduceMotion)) { state = .live }
                    }
                    .buttonStyle(BoardButtonStyle())
                }
            case .final:
                BoardLine(text: "Marsh 12\u{2032}, Holloway 58\u{2032} (pen) \u{00B7} Varley 38\u{2032}")
            default:
                BoardLine(text: match.play ?? "")
            }
        }
        .animation(Motion.hero(Motion.goFinal, reduceMotion: reduceMotion), value: state)
    }

    private var emptyBoard: some View {
        VStack(alignment: .leading, spacing: Space.m) {
            Text("No match today")
                .font(.title.weight(.bold))
                .foregroundStyle(Palette.ink)
            Text("Ashcombe play next on \(Sample.next.dateLabel), away at \(Sample.next.opponent.name). Kick-off \(Sample.next.kickoff).")
                .font(.body)
                .foregroundStyle(Palette.inkSecondary)
                .fixedSize(horizontal: false, vertical: true)
            Button("See all fixtures", action: showFixtures)
                .buttonStyle(InkButtonStyle())
                .padding(.top, Space.s)
        }
        .padding(Radius.boardPadding)
        .padding(.top, Space.xxl * 2)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(alignment: .topLeading) {
            ZStack(alignment: .topLeading) {
                Palette.surface
                CodeWatermark(code: Clubs.mine.code, size: 168)
                    .offset(x: -Space.l, y: -Space.xl)
            }
        }
        .clipShape(RoundedRectangle(cornerRadius: Radius.board, style: .continuous))
    }
}

/// The one button shape in the app: a capsule. White on a flood, ink on the plain ground.
struct BoardButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.subheadline.weight(.semibold))
            .foregroundStyle(Palette.club)
            .padding(.horizontal, Space.l)
            .frame(minHeight: 44)
            .background(Palette.onFlood, in: Capsule())
            .scaleEffect(configuration.isPressed ? 0.97 : 1)
            .animation(.easeOut(duration: 0.12), value: configuration.isPressed)
    }
}

struct InkButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.subheadline.weight(.semibold))
            .foregroundStyle(Palette.ground)
            .padding(.horizontal, Space.l)
            .frame(minHeight: 44)
            .background(Palette.ink, in: Capsule())
            .scaleEffect(configuration.isPressed ? 0.97 : 1)
            .animation(.easeOut(duration: 0.12), value: configuration.isPressed)
    }
}
