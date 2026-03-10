import { Zap } from 'lucide-react';

export default function MarqueeSection() {
  const items1 = ['GATEFLOW ENGINE', '•', 'UNIFIED AI GATEWAY', '•', 'ZERO LATENCY', '•', '100+ MODELS', '•'];
  const items2 = ['UNLIMITED SCALE', '•', 'SMART ROUTING', '•', 'ENTERPRISE READY', '•', 'GLOBAL EDGE', '•'];

  return (
    <section className="py-24 md:py-32 relative bg-black overflow-hidden font-sans border-y border-white/10 flex flex-col justify-center">

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0 opacity-50 mask-radial-fade" />

      <div className="relative z-10 flex flex-col gap-6 md:gap-10 -rotate-3 scale-[1.05] md:scale-110">

        {/* Track 1 - Outline Fast moving right-to-left */}
        <div
          className="marquee-track flex whitespace-nowrap opacity-40 mix-blend-screen w-max"
          style={{ animationDuration: '35s' }}
        >
          {[0, 1].map((group) => (
            <div key={group} className="flex items-center">
              {items1.map((text, i) => (
                <span key={`${group}-${i}`} className="flex items-center text-[4rem] md:text-[7rem] font-sans font-bold text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.2)] mx-6 md:mx-12 uppercase tracking-tighter">
                  {text === '•' ? <Zap className="w-10 h-10 md:w-16 md:h-16 text-white/20 mx-2" /> : text}
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* Track 2 - Solid, moving left-to-right */}
        <div
          className="marquee-track flex whitespace-nowrap mix-blend-screen w-max"
          style={{ animationDirection: 'reverse', animationDuration: '45s' }}
        >
          {[0, 1].map((group) => (
            <div key={group} className="flex items-center">
              {items2.map((text, i) => (
                <span key={`${group}-${i}`} className={`flex items-center text-[4.5rem] md:text-[8rem] font-sans font-bold mx-6 md:mx-12 uppercase tracking-tighter ${text === '•' ? '' : 'text-white'}`}>
                  {text === '•' ? <Zap className="w-12 h-12 md:w-20 md:h-20 text-white/80 mx-2" /> : text}
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* Track 3 - Outline Fast moving right-to-left */}
        <div
          className="marquee-track flex whitespace-nowrap opacity-40 mix-blend-screen w-max"
          style={{ animationDuration: '28s' }}
        >
          {[0, 1].map((group) => (
            <div key={group} className="flex items-center">
              {items1.map((text, i) => (
                <span key={`${group}-${i}`} className="flex items-center text-[4rem] md:text-[7rem] font-sans font-bold text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.2)] mx-6 md:mx-12 uppercase tracking-tighter">
                  {text === '•' ? <Zap className="w-10 h-10 md:w-16 md:h-16 text-white/20 mx-2" /> : text}
                </span>
              ))}
            </div>
          ))}
        </div>

      </div>

      {/* Center CTA Button Overlay */}
      <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <a
            href="#pricing"
            className="group relative inline-flex items-center justify-center px-10 py-4 font-sans font-medium text-sm text-black transition-all bg-white rounded-full hover:bg-neutral-200 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Zap className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
              START BUILDING
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
