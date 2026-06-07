import { NavLink } from 'react-router-dom';
import { FiGrid, FiFileText, FiPackage, FiUsers, FiBarChart2, FiHome } from 'react-icons/fi';

const LINKS = [
  { to: '/mini-erp/dashboard', label: 'Dashboard', icon: FiGrid },
  { to: '/mini-erp/requisitions', label: 'Requisiciones', icon: FiFileText },
  { to: '/mini-erp/products', label: 'Productos', icon: FiPackage },
  { to: '/mini-erp/inventory', label: 'Inventario', icon: FiBarChart2 },
  { to: '/mini-erp/leads', label: 'CRM Lite', icon: FiUsers },
  { to: '/mini-erp/reports', label: 'Reportes', icon: FiBarChart2 },
];

export default function MiniErpSidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />
      )}
      <aside className={`fixed top-0 left-0 z-40 h-full w-64 bg-tertiary/95 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:w-64 flex-shrink-0`}>
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-white/10">
            <NavLink to="/mini-erp/dashboard" className="flex items-center gap-2" onClick={onClose}>
              <div className="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <span className="text-violet-300 text-xs font-bold">E</span>
              </div>
              <span className="text-white font-semibold text-sm">Mini ERP</span>
            </NavLink>
          </div>
          <nav className="flex-1 py-4 space-y-1 px-3">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-violet-500/15 text-violet-300 border border-violet-500/20'
                      : 'text-secondary hover:text-white hover:bg-white/5 border border-transparent'
                  }`
                }
              >
                <link.icon className="w-4 h-4 flex-shrink-0" />
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t border-white/10">
            <NavLink
              to="/"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-secondary hover:text-white hover:bg-white/5 transition-all"
            >
              <FiHome className="w-4 h-4" />
              Volver al portafolio
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
}
