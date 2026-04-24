import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../services/api';
import { FormInput, FormTextarea, FormActions } from './FormParts';
import { TagPicker } from './TagPicker';

interface ReflectionFormProps {
  onCancel: () => void;
  onSave: (data: any) => void;
}

export function ReflectionForm({ onCancel, onSave }: ReflectionFormProps) {
  const { token } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
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
        type: 'reflection',
        title,
        content,
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

      <div className="s-form-sub">Capitulum II — Reflexio</div>
      <h1 className="s-form-title">Nouvelle réflexion personnelle</h1>
      <p style={{ color: 'var(--ink-3)', fontSize: 17, marginTop: 8, marginBottom: 40, maxWidth: 540 }}>
        Écris ta pensée, ton analyse, ton débat intérieur.
      </p>

      <div style={{ maxWidth: 600 }}>
        <FormInput
          label="Titre"
          value={title}
          onChange={setTitle}
          placeholder="Ex: Peut-on concilier libre arbitre et omniscience ?"
          required
        />

        <FormTextarea
          label="Ta pensée / analyse"
          value={content}
          onChange={setContent}
          placeholder="Écris ta réflexion personnelle..."
          required
          rows={6}
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
