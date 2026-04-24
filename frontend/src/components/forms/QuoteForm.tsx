import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../services/api';
import { FormInput, FormTextarea, FormSelect, FormActions } from './FormParts';
import { TagPicker } from './TagPicker';

interface QuoteFormProps {
  onCancel: () => void;
  onSave: (data: any) => void;
}

const LANGUAGES = [
  { value: 'francais', label: 'Français' },
  { value: 'latin', label: 'Latin' },
  { value: 'grec', label: 'Grec' },
  { value: 'anglais', label: 'Anglais' },
];

// TODO: Load from backend - for now use hardcoded list
const THEOLOGIANS = [
  { value: 'augustine', label: 'Augustin d\'Hippone' },
  { value: 'aquinas', label: 'Thomas d\'Aquin' },
  { value: 'luther', label: 'Martin Luther' },
  { value: 'calvin', label: 'Jean Calvin' },
];

export function QuoteForm({ onCancel, onSave }: QuoteFormProps) {
  const { token } = useAuth();
  const [author, setAuthor] = useState('');
  const [quoteText, setQuoteText] = useState('');
  const [language, setLanguage] = useState('francais');
  const [translation, setTranslation] = useState('');
  const [sourceBook, setSourceBook] = useState('');
  const [sourcePage, setSourcePage] = useState('');
  const [context, setContext] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [saveLoading, setSaveLoading] = useState(false);

  const handleAuthorChange = (newAuthor: string) => {
    setAuthor(newAuthor);
    // Auto-add author tag if selected
    if (newAuthor) {
      const authorName = THEOLOGIANS.find(t => t.value === newAuthor)?.label || newAuthor;
      if (!tags.includes(authorName)) {
        setTags([authorName, ...tags]);
      }
    }
  };

  const handleSave = async () => {
    if (!author || !quoteText) {
      alert('Auteur et citation sont obligatoires');
      return;
    }
    if (!token) return;

    setSaveLoading(true);
    try {
      const response = await api.createDiscovery(token, {
        type: 'quote',
        quote_text: quoteText,
        author_id: author,
        source_book: sourceBook,
        source_page: sourcePage || null,
        quote_language: language,
        your_translation: translation,
        context,
        tags,
      });
      onSave(response);
    } catch (err) {
      alert('Erreur: ' + (err instanceof Error ? err.message : 'Save failed'));
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="s-form-shell">
      <button
        className="s-btn s-btn-ghost"
        style={{ marginBottom: 32, padding: '6px 10px' }}
        onClick={onCancel}
      >
        ← Retour
      </button>

      <div className="s-form-sub">Capitulum II — Citatio</div>
      <h1 className="s-form-title">Nouvelle citation</h1>
      <p style={{ color: 'var(--ink-3)', fontSize: 17, marginTop: 8, marginBottom: 40, maxWidth: 540 }}>
        Une citation d'un théologien. Le tag de l'auteur s'ajoutera automatiquement.
      </p>

      <div style={{ maxWidth: 600 }}>
        <FormSelect
          label="Auteur (théologien)"
          value={author}
          onChange={handleAuthorChange}
          options={THEOLOGIANS}
          required
        />

        <FormTextarea
          label="La citation (exacte)"
          value={quoteText}
          onChange={setQuoteText}
          placeholder="Copie la citation..."
          required
          rows={4}
        />

        <div style={{ marginTop: 20, marginBottom: 20 }}>
          <div className="s-label" style={{ marginBottom: 12 }}>Langue originale</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {LANGUAGES.map((lang) => (
              <label key={lang.value} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="language"
                  value={lang.value}
                  checked={language === lang.value}
                  onChange={(e) => setLanguage(e.target.value)}
                />
                <span style={{ fontFamily: 'var(--font-serif)' }}>{lang.label}</span>
              </label>
            ))}
          </div>
        </div>

        {language !== 'francais' && (
          <FormTextarea
            label="Ta traduction"
            value={translation}
            onChange={setTranslation}
            placeholder="Si ce n'est pas en français, propose ta traduction..."
            rows={3}
          />
        )}

        <FormInput
          label="Provenance (livre/sermon)"
          value={sourceBook}
          onChange={setSourceBook}
          placeholder="Ex: Monadologie"
        />

        <FormInput
          label="Page / Référence (optionnel)"
          value={sourcePage}
          onChange={setSourcePage}
          placeholder="Ex: p. 42 ou §15"
        />

        <FormTextarea
          label="Pourquoi c'est important pour toi ?"
          value={context}
          onChange={setContext}
          placeholder="Ton contexte, ton interprétation..."
          rows={4}
        />

        <TagPicker
          selectedTags={tags}
          onTagsChange={setTags}
          lockedTags={author ? [THEOLOGIANS.find(t => t.value === author)?.label || ''] : []}
        />

        <FormActions
          onCancel={onCancel}
          onSave={handleSave}
          saveLoading={saveLoading}
        />
      </div>

      <div className="s-end-ornament">❦</div>
    </div>
  );
}
