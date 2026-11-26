import SwiftUI

struct Home: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @AppStorage("hapticsEnabled") private var hapticsEnabled = true
    @State private var saved = false

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Left to spend")
                .font(.subheadline)
            Text("$1,284.50")
                .font(.largeTitle.weight(.semibold))
                .monospacedDigit()
            Text("\u{2212}$42.10")
                .font(.body)
                .monospacedDigit()
            Button("Save") { saved.toggle() }
                .sensoryFeedback(.success, trigger: saved) { _, new in hapticsEnabled && new }
        }
        .animation(reduceMotion ? .easeOut(duration: 0.18) : .spring(duration: 0.4, bounce: 0), value: saved)
    }
}
