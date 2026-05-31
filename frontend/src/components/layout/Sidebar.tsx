import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { roleLabel } from '../../utils/formatters';

const navItems = [
  { path: '/', icon: '⬛', label: 'Dashboard', exact: true },
  { path: '/accounts', icon: '🏢', label: 'Cuentas' },
  { path: '/pipeline', icon: '📊', label: 'Pipeline' },
  { path: '/leads', icon: '🎯', label: 'Leads' },
  { path: '/opportunities', icon: '💰', label: 'Oportunidades' },
  { path: '/contacts', icon: '👥', label: 'Contactos' },
  { path: '/activities', icon: '📅', label: 'Actividades' },
  { path: '/reports', icon: '📈', label: 'Reportes' },
];

const adminItems = [
  { path: '/admin', icon: '⚙️', label: 'Administración' },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className={`flex flex-col bg-moneta-navy border-r border-white/10 transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'} min-h-screen flex-shrink-0`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        {collapsed ? (
          <div className="w-8 h-8 rounded-full bg-moneta-orange flex-shrink-0 overflow-hidden">
            <img src="/logo-moneta.png" alt="Moneta" style={{ width: 32, height: 32, objectFit: 'cover' }} />
          </div>
        ) : (
          <img src="/logo-moneta.png" alt="Moneta" style={{ height: 36, objectFit: 'contain' }} />
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-white/40 hover:text-white transition-colors text-xs"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="space-y-0.5 px-2">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-moneta-orange/20 text-moneta-orange border border-moneta-orange/30'
                    : 'text-white/60 hover:text-white hover:bg-white/8'
                }`
              }
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </div>

        {(user?.role === 'ADMIN' || user?.role === 'DIRECTOR_COMERCIAL') && (
          <div className="mt-4 pt-4 border-t border-white/10 space-y-0.5 px-2">
            {!collapsed && <p className="px-3 mb-2 text-xs font-semibold text-white/30 uppercase tracking-wider">Admin</p>}
            {adminItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                    isActive ? 'bg-moneta-orange/20 text-moneta-orange border border-moneta-orange/30' : 'text-white/60 hover:text-white hover:bg-white/8'
                  }`
                }
              >
                <span className="text-base flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      {/* User */}
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-moneta-orange/30 border border-moneta-orange/50 flex items-center justify-center text-xs font-bold text-moneta-orange flex-shrink-0">
            {user?.name?.charAt(0) || 'U'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-white/40 truncate">{user?.role ? roleLabel[user.role] : ''}</p>
            </div>
          )}
          {!collapsed && (
            <button onClick={handleLogout} className="text-white/30 hover:text-white/80 transition-colors text-xs" title="Salir">
              ⏻
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
