import { useState, useEffect } from 'react';
import * as api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface TagPickerProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  lockedTags?: string[];
}

interface Tag {
  id: string;
  name: string;
  category?: string;
}

export function TagPicker({ selectedTags, onTagsChange, lockedTags = [] }: TagPickerProps) {
  const { token } = useAuth();
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;

    const loadTags = async () => {
      setLoading(true);
      try {
        const response = await api.getTags(token);
        setAllTags(response.tags);
        setFilteredTags(response.tags);
      } catch (err) {
        console.error('Failed to load tags:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTags();
  }, [token]);

  const normalizeString = (str: string) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length === 0) {
      setFilteredTags(allTags);
    } else {
      const normalizedQuery = normalizeString(query);
      const filtered = allTags.filter((tag) =>
        normalizeString(tag.name).includes(normalizedQuery)
      );
      setFilteredTags(filtered);
    }
  };

  const handleTagSelect = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      onTagsChange(selectedTags.filter((t) => t !== tagName));
    } else {
      onTagsChange([...selectedTags, tagName]);
    }
  };

  const handleTagRemove = (tagName: string) => {
    onTagsChange(selectedTags.filter((t) => t !== tagName));
  };

  const getTagCategory = (tagName: string) => {
    const tag = allTags.find((t) => t.name === tagName);
    return tag?.category || '';
  };

  return (
    <div style={{ marginTop: 20, marginBottom: 20 }}>
      <div className="s-label" style={{ marginBottom: 12 }}>
        Tags
      </div>

      {/* Selected tags display */}
      {selectedTags.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 12,
            padding: '10px',
            background: 'var(--bg-elevated)',
            borderRadius: 4,
            minHeight: '40px',
          }}
        >
          {selectedTags.map((tag) => (
            <div
              key={tag}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 10px',
                background: 'var(--bg-card)',
                border: '1px solid var(--rule)',
                borderRadius: 3,
                fontFamily: 'var(--font-serif)',
                fontSize: 14,
              }}
            >
              {tag}
              {!lockedTags.includes(tag) && (
                <button
                  type="button"
                  onClick={() => handleTagRemove(tag)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    fontSize: 16,
                    color: 'var(--ink-3)',
                  }}
                  title="Remove tag"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tag picker input */}
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Chercher un tag..."
          className="s-input"
          disabled={loading}
          style={{ fontFamily: 'var(--font-serif)' }}
        />

        {/* Dropdown */}
        {isOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'var(--bg-card)',
              border: '1px solid var(--rule)',
              borderRadius: 4,
              marginTop: 4,
              maxHeight: '300px',
              overflowY: 'auto',
              zIndex: 10,
              boxShadow: 'var(--shadow-card)',
            }}
          >
            {loading ? (
              <div style={{ padding: '12px', color: 'var(--ink-3)', textAlign: 'center' }}>
                Chargement...
              </div>
            ) : filteredTags.length === 0 ? (
              <div style={{ padding: '12px', color: 'var(--ink-3)', textAlign: 'center' }}>
                Aucun tag trouvé
              </div>
            ) : (
              filteredTags.map((tag) => (
                <label
                  key={tag.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 12px',
                    borderBottom: '1px solid var(--rule)',
                    cursor: 'pointer',
                    gap: 10,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag.name)}
                    onChange={() => handleTagSelect(tag.name)}
                    disabled={lockedTags.includes(tag.name)}
                    style={{ cursor: 'pointer' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 14 }}>
                      {tag.name}
                    </div>
                    {tag.category && (
                      <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>
                        {tag.category}
                      </div>
                    )}
                  </div>
                </label>
              ))
            )}
          </div>
        )}
      </div>

      {/* Close dropdown when clicking outside */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9,
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
