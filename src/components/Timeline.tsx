import { useEffect, useRef } from 'react';
import { useGridWebGL } from '../hooks/useGridWebGL';

const phases = [
  { num: '01', title: 'Connect Endpoint', desc: 'Change your baseURL to point to the GateFlow API. Zero other code changes needed. Drop-in compatible.' },
  { num: '02', title: 'Intelligent Routing', desc: 'We automatically route your incoming queries to the fastest, cheapest, or highest-quality model instance.' },
  { num: '03', title: 'Infinite Scale', desc: 'Handle millions of requests. With automatic failover between 100+ providers, you will never hit a rate limit.' },
];

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useGridWebGL();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const steps = Array.from(section.querySelectorAll('.tl-step'));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (entry.target === section) {
            section.classList.add('is-inview');
            return;
          }
          const el = entry.target as HTMLElement;
          const idx = steps.indexOf(el);
          el.style.transitionDelay = `${Math.min(idx * 100, 300)}ms`;
          el.classList.add('is-inview');
          io.unobserve(el);
        });
      },
      { threshold: 0.1 }
    );

    io.observe(section);
    steps.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="liquid-timeline"
      className="overflow-hidden pt-24 pb-24 relative bg-black font-sans border-b border-white/10"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-30 z-0 mix-blend-screen" />

      <style>{`
        #liquid-timeline .tl-title,
        #liquid-timeline .tl-step {
          opacity: 0; transform: translateY(10px);
          transition: opacity 600ms ease, transform 600ms ease;
          will-change: opacity, transform;
        }
        #liquid-timeline.is-inview .tl-title { opacity: 1; transform: translateY(0); }
        #liquid-timeline .tl-step.is-inview { opacity: 1; transform: translateY(0); }
      `}</style>

      {/* Title */}
      <div className="max-w-7xl mx-auto px-6 relative z-20 text-center mb-16 tl-title flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/[0.02] border border-white/[0.08] rounded-full mb-6 relative font-sans text-[11px] text-[#4ade80] uppercase tracking-widest font-medium">
          <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full" />
          Deployment
        </div>
        <h2 className="text-4xl md:text-5xl font-sans font-bold text-white tracking-tighter mb-4">
          Live in seconds.
        </h2>
        <p className="text-lg text-white/50 font-sans max-w-2xl mx-auto font-medium">
          No complicated SDKs. Just swap your endpoint and we handle the rest.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-0">
        {phases.map((p, i) => (
          <div key={p.num} className="tl-step group relative w-full h-full">
            <div className={`bg-black border-t border-white/10 p-8 md:p-12 h-full flex flex-col items-start font-sans ${i !== 0 ? 'md:border-l' : ''}`}>
              <div className="text-[10px] uppercase font-bold text-white/40 tracking-[0.2em] mb-6">Step {p.num}</div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{p.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed font-medium">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
