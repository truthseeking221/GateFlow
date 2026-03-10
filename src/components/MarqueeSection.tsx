import { ArrowRight, Zap } from 'lucide-react';

export default function MarqueeSection() {
  const items1 = ['GATEFLOW ENGINE', 'UNIFIED AI GATEWAY', 'ZERO LATENCY', '100+ MODELS', 'SMART ROUTING'];
  const items2 = ['UNLIMITED SCALE', 'ENTERPRISE READY', 'GLOBAL EDGE', 'BYPASS LIMITS', 'ZERO LOGS'];

  return (
    <section className="py-32 relative bg-black overflow-hidden font-sans border-b border-t border-white/10 flex flex-col justify-center w-full">

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0 opacity-30" />

      {/* Marquee Tracks container */}
      <div className="relative z-10 flex flex-col gap-8 w-full">

        {/* Track 1 - Outline Fast moving right-to-left */}
        <div
          className="marquee-track flex whitespace-nowrap opacity-10 w-max"
          style={{ animationDuration: '50s' }}
        >
          {[0, 1].map((group) => (
            <div key={group} className="flex items-center">
              {items1.map((text, i) => (
                <div key={`${group}-${i}`} className="flex items-center mx-8">
                  <span className="text-5xl md:text-[6rem] font-sans font-bold text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.8)] uppercase tracking-tighter">
                    {text}
                  </span>
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-white/40 mx-12"></div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Track 2 - Solid, moving left-to-right */}
        <div
          className="marquee-track flex whitespace-nowrap opacity-[0.15] w-max"
          style={{ animationDirection: 'reverse', animationDuration: '60s' }}
        >
          {[0, 1].map((group) => (
            <div key={group} className="flex items-center">
              {items2.map((text, i) => (
                <div key={`${group}-${i}`} className="flex items-center mx-8">
                  <span className="text-5xl md:text-[6rem] font-sans font-bold text-white uppercase tracking-tighter">
                    {text}
                  </span>
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-white/40 mx-12"></div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Track 3 - Outline Fast moving right-to-left */}
        <div
          className="marquee-track flex whitespace-nowrap opacity-10 w-max"
          style={{ animationDuration: '45s' }}
        >
          {[0, 1].map((group) => (
            <div key={group} className="flex items-center">
              {items1.map((text, i) => (
                <div key={`${group}-${i}`} className="flex items-center mx-8">
                  <span className="text-5xl md:text-[6rem] font-sans font-bold text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.8)] uppercase tracking-tighter">
                    {text}
                  </span>
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-white/40 mx-12"></div>
                </div>
              ))}
            </div>
          ))}
        </div>

      </div>

      {/* Center CTA Overlay with Glassmorphism to hide text under it */}
      <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto flex flex-col items-center gap-6 bg-black/40 backdrop-blur-md border border-white/10 px-12 py-10 md:px-20 md:py-16 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,1)] text-center relative overflow-hidden">

          {/* Subtle glow behind the box */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#4ade80]/10 to-transparent opacity-50 z-0 pointer-events-none" />

          <div className="relative z-10 w-16 h-16 rounded-2xl bg-black border border-white/20 flex items-center justify-center shadow-[0_0_40px_rgba(74,222,128,0.2)] mb-2">
            <Zap className="w-8 h-8 text-[#4ade80]" />
          </div>

          <h2 className="relative z-10 text-4xl md:text-5xl font-bold font-sans tracking-tight text-white mb-2">
            Ready to scale?
          </h2>
          <p className="relative z-10 text-white/50 font-medium mb-4 max-w-sm">
            Join thousands of developers building the future without rate limits.
          </p>

          <a
            href="#pricing"
            className="relative z-10 group inline-flex items-center justify-center px-8 py-4 font-sans font-bold text-sm text-black transition-all bg-white rounded-md hover:bg-neutral-200"
          >
            <span className="flex items-center gap-2">
              Start Building Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </a>
        </div>
      </div>

      {/* Faded edges to blend into black background */}
      <div className="absolute inset-y-0 left-0 w-[15%] bg-gradient-to-r from-black via-black/80 to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-[15%] bg-gradient-to-l from-black via-black/80 to-transparent z-20 pointer-events-none" />
    </section>
  );
}
