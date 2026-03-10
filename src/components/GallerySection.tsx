import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { Activity, Code } from 'lucide-react';

export default function GallerySection() {
  const sectionRef = useRevealOnScroll<HTMLElement>();

  return (
    <section ref={sectionRef} className="bg-black border-b border-white/10 font-sans">
      <div className="max-w-7xl mx-auto pt-24 px-6 pb-24 relative">
        {/* Header */}
        <div className="mb-16 flex flex-col items-center border-b border-white/10 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/[0.02] border border-white/[0.08] rounded-full mb-6 relative font-sans text-[11px] text-[#4ade80] uppercase tracking-widest font-medium">
            <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full" />
            Dashboard
          </div>
          <h2 className="text-4xl md:text-5xl font-sans font-bold text-white tracking-tighter mb-4">
            Total Visibility.
          </h2>
          <p className="text-lg text-white/50 font-sans max-w-2xl font-medium">
            Monitor traffic, latency, and costs in real-time with our comprehensive dashboard.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-t border-l border-white/10 relative z-10">

          <div className="bg-black p-8 md:p-12 flex flex-col group transition-colors border-b border-r border-white/10 hover:bg-neutral-900/30">
            <div className="flex items-center gap-3 mb-8">
              <Activity className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
              <span className="font-semibold text-white tracking-tight">Traffic Analytics</span>
            </div>
            <div className="flex-1 bg-black rounded-xl border border-white/10 p-6 flex flex-col justify-end min-h-[250px] relative overflow-hidden group-hover:border-white/20 transition-colors">
              <div className="flex items-end gap-1 w-full h-32 relative z-10">
                {[40, 60, 45, 80, 50, 90, 65, 100, 70, 85].map((h, i) => (
                  <div key={i} className={`flex-1 ${h > 75 ? 'bg-[#4ade80]' : 'bg-white/10 group-hover:bg-white/20'} transition-colors duration-300 rounded-t-sm`} style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-20 pointer-events-none" />
            </div>
          </div>

          <div className="bg-black p-8 md:p-12 flex flex-col group transition-colors border-b border-r border-white/10 hover:bg-neutral-900/30">
            <div className="flex items-center gap-3 mb-8">
              <Code className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
              <span className="font-semibold text-white tracking-tight">Developer Console</span>
            </div>
            <div className="flex-1 bg-black rounded-xl border border-white/10 p-6 min-h-[250px] group-hover:border-white/20 transition-colors shadow-2xl overflow-hidden flex flex-col">
              <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/80 border border-white/10" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-white/10" />
                <div className="w-3 h-3 rounded-full bg-green-500/80 border border-white/10" />
              </div>
              <div className="font-mono text-sm leading-relaxed flex-1 w-full text-white/80">
                <p><span className="text-[#4ade80]">$</span> gateflow config:env <span className="text-white/40">--prod</span></p>
                <p className="mt-4 text-white/30">[info] verifying authentication...</p>
                <p className="text-white/30">[info] linking 142 active providers...</p>
                <p className="mt-2 text-[#4ade80] font-medium">[success] environment ready.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
