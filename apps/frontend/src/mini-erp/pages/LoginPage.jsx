import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { login as loginApi } from '../../services/authApi';
import { useAuth } from '../hooks/useAuth';

const DEMO_USERS = [
  { username: 'wilson', password: 'admin123', role: 'admin', name: 'Carlos Admin' },
  { username: 'compras1', password: 'compras123', role: 'compras', name: 'Maria Compras' },
  { username: 'bodega1', password: 'bodega123', role: 'bodega', name: 'Jose Bodega' },
  { username: 'gerencia1', password: 'gerencia123', role: 'gerencia', name: 'Ana Gerencia' },
];

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/mini-erp/dashboard" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username || !password) { setError('Ingrese usuario y contrasena'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await loginApi(username, password);
      login(res.data.token, res.data.user);
      navigate('/mini-erp/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Credenciales invalidas');
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(u) {
    setUsername(u.username);
    setPassword(u.password);
    setError('');
  }

  return (
    <div className="mini-erp-root min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[hsl(var(--primary))]/15 flex items-center justify-center border border-[hsl(var(--primary))]/25">
            <span className="text-[hsl(var(--primary-hover))] text-xl font-bold">E</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Mini ERP</h1>
          <p className="text-sm text-muted-foreground">Sistema de Gestion Empresarial</p>
          <p className="text-xs text-muted-foreground/70 mt-2">Demo tecnica conectada a backend serverless en AWS</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-xl">
          {error && (
            <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>
          )}
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">Usuario</label>
            <input
              type="text" value={username} onChange={(e) => setUsername(e.target.value)}
              placeholder="wilson"
              className="w-full bg-input/30 border border-border rounded-lg px-3 py-2.5 text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-[hsl(var(--ring))] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">Contrasena</label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
              className="w-full bg-input/30 border border-border rounded-lg px-3 py-2.5 text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-[hsl(var(--ring))] transition-colors"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full py-2.5 rounded-lg bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-hover))] text-[hsl(var(--primary-foreground))] text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="mt-6">
          <p className="text-center text-xs text-muted-foreground mb-3">Usuarios de prueba</p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_USERS.map((u) => (
              <button
                key={u.username}
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
          Datos ficticios de demostracion. Conexion a AWS Lambda + DynamoDB.
        </p>
      </div>
    </div>
  );
}
