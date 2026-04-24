import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { TypeSelectScreen } from './pages/TypeSelectScreen';
import { ReflectionForm } from './components/forms/ReflectionForm';
import { DiscoveryForm } from './components/forms/DiscoveryForm';
import { QuoteForm } from './components/forms/QuoteForm';
import { LectureForm } from './components/forms/LectureForm';
import './styles.css';

type View = 'graph' | 'new' | 'new-form';
type DiscoveryType = 'reflection' | 'discovery' | 'quote' | 'lecture';

function App() {
  const { user, loading } = useAuth();
  const [view, setView] = useState<View>('graph');
  const [selectedType, setSelectedType] = useState<DiscoveryType | null>(null);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        color: 'var(--ink-3)',
      }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 16 }}>Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  // New content flow
  if (view === 'new') {
    return (
      <TypeSelectScreen
        onPick={(type) => {
          setSelectedType(type);
          setView('new-form');
        }}
        onCancel={() => setView('graph')}
      />
    );
  }

  if (view === 'new-form' && selectedType) {
    const handleFormCancel = () => setView('new');
    const handleFormSave = (data: any) => {
      console.log('Saving discovery:', data);
      setView('graph');
    };

    switch (selectedType) {
      case 'reflection':
        return <ReflectionForm onCancel={handleFormCancel} onSave={handleFormSave} />;
      case 'discovery':
        return <DiscoveryForm onCancel={handleFormCancel} onSave={handleFormSave} />;
      case 'quote':
        return <QuoteForm onCancel={handleFormCancel} onSave={handleFormSave} />;
      case 'lecture':
        return <LectureForm onCancel={handleFormCancel} onSave={handleFormSave} />;
      default:
        return null;
    }
  }

  // Main graph view
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      color: 'var(--ink)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36 }}>Bienvenue, {user.email}</h1>
        <p style={{ color: 'var(--ink-3)', marginBottom: 24 }}>Le graphe arrive bientôt 🚀</p>
        <button
          onClick={() => setView('new')}
          style={{
            padding: '12px 24px',
            background: 'var(--rubric)',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontFamily: 'var(--font-serif)',
            fontSize: 16,
          }}
        >
          Nouveau contenu
        </button>
      </div>
    </div>
  );
}

export default App;