import { useState, useEffect } from 'react';
import { ArrowUpRight, TrendingUp } from 'lucide-react';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#140F0A]/80 backdrop-blur-md border-b border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.35)]'
          : 'bg-[#140F0A]/40 backdrop-blur-sm border-b border-white/5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <a
          href="#"
          className="flex items-center gap-3 group transition-transform duration-300 active:scale-95"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D96B27] via-[#9A4100] to-[#042F2E] p-[1px] shadow-lg shadow-[#D96B27]/10 group-hover:shadow-[#D96B27]/25 transition-all duration-300">
            <div className="w-full h-full bg-[#1A120B] rounded-[11px] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#34D399] transition-transform duration-300 group-hover:scale-110" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors duration-300">
              Biana Finanças
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#D96B27] font-medium -mt-1">
              Inteligência Pessoal
            </span>
          </div>
        </a>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white border border-white/10 hover:border-white/25 rounded-full backdrop-blur-sm hover:bg-white/5 transition-all duration-300 active:scale-95 cursor-pointer"
          >
            Entrar
          </button>
          <button
            type="button"
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#D96B27] to-[#E85D04] hover:from-[#E85D04] hover:to-[#F48C06] rounded-full shadow-[0_4px_16px_rgba(217,107,39,0.3)] hover:shadow-[0_6px_24px_rgba(217,107,39,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <span>Criar conta</span>
            <ArrowUpRight className="w-4 h-4 text-white/80 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </header>
  );
};
