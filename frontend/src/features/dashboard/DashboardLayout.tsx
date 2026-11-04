import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { DashboardTopNav } from './DashboardTopNav';
import { cn } from '../../utils/cn';

export interface DashboardLayoutProps {
  activeTab: string;
  onNavigateTab?: (tab: string) => void;
  onLogout?: () => void;
  userName?: string;
  periodLabel?: string;
  onPeriodChange?: (period: string) => void;
  onOpenNewTransaction?: () => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  activeTab,
  onNavigateTab,
  onLogout,
  userName = 'Davi',
  periodLabel = 'Outubro/2026',
  onPeriodChange,
  onOpenNewTransaction,
  children,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  // Auto-close mobile drawer when resizing up to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsMobileOpen((prev) => !prev);
    } else {
      setIsDesktopCollapsed((prev) => !prev);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex text-on-surface">
      {/* Sidebar for Desktop & Mobile Overlay Drawer */}
      <Sidebar
        isOpen={isMobileOpen}
        isCollapsed={isDesktopCollapsed}
        onClose={() => setIsMobileOpen(false)}
        activeTab={activeTab}
        onTabChange={onNavigateTab}
        onLogout={onLogout}
        user={{ name: userName, plan: 'Plano Familiar Ativo' }}
      />

      {/* Main Container smoothly shifting depending on desktop sidebar state */}
      <div
        className={cn(
          'flex-1 flex flex-col min-w-0 transition-all duration-300',
          isDesktopCollapsed ? 'md:pl-0' : 'md:pl-72'
        )}
      >
        <DashboardTopNav
          periodLabel={periodLabel}
          onPeriodChange={onPeriodChange}
          onOpenNewTransaction={onOpenNewTransaction}
          onToggleSidebar={toggleSidebar}
          user={{ name: userName }}
        />

        {children}
      </div>
    </div>
  );
};
