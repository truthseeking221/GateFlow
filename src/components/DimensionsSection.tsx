import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { Layout, GitPullRequest, Eye } from 'lucide-react';

const columns = [
  {
    title: 'Reliability',
    desc: 'Multi-region redundancy and automatic retries on failure. We absorb downtime so your end-users never notice a thing.',
    icon: <Layout className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />,
  },
  {
    title: 'Performance',
    desc: 'Built on Rust and distributed globally. Sub-millisecond routing overhead guaranteed for every single request.',
    icon: <GitPullRequest className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />,
  },
  {
    title: 'Simplicity',
    desc: 'One API Key. One endpoint. We abstract away the entire complexity of managing multiple LLM providers and billing.',
    icon: <Eye className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />,
  },
];

export default function DimensionsSection() {
  const sectionRef = useRevealOnScroll<HTMLElement>();

  return (
    <section ref={sectionRef} className="max-w-7xl mx-auto pt-24 px-6 pb-24 relative bg-black font-sans border-b border-white/10">
      <div className="mb-16 flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/[0.02] border border-white/[0.08] rounded-full mb-6 relative font-sans text-[11px] text-[#4ade80] uppercase tracking-widest font-medium">
          <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full" />
          Core Principles
        </div>
        <h2 className="text-4xl md:text-5xl font-sans font-bold text-white tracking-tighter mb-4">
          Built for Developers.
        </h2>
        <p className="text-lg text-white/50 font-sans max-w-2xl mx-auto font-medium">
          We designed our infrastructure around absolute reliability, uncompromised performance, and elegant simplicity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {columns.map((col, i) => (
          <div
            key={col.title}
            className={`bg-black p-8 md:p-12 border-t border-white/10 flex flex-col items-start group hover:bg-neutral-900/30 transition-colors ${i !== 0 ? 'md:border-l' : ''}`}
          >
            <div className="mb-6 rounded-lg bg-white/[0.02] border border-white/10 w-12 h-12 flex items-center justify-center group-hover:border-white/30 transition-colors">
              {col.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{col.title}</h3>
            <p className="text-sm text-white/50 leading-relaxed font-medium">{col.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
