import SwiftUI

// Fixed sample data and a fixed clock. No network, no persistence beyond the haptics setting.
// All money is integer cents.

enum Person: String, CaseIterable, Identifiable {
    case ana = "Ana"
    case tomas = "Tomas"

    var id: String { rawValue }
    var initial: String { String(rawValue.prefix(1)) }
}

enum Category: String, CaseIterable, Identifiable {
    case groceries = "Groceries"
    case eatingOut = "Eating out"
    case transport = "Transport"
    case home = "Home"
    case fun = "Fun"
    case other = "Other"

    var id: String { rawValue }

    var budgetCents: Int {
        switch self {
        case .groceries: return 80_000
        case .eatingOut: return 30_000
        case .transport: return 25_000
        case .home: return 110_000
        case .fun: return 40_000
        case .other: return 35_000
        }
    }
}

struct Spend: Identifiable, Equatable {
    let id: Int
    let day: Int
    let title: String
    let category: Category
    let cents: Int
    let payer: Person
}

struct MonthData {
    let name = "November"
    let year = 2026
    let daysInMonth = 30
    /// The fixed clock: the day of the month the app believes it is.
    var today: Int
    var spends: [Spend]

    var budgetCents: Int { Category.allCases.reduce(0) { $0 + $1.budgetCents } }
    var spentCents: Int { spends.reduce(0) { $0 + $1.cents } }
    var leftCents: Int { budgetCents - spentCents }
    var daysToGo: Int { daysInMonth - today }

    /// Share of the budget still left, 0...1. This is the level in the jug.
    var leftFraction: Double {
        min(max(Double(leftCents) / Double(budgetCents), 0), 1)
    }

    /// Where the level would be today if the budget were spent evenly.
    var evenFraction: Double {
        1 - Double(today) / Double(daysInMonth)
    }

    func spent(by person: Person) -> Int {
        spends.filter { $0.payer == person }.reduce(0) { $0 + $1.cents }
    }

    func spent(in category: Category) -> Int {
        spends.filter { $0.category == category }.reduce(0) { $0 + $1.cents }
    }

    /// Cents left at the end of each day, from day 0 (full) to today.
    var levelByDay: [Int] {
        var left = budgetCents
        var out = [left]
        guard today >= 1 else { return out }
        for day in 1...today {
            left -= spends.filter { $0.day == day }.reduce(0) { $0 + $1.cents }
            out.append(left)
        }
        return out
    }

    /// Newest first.
    var newestFirst: [Spend] {
        spends.sorted { ($0.day, $0.id) > ($1.day, $1.id) }
    }

    func dayLabel(_ day: Int) -> String {
        if day == today { return "Today" }
        if day == today - 1 { return "Yesterday" }
        return longDayLabel(day)
    }

    /// 1 November 2026 is a Sunday.
    func longDayLabel(_ day: Int) -> String {
        let names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        return "\(names[(day - 1) % 7]) \(day) Nov"
    }

    static let sample = MonthData(today: 14, spends: [
        Spend(id: 1, day: 1, title: "Electricity bill", category: .home, cents: 9_640, payer: .tomas),
        Spend(id: 2, day: 1, title: "Internet", category: .home, cents: 4_500, payer: .tomas),
        Spend(id: 3, day: 2, title: "Weekly shop", category: .groceries, cents: 11_235, payer: .ana),
        Spend(id: 4, day: 2, title: "Home insurance", category: .home, cents: 14_800, payer: .ana),
        Spend(id: 5, day: 3, title: "Bus passes", category: .transport, cents: 8_800, payer: .ana),
        Spend(id: 6, day: 4, title: "Noodle bar", category: .eatingOut, cents: 3_820, payer: .tomas),
        Spend(id: 7, day: 5, title: "Hardware store", category: .home, cents: 6_490, payer: .ana),
        Spend(id: 8, day: 6, title: "Cinema", category: .fun, cents: 3_100, payer: .tomas),
        Spend(id: 9, day: 6, title: "Boiler service", category: .home, cents: 31_000, payer: .tomas),
        Spend(id: 10, day: 7, title: "Weekly shop", category: .groceries, cents: 12_875, payer: .tomas),
        Spend(id: 11, day: 8, title: "Brunch", category: .eatingOut, cents: 5_460, payer: .ana),
        Spend(id: 12, day: 8, title: "Garden centre", category: .fun, cents: 4_400, payer: .tomas),
        Spend(id: 13, day: 9, title: "Water bill", category: .home, cents: 5_830, payer: .ana),
        Spend(id: 14, day: 9, title: "Train to the coast", category: .transport, cents: 7_250, payer: .ana),
        Spend(id: 15, day: 10, title: "Pharmacy", category: .other, cents: 2_345, payer: .tomas),
        Spend(id: 16, day: 11, title: "Fuel", category: .transport, cents: 6_120, payer: .tomas),
        Spend(id: 17, day: 12, title: "Birthday dinner", category: .eatingOut, cents: 14_280, payer: .ana),
        Spend(id: 18, day: 12, title: "Bookshop", category: .other, cents: 4_670, payer: .tomas),
        Spend(id: 19, day: 13, title: "Weekly shop", category: .groceries, cents: 13_415, payer: .ana),
        Spend(id: 20, day: 13, title: "Concert tickets", category: .fun, cents: 12_000, payer: .ana),
        Spend(id: 21, day: 14, title: "Pizza night", category: .eatingOut, cents: 8_300, payer: .tomas),
        Spend(id: 22, day: 14, title: "Bakery", category: .groceries, cents: 1_240, payer: .ana),
    ])

    /// First day of a month, nothing spent.
    static let empty = MonthData(today: 1, spends: [])

    /// The sample month plus one large repair that empties the jug.
    static let over: MonthData = {
        var month = sample
        month.spends.append(
            Spend(id: 23, day: 14, title: "Car repair", category: .transport, cents: 136_850, payer: .tomas)
        )
        return month
    }()
}

/// One currency format for the whole app: symbol full size, cents always shown at the same size,
/// a true minus for negatives, a plus for money back.
enum Money {
    static func string(_ cents: Int, plus: Bool = false) -> String {
        let magnitude = abs(cents)
        let digits = String(magnitude / 100)
        var grouped = ""
        for (offset, character) in digits.reversed().enumerated() {
            if offset > 0 && offset % 3 == 0 { grouped.append(",") }
            grouped.append(character)
        }
        let body = "$" + String(grouped.reversed()) + "." + String(format: "%02d", magnitude % 100)
        if cents < 0 { return "\u{2212}" + body }
        return plus ? "+" + body : body
    }

    /// Whole dollars, used only on the jug's tick labels.
    static func mark(_ cents: Int) -> String {
        String(string(cents).dropLast(3))
    }
}

/// Launch arguments: `-screen home|add|paid|month` and `-state empty|over|saved`.
enum Launch {
    private static func value(after flag: String) -> String? {
        let args = ProcessInfo.processInfo.arguments
        return args.firstIndex(of: flag).flatMap { args.indices.contains($0 + 1) ? args[$0 + 1] : nil }
    }

    static let screen = value(after: "-screen") ?? "home"
    static let state = value(after: "-state") ?? "default"
}

enum AppTab: Hashable {
    case home, paid, month
}

@MainActor
final class AppState: ObservableObject {
    @Published var month: MonthData
    @Published var tab: AppTab
    @Published var showAdd: Bool

    init() {
        switch Launch.state {
        case "empty": month = .empty
        case "over": month = .over
        default: month = .sample
        }
        switch Launch.screen {
        case "paid": tab = .paid
        case "month": tab = .month
        default: tab = .home
        }
        showAdd = Launch.screen == "add"
    }

    func add(cents: Int, title: String, category: Category, payer: Person) {
        let next = (month.spends.map(\.id).max() ?? 0) + 1
        month.spends.append(
            Spend(id: next, day: month.today, title: title, category: category, cents: cents, payer: payer)
        )
    }
}
