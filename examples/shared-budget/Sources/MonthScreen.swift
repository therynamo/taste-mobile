import SwiftUI

/// Month: how the level fell day by day, and what is left in each category.
struct MonthScreen: View {
    @EnvironmentObject private var app: AppState
    @Environment(\.dynamicTypeSize) private var typeSize
    @ScaledMetric(relativeTo: .footnote) private var swatch: CGFloat = 12

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: Space.xl) {
                    VStack(alignment: .leading, spacing: Space.m) {
                        Text(paceSentence)
                            .font(.title3.weight(.semibold))
                            .foregroundStyle(Palette.ink)
                        LevelChart(month: app.month)
                            .frame(height: 220)
                            .padding(.horizontal, -Space.page)
                        HStack {
                            Text("1 Nov")
                            Spacer()
                            Text("30 Nov")
                        }
                        .font(TypeScale.tick)
                        .foregroundStyle(Palette.inkSoft)
                        legend
                    }

                    VStack(spacing: 0) {
                        SectionHeading(text: "Left by category")
                            .padding(.bottom, Space.xs)
                        ForEach(Category.allCases) { category in
                            CategoryRow(
                                category: category,
                                spent: app.month.spent(in: category)
                            )
                            if category != Category.allCases.last { RowDivider() }
                        }
                    }
                }
                .padding(.horizontal, Space.page)
                .padding(.top, Space.s)
                .padding(.bottom, Space.xl)
                .frame(maxWidth: .infinity, alignment: .leading)
            }
            .background(Palette.ground)
            .navigationTitle(app.month.name)
        }
    }

    private var paceSentence: String {
        let month = app.month
        if month.spends.isEmpty { return "Nothing spent yet. The jug is full." }
        if month.leftCents < 0 { return "The jug is empty, \(month.daysToGo) days early." }
        let even = Int((Double(month.budgetCents) * month.evenFraction).rounded())
        let gap = month.leftCents - even
        if gap == 0 { return "Spending at an even pace." }
        return gap < 0
            ? "Spending \(Money.string(-gap)) faster than an even pace."
            : "Spending \(Money.string(gap)) slower than an even pace."
    }

    private var legend: some View {
        let layout = typeSize.isAccessibilitySize
            ? AnyLayout(VStackLayout(alignment: .leading, spacing: Space.s))
            : AnyLayout(HStackLayout(spacing: Space.l))
        return layout {
            HStack(spacing: Space.s) {
                Rectangle()
                    .fill(Palette.level)
                    .overlay(alignment: .top) { Rectangle().fill(Palette.ink).frame(height: Size.line) }
                    .frame(width: swatch * 1.8, height: swatch)
                Text("Left, day by day")
            }
            HStack(spacing: Space.s) {
                DashedLine()
                    .stroke(Palette.ink.opacity(0.7), style: StrokeStyle(lineWidth: Size.line, dash: [4, 4]))
                    .frame(width: swatch * 1.8, height: Size.line)
                Text("Even pace")
            }
        }
        .font(TypeScale.rowMeta)
        .foregroundStyle(Palette.inkSoft)
        .accessibilityElement(children: .combine)
    }
}

/// The level over the month: a bare lime step area, an ink top edge, the dashed even line.
/// No axes and no gridlines. Drawn once, not animated on load.
struct LevelChart: View {
    let month: MonthData

    var body: some View {
        GeometryReader { geo in
            let size = geo.size
            let levels = month.levelByDay
            let dayWidth = size.width / CGFloat(month.daysInMonth)
            let y: (Int) -> CGFloat = { cents in
                let share = min(max(Double(cents) / Double(month.budgetCents), 0), 1)
                return size.height * (1 - share)
            }

            ZStack(alignment: .topLeading) {
                Path { path in
                    path.move(to: CGPoint(x: 0, y: size.height))
                    for (day, cents) in levels.enumerated() where day > 0 {
                        path.addLine(to: CGPoint(x: CGFloat(day - 1) * dayWidth, y: y(cents)))
                        path.addLine(to: CGPoint(x: CGFloat(day) * dayWidth, y: y(cents)))
                    }
                    path.addLine(to: CGPoint(x: CGFloat(levels.count - 1) * dayWidth, y: size.height))
                    path.closeSubpath()
                }
                .fill(Palette.level)

                Path { path in
                    path.move(to: CGPoint(x: 0, y: y(levels.first ?? 0)))
                    for (day, cents) in levels.enumerated() where day > 0 {
                        path.addLine(to: CGPoint(x: CGFloat(day - 1) * dayWidth, y: y(cents)))
                        path.addLine(to: CGPoint(x: CGFloat(day) * dayWidth, y: y(cents)))
                    }
                }
                .stroke(Palette.ink, style: StrokeStyle(lineWidth: Size.line, lineJoin: .miter))

                Path { path in
                    path.move(to: CGPoint(x: 0, y: 0))
                    path.addLine(to: CGPoint(x: size.width, y: size.height))
                }
                .stroke(Palette.ink.opacity(0.7), style: StrokeStyle(lineWidth: Size.line, dash: [6, 6]))

                Rectangle()
                    .fill(Palette.ink)
                    .frame(width: size.width, height: Size.line)
                    .offset(y: size.height - Size.line)
            }
        }
        .accessibilityElement()
        .accessibilityLabel("Level chart. \(Money.string(month.leftCents)) left on day \(month.today) of \(month.daysInMonth).")
    }
}

/// One category: what is left, of how much, with an ink bar. Red only when over.
struct CategoryRow: View {
    let category: Category
    let spent: Int
    @Environment(\.dynamicTypeSize) private var typeSize

    var body: some View {
        let left = category.budgetCents - spent
        let share = min(max(Double(left) / Double(category.budgetCents), 0), 1)

        VStack(alignment: .leading, spacing: Space.s) {
            if typeSize.isAccessibilitySize {
                VStack(alignment: .leading, spacing: Space.xs) {
                    name
                    amount(left)
                    meta
                }
            } else {
                HStack(alignment: .firstTextBaseline, spacing: Space.m) {
                    VStack(alignment: .leading, spacing: 2) {
                        name
                        meta
                    }
                    Spacer(minLength: Space.m)
                    amount(left)
                }
            }
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    Rectangle().fill(Palette.raised)
                    Rectangle().fill(Palette.ink).frame(width: geo.size.width * share)
                }
            }
            .frame(height: 6)
            .accessibilityHidden(true)
        }
        .padding(.vertical, Space.m)
        .accessibilityElement(children: .combine)
    }

    private var name: some View {
        Text(category.rawValue).font(TypeScale.rowTitle).foregroundStyle(Palette.ink)
    }

    private var meta: some View {
        Text("\(Money.string(spent)) spent of \(Money.string(category.budgetCents))")
            .font(TypeScale.rowMeta.monospacedDigit())
            .foregroundStyle(Palette.inkSoft)
    }

    @ViewBuilder
    private func amount(_ left: Int) -> some View {
        if left < 0 {
            Label("\(Money.string(left)) over", systemImage: "exclamationmark.triangle.fill")
                .font(TypeScale.amount)
                .foregroundStyle(Palette.over)
        } else {
            Text(Money.string(left)).font(TypeScale.amount).foregroundStyle(Palette.ink)
                .lineLimit(1).minimumScaleFactor(0.6)
        }
    }
}
