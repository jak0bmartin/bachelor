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

// Beispielhafte Fragenliste (Platzhalter-Inhalte)
// Du kannst hier deine echten Fragen eintragen; jede Frage wird in Phase 1 und Phase 2 verwendet.
export const QUESTIONS: Question[] = [
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