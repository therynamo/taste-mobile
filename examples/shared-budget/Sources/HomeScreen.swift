import SwiftUI

/// Home: what is left this month, as the level in the jug. The only flooded surface.
struct HomeScreen: View {
    @EnvironmentObject private var app: AppState
    @AppStorage(Haptics.settingKey) private var hapticsOn = true

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 0) {
                    JugHero(month: app.month)
                    latest
                        .padding(.horizontal, Space.page)
                        .padding(.top, Space.xl)
                        .padding(.bottom, Space.xl)
                }
            }
            .background(Palette.ground)
            .navigationTitle("\(app.month.name) \(String(app.month.year))")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Menu {
                        Toggle("Haptics", isOn: $hapticsOn)
                    } label: {
                        Image(systemName: "ellipsis")
                    }
                    .accessibilityLabel("Settings")
                }
            }
            .safeAreaBar(edge: .bottom) {
                Button("Add spend") { app.showAdd = true }
                    .buttonStyle(InkPillStyle())
                    .padding(.horizontal, Space.page)
                    .padding(.bottom, Space.s)
            }
            .sheet(isPresented: $app.showAdd) {
                AddSpendSheet()
            }
        }
    }

    @ViewBuilder
    private var latest: some View {
        let rows = Array(app.month.newestFirst.prefix(5))
        if rows.isEmpty {
            VStack(alignment: .leading, spacing: Space.s) {
                Text("Nothing poured yet")
                    .font(.title3.weight(.semibold))
                    .foregroundStyle(Palette.ink)
                Text("The jug is full. Add the first spend and the level drops by that much, with a note of who paid.")
                    .font(TypeScale.rowTitle)
                    .foregroundStyle(Palette.inkSoft)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        } else {
            VStack(spacing: 0) {
                SectionHeading(text: "Latest")
                    .padding(.bottom, Space.xs)
                ForEach(rows) { spend in
                    SpendRow(spend: spend, meta: "\(spend.category.rawValue) · \(app.month.dayLabel(spend.day))")
                    if spend != rows.last { RowDivider() }
                }
            }
        }
    }
}

/// The jug, full bleed. The figure sits in the level when the level is deep enough to hold it,
/// otherwise it rests on the level line. At accessibility sizes it moves above the jug.
struct JugHero: View {
    let month: MonthData
    @Environment(\.dynamicTypeSize) private var typeSize
    @State private var textHeight: CGFloat = 150

    private let fullHeight: CGFloat = 470
    private let stackedHeight: CGFloat = 250
    private let brim: CGFloat = Space.page

    var body: some View {
        let fraction = month.leftFraction
        let stacked = typeSize.isAccessibilitySize
        let height = stacked ? stackedHeight : fullHeight
        let levelY = brim + (height - brim) * (1 - fraction)
        let inside = (height - levelY) >= textHeight + Space.l + Space.m
        let textTop = inside ? height - Space.l - textHeight : max(levelY - Space.m - textHeight, 0)
        let textRect = stacked ? CGRect.zero : CGRect(x: 0, y: textTop, width: 260, height: textHeight)

        VStack(alignment: .leading, spacing: Space.l) {
            if stacked {
                figure(onLevel: false)
                    .padding(.horizontal, Space.page)
                    .padding(.top, Space.s)
            }
            ZStack(alignment: .topLeading) {
                JugLevel(
                    fraction: fraction,
                    even: month.spends.isEmpty ? nil : month.evenFraction,
                    keepClear: textRect,
                    budgetCents: month.budgetCents,
                    brim: brim,
                    sparse: stacked
                )
                if !stacked {
                    figure(onLevel: inside)
                        .onGeometryChange(for: CGFloat.self) { $0.size.height } action: { textHeight = $0 }
                        .padding(.leading, Space.page)
                        .padding(.trailing, Space.page + Size.tickMajor)
                        .offset(y: textTop)
                }
            }
            .frame(height: height)
        }
    }

    private func figure(onLevel: Bool) -> some View {
        let over = month.leftCents < 0
        let strong = over ? Palette.over : (onLevel ? Palette.onLevel : Palette.ink)
        let soft = onLevel ? Palette.onLevel.opacity(0.78) : Palette.inkSoft
        return VStack(alignment: .leading, spacing: 0) {
            HStack(spacing: Space.xs) {
                if over {
                    Image(systemName: "exclamationmark.triangle.fill")
                        .foregroundStyle(Palette.over)
                        .accessibilityHidden(true)
                }
                Text(over ? "Over this month" : "Left this month")
            }
            .font(TypeScale.label)
            .foregroundStyle(over ? Palette.over : soft)
            LeftFigure(cents: month.leftCents)
                .foregroundStyle(strong)
            Text(subline)
                .font(TypeScale.label)
                .foregroundStyle(soft)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .accessibilityElement(children: .combine)
    }

    private var subline: String {
        let days = month.daysToGo == 1 ? "1 day to go" : "\(month.daysToGo) days to go"
        if month.spends.isEmpty { return "Nothing spent yet · \(days)" }
        return "of \(Money.string(month.budgetCents)) · \(days)"
    }
}
