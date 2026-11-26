import SwiftUI

/// Add a spend: amount on a keypad, who paid, a category, save.
/// Ink only. The level appears after the spend is committed, in the saved result.
struct AddSpendSheet: View {
    @EnvironmentObject private var app: AppState
    @Environment(\.dismiss) private var dismiss
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @Environment(\.dynamicTypeSize) private var typeSize

    @State private var entry = Launch.screen == "add" ? "42.40" : ""
    @State private var payer = Person.ana
    @State private var category = Category.groceries
    @State private var saved: Spend?
    @State private var leftBefore = 0
    @State private var shownFraction = 0.0
    @State private var savedCount = 0

    private var cents: Int {
        let parts = entry.split(separator: ".", omittingEmptySubsequences: false)
        let units = Int(parts.first ?? "") ?? 0
        var fraction = parts.count > 1 ? String(parts[1].prefix(2)) : ""
        while fraction.count < 2 { fraction.append("0") }
        return units * 100 + (Int(fraction) ?? 0)
    }

    var body: some View {
        NavigationStack {
            Group {
                if let saved {
                    savedResult(saved)
                } else {
                    entryForm
                }
            }
            .background(Palette.ground)
            .navigationTitle(saved == nil ? "Add spend" : "Saved")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                if saved == nil {
                    ToolbarItem(placement: .topBarLeading) {
                        Button("Cancel") { dismiss() }
                    }
                }
            }
        }
        .haptic(.success, trigger: savedCount, interaction: "spend saved", screen: "add")
        .onAppear {
            if Launch.screen == "add", Launch.state == "saved", saved == nil { save(animated: false) }
        }
    }

    // MARK: Entry

    private var entryForm: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: Space.xl) {
                VStack(alignment: .leading, spacing: Space.xs) {
                    Text("Amount")
                        .font(TypeScale.label)
                        .foregroundStyle(Palette.inkSoft)
                    Text("$" + (entry.isEmpty ? "0" : entry))
                        .font(TypeScale.entry)
                        .foregroundStyle(cents == 0 ? Palette.inkSoft : Palette.ink)
                        .accessibilityLabel("Amount \(Money.string(cents))")
                    leavesLine
                }

                VStack(alignment: .leading, spacing: Space.s) {
                    SectionHeading(text: "Who paid")
                    let layout = typeSize.isAccessibilitySize
                        ? AnyLayout(VStackLayout(spacing: Space.s))
                        : AnyLayout(HStackLayout(spacing: Space.s))
                    layout {
                        ForEach(Person.allCases) { person in
                            payerChoice(person)
                        }
                    }
                }

                VStack(alignment: .leading, spacing: Space.s) {
                    SectionHeading(text: "Category")
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: Space.s) {
                            ForEach(Category.allCases) { item in
                                categoryChip(item)
                            }
                        }
                        .padding(.horizontal, Space.page)
                    }
                    .padding(.horizontal, -Space.page)
                }

                keypad
            }
            .padding(.horizontal, Space.page)
            .padding(.top, Space.s)
            .padding(.bottom, Space.l)
        }
        .safeAreaBar(edge: .bottom) {
            Button("Save spend") { save(animated: true) }
                .buttonStyle(InkPillStyle())
                .disabled(cents == 0)
                .padding(.horizontal, Space.page)
                .padding(.bottom, Space.s)
        }
    }

    @ViewBuilder
    private var leavesLine: some View {
        let after = app.month.leftCents - cents
        if after < 0 {
            Label("Takes the month \(Money.string(-after)) over", systemImage: "exclamationmark.triangle.fill")
                .font(TypeScale.label)
                .foregroundStyle(Palette.over)
        } else {
            Text("Leaves \(Money.string(after)) this month")
                .font(TypeScale.label.monospacedDigit())
                .foregroundStyle(Palette.inkSoft)
        }
    }

    private func payerChoice(_ person: Person) -> some View {
        let selected = payer == person
        return Button {
            payer = person
        } label: {
            HStack(spacing: Space.m) {
                Monogram(person: person)
                    .accessibilityHidden(true)
                Text(person.rawValue)
                    .font(TypeScale.rowTitle.weight(selected ? .semibold : .regular))
                    .foregroundStyle(Palette.ink)
                Spacer(minLength: 0)
                Image(systemName: selected ? "checkmark" : "circle")
                    .font(.footnote.weight(.bold))
                    .foregroundStyle(selected ? Palette.ink : Palette.hairline)
                    .accessibilityHidden(true)
            }
            .padding(.horizontal, Space.m)
            .padding(.vertical, Space.s)
            .frame(maxWidth: .infinity, minHeight: Size.key)
            .background(
                RoundedRectangle(cornerRadius: Radius.control, style: .continuous)
                    .strokeBorder(selected ? Palette.ink : Palette.hairline, lineWidth: selected ? Size.line : 1)
            )
            .contentShape(RoundedRectangle(cornerRadius: Radius.control, style: .continuous))
        }
        .buttonStyle(PressScaleStyle())
        .accessibilityLabel("\(person.rawValue) paid")
        .accessibilityAddTraits(selected ? .isSelected : [])
    }

    private func categoryChip(_ item: Category) -> some View {
        let selected = category == item
        return Button {
            category = item
        } label: {
            Text(item.rawValue)
                .font(TypeScale.label.weight(selected ? .semibold : .regular))
                .foregroundStyle(selected ? Palette.ground : Palette.ink)
                .padding(.horizontal, Space.l)
                .frame(minHeight: Size.minTarget)
                .background(selected ? Palette.ink : Palette.raised, in: Capsule())
        }
        .buttonStyle(PressScaleStyle())
        .accessibilityAddTraits(selected ? .isSelected : [])
    }

    private var keypad: some View {
        let keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "delete"]
        return LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: Space.s), count: 3), spacing: Space.s) {
            ForEach(keys, id: \.self) { key in
                Button {
                    press(key)
                } label: {
                    Group {
                        if key == "delete" {
                            Image(systemName: "delete.left")
                        } else {
                            Text(key)
                        }
                    }
                    .font(TypeScale.key)
                    .foregroundStyle(Palette.ink)
                    .frame(maxWidth: .infinity, minHeight: Size.key)
                    .background(Palette.raised, in: RoundedRectangle(cornerRadius: Radius.control, style: .continuous))
                }
                .buttonStyle(PressScaleStyle())
                .accessibilityLabel(key == "delete" ? "Delete" : (key == "." ? "Decimal point" : key))
            }
        }
    }

    private func press(_ key: String) {
        switch key {
        case "delete":
            if !entry.isEmpty { entry.removeLast() }
        case ".":
            if !entry.contains(".") { entry += entry.isEmpty ? "0." : "." }
        default:
            if let dot = entry.firstIndex(of: ".") {
                if entry.distance(from: dot, to: entry.endIndex) <= 2 { entry += key }
            } else if entry == "0" {
                entry = key
            } else if entry.count < 5 {
                entry += key
            }
        }
    }

    private func save(animated: Bool) {
        guard cents > 0 else { return }
        leftBefore = app.month.leftCents
        shownFraction = app.month.leftFraction
        app.add(cents: cents, title: category.rawValue, category: category, payer: payer)
        saved = app.month.spends.last
        savedCount += 1
        let target = app.month.leftFraction
        if animated {
            // Hero moment: the level settles at its new mark. No bounce on a money flow.
            withAnimation(reduceMotion ? Motion.reduced : Motion.standard.delay(0.15)) { shownFraction = target }
        } else {
            shownFraction = target
        }
    }

    // MARK: Saved result

    private func savedResult(_ spend: Spend) -> some View {
        ScrollView {
            VStack(alignment: .leading, spacing: Space.xl) {
                VStack(spacing: 0) {
                    SpendRow(spend: spend, meta: "\(spend.payer.rawValue) paid · \(app.month.dayLabel(spend.day))")
                    RowDivider()
                }

                let layout = typeSize.isAccessibilitySize
                    ? AnyLayout(VStackLayout(alignment: .leading, spacing: Space.l))
                    : AnyLayout(HStackLayout(alignment: .bottom, spacing: Space.xl))
                layout {
                    if stacked { resultFigure }
                    SmallJug(fraction: shownFraction, budgetCents: app.month.budgetCents)
                        .frame(width: 132, height: 236)
                    if !stacked { resultFigure }
                }

                // At the largest text sizes the two actions follow the result instead of covering it.
                if stacked { resultActions }
            }
            .padding(.horizontal, Space.page)
            .padding(.top, Space.s)
            .padding(.bottom, Space.l)
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .safeAreaBar(edge: .bottom) {
            if !stacked {
                resultActions
                    .padding(.horizontal, Space.page)
                    .padding(.bottom, Space.s)
            }
        }
    }

    private var stacked: Bool { typeSize.isAccessibilitySize }

    private var resultFigure: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text(app.month.leftCents < 0 ? "Over this month" : "Left this month")
                .font(TypeScale.label)
                .foregroundStyle(Palette.inkSoft)
            LeftFigure(cents: app.month.leftCents, base: Size.resultFigure)
                .foregroundStyle(app.month.leftCents < 0 ? Palette.over : Palette.ink)
            Text("Down from \(Money.string(leftBefore))")
                .font(TypeScale.label.monospacedDigit())
                .foregroundStyle(Palette.inkSoft)
        }
        .accessibilityElement(children: .combine)
    }

    private var resultActions: some View {
        VStack(spacing: Space.s) {
            Button("Add another") {
                entry = ""
                saved = nil
            }
            .buttonStyle(OutlinePillStyle())
            Button("Done") { dismiss() }
                .buttonStyle(InkPillStyle())
        }
    }
}
