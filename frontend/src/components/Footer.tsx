export const Footer = () => {
  return (
    <footer className="w-full border-t border-white/5 py-10 px-6 bg-[#140F0A]/90 relative z-10">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        {/* Copyright notice */}
        <p className="text-xs text-stone-400/60">
          © {new Date().getFullYear()} Biana Finanças. Todos os direitos reservados.
        </p>

        {/* Minimalist Terms & Privacy Links with reduced opacity & smooth hover */}
        <div className="flex items-center gap-6 text-xs text-stone-400/60">
          <a
            href="#termos"
            className="hover:text-white/90 hover:underline underline-offset-4 transition-colors duration-300"
          >
            Termos de Uso
          </a>
          <span className="text-stone-600">•</span>
          <a
            href="#privacidade"
            className="hover:text-white/90 hover:underline underline-offset-4 transition-colors duration-300"
          >
            Privacidade
          </a>
        </div>
      </div>
    </footer>
  );
};
