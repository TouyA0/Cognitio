import { useAuth } from './AuthContext';
import { LoginPage } from './pages/LoginPage';
import './styles.css';

function App() {
  const { user, loading } = useAuth();

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
        <p style={{ color: 'var(--ink-3)' }}>Le graphe et les formulaires arrivent bientôt 🚀</p>
      </div>
    </div>
  );
}

export default App;