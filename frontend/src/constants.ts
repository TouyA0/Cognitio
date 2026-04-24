export const TYPE_META: Record<string, { label: string; glyph: string; color: string }> = {
  reflection: {
    label: 'Réflexion',
    glyph: '✦',
    color: 'var(--type-reflection)',
  },
  discovery: {
    label: 'Découverte',
    glyph: '◆',
    color: 'var(--type-discovery)',
  },
  quote: {
    label: 'Citation',
    glyph: '❝',
    color: 'var(--type-quote)',
  },
  lecture: {
    label: 'Cours',
    glyph: '◈',
    color: 'var(--type-lecture)',
  },
};

export const TYPE_OPTIONS = [
  {
    key: 'reflection',
    title: 'Réflexion personnelle',
    sub: 'Tes pensées, ton analyse, un débat intérieur',
  },
  {
    key: 'discovery',
    title: 'Découverte',
    sub: 'Un concept ou une idée nouvelle pour toi',
  },
  {
    key: 'quote',
    title: 'Citation',
    sub: "Une parole d'un théologien, avec sa source",
  },
  {
    key: 'lecture',
    title: 'Cours de théologie',
    sub: "Notes d'un séminaire ou d'un cours magistral",
  },
];
