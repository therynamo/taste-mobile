import SwiftUI

// The one haptics module. Every haptic in the app goes through `View.haptic`.
// It respects the in-app setting and logs each call so the mapping can be read back.

enum HapticKind: String {
    case success
    case error

    var feedback: SensoryFeedback {
        switch self {
        case .success: return .success
        case .error: return .error
        }
    }
}

enum Haptics {
    static let settingKey = "hapticsEnabled"

    static var enabled: Bool {
        UserDefaults.standard.object(forKey: settingKey) as? Bool ?? true
    }

    static func log(interaction: String, kind: HapticKind, screen: String) {
        guard ProcessInfo.processInfo.arguments.contains("-hapticLog") else { return }
        print("haptic {interaction: \(interaction), type: \(kind.rawValue), timestamp: \(Date().timeIntervalSince1970), screen: \(screen)}")
    }
}

extension View {
    /// Plays one haptic when `trigger` changes, for a visible cause named by `interaction`.
    func haptic<T: Equatable>(_ kind: HapticKind, trigger: T, interaction: String, screen: String) -> some View {
        sensoryFeedback(trigger: trigger) { _, _ in
            guard Haptics.enabled else { return nil }
            Haptics.log(interaction: interaction, kind: kind, screen: screen)
            return kind.feedback
        }
    }
}
