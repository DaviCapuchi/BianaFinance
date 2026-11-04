import React from 'react';
import {
  LayoutGrid,
  ArrowLeftRight,
  BarChart3,
  PiggyBank,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import logoImg from '../../assets/Logo.webp';

export interface SidebarProps {
  isOpen?: boolean;
  isCollapsed?: boolean;
  onClose?: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onLogout?: () => void;
  user?: {
    name?: string;
    email?: string;
    plan?: string;
    avatarUrl?: string;
  };
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { id: 'transações', label: 'Transações', icon: ArrowLeftRight },
  { id: 'relatórios', label: 'Relatórios', icon: BarChart3 },
  { id: 'metas', label: 'Metas & Orçamentos', icon: PiggyBank },
  { id: 'configurações', label: 'Configurações', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  isCollapsed = false,
  onClose,
  activeTab = 'dashboard',
  onTabChange,
  onLogout,
  user = {
    name: 'Davi',
    email: 'davi@biana.finance',
    plan: 'Plano Familiar Ativo',
  },
}) => {
  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isOpen && (
        <div
          data-testid="sidebar-backdrop"
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden animate-fade-in"
          onClick={onClose}
          aria-label="Fechar menu lateral"
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 bottom-0 w-72 bg-surface-container-lowest border-r border-[rgba(44,24,16,0.06)] flex-col justify-between p-6 z-50 select-none transition-all duration-300',
          isOpen ? 'flex shadow-2xl md:shadow-none' : 'hidden md:flex',
          isCollapsed && 'md:hidden'
        )}
      >
        {/* Top Header / Branding */}
        <div>
          <div className="flex items-center justify-between gap-3 px-2 py-3 mb-8">
            <div className="flex items-center gap-3">
              <img
                src={logoImg}
                alt="Biana Finanças"
                className="w-10 h-10 rounded-xl object-cover shadow-tactile shrink-0 border border-[rgba(44,24,16,0.08)]"
              />
              <div>
                <h1 className="font-bold text-base text-on-surface tracking-tight leading-tight">
                  Biana Finanças
                </h1>
                <p className="text-xs text-outline font-medium">Gestão Consiciente</p>
              </div>
            </div>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar barra lateral"
                className="md:hidden p-1.5 -mr-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5" aria-label="Navegação Principal">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                activeTab.toLowerCase() === item.id.toLowerCase() ||
                activeTab.toLowerCase() === item.label.toLowerCase();

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onTabChange?.(item.id);
                    onClose?.();
                  }}
                  className={cn(
                    'w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer text-left',
                    isActive
                      ? 'bg-surface-container text-primary font-semibold shadow-xs'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-5 h-5 shrink-0 transition-colors',
                      isActive ? 'text-primary' : 'text-outline'
                    )}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

      {/* User Anchor Footer */}
      <div className="pt-4 border-t border-[rgba(44,24,16,0.06)]">
        <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container-low/60 hover:bg-surface-container-low transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name || 'Usuário'}
                className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-primary/20"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-sm shrink-0">
                {(user.name || 'D').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-on-surface truncate">
                {user.name || 'Davi'}
              </p>
              <p className="text-xs text-outline truncate">
                {user.plan || 'Plano Familiar Ativo'}
              </p>
            </div>
          </div>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              aria-label="Sair da conta"
              className="p-1.5 text-outline hover:text-primary rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
    </>
  );
};
