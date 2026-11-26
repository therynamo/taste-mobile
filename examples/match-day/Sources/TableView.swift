import SwiftUI

/// The league table. Neutral and aligned: no team colour in the table itself.
struct TableView: View {
    @Environment(\.dynamicTypeSize) private var typeSize

    private let rows = Sample.table
    private var mine: TableRow { rows.first { $0.club == Clubs.mine }! }
    private var leader: TableRow { rows[0] }

    private var standing: String {
        let gap = leader.points - mine.points
        if gap == 0 { return "\(mine.points) points. Top of the table." }
        return "\(mine.points) points, \(gap) behind \(leader.club.name)."
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: Space.xl) {
                    PageNote(text: "\(Sample.league) \u{00B7} \(Sample.division)", short: Sample.division)

                    header

                    if typeSize.isAccessibilitySize { stackedTable } else { gridTable }

                    Text("Standings before today\u{2019}s matches. Three points for a win, one for a draw. The champions go up and the bottom club goes down.")
                        .font(.footnote)
                        .foregroundStyle(Palette.inkSecondary)
                        .fixedSize(horizontal: false, vertical: true)
                }
                .padding(.horizontal, Space.l)
                .padding(.bottom, Space.xl)
            }
            .background(Palette.ground)
            .navigationTitle("Table")
        }
    }

    /// The one flooded surface on this screen: the supported club's place, in its own colour.
    private var header: some View {
        VStack(alignment: .leading, spacing: Space.xs) {
            Text(Clubs.mine.name)
                .font(.headline)
                .foregroundStyle(Palette.onFlood)
            Text("\(Sample.ordinal(mine.position)) of \(rows.count)")
                .font(.largeTitle.weight(.bold))
                .foregroundStyle(Palette.onFlood)
            Text(standing)
                .font(.subheadline.weight(.medium))
                .foregroundStyle(Palette.onFloodSecondary)
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(Radius.boardPadding)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(alignment: .trailing) {
            ZStack(alignment: .trailing) {
                Palette.club
                CodeWatermark(code: Clubs.mine.code, size: 120, color: Palette.onFloodWatermark)
                    .offset(x: Space.xl, y: Space.m)
            }
        }
        .clipShape(RoundedRectangle(cornerRadius: Radius.board, style: .continuous))
        .accessibilityElement(children: .combine)
    }

    private func isMine(_ row: TableRow) -> Bool { row.club == Clubs.mine }

    // One table, one set of columns. Figures are right-aligned in code.
    private var gridTable: some View {
        Grid(alignment: .trailing, horizontalSpacing: Space.s, verticalSpacing: 0) {
            GridRow {
                Text("#").gridColumnAlignment(.leading)
                Text("Club").gridColumnAlignment(.leading)
                Text("P")
                Text("W")
                Text("D")
                Text("L")
                Text("GD")
                Text("Pts")
            }
            .font(TypeStyle.label)
            .foregroundStyle(Palette.inkSecondary)
            .padding(.bottom, Space.s)
            .accessibilityHidden(true)

            ForEach(rows) { row in
                Rectangle().fill(Palette.hairline).frame(height: 1)
                    .gridCellColumns(8)
                GridRow {
                    Text("\(row.position)")
                    Text(row.club.name)
                        .lineLimit(1)
                        .minimumScaleFactor(0.85)
                        .frame(maxWidth: .infinity, alignment: .leading)
                    Text("\(row.played)")
                    Text("\(row.won)")
                    Text("\(row.drawn)")
                    Text("\(row.lost)")
                    Text(row.goalDifferenceText)
                    Text("\(row.points)").fontWeight(.bold)
                }
                .font(.callout.monospacedDigit())
                .fontWeight(isMine(row) ? .bold : .regular)
                .foregroundStyle(Palette.ink)
                .padding(.vertical, Space.m)
                .accessibilityElement(children: .ignore)
                .accessibilityLabel(spoken(row))

                if let note = zoneNote(after: row) {
                    Text(note)
                        .font(TypeStyle.label)
                        .foregroundStyle(Palette.inkSecondary)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(.bottom, Space.s)
                        .gridCellColumns(8)
                }
            }
        }
    }

    // Largest text sizes: the same data, two lines per club, nothing dropped.
    private var stackedTable: some View {
        VStack(alignment: .leading, spacing: 0) {
            ForEach(rows) { row in
                Rectangle().fill(Palette.hairline).frame(height: 1)
                VStack(alignment: .leading, spacing: Space.xs) {
                    Text("\(row.position). \(row.club.name)")
                        .font(.body.weight(isMine(row) ? .bold : .semibold))
                    Text("\(row.points) pts \u{00B7} P \(row.played) \u{00B7} W \(row.won) \u{00B7} D \(row.drawn) \u{00B7} L \(row.lost) \u{00B7} GD \(row.goalDifferenceText)")
                        .font(.subheadline.monospacedDigit())
                        .foregroundStyle(isMine(row) ? Palette.ink : Palette.inkSecondary)
                    if let note = zoneNote(after: row) {
                        Text(note).font(TypeStyle.label).foregroundStyle(Palette.inkSecondary)
                    }
                }
                .foregroundStyle(Palette.ink)
                .fixedSize(horizontal: false, vertical: true)
                .padding(.vertical, Space.m)
                .accessibilityElement(children: .ignore)
                .accessibilityLabel(spoken(row))
            }
        }
    }

    private func zoneNote(after row: TableRow) -> String? {
        if row.position == 1 { return "\u{2191} Promotion place" }
        if row.position == rows.count { return "\u{2193} Relegation place" }
        return nil
    }

    private func spoken(_ row: TableRow) -> String {
        "\(Sample.ordinal(row.position)), \(row.club.name). Played \(row.played), won \(row.won), drawn \(row.drawn), lost \(row.lost), goal difference \(row.goalDifferenceText), \(row.points) points."
    }
}
