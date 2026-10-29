import { useEffect, useRef, useState } from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  PiggyBank,
  Calendar,
  Layers,
} from 'lucide-react';

export const InteractiveChartCard = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activePoint, setActivePoint] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const dataPoints = [
    { day: '01', entradas: 3200, saidas: 1100, x: 50, yEntrada: 160, ySaida: 180 },
    { day: '07', entradas: 4600, saidas: 1750, x: 200, yEntrada: 130, ySaida: 165 },
    { day: '14', entradas: 5900, saidas: 2100, x: 380, yEntrada: 95, ySaida: 160 },
    { day: '21', entradas: 7100, saidas: 2450, x: 560, yEntrada: 60, ySaida: 155 },
    { day: '30', entradas: 8450, saidas: 2920, x: 750, yEntrada: 25, ySaida: 150 },
  ];

  return (
    <section
      id="fluxo-financeiro"
      className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-16 scroll-mt-24"
    >
      {/* Scroll Trigger Container */}
      <div
        ref={cardRef}
        style={{
          opacity: isVisible ? 1 : 0.2,
          transform: isVisible
            ? 'translateY(0px) scale(1)'
            : 'translateY(60px) scale(0.96)',
          transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="relative rounded-3xl bg-[#1A120B]/60 backdrop-blur-xl border border-white/10 p-5 sm:p-8 md:p-10 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.8)] overflow-hidden group hover:border-white/20 transition-colors duration-500"
      >
        {/* Specular Top Edge Highlight */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        {/* Ambient Internal Glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-[#042F2E]/40 blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 rounded-full bg-[#D96B27]/10 blur-[80px] pointer-events-none" />

        {/* Card Header & Controls */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#064E3B] to-[#042F2E] border border-emerald-500/30 flex items-center justify-center text-[#34D399] shadow-lg shadow-emerald-950/50">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Fluxo Financeiro em Tempo Real
                </h3>
                <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Ao vivo
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-400">
                Mapeamento automático com categorização inteligente
              </p>
            </div>
          </div>

          {/* Surplus Highlight Badge */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-stone-300">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              <span>Outubro 2026</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#042F2E]/70 border border-[#34D399]/40 text-sm font-semibold text-[#34D399] shadow-[0_0_20px_rgba(52,211,153,0.18)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#34D399]" />
              </span>
              <span>+R$ 5.530,00 superávit</span>
            </div>
          </div>
        </div>

        {/* Chart Viewport */}
        <div className="relative z-10 pt-6 pb-2">
          {/* Chart Legends */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-medium pb-4 text-stone-400">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-[#34D399]">
                <span className="w-3 h-3 rounded-full bg-[#34D399] shadow-[0_0_8px_#34D399]" />
                <span className="font-semibold">Entradas (Verde luminoso)</span>
              </div>
              <div className="flex items-center gap-2 text-stone-400">
                <span className="w-3 h-3 rounded-full bg-[#8D766C]" />
                <span>Saídas (Neutro controlado)</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-stone-500 uppercase tracking-widest text-[10px]">
              <Layers className="w-3 h-3" />
              <span>Escala Progressiva 30 Dias</span>
            </div>
          </div>

          {/* SVG Smooth Interactive Graph */}
          <div className="w-full h-56 sm:h-64 md:h-72 relative mt-2">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 800 220"
              preserveAspectRatio="none"
            >
              <defs>
                {/* Luminous Emerald Area Gradient */}
                <linearGradient id="emeraldFillGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34D399" stopOpacity="0.35" />
                  <stop offset="50%" stopColor="#064E3B" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#042F2E" stopOpacity="0.0" />
                </linearGradient>

                {/* Glow Filter for the Entradas path */}
                <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Horizontal Grid lines */}
              <line
                x1="0"
                y1="30"
                x2="800"
                y2="30"
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="4 6"
              />
              <line
                x1="0"
                y1="85"
                x2="800"
                y2="85"
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="4 6"
              />
              <line
                x1="0"
                y1="140"
                x2="800"
                y2="140"
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="4 6"
              />
              <line
                x1="0"
                y1="195"
                x2="800"
                y2="195"
                stroke="rgba(255,255,255,0.06)"
              />

              {/* Saídas Line */}
              <path
                d="M 50,180 C 180,185 280,165 400,168 C 520,172 650,152 750,150"
                fill="none"
                stroke="#8D766C"
                strokeWidth="2.5"
                strokeDasharray="3 3"
                opacity="0.75"
              />

              {/* Entradas Gradient Shaded Area */}
              <path
                d="M 50,160 C 180,145 280,105 420,95 C 560,80 650,45 750,25 L 750,210 L 50,210 Z"
                fill="url(#emeraldFillGrad)"
              />

              {/* Entradas Main Luminous Glowing Path */}
              <path
                d="M 50,160 C 180,145 280,105 420,95 C 560,80 650,45 750,25"
                fill="none"
                stroke="#34D399"
                strokeWidth="4"
                filter="url(#emeraldGlow)"
              />

              {/* Interactive nodes along the curve */}
              {dataPoints.map((point, index) => (
                <g
                  key={index}
                  className="cursor-pointer transition-transform duration-300"
                  onMouseEnter={() => setActivePoint(index)}
                  onMouseLeave={() => setActivePoint(null)}
                >
                  <circle
                    cx={point.x}
                    cy={point.ySaida}
                    r={activePoint === index ? 5 : 3.5}
                    fill="#8D766C"
                    stroke="#140F0A"
                    strokeWidth="2"
                    className="transition-all duration-300"
                  />
                  <circle
                    cx={point.x}
                    cy={point.yEntrada}
                    r={activePoint === index ? 7 : 5}
                    fill="#34D399"
                    stroke="#042F2E"
                    strokeWidth="2"
                    className="transition-all duration-300"
                  />
                  {activePoint === index && (
                    <circle
                      cx={point.x}
                      cy={point.yEntrada}
                      r="14"
                      fill="none"
                      stroke="#34D399"
                      strokeWidth="1.5"
                      strokeOpacity="0.8"
                      className="animate-ping"
                    />
                  )}
                </g>
              ))}
            </svg>
          </div>

          {/* Timeline X-Axis Labels */}
          <div className="flex justify-between items-center text-xs text-stone-500 pt-3 px-3 border-t border-white/5">
            <span>Dia 01</span>
            <span>Dia 07</span>
            <span>Dia 14</span>
            <span>Dia 21</span>
            <span>Dia 30 (Fechamento)</span>
          </div>
        </div>

        {/* Quick KPI Financial Cards */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 mt-6 border-t border-white/10">
          <div className="rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 p-4 flex items-center justify-between transition-all duration-300 group/kpi">
            <div>
              <span className="text-xs uppercase tracking-wider text-stone-400 font-medium">
                Entradas (Total)
              </span>
              <p className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1">
                +R$ 8.450,00
              </p>
              <span className="text-[11px] text-emerald-300/80 flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3" /> +18,4% este mês
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[#34D399] group-hover/kpi:scale-110 transition-transform duration-300">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 p-4 flex items-center justify-between transition-all duration-300 group/kpi">
            <div>
              <span className="text-xs uppercase tracking-wider text-stone-400 font-medium">
                Saídas (Total)
              </span>
              <p className="text-xl sm:text-2xl font-bold text-stone-200 mt-1">
                -R$ 2.920,00
              </p>
              <span className="text-[11px] text-emerald-400/80 flex items-center gap-1 mt-1">
                <ArrowDownRight className="w-3 h-3 text-[#34D399]" /> -6,2% economia
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-stone-400 group-hover/kpi:scale-110 transition-transform duration-300">
              <Wallet className="w-5 h-5" />
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[#064E3B]/40 to-[#042F2E]/60 border border-emerald-500/25 p-4 flex items-center justify-between transition-all duration-300 group/kpi shadow-lg shadow-emerald-950/40">
            <div>
              <span className="text-xs uppercase tracking-wider text-emerald-300/80 font-medium">
                Taxa de Economia
              </span>
              <p className="text-xl sm:text-2xl font-bold text-white mt-1">
                65,4%
              </p>
              <span className="text-[11px] text-emerald-200/90 flex items-center gap-1 mt-1 font-medium">
                Excelente margem líquida
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center text-[#34D399] group-hover/kpi:scale-110 transition-transform duration-300">
              <PiggyBank className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
