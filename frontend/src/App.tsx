import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Accounts } from './pages/Accounts';
import { AccountDetail } from './pages/AccountDetail';
import { Pipeline } from './pages/Pipeline';
import { Leads } from './pages/Leads';
import { Opportunities } from './pages/Opportunities';
import { Contacts } from './pages/Contacts';
import { Activities } from './pages/Activities';
import { Reports } from './pages/Reports';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuthStore();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={
        <PrivateRoute>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/accounts/:id" element={<AccountDetail />} />
              <Route path="/pipeline" element={<Pipeline />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/opportunities" element={<Opportunities />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </Layout>
        </PrivateRoute>
      } />
    </Routes>
  </BrowserRouter>
);

export default App;
