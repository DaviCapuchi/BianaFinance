import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { ReportsPage } from './pages/ReportsPage';
import { GoalsPage } from './pages/GoalsPage';
import { SettingsPage } from './pages/SettingsPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';

export function AppRoutes() {
  const navigate = useNavigate();

  const handleNavigateTab = (tab: string) => {
    const normalized = tab.toLowerCase();
    switch (normalized) {
      case 'dashboard':
        navigate('/');
        break;
      case 'transações':
      case 'transacoes':
        navigate('/transacoes');
        break;
      case 'relatórios':
      case 'relatorios':
        navigate('/relatorios');
        break;
      case 'metas':
        navigate('/metas');
        break;
      case 'configurações':
      case 'configuracoes':
        navigate('/configuracoes');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-surface font-sans selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Routes>
        <Route
          path="/"
          element={
            <DashboardPage
              onLogout={() => navigate('/signin')}
              onNavigateTab={handleNavigateTab}
            />
          }
        />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />

        <Route
          path="/transacoes"
          element={
            <TransactionsPage
              onLogout={() => navigate('/signin')}
              onNavigateTab={handleNavigateTab}
            />
          }
        />
        <Route path="/transações" element={<Navigate to="/transacoes" replace />} />

        <Route
          path="/relatorios"
          element={
            <ReportsPage
              onLogout={() => navigate('/signin')}
              onNavigateTab={handleNavigateTab}
            />
          }
        />
        <Route path="/relatórios" element={<Navigate to="/relatorios" replace />} />

        <Route
          path="/metas"
          element={
            <GoalsPage
              onLogout={() => navigate('/signin')}
              onNavigateTab={handleNavigateTab}
            />
          }
        />

        <Route
          path="/configuracoes"
          element={
            <SettingsPage
              onLogout={() => navigate('/signin')}
              onNavigateTab={handleNavigateTab}
            />
          }
        />
        <Route path="/configurações" element={<Navigate to="/configuracoes" replace />} />

        <Route
          path="/signin"
          element={
            <SignInPage
              onNavigateToSignUp={() => navigate('/signup')}
              onLoginSuccess={() => navigate('/')}
            />
          }
        />

        <Route
          path="/signup"
          element={
            <SignUpPage
              onNavigateToSignIn={() => navigate('/signin')}
              onRegisterSuccess={() => navigate('/')}
            />
          }
        />

        {/* 404 Wildcard fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
