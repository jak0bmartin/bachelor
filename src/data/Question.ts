import { GameMode } from './GameConfig';

// Eine Antwortoption zu einer Frage
export interface AnswerOption {
    id: number;
    text: string;
}


// Eine Frage mit möglichen Antworten
export interface Question {
    id: number;
    text: string;
    options: AnswerOption[];
    correctOptionId: number;
}

// Fragen für den Trophy-Modus (ursprüngliche Fragen)
export const QUESTIONS_TROPHY: Question[] = [
    {
        id: 1,
        text: 'Welches chemische Element ist Natrium?',
        options: [
            { id: 1, text: 'Gasförmiges Nichtmetall' },
            { id: 2, text: 'Edelgas' },
            { id: 3, text: 'Metall' },
        ],
        correctOptionId: 3,
    },
    {
        id: 2,
        text: 'Welche Aussage über Edelgase trifft zu?',
        options: [
            { id: 1, text: 'Sie sind sehr reaktiv.' },
            { id: 2, text: 'Sie sind weitgehend reaktionsträge.' },
            { id: 3, text: 'Sie sind nur in festen Verbindungen stabil.' },
        ],
        correctOptionId: 2,
    },
    {
        id: 3,
        text: 'Wofür steht das chemische Symbol "O"?',
        options: [
            { id: 1, text: 'Osmium' },
            { id: 2, text: 'Sauerstoff' },
            { id: 3, text: 'Oxalat' },
        ],
        correctOptionId: 2,
    },
    {
        id: 4,
        text: 'Welche Eigenschaft trifft auf Metalle typischerweise zu?',
        options: [
            { id: 1, text: 'Sie leiten Wärme gut.' },
            { id: 2, text: 'Sie sind leicht entzündlich.' },
            { id: 3, text: 'Sie reagieren nie mit Sauerstoff.' },
        ],
        correctOptionId: 1,
    },
    {
        id: 5,
        text: 'Welche Aussage beschreibt ein Ion korrekt?',
        options: [
            { id: 1, text: 'Ein Atom ohne Protonen.' },
            { id: 2, text: 'Ein Atom oder Molekül mit elektrischer Ladung.' },
            { id: 3, text: 'Ein Molekül, das keine Elektronen besitzt.' },
        ],
        correctOptionId: 2,
    },
    {
        id: 6,
        text: 'Was beschreibt die Ordnungszahl eines Elements?',
        options: [
            { id: 1, text: 'Die Elektronenzahl im Atomkern.' },
            { id: 2, text: 'Die Neutronenzahl im Atomkern.' },
            { id: 3, text: 'Die Protonenzahl im Atomkern.' },
        ],
        correctOptionId: 3,
    },
    {
        id: 7,
        text: 'Was versteht man unter einer chemischen Verbindung?',
        options: [
            { id: 1, text: 'Eine Mischung aus zwei beliebigen Stoffen.' },
            { id: 2, text: 'Einen Stoff aus Atomen verschiedener Elemente.' },
            { id: 3, text: 'Ein einzelnes Atom in reiner Form.' },
        ],
        correctOptionId: 2,
    },
    {
        id: 8,
        text: 'Welche Aggregatzustände treten in der Natur häufig auf?',
        options: [
            { id: 1, text: 'Fest, flüssig, gasförmig' },
            { id: 2, text: 'Plasma, flüssig, amorph' },
            { id: 3, text: 'Kristallin, ionisiert, wässrig' },
        ],
        correctOptionId: 1,
    },
    {
        id: 9,
        text: 'Was passiert bei einer exothermen Reaktion?',
        options: [
            { id: 1, text: 'Es wird Energie freigesetzt.' },
            { id: 2, text: 'Energie wird vollständig gespeichert.' },
            { id: 3, text: 'Elektronen werden zerstört.' },
        ],
        correctOptionId: 1,
    },
    {
        id: 10,
        text: 'Welche Aussage über Elektronen trifft zu?',
        options: [
            { id: 1, text: 'Sie besitzen eine positive Ladung.' },
            { id: 2, text: 'Sie besitzen eine negative Ladung.' },
            { id: 3, text: 'Sie besitzen keine Masse.' },
        ],
        correctOptionId: 2,
    },
];

// Fragen für den Terminator-Modus (10 neue Fragen)
export const QUESTIONS_TERMINATOR: Question[] = [
    {
        id: 11,
        text: 'Welches Element hat die höchste Elektronegativität?',
        options: [
            { id: 1, text: 'Fluor' },
            { id: 2, text: 'Chlor' },
            { id: 3, text: 'Sauerstoff' },
        ],
        correctOptionId: 1,
    },
    {
        id: 12,
        text: 'Was ist die chemische Formel für Wasser?',
        options: [
            { id: 1, text: 'H2O' },
            { id: 2, text: 'CO2' },
            { id: 3, text: 'NaCl' },
        ],
        correctOptionId: 1,
    },
    {
        id: 13,
        text: 'Welche Verbindung entsteht bei der Reaktion von Säure und Base?',
        options: [
            { id: 1, text: 'Salz und Wasser' },
            { id: 2, text: 'Kohlenstoffdioxid' },
            { id: 3, text: 'Wasserstoffgas' },
        ],
        correctOptionId: 1,
    },
    {
        id: 14,
        text: 'Was beschreibt der pH-Wert?',
        options: [
            { id: 1, text: 'Die Temperatur einer Lösung' },
            { id: 2, text: 'Den Säure- oder Basengehalt einer Lösung' },
            { id: 3, text: 'Die Dichte einer Lösung' },
        ],
        correctOptionId: 2,
    },
    {
        id: 15,
        text: 'Welches Gas macht den größten Teil der Erdatmosphäre aus?',
        options: [
            { id: 1, text: 'Sauerstoff' },
            { id: 2, text: 'Stickstoff' },
            { id: 3, text: 'Kohlenstoffdioxid' },
        ],
        correctOptionId: 2,
    },
    {
        id: 16,
        text: 'Was ist ein Katalysator?',
        options: [
            { id: 1, text: 'Ein Stoff, der Reaktionen verlangsamt' },
            { id: 2, text: 'Ein Stoff, der Reaktionen beschleunigt, ohne selbst verbraucht zu werden' },
            { id: 3, text: 'Ein Endprodukt einer chemischen Reaktion' },
        ],
        correctOptionId: 2,
    },
    {
        id: 17,
        text: 'Welche Aussage über Isotope trifft zu?',
        options: [
            { id: 1, text: 'Sie haben unterschiedliche Protonenzahlen' },
            { id: 2, text: 'Sie haben unterschiedliche Neutronenzahlen' },
            { id: 3, text: 'Sie haben unterschiedliche Elektronenzahlen' },
        ],
        correctOptionId: 2,
    },
    {
        id: 18,
        text: 'Was passiert bei einer Redox-Reaktion?',
        options: [
            { id: 1, text: 'Nur Oxidation findet statt' },
            { id: 2, text: 'Oxidation und Reduktion finden gleichzeitig statt' },
            { id: 3, text: 'Nur Reduktion findet statt' },
        ],
        correctOptionId: 2,
    },
    {
        id: 19,
        text: 'Welches Element ist das häufigste im Universum?',
        options: [
            { id: 1, text: 'Sauerstoff' },
            { id: 2, text: 'Wasserstoff' },
            { id: 3, text: 'Helium' },
        ],
        correctOptionId: 2,
    },
    {
        id: 20,
        text: 'Was ist die Valenz eines Atoms?',
        options: [
            { id: 1, text: 'Die Anzahl der Neutronen' },
            { id: 2, text: 'Die Anzahl der Elektronen in der äußersten Schale' },
            { id: 3, text: 'Die Masse des Atoms' },
        ],
        correctOptionId: 2,
    },
];

// Fragen für den Marie-Modus (10 neue Fragen)
export const QUESTIONS_MARIE: Question[] = [
    {
        id: 21,
        text: 'Welches Element wurde von Marie Curie entdeckt?',
        options: [
            { id: 1, text: 'Radium und Polonium' },
            { id: 2, text: 'Uran und Thorium' },
            { id: 3, text: 'Plutonium und Neptunium' },
        ],
        correctOptionId: 1,
    },
    {
        id: 22,
        text: 'Was ist Radioaktivität?',
        options: [
            { id: 1, text: 'Die Fähigkeit von Atomen, spontan Strahlung abzugeben' },
            { id: 2, text: 'Die Fähigkeit, Wärme zu leiten' },
            { id: 3, text: 'Die Fähigkeit, Elektrizität zu leiten' },
        ],
        correctOptionId: 1,
    },
    {
        id: 23,
        text: 'Welche Art von Strahlung hat die höchste Durchdringungskraft?',
        options: [
            { id: 1, text: 'Alpha-Strahlung' },
            { id: 2, text: 'Beta-Strahlung' },
            { id: 3, text: 'Gamma-Strahlung' },
        ],
        correctOptionId: 3,
    },
    {
        id: 24,
        text: 'Was ist eine Halbwertszeit?',
        options: [
            { id: 1, text: 'Die Zeit, bis ein Atom vollständig zerfällt' },
            { id: 2, text: 'Die Zeit, bis die Hälfte einer radioaktiven Substanz zerfallen ist' },
            { id: 3, text: 'Die Zeit für eine vollständige chemische Reaktion' },
        ],
        correctOptionId: 2,
    },
    {
        id: 25,
        text: 'Welches Element hat die Ordnungszahl 92?',
        options: [
            { id: 1, text: 'Thorium' },
            { id: 2, text: 'Uran' },
            { id: 3, text: 'Plutonium' },
        ],
        correctOptionId: 2,
    },
    {
        id: 26,
        text: 'Was sind Transurane?',
        options: [
            { id: 1, text: 'Elemente mit Ordnungszahl kleiner als Uran' },
            { id: 2, text: 'Elemente mit Ordnungszahl größer als Uran' },
            { id: 3, text: 'Stabile Elemente' },
        ],
        correctOptionId: 2,
    },
    {
        id: 27,
        text: 'Welche Aussage über radioaktive Zerfälle trifft zu?',
        options: [
            { id: 1, text: 'Sie sind vollständig vorhersagbar' },
            { id: 2, text: 'Sie folgen statistischen Gesetzen' },
            { id: 3, text: 'Sie können gestoppt werden' },
        ],
        correctOptionId: 2,
    },
    {
        id: 28,
        text: 'Was ist ein Nuklid?',
        options: [
            { id: 1, text: 'Ein Atomkern mit bestimmter Protonen- und Neutronenzahl' },
            { id: 2, text: 'Ein Molekül aus zwei Atomen' },
            { id: 3, text: 'Ein Elektron in der äußersten Schale' },
        ],
        correctOptionId: 1,
    },
    {
        id: 29,
        text: 'Welche Strahlung besteht aus Helium-Kernen?',
        options: [
            { id: 1, text: 'Alpha-Strahlung' },
            { id: 2, text: 'Beta-Strahlung' },
            { id: 3, text: 'Gamma-Strahlung' },
        ],
        correctOptionId: 1,
    },
    {
        id: 30,
        text: 'Was passiert bei der Kernspaltung?',
        options: [
            { id: 1, text: 'Ein Atomkern verschmilzt mit einem anderen' },
            { id: 2, text: 'Ein schwerer Atomkern wird in leichtere Kerne gespalten' },
            { id: 3, text: 'Elektronen werden aus der Hülle entfernt' },
        ],
        correctOptionId: 2,
    },
];

// Funktion, die die richtigen Fragen basierend auf dem Modus zurückgibt
export function getQuestionsForMode(mode: GameMode): Question[] {
    switch (mode) {
        case GameMode.TROPHY:
            return QUESTIONS_TROPHY;
        case GameMode.TERMINATOR:
            return QUESTIONS_TERMINATOR;
        case GameMode.MARIE:
            return QUESTIONS_MARIE;
        default:
            return QUESTIONS_TROPHY;
    }
}

// Für Rückwärtskompatibilität
export const QUESTIONS = QUESTIONS_TROPHY;