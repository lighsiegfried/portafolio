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
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-violet-500/20 flex items-center justify-center border border-violet-500/20">
            <span className="text-violet-300 text-xl font-bold">E</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Mini ERP</h1>
          <p className="text-sm text-secondary">Sistema de Gestion Empresarial</p>
          <p className="text-xs text-white/20 mt-2">Demo tecnica conectada a backend serverless en AWS</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-tertiary/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4">
          {error && (
            <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>
          )}
          <div>
            <label className="block text-xs text-secondary mb-1.5">Usuario</label>
            <input
              type="text" value={username} onChange={(e) => setUsername(e.target.value)}
              placeholder="wilson"
              className="w-full bg-primary/50 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-secondary mb-1.5">Contrasena</label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
              className="w-full bg-primary/50 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full py-2.5 rounded-lg bg-violet-500/80 hover:bg-violet-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="mt-6">
          <p className="text-center text-xs text-secondary mb-3">Usuarios de prueba</p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_USERS.map((u) => (
              <button
                key={u.username}
                onClick={() => fillDemo(u)}
                className="text-left bg-tertiary/30 border border-white/10 rounded-lg px-3 py-2 hover:border-violet-500/30 transition-colors"
              >
                <p className="text-white text-xs font-medium">{u.username}</p>
                <p className="text-secondary text-[10px]">{u.role} / {u.password}</p>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-[10px] text-white/10 mt-8">
          Datos ficticios de demostracion. Conexion a AWS Lambda + DynamoDB.
        </p>
      </div>
    </div>
  );
}
