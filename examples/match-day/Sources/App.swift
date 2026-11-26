import SwiftUI

// Shell: launch arguments, the system tab bar, one navigation stack per tab.

enum Launch {
    static let args = ProcessInfo.processInfo.arguments

    static func value(_ key: String) -> String? {
        args.firstIndex(of: key).flatMap { args.indices.contains($0 + 1) ? args[$0 + 1] : nil }
    }

    /// -screen today | fixtures | match | table
    static let screen = value("-screen") ?? "today"
    /// -state live | empty | error | final
    static let state = value("-state") ?? "live"
}

enum AppTab: Hashable {
    case today, fixtures, table
}

@main
struct ScoreboardEndApp: App {
    var body: some Scene {
        WindowGroup {
            RootView()
                .tint(Palette.tint)
        }
    }
}

struct RootView: View {
    @State private var tab: AppTab = {
        switch Launch.screen {
        case "fixtures", "match": return .fixtures
        case "table": return .table
        default: return .today
        }
    }()

    var body: some View {
        TabView(selection: $tab) {
            Tab("Today", systemImage: "sportscourt", value: AppTab.today) {
                TodayView(showFixtures: { tab = .fixtures })
            }
            Tab("Fixtures", systemImage: "calendar", value: AppTab.fixtures) {
                FixturesView(openMatch: Launch.screen == "match" ? Sample.featuredResult : nil)
            }
            Tab("Table", systemImage: "list.number", value: AppTab.table) {
                TableView()
            }
        }
    }
}
