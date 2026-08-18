import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Home, Moon, Sun } from 'lucide-react';
import { login as loginApi } from '../../services/authApi';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import useErpTranslation from '../i18n/useErpTranslation';

const DEMO_USERS = [
  { username: 'wilson', password: 'admin123', role: 'admin', name: 'Carlos Admin' },
  { username: 'compras1', password: 'compras123', role: 'compras', name: 'Maria Compras' },
  { username: 'bodega1', password: 'bodega123', role: 'bodega', name: 'Jose Bodega' },
  { username: 'gerencia1', password: 'gerencia123', role: 'gerencia', name: 'Ana Gerencia' },
];

export default function LoginPage() {
  const { user, login } = useAuth();
  const { te } = useErpTranslation();
  const { language, toggleLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // `error` holds either a dictionary key (`'missingFields'` / `'invalidCredentials'`)
  // or `{ message }` straight from the API, so the banner re-renders in the new
  // language when the visitor toggles it mid-session.
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const errorText = error
    ? (typeof error === 'string' ? te.auth.errors[error] : error.message)
    : '';

  if (user) {
    return <Navigate to="/mini-erp/dashboard" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username || !password) { setError('missingFields'); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await loginApi(username, password);
      login(res.data.token, res.data.user);
      navigate('/mini-erp/dashboard', { replace: true });
    } catch (err) {
      setError(err.message ? { message: err.message } : 'invalidCredentials');
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(u) {
    setUsername(u.username);
    setPassword(u.password);
    setError(null);
  }

  return (
    <div className="mini-erp-root relative min-h-screen bg-background flex items-center justify-center p-4">
      {/* Theme / language / back-to-portfolio controls. The login screen renders
          outside `MiniErpLayout`, so it needs its own copy of the header cluster —
          without it a visitor cannot switch language before signing in. */}
      <div className="absolute right-4 top-4 flex items-center gap-1">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={te.common.toggleTheme}
          className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          {isDark ? <Sun className="size-4" aria-hidden="true" /> : <Moon className="size-4" aria-hidden="true" />}
        </button>
        <button
          type="button"
          onClick={toggleLanguage}
          aria-label={te.common.toggleLanguage}
          className="inline-flex size-9 items-center justify-center rounded-lg text-xs font-semibold uppercase text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          {language}
        </button>
        <Link
          to="/"
          aria-label={te.common.backToPortfolio}
          className="inline-flex h-9 items-center gap-2 rounded-lg px-2.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Home className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">{te.common.backToPortfolio}</span>
        </Link>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[hsl(var(--primary))]/15 flex items-center justify-center border border-[hsl(var(--primary))]/25">
            <span aria-hidden="true" className="text-[hsl(var(--primary-hover))] text-xl font-bold">E</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">{te.auth.title}</h1>
          <p className="text-sm text-muted-foreground">{te.auth.subtitle}</p>
          <p className="text-xs text-muted-foreground/70 mt-2">{te.auth.tagline}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-xl">
          {errorText && (
            <div role="alert" className="text-xs text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{errorText}</div>
          )}
          <div>
            <label htmlFor="mini-erp-username" className="block text-xs text-muted-foreground mb-1.5">{te.auth.username}</label>
            <input
              id="mini-erp-username"
              type="text" value={username} onChange={(e) => setUsername(e.target.value)}
              placeholder={te.auth.usernamePlaceholder}
              className="w-full bg-input/30 border border-border rounded-lg px-3 py-2.5 text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-[hsl(var(--ring))] transition-colors"
            />
          </div>
          <div>
            <label htmlFor="mini-erp-password" className="block text-xs text-muted-foreground mb-1.5">{te.auth.password}</label>
            <input
              id="mini-erp-password"
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder={te.auth.passwordPlaceholder}
              className="w-full bg-input/30 border border-border rounded-lg px-3 py-2.5 text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-[hsl(var(--ring))] transition-colors"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full py-2.5 rounded-lg bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-hover))] text-[hsl(var(--primary-foreground))] text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? te.auth.submitting : te.auth.submit}
          </button>
        </form>

        <div className="mt-6">
          <p className="text-center text-xs text-muted-foreground mb-3">{te.auth.demoCredentials}</p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_USERS.map((u) => (
              <button
                key={u.username}
                type="button"
                onClick={() => fillDemo(u)}
                className="text-left bg-muted/40 border border-border rounded-lg px-3 py-2 hover:border-[hsl(var(--ring))]/40 transition-colors"
              >
                <p className="text-foreground text-xs font-medium">{u.username}</p>
                <p className="text-muted-foreground text-[10px]">{u.role} / {u.password}</p>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-[10px] text-muted-foreground/50 mt-8">
          {te.auth.disclaimer}
        </p>
      </div>
    </div>
  );
}
