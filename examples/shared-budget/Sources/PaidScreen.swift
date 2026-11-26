import SwiftUI

/// Who paid: every spend with its payer, and how far the two are from an even split.
/// Ink only. Solid means Ana, outlined means Tomas, dashed means even.
struct PaidScreen: View {
    @EnvironmentObject private var app: AppState
    @State private var filter: Person?

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: Space.xl) {
                    if app.month.spends.isEmpty {
                        VStack(alignment: .leading, spacing: Space.s) {
                            Text("Nobody has paid for anything yet")
                                .font(.title3.weight(.semibold))
                                .foregroundStyle(Palette.ink)
                            Text("Each spend you add is marked with who paid, and the split between you shows here.")
                                .font(TypeScale.rowTitle)
                                .foregroundStyle(Palette.inkSoft)
                        }
                    } else {
                        SplitSummary(month: app.month)
                        Picker("Show", selection: $filter) {
                            Text("Both").tag(Person?.none)
                            ForEach(Person.allCases) { person in
                                Text(person.rawValue).tag(Person?.some(person))
                            }
                        }
                        .pickerStyle(.segmented)
                        spendsByDay
                    }
                }
                .padding(.horizontal, Space.page)
                .padding(.top, Space.s)
                .padding(.bottom, Space.xl)
                .frame(maxWidth: .infinity, alignment: .leading)
            }
            .background(Palette.ground)
            .navigationTitle("Who paid")
        }
    }

    private var spendsByDay: some View {
        let shown = app.month.newestFirst.filter { filter == nil || $0.payer == filter }
        let days = Array(Set(shown.map(\.day))).sorted(by: >)
        return VStack(alignment: .leading, spacing: Space.l) {
            ForEach(days, id: \.self) { day in
                let rows = shown.filter { $0.day == day }
                VStack(spacing: 0) {
                    SectionHeading(text: heading(day))
                        .padding(.bottom, Space.xs)
                    ForEach(rows) { spend in
                        SpendRow(spend: spend, meta: "\(spend.category.rawValue) · \(spend.payer.rawValue) paid")
                        if spend != rows.last { RowDivider() }
                    }
                }
            }
        }
    }

    private func heading(_ day: Int) -> String {
        let short = app.month.dayLabel(day)
        let long = app.month.longDayLabel(day)
        return short == long ? long : "\(short) · \(long)"
    }
}

/// The split: one bar, Ana's share solid, Tomas's outlined, a dashed mark at even.
struct SplitSummary: View {
    let month: MonthData
    @Environment(\.dynamicTypeSize) private var typeSize

    var body: some View {
        let ana = month.spent(by: .ana)
        let tomas = month.spent(by: .tomas)
        let sum = max(ana + tomas, 1)
        let share = Double(ana) / Double(sum)

        VStack(alignment: .leading, spacing: Space.l) {
            let layout = typeSize.isAccessibilitySize
                ? AnyLayout(VStackLayout(alignment: .leading, spacing: Space.m))
                : AnyLayout(HStackLayout(alignment: .top, spacing: Space.l))
            layout {
                paidTotal(for: .ana, cents: ana)
                paidTotal(for: .tomas, cents: tomas)
            }

            VStack(alignment: .leading, spacing: Space.xs) {
                GeometryReader { geo in
                    let width = geo.size.width
                    ZStack(alignment: .topLeading) {
                        Rectangle()
                            .strokeBorder(Palette.ink, lineWidth: Size.line)
                            .frame(height: 28)
                            .offset(y: Space.s)
                        Rectangle()
                            .fill(Palette.ink)
                            .frame(width: width * share, height: 28)
                            .offset(y: Space.s)
                        // The even mark: the same dashed line as the even pace in the jug.
                        DashedLine(vertical: true)
                            .stroke(Palette.ink, style: StrokeStyle(lineWidth: Size.line, dash: [4, 4]))
                            .frame(width: Size.line, height: 44)
                            .offset(x: width / 2 - Size.line / 2)
                        if share > 0.5 {
                            DashedLine(vertical: true)
                                .stroke(Palette.ground, style: StrokeStyle(lineWidth: Size.line, dash: [4, 4]))
                                .frame(width: Size.line, height: 28)
                                .offset(x: width / 2 - Size.line / 2, y: Space.s)
                        }
                    }
                }
                .frame(height: 44)
                .accessibilityHidden(true)
                Text("Even split")
                    .font(TypeScale.tick)
                    .foregroundStyle(Palette.inkSoft)
                    .frame(maxWidth: .infinity, alignment: .center)
            }

            Text(sentence(ana: ana, tomas: tomas))
                .font(TypeScale.rowTitle)
                .foregroundStyle(Palette.ink)
        }
    }

    private func paidTotal(for person: Person, cents: Int) -> some View {
        HStack(alignment: .center, spacing: Space.m) {
            Monogram(person: person)
                .accessibilityHidden(true)
            VStack(alignment: .leading, spacing: 0) {
                Text("\(person.rawValue) paid")
                    .font(TypeScale.label)
                    .foregroundStyle(Palette.inkSoft)
                Text(Money.string(cents))
                    .font(.title3.weight(.semibold).monospacedDigit())
                    .foregroundStyle(Palette.ink)
                    .lineLimit(1)
                    .minimumScaleFactor(0.6)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .accessibilityElement(children: .combine)
    }

    private func sentence(ana: Int, tomas: Int) -> String {
        let gap = abs(ana - tomas) / 2
        if gap == 0 { return "You are even this month." }
        let (from, to) = ana > tomas ? (Person.tomas, Person.ana) : (Person.ana, Person.tomas)
        return "\(from.rawValue) pays \(to.rawValue) \(Money.string(gap)) to be even."
    }
}
