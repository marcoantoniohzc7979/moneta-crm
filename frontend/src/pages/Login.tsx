import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const DEMO_USERS = [
  { email: 'comercial@moneta.com.mx', password: 'moneta2024', name: 'Javier Gonzalez', role: 'DIRECTOR_COMERCIAL' as const }
];

export const Login = () => {
  const [email, setEmail] = useState('comercial@moneta.com.mx');
  const [password, setPassword] = useState('moneta2024');
  const [error, setError] = useState('');
  const { localLogin } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = DEMO_USERS.find(
      u => u.email.toLowerCase().trim() === email.toLowerCase().trim()
        && u.password === password.trim()
    );

    if (user) {
      localLogin(user);
      navigate('/');
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-moneta-navy-dark">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/logo-moneta.png"
            alt="Moneta"
            style={{ height: 64, objectFit: 'contain', display: 'inline-block', marginBottom: 16 }}
          />
          <h1 className="text-2xl font-bold text-white">Moneta CRM</h1>
          <p className="text-white/40 text-sm mt-1">Gestión comercial B2B</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-moneta-navy border border-white/10 rounded-2xl p-8 shadow-2xl space-y-5">
          <div>
            <h2 className="text-base font-semibold text-white mb-1">Iniciar sesión</h2>
            <p className="text-xs text-white/40">Ingresa tus credenciales para acceder</p>
          </div>

          <Input
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="usuario@moneta.com.mx"
            required
          />
          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-sm text-red-400 text-center bg-red-400/10 border border-red-400/20 rounded-lg py-2">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full justify-center py-3">
            Acceder al CRM
          </Button>

          <div className="pt-2 border-t border-white/10">
            <div className="px-3 py-2 rounded-lg bg-white/5 text-center">
              <p className="text-xs text-white/50">comercial@moneta.com.mx</p>
              <p className="text-xs text-white/30">contraseña: moneta2024</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
