import { Shield, Zap, Activity, GitCommit, Network, ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center px-6 pt-32 pb-12 bg-black overflow-hidden font-sans border-b border-white/10">

      {/* Background radial gradient to give it a subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white opacity-[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16 max-w-7xl mx-auto w-full z-10 relative">

        {/* Text / Lead */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left relative z-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/[0.02] border border-white/[0.08] rounded-full mb-8 relative font-sans text-[11px] text-[#4ade80] uppercase tracking-widest font-medium group transition-all duration-300 hover:bg-white/[0.04] hover:border-[#4ade80]/30">
            <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full" />
            GATEFLOW ARCHITECTURE
          </div>

          <h1 className="text-5xl md:text-7xl font-sans font-bold text-white leading-tight tracking-tighter mb-6 relative">
            Unified API.<br />
            <span className="text-white/40">Infinite Models.</span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 max-w-[500px] leading-relaxed mb-10 font-medium">
            Connect to Opus 4.6, ChatGPT 5.4, and Gemini 3.1 through a single gateway. Built for massive scale and absolute security.
          </p>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start font-medium text-sm w-full">
            <button className="flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-neutral-200 transition-colors rounded-md group">
              Start Building <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href="#docs"
              className="flex items-center gap-2 px-6 py-3 text-white/70 hover:text-white transition-colors bg-white/[0.02] border border-white/[0.08] hover:border-white/20 rounded-md"
            >
              Read Documentation
            </a>
          </div>
        </div>

        {/* Minimal Info-Graphic right side */}
        <div className="relative flex justify-center items-center h-[500px] w-full mt-10 lg:mt-0 font-mono text-[11px]">
          <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center">

            {/* Faint connecting lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 400 400">
              {[
                { x: 200, y: 40 },
                { x: 360, y: 200 },
                { x: 200, y: 360 },
                { x: 40, y: 200 },
              ].map((p, i) => (
                <line key={i} x1="200" y1="200" x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 4" />
              ))}
            </svg>

            {/* Central Node */}
            <div className="relative z-10 w-24 h-24 bg-black border border-white/20 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <Network className="w-8 h-8 text-white" strokeWidth="1.5" />
              <span className="text-[#4ade80] tracking-widest uppercase font-medium">GATEWAY</span>
            </div>

            {/* Satellites */}
            {[
              { icon: Zap, label: 'OPENAI', pos: 'top-0 left-1/2 -translate-x-1/2 -translate-y-4' },
              { icon: Activity, label: 'ANTHROPIC', pos: 'right-0 top-1/2 translate-x-4 -translate-y-1/2' },
              { icon: GitCommit, label: 'GOOGLE', pos: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-4' },
              { icon: Shield, label: 'META', pos: 'left-0 top-1/2 -translate-x-4 -translate-y-1/2' },
            ].map((node, i) => (
              <div key={i} className={`absolute ${node.pos} bg-black border border-white/10 p-3 rounded-xl flex items-center gap-3 z-10 transition-colors hover:border-white/30`}>
                <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center border border-white/[0.05]">
                  <node.icon className="w-4 h-4 text-white/70" strokeWidth="1.5" />
                </div>
                <div className="flex flex-col pr-2">
                  <span className="text-white/80 font-medium tracking-wide">{node.label}</span>
                  <span className="text-white/30 text-[9px]">ACTIVE</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
