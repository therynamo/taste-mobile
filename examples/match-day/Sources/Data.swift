import Foundation

// Fixed sample data. Every club, player, ground and competition here is invented.
// The fixed clock is Saturday 28 November 2026, 67 minutes into the home match.

struct Club: Identifiable, Hashable {
    let code: String
    let name: String
    var id: String { code }
}

enum Clubs {
    static let ash = Club(code: "ASH", name: "Ashcombe Rovers")
    static let old = Club(code: "OLD", name: "Oldmill United")
    static let fen = Club(code: "FEN", name: "Fenwick Park")
    static let sal = Club(code: "SAL", name: "Saltbridge Town")
    static let kes = Club(code: "KES", name: "Kestrel Hill")
    static let tol = Club(code: "TOL", name: "Tollgate Athletic")
    static let rid = Club(code: "RID", name: "Ridgeway Albion")
    static let nor = Club(code: "NOR", name: "Northgate Wanderers")
    static let qry = Club(code: "QRY", name: "Quarry Lane")
    static let bri = Club(code: "BRI", name: "Briar Common")
    static let mine = ash
}

enum MatchPhase: Equatable {
    case upcoming
    case live(minute: Int)
    case final
}

enum EventKind {
    case goal, yellow, substitution
    var label: String {
        switch self {
        case .goal: return "Goal"
        case .yellow: return "Yellow card"
        case .substitution: return "Substitution"
        }
    }
}

struct MatchEvent: Identifiable {
    let id = UUID()
    let minute: Int
    let kind: EventKind
    let home: Bool
    let text: String
    var scoreAfter: String? = nil
}

struct Match: Identifiable {
    let id: String
    let competition: String
    let dateLabel: String
    let kickoff: String
    let home: Club
    let away: Club
    var homeGoals: Int?
    var awayGoals: Int?
    var phase: MatchPhase
    let ground: String
    var play: String? = nil
    var events: [MatchEvent] = []

    var isHome: Bool { home == Clubs.mine }
    var opponent: Club { isHome ? away : home }

    /// W, D or L from the supported club's side. Nil until the game is final.
    var outcome: String? {
        guard phase == .final, let h = homeGoals, let a = awayGoals else { return nil }
        if h == a { return "D" }
        return (h > a) == isHome ? "W" : "L"
    }

    var outcomeWord: String? {
        switch outcome {
        case "W": return "Won"
        case "D": return "Drew"
        case "L": return "Lost"
        default: return nil
        }
    }
}

struct TableRow: Identifiable {
    let position: Int
    let club: Club
    let won: Int
    let drawn: Int
    let lost: Int
    let goalsFor: Int
    let goalsAgainst: Int
    var id: String { club.code }
    var played: Int { won + drawn + lost }
    var points: Int { won * 3 + drawn }
    var goalDifference: Int { goalsFor - goalsAgainst }
    var goalDifferenceText: String {
        // A true minus, not a hyphen.
        goalDifference > 0 ? "+\(goalDifference)" : goalDifference < 0 ? "\u{2212}\(-goalDifference)" : "0"
    }
}

enum Sample {
    static let league = "Brackwater District League"
    static let division = "Division One"
    static let cup = "District Cup"
    static let homeGround = "Cinder Lane"
    static let todayLabel = "Saturday 28 November"

    static let todayEvents: [MatchEvent] = [
        MatchEvent(minute: 12, kind: .goal, home: true, text: "T. Marsh", scoreAfter: "1\u{2013}0"),
        MatchEvent(minute: 31, kind: .yellow, home: false, text: "K. Brandt"),
        MatchEvent(minute: 38, kind: .goal, home: false, text: "S. Varley", scoreAfter: "1\u{2013}1"),
        MatchEvent(minute: 58, kind: .goal, home: true, text: "J. Holloway, penalty", scoreAfter: "2\u{2013}1"),
        MatchEvent(minute: 64, kind: .substitution, home: true, text: "R. Pym on for T. Marsh"),
    ]

    static let today = Match(
        id: "r11", competition: "\(division), matchday 11", dateLabel: "Sat 28 Nov", kickoff: "14:00",
        home: Clubs.ash, away: Clubs.old, homeGoals: 2, awayGoals: 1, phase: .live(minute: 67),
        ground: homeGround, play: "Corner to Ashcombe on the right. Pym to take it.", events: todayEvents
    )

    static let fenwickEvents: [MatchEvent] = [
        MatchEvent(minute: 9, kind: .goal, home: true, text: "L. Garrow", scoreAfter: "1\u{2013}0"),
        MatchEvent(minute: 27, kind: .yellow, home: true, text: "P. Ensor"),
        MatchEvent(minute: 44, kind: .goal, home: false, text: "J. Holloway", scoreAfter: "1\u{2013}1"),
        MatchEvent(minute: 61, kind: .substitution, home: false, text: "D. Acton on for M. Reeve"),
        MatchEvent(minute: 70, kind: .yellow, home: false, text: "N. Castell"),
        MatchEvent(minute: 83, kind: .goal, home: false, text: "D. Acton", scoreAfter: "1\u{2013}2"),
    ]

    private static func result(_ id: String, _ comp: String, _ date: String, home: Club, away: Club,
                               _ h: Int, _ a: Int, ground: String, events: [MatchEvent] = []) -> Match {
        Match(id: id, competition: comp, dateLabel: date, kickoff: "14:00", home: home, away: away,
              homeGoals: h, awayGoals: a, phase: .final, ground: ground, events: events)
    }

    private static func fixture(_ id: String, _ comp: String, _ date: String, _ time: String,
                                home: Club, away: Club, ground: String) -> Match {
        Match(id: id, competition: comp, dateLabel: date, kickoff: time, home: home, away: away,
              homeGoals: nil, awayGoals: nil, phase: .upcoming, ground: ground)
    }

    /// Most recent first. League results add up to the Ashcombe row in the table: W6 D3 L1, 20 for, 11 against.
    static let results: [Match] = [
        result("r10", "Matchday 10", "Sat 21 Nov", home: Clubs.bri, away: Clubs.ash, 1, 3, ground: "Briar Common Rec"),
        result("r9", "Matchday 9", "Sat 14 Nov", home: Clubs.tol, away: Clubs.ash, 0, 1, ground: "Tollgate Field"),
        result("c2", "\(cup), round 2", "Sat 7 Nov", home: Clubs.ash, away: Clubs.qry, 3, 1, ground: homeGround),
        result("r8", "Matchday 8", "Sat 24 Oct", home: Clubs.fen, away: Clubs.ash, 1, 2, ground: "Park Road", events: fenwickEvents),
        result("r7", "Matchday 7", "Sat 17 Oct", home: Clubs.ash, away: Clubs.kes, 2, 2, ground: homeGround),
        result("r6", "Matchday 6", "Sat 10 Oct", home: Clubs.rid, away: Clubs.ash, 1, 1, ground: "Ridgeway Meadow"),
        result("r5", "Matchday 5", "Sat 3 Oct", home: Clubs.ash, away: Clubs.nor, 2, 1, ground: homeGround),
        result("r4", "Matchday 4", "Sat 26 Sep", home: Clubs.sal, away: Clubs.ash, 2, 0, ground: "Saltbridge Quay"),
        result("r3", "Matchday 3", "Sat 19 Sep", home: Clubs.ash, away: Clubs.qry, 4, 1, ground: homeGround),
        result("r2", "Matchday 2", "Sat 12 Sep", home: Clubs.old, away: Clubs.ash, 2, 2, ground: "Oldmill Road"),
        result("r1", "Matchday 1", "Sat 5 Sep", home: Clubs.ash, away: Clubs.bri, 3, 0, ground: homeGround),
    ]

    static let upcoming: [Match] = [
        fixture("r12", "Matchday 12", "Sat 5 Dec", "14:00", home: Clubs.fen, away: Clubs.ash, ground: "Park Road"),
        fixture("r13", "Matchday 13", "Sat 12 Dec", "14:00", home: Clubs.ash, away: Clubs.sal, ground: homeGround),
        fixture("cq", "\(cup), quarter-final", "Sat 19 Dec", "13:30", home: Clubs.kes, away: Clubs.ash, ground: "Kestrel Hill Rec"),
        fixture("r14", "Matchday 14", "Sat 9 Jan", "14:00", home: Clubs.nor, away: Clubs.ash, ground: "Northgate Rec"),
        fixture("r15", "Matchday 15", "Sat 16 Jan", "14:00", home: Clubs.ash, away: Clubs.rid, ground: homeGround),
    ]

    static let defaultPinned: String? = "cq"
    static let featuredResult: Match = results.first { $0.id == "r8" }!
    static let next: Match = upcoming[0]

    /// Standings before today's kick-offs. 50 matches: 39 decided, 11 drawn; 144 goals for and against.
    static let table: [TableRow] = [
        TableRow(position: 1, club: Clubs.sal, won: 7, drawn: 2, lost: 1, goalsFor: 22, goalsAgainst: 9),
        TableRow(position: 2, club: Clubs.fen, won: 7, drawn: 1, lost: 2, goalsFor: 19, goalsAgainst: 10),
        TableRow(position: 3, club: Clubs.ash, won: 6, drawn: 3, lost: 1, goalsFor: 20, goalsAgainst: 11),
        TableRow(position: 4, club: Clubs.tol, won: 5, drawn: 1, lost: 4, goalsFor: 15, goalsAgainst: 14),
        TableRow(position: 5, club: Clubs.kes, won: 4, drawn: 3, lost: 3, goalsFor: 17, goalsAgainst: 12),
        TableRow(position: 6, club: Clubs.old, won: 4, drawn: 2, lost: 4, goalsFor: 14, goalsAgainst: 15),
        TableRow(position: 7, club: Clubs.rid, won: 3, drawn: 3, lost: 4, goalsFor: 12, goalsAgainst: 14),
        TableRow(position: 8, club: Clubs.nor, won: 2, drawn: 3, lost: 5, goalsFor: 10, goalsAgainst: 17),
        TableRow(position: 9, club: Clubs.qry, won: 1, drawn: 2, lost: 7, goalsFor: 8, goalsAgainst: 20),
        TableRow(position: 10, club: Clubs.bri, won: 0, drawn: 2, lost: 8, goalsFor: 7, goalsAgainst: 22),
    ]

    static func ordinal(_ n: Int) -> String {
        switch n {
        case 1: return "1st"
        case 2: return "2nd"
        case 3: return "3rd"
        default: return "\(n)th"
        }
    }
}
