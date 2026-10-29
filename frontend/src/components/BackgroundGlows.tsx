export const BackgroundGlows = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Root linear gradient from deep earthy brown to deep emerald */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#140F0A] via-[#1A120B] to-[#042F2E] opacity-95" />

      {/* Top-left earthy terracotta ambient glow */}
      <div className="absolute -top-32 -left-20 w-[30rem] h-[30rem] rounded-full bg-[#D96B27]/10 blur-[130px]" />

      {/* Mid-right emerald glow */}
      <div className="absolute top-1/3 -right-24 w-[36rem] h-[36rem] rounded-full bg-[#064E3B]/25 blur-[140px]" />

      {/* Bottom central emerald / forest wash */}
      <div className="absolute -bottom-40 left-1/4 w-[42rem] h-[42rem] rounded-full bg-[#042F2E]/35 blur-[150px]" />

      {/* Subtle organic noise/specular texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
};
