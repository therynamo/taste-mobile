import SwiftUI
import UIKit

// Every colour, size, radius and motion value in the app lives here.
// Roles are named in MOBILE-DESIGN.md. Screens never hard-code a value.

private extension UIColor {
    convenience init(rgb: UInt32) {
        self.init(
            red: CGFloat((rgb >> 16) & 0xFF) / 255,
            green: CGFloat((rgb >> 8) & 0xFF) / 255,
            blue: CGFloat(rgb & 0xFF) / 255,
            alpha: 1
        )
    }
}

private func role(light: UInt32, dark: UInt32, lightHigh: UInt32? = nil, darkHigh: UInt32? = nil) -> Color {
    Color(uiColor: UIColor { traits in
        let high = traits.accessibilityContrast == .high
        if traits.userInterfaceStyle == .dark {
            return UIColor(rgb: high ? (darkHigh ?? dark) : dark)
        }
        return UIColor(rgb: high ? (lightHigh ?? light) : light)
    })
}

enum Palette {
    /// Page and list background, and the empty part of the jug.
    static let ground = role(light: 0xFFFFFF, dark: 0x0B0C0A)
    /// Keypad keys, unselected chips, bar tracks.
    static let raised = role(light: 0xF1F2EC, dark: 0x1B1D18, lightHigh: 0xE6E8DE, darkHigh: 0x262922)
    /// Text, spending amounts, ticks, the primary pill, selection.
    static let ink = role(light: 0x0B0C0A, dark: 0xF3F5EC)
    /// Labels and secondary text.
    static let inkSoft = role(light: 0x575A50, dark: 0xA9AC9F, lightHigh: 0x34362F, darkHigh: 0xD4D7CA)
    /// Row separators and outlines.
    static let hairline = role(light: 0xD6D8CF, dark: 0x30332B, lightHigh: 0x8B8E83, darkHigh: 0x7C7F74)
    /// The owned colour. Only ever the fill of what is left.
    static let level = role(light: 0xC5F230, dark: 0xC9F53A)
    /// Text and ticks drawn on the level. Dark in both modes.
    static let onLevel = Color(uiColor: UIColor(rgb: 0x0B0C0A))
    /// Over-budget amounts only.
    static let over = role(light: 0xC2251C, dark: 0xFF7A6E, lightHigh: 0x8F120B, darkHigh: 0xFFA398)
    /// Reserved for unsettled items. Not shown in this example.
    static let pending = role(light: 0x8A5A00, dark: 0xF2C14E)
}

enum Space {
    static let xs: CGFloat = 4
    static let s: CGFloat = 8
    static let m: CGFloat = 12
    static let l: CGFloat = 16
    static let xl: CGFloat = 24
    static let xxl: CGFloat = 32
    /// Horizontal page margin.
    static let page: CGFloat = 20
}

enum Radius {
    static let control: CGFloat = 14
    static let vessel: CGFloat = 18
}

enum Size {
    static let minTarget: CGFloat = 44
    static let pill: CGFloat = 54
    static let key: CGFloat = 56
    static let heroFigure: CGFloat = 86
    static let resultFigure: CGFloat = 60
    static let tickMinor: CGFloat = 10
    static let tickMajor: CGFloat = 22
    static let line: CGFloat = 2
}

enum TypeScale {
    static let label = Font.subheadline
    static let rowTitle = Font.body
    static let rowMeta = Font.footnote
    static let amount = Font.body.monospacedDigit()
    static let section = Font.footnote.weight(.semibold)
    static let tick = Font.caption.monospacedDigit()
    static let action = Font.headline
    static let entry = Font.largeTitle.weight(.bold).monospacedDigit()
    static let key = Font.title2.weight(.medium).monospacedDigit()
}

enum Motion {
    /// spring.default: most state changes, and the level settling. No bounce.
    static let standard = Animation.smooth(duration: 0.5)
    /// spring.effects: opacity and colour.
    static let effects = Animation.spring(duration: 0.2, bounce: 0)
    /// tween.press: press feedback on bounded controls.
    static let press = Animation.easeOut(duration: 0.12)
    /// Reduce Motion: a short crossfade instead of travel.
    static let reduced = Animation.linear(duration: 0.18)
}

// MARK: - Shared control styles (defined once, used on every screen)

/// The primary action: an ink pill. Never the owned colour.
struct InkPillStyle: ButtonStyle {
    @Environment(\.isEnabled) private var enabled

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(TypeScale.action)
            .foregroundStyle(Palette.ground)
            .multilineTextAlignment(.center)
            .padding(.horizontal, Space.xl)
            .padding(.vertical, Space.m)
            .frame(maxWidth: .infinity, minHeight: Size.pill)
            .background(Palette.ink.opacity(enabled ? 1 : 0.35), in: Capsule())
            .scaleEffect(configuration.isPressed ? 0.97 : 1)
            .animation(Motion.press, value: configuration.isPressed)
    }
}

/// The secondary action: the same pill, outlined.
struct OutlinePillStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(TypeScale.action)
            .foregroundStyle(Palette.ink)
            .multilineTextAlignment(.center)
            .padding(.horizontal, Space.xl)
            .padding(.vertical, Space.m)
            .frame(maxWidth: .infinity, minHeight: Size.pill)
            .background(Capsule().strokeBorder(Palette.ink, lineWidth: Size.line))
            .contentShape(Capsule())
            .scaleEffect(configuration.isPressed ? 0.97 : 1)
            .animation(Motion.press, value: configuration.isPressed)
    }
}

/// Press feedback for other bounded controls (keys, chips).
struct PressScaleStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.96 : 1)
            .opacity(configuration.isPressed ? 0.8 : 1)
            .animation(Motion.press, value: configuration.isPressed)
    }
}

/// A plain section heading used above every list.
struct SectionHeading: View {
    let text: String

    var body: some View {
        Text(text)
            .font(TypeScale.section)
            .foregroundStyle(Palette.inkSoft)
            .frame(maxWidth: .infinity, alignment: .leading)
            .accessibilityAddTraits(.isHeader)
    }
}
