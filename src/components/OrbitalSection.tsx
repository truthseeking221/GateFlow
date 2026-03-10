import { ShieldCheck, Zap, Database, Globe } from 'lucide-react';

const coreComponents = [
  { icon: ShieldCheck, title: 'Secure Core', desc: 'Bank-grade security and isolated execution.' },
  { icon: Zap, title: 'Auto Bypass', desc: 'Seamless, instant failovers without downtime.' },
  { icon: Database, title: 'Unified Data', desc: 'A single, reliable source of truth for all records.' },
  { icon: Globe, title: 'Global Edge', desc: 'Deployed across 50+ regions for sub-ms latency.' },
];

export default function OrbitalSection() {
  return (
    <section className="min-h-[500px] flex flex-col pt-24 pb-24 relative bg-black border-y border-white/10 font-sans overflow-hidden">
      <div className="text-center max-w-3xl mx-auto px-6 mb-16 flex flex-col items-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/[0.02] border border-white/[0.08] rounded-full mb-6 relative font-sans text-[11px] text-[#4ade80] uppercase tracking-widest font-medium">
          <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full" />
          Architecture
        </div>
        <h2 className="text-4xl md:text-5xl font-sans font-bold text-white tracking-tighter mb-4">
          360° System Reliability.
        </h2>
        <p className="text-lg text-white/50 font-sans font-medium">
          Designed for absolute fault tolerance. Your applications stay online even when individual providers face complete outages.
        </p>
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-white/10 relative z-10">
        {coreComponents.map((card) => (
          <div key={card.title} className="bg-black p-10 flex flex-col items-start border-b border-r border-white/10 text-left group transition-colors hover:bg-neutral-900/30">
            <div className="w-10 h-10 bg-white/[0.02] border border-white/10 flex items-center justify-center group-hover:border-white/30 rounded-lg mb-6 transition-colors">
              <card.icon className="w-5 h-5 text-white/50 group-hover:text-white" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight mb-2">{card.title}</h3>
            <p className="text-sm font-medium text-white/50 leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
