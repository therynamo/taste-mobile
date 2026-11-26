import SwiftUI

@main
struct JugfulApp: App {
    @StateObject private var app = AppState()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(app)
                .tint(Palette.ink)
        }
    }
}

/// The shell: a system tab bar with the three places visited every session.
/// Adding a spend is a system sheet opened from Home.
struct RootView: View {
    @EnvironmentObject private var app: AppState

    var body: some View {
        TabView(selection: $app.tab) {
            Tab("Left", systemImage: "square.bottomhalf.filled", value: AppTab.home) {
                HomeScreen()
            }
            Tab("Who paid", systemImage: "person.2", value: AppTab.paid) {
                PaidScreen()
            }
            Tab("Month", systemImage: "calendar", value: AppTab.month) {
                MonthScreen()
            }
        }
    }
}
