import SwiftUI
import UIKit

// Tokens: every colour, spacing, radius, type and motion value in the app lives here.
// Nothing is hard-coded in the views.

extension UIColor {
    convenience init(hex: UInt32, alpha: CGFloat = 1) {
        self.init(
            red: CGFloat((hex >> 16) & 0xFF) / 255,
            green: CGFloat((hex >> 8) & 0xFF) / 255,
            blue: CGFloat(hex & 0xFF) / 255,
            alpha: alpha
        )
    }
}

extension Color {
    /// A role with light, dark and increased-contrast values.
    init(light: UInt32, dark: UInt32, lightHC: UInt32, darkHC: UInt32, alpha: CGFloat = 1) {
        self.init(uiColor: UIColor { traits in
            let isDark = traits.userInterfaceStyle == .dark
            let isHigh = traits.accessibilityContrast == .high
            let hex = isDark ? (isHigh ? darkHC : dark) : (isHigh ? lightHC : light)
            return UIColor(hex: hex, alpha: alpha)
        })
    }
}

enum Palette {
    static let ground = Color(light: 0xF3F1ED, dark: 0x160A0C, lightHC: 0xFFFFFF, darkHC: 0x000000)
    static let surface = Color(light: 0xFFFFFF, dark: 0x231317, lightHC: 0xFFFFFF, darkHC: 0x1A0D10)
    static let ink = Color(light: 0x1A1113, dark: 0xF6EDEE, lightHC: 0x000000, darkHC: 0xFFFFFF)
    static let inkSecondary = Color(light: 0x5C5053, dark: 0xBBABAE, lightHC: 0x3A3033, darkHC: 0xE2D6D8)
    static let hairline = Color(light: 0xDAD4D0, dark: 0x3B262A, lightHC: 0x8A8083, darkHC: 0x9A8A8D)
    static let watermark = Color(uiColor: UIColor { traits in
        traits.userInterfaceStyle == .dark
            ? UIColor(hex: 0xF6EDEE, alpha: 0.09)
            : UIColor(hex: 0x1A1113, alpha: 0.07)
    })
    /// The supported club's identity colour. Floods only, never status.
    static let club = Color(light: 0x8E1B2A, dark: 0x8E1B2A, lightHC: 0x6E0F1C, darkHC: 0x6E0F1C)
    static let tint = Color(light: 0x8E1B2A, dark: 0xF2A7B0, lightHC: 0x6E0F1C, darkHC: 0xFFC9CF)
    static let onFlood = Color(light: 0xFFFFFF, dark: 0xFFFFFF, lightHC: 0xFFFFFF, darkHC: 0xFFFFFF)
    static let onFloodSecondary = Color(light: 0xFFFFFF, dark: 0xFFFFFF, lightHC: 0xFFFFFF, darkHC: 0xFFFFFF, alpha: 0.82)
    static let onFloodWatermark = Color(light: 0xFFFFFF, dark: 0xFFFFFF, lightHC: 0xFFFFFF, darkHC: 0xFFFFFF, alpha: 0.13)
    static let onFloodRule = Color(light: 0xFFFFFF, dark: 0xFFFFFF, lightHC: 0xFFFFFF, darkHC: 0xFFFFFF, alpha: 0.28)
    /// Laid over a flood once the game is final, so a result sits quieter than a live game.
    static let settle = Color(light: 0x160A0C, dark: 0x160A0C, lightHC: 0x000000, darkHC: 0x000000, alpha: 0.34)

    /// One dark hue per club. Data for the two-team flood, not decoration.
    static func team(_ code: String) -> Color {
        let hex: UInt32
        switch code {
        case "ASH": hex = 0x8E1B2A
        case "OLD": hex = 0x1D2E6E
        case "FEN": hex = 0x1F5A3A
        case "SAL": hex = 0x0E5F66
        case "KES": hex = 0x9A4510
        case "TOL": hex = 0x0F4C6B
        case "RID": hex = 0x2A5F96
        case "NOR": hex = 0x3A3F47
        case "QRY": hex = 0x7A5C10
        case "BRI": hex = 0x5B2A6E
        default: hex = 0x3A3F47
        }
        return Color(uiColor: UIColor(hex: hex))
    }
}

enum Space {
    static let xs: CGFloat = 4
    static let s: CGFloat = 8
    static let m: CGFloat = 12
    static let l: CGFloat = 16
    static let xl: CGFloat = 24
    static let xxl: CGFloat = 36
}

enum Radius {
    /// The game surface. Inner shapes derive from it: inner = outer - padding.
    static let board: CGFloat = 24
    static let boardPadding: CGFloat = 16
    static let inner: CGFloat = board - boardPadding
}

enum Motion {
    /// spring.default
    static let standard = Animation.smooth(duration: 0.4)
    /// spring.effects: opacity and colour, never overshoots
    static let effects = Animation.spring(duration: 0.2, bounce: 0)
    /// spring.expressive: hero moments only
    static let pin = Animation.spring(duration: 0.4, bounce: 0.3)
    static let goFinal = Animation.spring(duration: 0.44, bounce: 0.2)
    /// Replaces travel under Reduce Motion
    static let reduced = Animation.easeOut(duration: 0.18)

    static func hero(_ animation: Animation, reduceMotion: Bool) -> Animation {
        reduceMotion ? reduced : animation
    }
}

enum TypeStyle {
    /// The display treatment: condensed heavy italic. Score numerals only.
    // taste-mobile-ignore A03: every caller passes a size from @ScaledMetric (ScoreNumeral in Scoreboard.swift), so scores follow Dynamic Type
    static func score(size: CGFloat) -> Font {
        Font.system(size: size, weight: .black)
    }

    /// The governing asset: a giant heavy italic club code. Decorative, hidden from VoiceOver.
    // taste-mobile-ignore A03: the watermark is a decorative backdrop hidden from VoiceOver; it is fixed so it never crowds the text over it
    static func watermark(size: CGFloat) -> Font {
        Font.system(size: size, weight: .black)
    }

    /// Small tracked label. Platform face.
    static let label = Font.caption.weight(.semibold)
    static let figures = Font.body.monospacedDigit()
}
