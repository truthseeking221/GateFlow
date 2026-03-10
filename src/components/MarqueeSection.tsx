import { Zap } from 'lucide-react';

export default function MarqueeSection() {
  const items1 = ['GATEFLOW ENGINE', '•', 'UNIFIED AI GATEWAY', '•', 'ZERO LATENCY', '•', '100+ MODELS', '•'];
  const items2 = ['UNLIMITED SCALE', '•', 'SMART ROUTING', '•', 'ENTERPRISE READY', '•', 'GLOBAL EDGE', '•'];

  return (
    <section className="py-24 md:py-32 relative bg-[#050505] overflow-hidden font-sans border-y border-gray-800 flex flex-col justify-center">

      {/* Center glowing ambient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[800px] md:h-[600px] bg-cyan-500/20 rounded-[100%] blur-[120px] opacity-60 z-0 pointer-events-none" />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0 mix-blend-screen opacity-50 mask-radial-fade" />

      <div className="relative z-10 flex flex-col gap-6 md:gap-10 -rotate-3 scale-[1.05] md:scale-110">

        {/* Track 1 - Outline Fast moving right-to-left */}
        <div
          className="marquee-track flex whitespace-nowrap opacity-40 mix-blend-screen w-max"
          style={{ animationDuration: '35s' }}
        >
          {[0, 1].map((group) => (
            <div key={group} className="flex items-center">
              {items1.map((text, i) => (
                <span key={`${group}-${i}`} className="flex items-center text-[4rem] md:text-[7rem] font-black text-transparent [-webkit-text-stroke:2px_#444] mx-6 md:mx-12 uppercase tracking-tighter">
                  {text === '•' ? <Zap className="w-10 h-10 md:w-16 md:h-16 text-gray-700 mx-2" /> : text}
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* Track 2 - Solid, Glowing moving left-to-right */}
        <div
          className="marquee-track flex whitespace-nowrap mix-blend-screen w-max"
          style={{ animationDirection: 'reverse', animationDuration: '45s' }}
        >
          {[0, 1].map((group) => (
            <div key={group} className="flex items-center">
              {items2.map((text, i) => (
                <span key={`${group}-${i}`} className={`flex items-center text-[4.5rem] md:text-[8rem] font-black mx-6 md:mx-12 uppercase tracking-tighter ${text === '•' ? '' : 'text-cyan-500 drop-shadow-[0_0_40px_rgba(6,182,212,0.5)]'}`}>
                  {text === '•' ? <Zap className="w-12 h-12 md:w-20 md:h-20 text-cyan-400 mx-2" /> : text}
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
                <span key={`${group}-${i}`} className="flex items-center text-[4rem] md:text-[7rem] font-black text-transparent [-webkit-text-stroke:2px_#444] mx-6 md:mx-12 uppercase tracking-tighter">
                  {text === '•' ? <Zap className="w-10 h-10 md:w-16 md:h-16 text-gray-700 mx-2" /> : text}
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
            className="group relative inline-flex items-center justify-center px-10 py-5 font-mono font-bold text-[14px] text-white tracking-widest uppercase transition-all overflow-hidden bg-black/40 backdrop-blur-md border border-white/10 hover:border-cyan-500/50 shadow-[0_0_40px_rgba(0,0,0,0.8)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />

            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-500 opacity-50 group-hover:opacity-100 group-hover:w-4 group-hover:h-4 transition-all" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-500 opacity-50 group-hover:opacity-100 group-hover:w-4 group-hover:h-4 transition-all" />

            <span className="relative z-10 flex items-center gap-3">
              <Zap className="w-5 h-5 text-cyan-500 group-hover:animate-pulse" />
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
