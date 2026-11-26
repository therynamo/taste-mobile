import SwiftUI

// The governing asset: the level in a measuring jug.
// A lime fill whose height is the share of the budget still left, an ink level line,
// ink graduation ticks on the trailing edge, and a dashed "even" mark.

/// The one display treatment: the figure that says what is left.
/// System face, compressed width, black weight. Scales with Dynamic Type.
struct LeftFigure: View {
    let cents: Int
    var base: CGFloat = Size.heroFigure

    var body: some View {
        ScaledFigure(text: Money.string(cents), base: base)
    }
}

private struct ScaledFigure: View {
    let text: String
    @ScaledMetric private var size: CGFloat

    init(text: String, base: CGFloat) {
        self.text = text
        _size = ScaledMetric(wrappedValue: base, relativeTo: .largeTitle)
    }

    var body: some View {
        Text(text)
            .font(.system(size: size, weight: .black).width(.compressed))
            .monospacedDigit()
            .lineLimit(1)
            .minimumScaleFactor(0.35)
    }
}

/// The jug's contents and scale, drawn to fill whatever frame it is given.
struct JugLevel: View {
    /// Share left, 0...1.
    let fraction: Double
    /// Where an even spend would put the level today. Nil hides the mark.
    var even: Double? = nil
    var evenLabel: String = "Even pace today"
    /// Rect (in this view's space) the even label must stay out of.
    var keepClear: CGRect = .zero
    let budgetCents: Int
    /// Space above the top mark, so the brim is not flush with the frame.
    var brim: CGFloat = Space.page
    var labels = true
    /// At the largest text sizes: drop a scale label that would run into the even label.
    var sparse = false
    var tickInset: CGFloat = 0

    @ScaledMetric(relativeTo: .caption) private var labelHeight: CGFloat = 16

    var body: some View {
        GeometryReader { geo in
            let width = geo.size.width
            let height = geo.size.height
            let scale = height - brim
            let levelY = brim + scale * (1 - fraction)
            let evenMid = even.map { brim + scale * (1 - $0) - labelHeight / 2 - Space.xs }

            ZStack(alignment: .topLeading) {
                Rectangle()
                    .fill(Palette.level)
                    .frame(width: width, height: max(height - levelY, 0))
                    .offset(y: levelY)

                // The level line. When the jug is empty this is its base.
                Rectangle()
                    .fill(fraction > 0 ? Palette.onLevel : Palette.ink)
                    .frame(width: width, height: Size.line)
                    .offset(y: min(levelY, height - Size.line))

                if let even {
                    let evenY = brim + scale * (1 - even)
                    let under = evenY > levelY
                    DashedLine()
                        .stroke(
                            under ? Palette.onLevel.opacity(0.7) : Palette.ink.opacity(0.7),
                            style: StrokeStyle(lineWidth: Size.line, dash: [6, 6])
                        )
                        .frame(width: width, height: Size.line)
                        .offset(y: evenY)
                    let labelRect = CGRect(x: 0, y: evenY - labelHeight - Space.s, width: width * 0.6, height: labelHeight + Space.s)
                    if labels && !labelRect.intersects(keepClear) && labelRect.minY > 0 {
                        Text(evenLabel)
                            .font(TypeScale.tick)
                            .foregroundStyle(under ? Palette.onLevel.opacity(0.75) : Palette.inkSoft)
                            .fixedSize()
                            .frame(height: 0, alignment: .leading)
                            .offset(x: Space.page, y: evenY - labelHeight / 2 - Space.xs)
                    }
                }

                ForEach(0...8, id: \.self) { step in
                    let mark = Double(step) / 8
                    let y = brim + scale * (1 - mark)
                    let major = step % 2 == 0
                    let under = fraction > 0 && y > levelY - 1
                    let length = major ? Size.tickMajor : Size.tickMinor
                    Rectangle()
                        .fill(under ? Palette.onLevel.opacity(major ? 0.8 : 0.45) : Palette.ink.opacity(major ? 0.85 : 0.4))
                        .frame(width: length, height: Size.line)
                        .offset(x: width - length - tickInset, y: min(y, height - Size.line))
                    let crowded = sparse && evenMid.map { abs(y - $0) < labelHeight * 1.15 } ?? false
                    if labels && major && step > 0 && !crowded && y < levelY - labelHeight * 0.75 {
                        Text(Money.mark(Int(Double(budgetCents) * mark)))
                            .font(TypeScale.tick)
                            .foregroundStyle(Palette.inkSoft)
                            .fixedSize()
                            .frame(width: max(width - Size.tickMajor - Space.s - tickInset, 0), height: 0, alignment: .trailing)
                            .offset(y: y + Size.line / 2)
                    }
                }
            }
        }
        .accessibilityHidden(true)
    }
}

struct DashedLine: Shape {
    var vertical = false

    func path(in rect: CGRect) -> Path {
        var path = Path()
        if vertical {
            path.move(to: CGPoint(x: rect.midX, y: rect.minY))
            path.addLine(to: CGPoint(x: rect.midX, y: rect.maxY))
        } else {
            path.move(to: CGPoint(x: rect.minX, y: rect.midY))
            path.addLine(to: CGPoint(x: rect.maxX, y: rect.midY))
        }
        return path
    }
}

/// The jug drawn small, with walls: used where the level is shown away from Home.
struct SmallJug: View {
    let fraction: Double
    let budgetCents: Int

    var body: some View {
        JugLevel(fraction: fraction, budgetCents: budgetCents, brim: Space.l, labels: false, tickInset: Size.line)
            .clipShape(JugWalls())
            .overlay(JugWalls().stroke(Palette.ink, style: StrokeStyle(lineWidth: Size.line, lineJoin: .round)))
    }
}

/// An open-topped vessel: two walls and a rounded base.
struct JugWalls: Shape {
    func path(in rect: CGRect) -> Path {
        let r = min(Radius.vessel, rect.width / 3)
        var path = Path()
        path.move(to: CGPoint(x: rect.minX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.minX, y: rect.maxY - r))
        path.addQuadCurve(to: CGPoint(x: rect.minX + r, y: rect.maxY), control: CGPoint(x: rect.minX, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.maxX - r, y: rect.maxY))
        path.addQuadCurve(to: CGPoint(x: rect.maxX, y: rect.maxY - r), control: CGPoint(x: rect.maxX, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.minY))
        return path
    }
}

/// Who paid. The two people are told apart by shape, not colour:
/// Ana is a solid ink disc, Tomas an outlined one.
struct Monogram: View {
    let person: Person
    @ScaledMetric(relativeTo: .body) private var size: CGFloat = 34

    var body: some View {
        Text(person.initial)
            .font(.footnote.weight(.bold))
            .foregroundStyle(person == .ana ? Palette.ground : Palette.ink)
            .frame(width: size, height: size)
            .background {
                if person == .ana {
                    Circle().fill(Palette.ink)
                } else {
                    Circle().strokeBorder(Palette.ink, lineWidth: Size.line)
                }
            }
            .accessibilityLabel("\(person.rawValue) paid")
    }
}

/// One spend. Plain row: ink on the ground, no card, no colour.
struct SpendRow: View {
    let spend: Spend
    let meta: String
    @Environment(\.dynamicTypeSize) private var typeSize

    var body: some View {
        HStack(alignment: .center, spacing: Space.m) {
            Monogram(person: spend.payer)
            if typeSize.isAccessibilitySize {
                VStack(alignment: .leading, spacing: Space.xs) {
                    title
                    amount
                    metaLine
                }
                Spacer(minLength: 0)
            } else {
                VStack(alignment: .leading, spacing: 2) {
                    title
                    metaLine
                }
                Spacer(minLength: Space.m)
                amount
            }
        }
        .padding(.vertical, Space.m)
        .accessibilityElement(children: .combine)
    }

    private var title: some View {
        Text(spend.title).font(TypeScale.rowTitle).foregroundStyle(Palette.ink)
    }

    private var metaLine: some View {
        Text(meta).font(TypeScale.rowMeta).foregroundStyle(Palette.inkSoft)
    }

    private var amount: some View {
        Text(Money.string(spend.cents)).font(TypeScale.amount).foregroundStyle(Palette.ink)
            .lineLimit(1).minimumScaleFactor(0.6)
    }
}

struct RowDivider: View {
    var body: some View {
        Rectangle().fill(Palette.hairline).frame(height: 1)
    }
}
