import { useNavigate } from 'react-router-dom';
import { FiMenu, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

export default function MiniErpHeader({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/', { replace: true });
  }

  return (
    <header className="h-16 bg-tertiary/50 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="lg:hidden text-secondary hover:text-white transition-colors">
          <FiMenu className="w-5 h-5" />
        </button>
        <span className="text-white/40 text-sm hidden sm:block">Sistema de Gestion Empresarial</span>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <>
            <div className="flex items-center gap-2 text-sm text-secondary">
              <FiUser className="w-4 h-4" />
              <span className="hidden sm:inline">{user.name || user.username}</span>
              <span className="text-xs text-white/30 px-2 py-0.5 rounded-full bg-white/5">{(user.role || '').toUpperCase()}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-red-300 hover:text-red-200 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/10"
            >
              <FiLogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
}
