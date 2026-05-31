import React from 'react';
import { useLocation } from 'react-router-dom';

const pageTitle: Record<string, string> = {
  '/': 'Dashboard Ejecutivo',
  '/accounts': 'Gestión de Cuentas',
  '/pipeline': 'Pipeline por Producto',
  '/leads': 'Gestión de Leads',
  '/opportunities': 'Oportunidades',
  '/contacts': 'Contactos',
  '/activities': 'Actividades',
  '/reports': 'Reportes & Analytics',
  '/admin': 'Administración',
};

export const TopBar = () => {
  const location = useLocation();
  const title = pageTitle[location.pathname] || 'Moneta CRM';
  const now = new Date();
  const dateStr = now.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-white/10 bg-moneta-navy-dark/50 backdrop-blur-sm flex-shrink-0">
      <div>
        <h1 className="text-sm font-semibold text-white">{title}</h1>
        <p className="text-xs text-white/40 capitalize">{dateStr}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 font-medium">Sistema activo</span>
        </div>
      </div>
    </header>
  );
};
