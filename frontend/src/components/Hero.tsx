import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative w-full pt-16 md:pt-24 pb-12 md:pb-16 flex flex-col items-center text-center px-6 overflow-hidden">
      {/* Decorative Brand Light Glows on Sides */}
      <div className="absolute top-1/2 -left-40 md:-left-20 -translate-y-1/2 w-72 md:w-96 h-72 md:h-96 rounded-full bg-[#D96B27]/15 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 -right-40 md:-right-20 -translate-y-1/2 w-80 md:w-[28rem] h-80 md:h-[28rem] rounded-full bg-[#064E3B]/30 blur-[110px] pointer-events-none" />

      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md mb-8 hover:border-white/20 transition-all duration-300 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-[#34D399] animate-ping" />
        <span className="text-xs font-medium text-emerald-300/90 tracking-wide flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#D96B27]" />
          Inteligência Financeira Autônoma
        </span>
      </div>

      {/* Main Hook H1 */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.12] drop-shadow-sm">
        Aqui o seu dinheiro{' '}
        <span className="bg-gradient-to-r from-[#F3EFEA] via-[#A7E8BD] to-[#34D399] bg-clip-text text-transparent">
          se organiza.
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg md:text-xl text-stone-300/80 max-w-2xl mt-6 leading-relaxed font-normal">
        Menos atrito, zero complicação. O controle total da sua vida financeira em uma única tela.
      </p>

      {/* Main CTA with smooth micro-interaction & glowing aura */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
        <button
          type="button"
          onClick={() => {
            const chartEl = document.getElementById('fluxo-financeiro');
            chartEl?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="group relative w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-white text-base sm:text-lg bg-gradient-to-r from-[#D96B27] via-[#E85D04] to-[#2E5A44] shadow-[0_8px_28px_rgba(217,107,39,0.35)] hover:shadow-[0_12px_40px_rgba(46,90,68,0.45)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
        >
          <span>Começar agora</span>
          <ArrowRight className="w-5 h-5 text-emerald-200 group-hover:translate-x-1.5 transition-transform duration-300" />
        </button>
      </div>

      {/* Trust micro-banner */}
      <div className="mt-8 flex items-center justify-center gap-6 text-xs text-stone-400/70">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#34D399]" />
          Criptografia de ponta a ponta
        </span>
        <span className="w-1 h-1 rounded-full bg-stone-600" />
        <span>Sem necessidade de planilhas</span>
      </div>
    </section>
  );
};
