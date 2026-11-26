import SwiftUI
import AVFoundation

struct Home: View {
    @State private var on = false
    @State private var shown = false

    var body: some View {
        VStack {
            Text("Balance")
                .font(.system(size: 9))
                .dynamicTypeSize(.large)
            Toggle("Alerts", isOn: $on)
                .sensoryFeedback(.selection, trigger: on)
            Circle()
                .scaleEffect(0)
                .animation(.spring(response: 0.4, dampingFraction: 0.45), value: shown)
            Rectangle()
                .fill(LinearGradient(colors: [.purple, .blue], startPoint: .top, endPoint: .bottom))
                .animation(.easeIn(duration: 0.8), value: shown)
        }
        .navigationBarBackButtonHidden(true)
        .padding(.top, 50)
    }

    func prepare() {
        try? AVAudioSession.sharedInstance().setCategory(.playback)
        UIImpactFeedbackGenerator(style: .heavy).impactOccurred()
    }
}
