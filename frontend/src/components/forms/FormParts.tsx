import React from 'react';

interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export function FormInput({ label, value, onChange, placeholder, required, disabled }: FormInputProps) {
  return (
    <div className="s-field">
      <label className="s-label">
        {label}
        {required && <span style={{ color: 'var(--rubric)' }}>*</span>}
      </label>
      <input
        className="s-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}

interface FormTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
}

export function FormTextarea({ label, value, onChange, placeholder, required, disabled, rows = 4 }: FormTextareaProps) {
  return (
    <div className="s-field">
      <label className="s-label">
        {label}
        {required && <span style={{ color: 'var(--rubric)' }}>*</span>}
      </label>
      <textarea
        className="s-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        style={{ fontFamily: 'var(--font-serif)', resize: 'vertical' }}
      />
    </div>
  );
}

interface FormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
}

export function FormSelect({ label, value, onChange, options, required, disabled }: FormSelectProps) {
  return (
    <div className="s-field">
      <label className="s-label">
        {label}
        {required && <span style={{ color: 'var(--rubric)' }}>*</span>}
      </label>
      <select
        className="s-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        <option value="">— Sélectionner —</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface TagSelectorProps {
  tags: { name: string; locked?: boolean }[];
  onAccept: (tagName: string) => void;
  onReject: (tagName: string) => void;
  onSuggest?: () => void;
  suggestLoading?: boolean;
}

export function TagSelector({ tags, onAccept, onReject, onSuggest, suggestLoading }: TagSelectorProps) {
  return (
    <div style={{ marginTop: 32, paddingTop: 28, borderTop: '1px solid var(--rule)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500 }}>
          Tags proposés
        </div>
        {onSuggest && (
          <button
            type="button"
            onClick={onSuggest}
            disabled={suggestLoading}
            style={{
              padding: '6px 12px',
              background: 'transparent',
              border: '1px solid var(--rule)',
              borderRadius: 4,
              cursor: suggestLoading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-serif)',
              fontSize: 14,
              opacity: suggestLoading ? 0.6 : 1,
            }}
          >
            {suggestLoading ? 'En cours...' : 'Suggérer des tags'} 🔄
          </button>
        )}
      </div>

      {tags.length === 0 ? (
        <div style={{ color: 'var(--ink-3)', fontStyle: 'italic' }}>Aucun tag pour le moment</div>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {tags.map((tag) => (
            <div
              key={tag.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--rule)',
                borderRadius: 4,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="checkbox"
                  checked={true}
                  readOnly
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ fontFamily: 'var(--font-serif)' }}>{tag.name}</span>
                {tag.locked && (
                  <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>🔒 Auto</span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  type="button"
                  onClick={() => onAccept(tag.name)}
                  disabled={tag.locked}
                  title="Accepter"
                  style={{
                    padding: '4px 8px',
                    background: 'transparent',
                    border: '1px solid var(--rule)',
                    borderRadius: 3,
                    cursor: tag.locked ? 'not-allowed' : 'pointer',
                    opacity: tag.locked ? 0.5 : 1,
                  }}
                >
                  ✓
                </button>
                <button
                  type="button"
                  onClick={() => onReject(tag.name)}
                  disabled={tag.locked}
                  title="Rejeter"
                  style={{
                    padding: '4px 8px',
                    background: 'transparent',
                    border: '1px solid var(--rule)',
                    borderRadius: 3,
                    cursor: tag.locked ? 'not-allowed' : 'pointer',
                    opacity: tag.locked ? 0.5 : 1,
                  }}
                >
                  ✗
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface FormActionsProps {
  onCancel: () => void;
  onSave: () => void;
  saveLoading?: boolean;
}

export function FormActions({ onCancel, onSave, saveLoading }: FormActionsProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        justifyContent: 'flex-end',
        marginTop: 40,
        paddingTop: 28,
        borderTop: '1px solid var(--rule)',
      }}
    >
      <button
        type="button"
        onClick={onCancel}
        className="s-btn s-btn-ghost"
        disabled={saveLoading}
        style={{ opacity: saveLoading ? 0.6 : 1 }}
      >
        Annuler
      </button>
      <button
        type="submit"
        onClick={onSave}
        className="s-btn s-btn-primary"
        disabled={saveLoading}
        style={{ opacity: saveLoading ? 0.6 : 1 }}
      >
        {saveLoading ? 'Sauvegarde...' : 'Sauvegarder'}
      </button>
    </div>
  );
}
