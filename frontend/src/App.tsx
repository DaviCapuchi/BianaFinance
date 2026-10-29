import { useState } from 'react';
import { DashboardPage } from './pages/DashboardPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';

type ViewMode = 'dashboard' | 'signin' | 'signup';

export function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');

  return (
    <div className="min-h-screen bg-surface font-sans selection:bg-primary-fixed selection:text-on-primary-fixed">
      {currentView === 'dashboard' && (
        <DashboardPage onLogout={() => setCurrentView('signin')} />
      )}

      {currentView === 'signin' && (
        <SignInPage
          onNavigateToSignUp={() => setCurrentView('signup')}
          onLoginSuccess={() => setCurrentView('dashboard')}
        />
      )}

      {currentView === 'signup' && (
        <SignUpPage
          onNavigateToSignIn={() => setCurrentView('signin')}
          onRegisterSuccess={() => setCurrentView('dashboard')}
        />
      )}
    </div>
  );
}

export default App;
