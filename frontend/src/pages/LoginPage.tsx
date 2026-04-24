import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        background: 'var(--bg-page)',
      }}
    >
      <style>{`@keyframes shake { 0%,100%{transform:none} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }`}</style>

      <div
        style={{
          width: '100%',
          maxWidth: 440,
          background: 'var(--bg-card)',
          border: '1px solid var(--rule)',
          borderRadius: 8,
          padding: '56px 48px 40px',
          boxShadow: 'var(--shadow-card)',
          position: 'relative',
          animation: shaking ? 'shake 0.4s' : 'none',
        }}
      >
        {/* Ornamental header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 44,
              color: 'var(--rubric)',
              lineHeight: 1,
              marginBottom: 4,
            }}
          >
            ❧
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              fontSize: 40,
              margin: '8px 0 4px',
              letterSpacing: '-0.01em',
              color: 'var(--ink)',
            }}
          >
            Cognitio
          </h1>
          <div className="s-mono" style={{ color: 'var(--rubric)' }}>
            ❦ Théologie · Lectio & Memoria ❦
          </div>
        </div>

        <hr className="s-hairline" style={{ margin: '0 0 28px' }} />

        {error && (
          <div
            style={{
              background: 'color-mix(in oklch, var(--rubric) 12%, transparent)',
              color: 'var(--rubric)',
              padding: '12px 14px',
              borderRadius: 4,
              marginBottom: 20,
              fontSize: 14,
              border: '1px solid color-mix(in oklch, var(--rubric) 35%, transparent)',
              fontFamily: 'var(--font-serif)',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="s-field">
            <label className="s-label">Adresse</label>
            <input
              className="s-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="frere@cognitio.fr"
              autoFocus
              disabled={loading}
            />
          </div>

          <div className="s-field">
            <label className="s-label">Mot de passe</label>
            <input
              className="s-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="s-btn s-btn-primary"
            disabled={loading}
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '12px',
              marginTop: 12,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Entrée en cours…' : 'Entrer dans Cognitio'}
          </button>
        </form>

        <div
          className="s-end-ornament"
          style={{ margin: '28px 0 0', fontSize: 14 }}
        >
          ⁂
        </div>
      </div>
    </div>
  );
}
