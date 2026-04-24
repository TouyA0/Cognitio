import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../services/api';
import { FormInput, FormTextarea, FormActions } from './FormParts';
import { TagPicker } from './TagPicker';

interface LectureFormProps {
  onCancel: () => void;
  onSave: (data: any) => void;
}

export function LectureForm({ onCancel, onSave }: LectureFormProps) {
  const { token } = useAuth();
  const [title, setTitle] = useState('');
  const [professor, setProfessor] = useState('');
  const [lectureDate, setLectureDate] = useState('');
  const [content, setContent] = useState('');
  const [keyConcepts, setKeyConcepts] = useState('');
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
        type: 'lecture',
        title,
        professor,
        date_lecture: lectureDate,
        content,
        key_concepts: keyConcepts.split(',').map(c => c.trim()).filter((c: string) => c),
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

      <div className="s-form-sub">Capitulum II — Lectio</div>
      <h1 className="s-form-title">Nouveau cours</h1>
      <p style={{ color: 'var(--ink-3)', fontSize: 17, marginTop: 8, marginBottom: 40, maxWidth: 540 }}>
        Notes d'un cours ou séminaire de théologie que tu as suivi.
      </p>

      <div style={{ maxWidth: 600 }}>
        <FormInput
          label="Titre du cours / Sujet"
          value={title}
          onChange={setTitle}
          placeholder="Ex: Introduction à la Christologie"
          required
        />

        <FormInput
          label="Professeur / Source"
          value={professor}
          onChange={setProfessor}
          placeholder="Ex: Abbé Dupont"
        />

        <div className="s-field">
          <label className="s-label">Date du cours</label>
          <input
            className="s-input"
            type="date"
            value={lectureDate}
            onChange={(e) => setLectureDate(e.target.value)}
            style={{ fontFamily: 'var(--font-serif)' }}
          />
        </div>

        <FormTextarea
          label="Notes du cours"
          value={content}
          onChange={setContent}
          placeholder="Écris tes notes..."
          required
          rows={6}
        />

        <FormInput
          label="Concepts clés abordés"
          value={keyConcepts}
          onChange={setKeyConcepts}
          placeholder="Ex: Justification, Grâce, Rédemption (séparés par des virgules)"
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
