import SwiftUI
import UIKit

// The one haptics module. Every haptic in the app goes through here.
// Setting key: haptics_enabled (toggle in Settings). Debug builds log each call.

enum Haptics {
    static let settingKey = "haptics_enabled"

    static var isEnabled: Bool {
        UserDefaults.standard.object(forKey: settingKey) as? Bool ?? true
    }

    /// A game row lands in Pinned: a medium impact, matched to a row-sized object dropping into place.
    static func pinLanded(screen: String) {
        play(interaction: "pin-landed", type: "impact.medium", screen: screen) {
            let generator = UIImpactFeedbackGenerator(style: .medium)
            generator.impactOccurred()
        }
    }

    private static func play(interaction: String, type: String, screen: String, _ fire: () -> Void) {
        guard isEnabled else { return }
        fire()
        #if DEBUG
        print("haptic {interaction: \(interaction), type: \(type), timestamp: \(Date().timeIntervalSince1970), screen: \(screen)}")
        #endif
    }
}

struct SettingsSheet: View {
    @AppStorage(Haptics.settingKey) private var hapticsEnabled = true
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    Toggle("Haptics", isOn: $hapticsEnabled)
                } footer: {
                    Text("One haptic in the app: a game landing in Pinned. Score changes are silent.")
                }
                .listRowBackground(Palette.surface)
                Section {
                    LabeledContent("Club", value: Clubs.mine.name)
                    LabeledContent("League", value: Sample.league)
                } footer: {
                    Text("Sample data with a fixed clock. Every club, player and competition is invented.")
                }
                .listRowBackground(Palette.surface)
            }
            .scrollContentBackground(.hidden)
            .background(Palette.ground)
            .foregroundStyle(Palette.ink)
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") { dismiss() }
                }
            }
        }
    }
}
