import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { useParticlesWebGL } from '../hooks/useParticlesWebGL';
import { Route, Globe, ShieldCheck, CreditCard } from 'lucide-react';

export default function FeaturesGrid() {
  const sectionRef = useRevealOnScroll<HTMLElement>();
  const canvasRef = useParticlesWebGL();

  const features = [
    {
      id: 'routing',
      title: 'Smart Routing',
      desc: 'Auto-route to the fastest provider. Bypass rate limits with automatic load balancing.',
      icon: <Route className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />,
      visual: (
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-end gap-1 h-12 w-32">
            {[30, 50, 80, 100, 60, 40].map((h, i) => (
              <div key={i} className={`w-full bg-white/10 group-hover:bg-white/30 transition-colors duration-300 rounded-t-sm`} style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="text-[10px] font-sans text-white/40 uppercase tracking-[0.2em] font-medium mt-4 group-hover:text-white/70 transition-colors">TRAFFIC FLOW</div>
        </div>
      )
    },
    {
      id: 'privacy',
      title: 'Zero Logs',
      desc: 'Your data is yours. End-to-end encryption. No prompt storage. Never touches our disks.',
      icon: <ShieldCheck className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />,
      visual: (
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center gap-3 w-48">
            <ShieldCheck className="w-5 h-5 text-white/20 group-hover:text-white/60 transition-colors" />
            <div className="h-px flex-1 bg-white/10 border-t border-dashed border-white/5 relative">
              <div className="absolute inset-0 h-full bg-white/40 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
          <div className="text-[10px] font-sans text-white/40 uppercase tracking-[0.2em] font-medium mt-4 group-hover:text-white/70 transition-colors">ENCRYPTED TUNNEL</div>
        </div>
      )
    },
    {
      id: 'billing',
      title: 'One Invoice',
      desc: 'Stop juggling credit cards. Get one monthly bill for all 100+ AI providers.',
      icon: <CreditCard className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />,
      visual: (
        <div className="mt-8 pt-6 border-t border-white/10 space-y-3 font-mono">
          <div className="flex items-center justify-between max-w-[200px]">
            <span className="text-[11px] font-medium text-white/50">OPENAI</span>
            <span className="text-[11px] font-medium text-white/50 group-hover:text-white transition-colors">$42.00</span>
          </div>
          <div className="flex items-center justify-between max-w-[200px]">
            <span className="text-[11px] font-medium text-white/50">ANTHROPIC</span>
            <span className="text-[11px] font-medium text-white/50 group-hover:text-white transition-colors">$82.50</span>
          </div>
        </div>
      )
    },
    {
      id: 'network',
      title: 'Global Edge',
      desc: '50+ edge nodes globally. Process requests closest to your users for ultra-fast responses.',
      icon: <Globe className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />,
      visual: (
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-baseline gap-2 mb-3 font-mono">
            <span className="text-3xl font-bold text-white tracking-tighter group-hover:text-white/80 transition-colors">12</span>
            <span className="text-[10px] font-medium text-white/40 uppercase tracking-[0.2em]">MS DELAY</span>
          </div>
          <div className="h-1 w-full max-w-[200px] bg-white/5 relative overflow-hidden rounded-full">
            <div className="absolute inset-y-0 left-0 bg-white/30 w-[15%] group-hover:w-[85%] transition-all duration-700 ease-out" />
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="features" ref={sectionRef} className="max-w-7xl mx-auto pt-24 px-6 pb-24 relative bg-black font-sans border-b border-white/10 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0 mix-blend-screen" />

      <div className="mb-16 flex flex-col items-start border-b border-white/10 pb-12 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/[0.02] border border-white/[0.08] rounded-full mb-6 relative font-sans text-[11px] text-[#4ade80] uppercase tracking-widest font-medium">
          <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full" />
          Capabilities
        </div>
        <h2 className="text-4xl md:text-6xl font-sans font-bold text-white tracking-tighter mb-4">
          Scale instantly.
        </h2>
        <p className="text-lg text-white/50 font-sans max-w-2xl font-medium">
          Manage AI traffic in production without limits or downtime.
        </p>
      </div>

      {/* Zero Trust Bento Grid: no bg hover, only borders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-l border-white/10">
        {features.map((feature) => (
          <div key={feature.id} className="relative w-full group bg-black p-10 flex flex-col justify-between border-b border-r border-white/10 transition-colors">
            <div className="h-full">
              <div className="mb-8 w-12 h-12 bg-white/[0.02] flex items-center justify-center border border-white/10 group-hover:border-white/30 transition-colors rounded-lg">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-white/50 font-sans text-sm font-medium leading-relaxed max-w-sm">{feature.desc}</p>
            </div>
            <div className="mt-auto">
              {feature.visual}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
