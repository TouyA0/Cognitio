import React, { useState } from 'react';
import { TYPE_OPTIONS, TYPE_META } from '../constants';
import { Icon } from '../icons';

interface TypeSelectScreenProps {
  onPick: (type: 'reflection' | 'discovery' | 'quote' | 'lecture') => void;
  onCancel: () => void;
}

export function TypeSelectScreen({ onPick, onCancel }: TypeSelectScreenProps) {
  const [hover, setHover] = useState<string | null>(null);

  return (
    <div className="s-form-shell">
      <button
        className="s-btn s-btn-ghost"
        style={{ marginBottom: 32, padding: '6px 10px' }}
        onClick={onCancel}
      >
        <Icon name="back" size={15} /> Retour
      </button>

      <div className="s-form-sub">Capitulum I — Initium</div>
      <h1 className="s-form-title">Quel type de découverte ?</h1>
      <p
        style={{
          color: 'var(--ink-3)',
          fontSize: 17,
          marginTop: 8,
          marginBottom: 40,
          maxWidth: 540,
        }}
      >
        Chaque découverte vit dans le graphe selon sa nature. Choisis le genre qui lui
        convient — tu pourras toujours l'éditer plus tard.
      </p>

      <div style={{ display: 'grid', gap: 14 }}>
        {TYPE_OPTIONS.map((opt) => {
          const meta = TYPE_META[opt.key as keyof typeof TYPE_META];
          const isHover = hover === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => onPick(opt.key as 'reflection' | 'discovery' | 'quote' | 'lecture')}
              onMouseEnter={() => setHover(opt.key)}
              onMouseLeave={() => setHover(null)}
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 1fr auto',
                alignItems: 'center',
                gap: 20,
                padding: '22px 26px',
                background: isHover ? 'var(--bg-card)' : 'var(--bg-elevated)',
                border: `1px solid ${isHover ? meta.color : 'var(--rule)'}`,
                borderRadius: 6,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                fontFamily: 'inherit',
                color: 'inherit',
                boxShadow: isHover ? 'var(--shadow-card)' : 'none',
                transform: isHover ? 'translateX(2px)' : 'none',
              }}
            >
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: '50%',
                  background: `color-mix(in oklch, ${meta.color} 14%, transparent)`,
                  color: meta.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontSize: 28,
                  border: `1px solid color-mix(in oklch, ${meta.color} 35%, transparent)`,
                }}
              >
                {meta.glyph}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 24,
                    fontWeight: 500,
                    marginBottom: 2,
                  }}
                >
                  {opt.title}
                </div>
                <div style={{ color: 'var(--ink-3)', fontSize: 15 }}>{opt.sub}</div>
              </div>
              <div
                style={{
                  color: meta.color,
                  fontSize: 22,
                  opacity: isHover ? 1 : 0.4,
                  transition: 'opacity 0.15s',
                }}
              >
                →
              </div>
            </button>
          );
        })}
      </div>

      <div className="s-end-ornament">❦ · ❦ · ❦</div>
    </div>
  );
}
