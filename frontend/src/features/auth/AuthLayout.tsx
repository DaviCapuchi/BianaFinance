import React from 'react';
import { Sparkles, Users, ShieldCheck } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface AuthLayoutProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  children,
  className,
}) => {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-hidden">
      {/* Background Ambience Blurs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-secondary/5 blur-3xl" />
        <div className="absolute -bottom-28 left-1/4 w-[32rem] h-[32rem] rounded-full bg-tertiary/5 blur-3xl" />
      </div>

      <div className="w-full max-w-5xl mx-auto my-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-tactile border border-[rgba(44,24,16,0.06)] bg-surface-container-lowest">
          {/* Left Panel: Contemporary Warm Minimalism (5 cols) */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-surface-container to-surface-container-high p-8 sm:p-10 flex-col justify-between relative overflow-hidden select-none">
            {/* Soft Ambient decorative blobs */}
            <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
            <div className="absolute -left-12 bottom-12 w-56 h-56 rounded-full bg-secondary/15 blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 bg-surface-container-lowest/80 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                <span className="text-xs font-semibold text-secondary tracking-wide uppercase">
                  Finanças com Propósito
                </span>
              </div>

              <div>
                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-terracotta mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold text-on-surface tracking-tight">
                  Harmonia Finanças
                </h1>
                <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                  Equilíbrio e tranquilidade para a sua vida financeira e o bem-estar da sua família.
                </p>
              </div>
            </div>

            {/* Social Trust Metrics */}
            <div className="relative z-10 space-y-3.5 my-8">
              <div className="p-4 bg-surface-container-lowest/90 backdrop-blur-md rounded-2xl shadow-xs flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-secondary-container text-secondary flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-base text-on-surface">
                    +50.000 Famílias
                  </div>
                  <div className="text-xs text-on-surface-variant">
                    Conquistando segurança e paz orçamentária
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-surface-container-lowest/70 backdrop-blur-sm rounded-xl flex items-center gap-2.5 text-xs text-on-surface-variant font-medium">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                <span>Criptografia bancária de ponta a ponta</span>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="relative z-10 p-4 bg-surface-container-low/80 rounded-2xl border border-[rgba(44,24,16,0.04)]">
              <p className="text-xs text-on-surface italic leading-relaxed">
                "Enfim um aplicativo financeiro sem ansiedade ou gráficos frios. Trouxe leveza e alinhamento para o nosso lar."
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-on-surface">
                  Camila & Rafael
                </span>
                <span className="text-outline">• Membros há 2 anos</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Form (7 cols) */}
          <div className="col-span-12 lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-surface-container-lowest">
            <div className={cn('max-w-md w-full mx-auto', className)}>
              {(title || subtitle) && (
                <div className="mb-6 text-left">
                  {title && (
                    <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                      {title}
                    </h2>
                  )}
                  {subtitle && (
                    <p className="text-sm text-on-surface-variant mt-1.5 leading-relaxed">
                      {subtitle}
                    </p>
                  )}
                </div>
              )}
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
