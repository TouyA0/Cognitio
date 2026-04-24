import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../services/api';
import { FormInput, FormTextarea, FormActions } from './FormParts';
import { TagPicker } from './TagPicker';

interface DiscoveryFormProps {
  onCancel: () => void;
  onSave: (data: any) => void;
}

export function DiscoveryForm({ onCancel, onSave }: DiscoveryFormProps) {
  const { token } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [source, setSource] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [saveLoading, setSaveLoading] = useState(false);

  const handleSave = async () => {
    if (!title || !content) {
      alert('Titre et contenu sont obligatoires');
      return;
    }
    if (!token) return;

    setSaveLoading(true);
    try {
      const response = await api.createDiscovery(token, {
        type: 'discovery',
        title,
        content,
        source,
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

      <div className="s-form-sub">Capitulum II — Inventio</div>
      <h1 className="s-form-title">Nouvelle découverte</h1>
      <p style={{ color: 'var(--ink-3)', fontSize: 17, marginTop: 8, marginBottom: 40, maxWidth: 540 }}>
        Un concept ou une idée nouvelle pour toi. D'où tu l'apprends, ce que tu en comprends.
      </p>

      <div style={{ maxWidth: 600 }}>
        <FormInput
          label="Titre"
          value={title}
          onChange={setTitle}
          placeholder="Ex: La théodicée chez Leibniz"
          required
        />

        <FormTextarea
          label="Ce que tu as découvert"
          value={content}
          onChange={setContent}
          placeholder="Décris la découverte..."
          required
          rows={6}
        />

        <FormInput
          label="D'où tu viens de l'apprendre ?"
          value={source}
          onChange={setSource}
          placeholder="Ex: cours, livre, article..."
        />

        <TagPicker
          selectedTags={tags}
          onTagsChange={setTags}
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
