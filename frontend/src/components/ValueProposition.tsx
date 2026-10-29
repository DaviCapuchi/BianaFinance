import { ArrowRight, CheckCircle2, Zap, Brain, Shield } from 'lucide-react';

export const ValueProposition = () => {
  const pillars = [
    {
      icon: Zap,
      title: 'Zero Planilhas Manuais',
      description:
        'Diga adeus ao preenchimento de colunas infinitas. O sistema conecta, agrupa e categoriza seus gastos automaticamente.',
    },
    {
      icon: Brain,
      title: 'Decisões com Clareza',
      description:
        'Descubra sua real capacidade de aporte e reserva de emergência com visualizações intuitivas que qualquer pessoa domina.',
    },
    {
      icon: Shield,
      title: 'Soberania e Privacidade',
      description:
        'Criptografia de alto padrão para manter seus dados sob sua exclusiva posse e confidencialidade irrestrita.',
    },
  ];

  return (
    <section className="relative w-full max-w-5xl mx-auto px-6 py-16 md:py-24 text-center flex flex-col items-center">
      {/* Decorative center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#042F2E]/35 blur-[120px] pointer-events-none" />

      {/* Main Text Content */}
      <div className="relative z-10 max-w-3xl flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs text-[#D96B27] font-medium mb-6">
          <span>Metodologia Comprovada</span>
        </div>

        {/* Strong Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Um parceiro para a vida toda.
        </h2>

        {/* Descriptive Body */}
        <p className="text-base sm:text-lg md:text-xl text-stone-300/80 mt-6 leading-relaxed font-normal">
          Desenvolvido para descomplicar seu patrimônio com entendimento fácil e aprendizado rápido.
          Visualize para onde vai cada centavo sem precisar de planilhas complexas.
        </p>
      </div>

      {/* Three Pillars Cards with Glassmorphism */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-14 text-left">
        {pillars.map((pillar, index) => {
          const IconComponent = pillar.icon;
          return (
            <div
              key={index}
              className="group rounded-2xl bg-[#1A120B]/40 backdrop-blur-md border border-white/10 p-6 sm:p-7 hover:border-emerald-500/40 hover:bg-[#1A120B]/70 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-emerald-950/20"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 flex items-center justify-center text-[#34D399] group-hover:scale-105 group-hover:border-emerald-500/30 transition-all duration-300 mb-5">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors duration-300">
                  {pillar.title}
                </h3>
                <p className="text-sm text-stone-300/70 leading-relaxed font-normal">
                  {pillar.description}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs font-medium text-emerald-400/90 pt-4 border-t border-white/5">
                <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
                <span>Pronto para usar</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Second CTA - High Conversion Trigger */}
      <div className="relative z-10 mt-14">
        <button
          type="button"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="group relative px-8 py-4 rounded-full font-semibold text-white text-base sm:text-lg bg-gradient-to-r from-[#D96B27] via-[#E85D04] to-[#2E5A44] shadow-[0_8px_30px_rgba(217,107,39,0.35)] hover:shadow-[0_12px_45px_rgba(46,90,68,0.5)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 inline-flex items-center gap-3 cursor-pointer"
        >
          <span>Começar agora</span>
          <ArrowRight className="w-5 h-5 text-emerald-200 group-hover:translate-x-1.5 transition-transform duration-300" />
        </button>
        <p className="text-xs text-stone-400/70 mt-3">
          Sem cartão de crédito necessário • Acesso imediato
        </p>
      </div>
    </section>
  );
};
