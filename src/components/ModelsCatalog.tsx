import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { Sparkles, Zap } from 'lucide-react';

const frontierModels = [
  { name: 'GPT-4o', provider: 'OpenAI', badge: '128K CTX' },
  { name: 'Claude 3.5 Sonnet', provider: 'Anthropic', badge: '200K CTX' },
  { name: 'Gemini 1.5 Pro', provider: 'Google', badge: '1M CTX' },
  { name: 'Llama 3.1 405B', provider: 'Meta', badge: 'OPEN WEIGHT' },
];

const speedModels = [
  { name: 'GPT-4o Mini', provider: 'OpenAI', latency: '~200MS' },
  { name: 'Claude 3.5 Haiku', provider: 'Anthropic', latency: '~150MS' },
  { name: 'Gemini 1.5 Flash', provider: 'Google', latency: '~120MS' },
  { name: 'Llama 3.1 8B', provider: 'Meta', latency: '~80MS' },
];

export default function ModelsCatalog() {
  const sectionRef = useRevealOnScroll<HTMLElement>();

  return (
    <section id="models" ref={sectionRef} className="max-w-7xl mx-auto pt-24 px-6 pb-24 relative bg-black font-sans border-b border-white/10">
      <div className="mb-16 flex flex-col items-start border-b border-white/10 pb-12 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/[0.02] border border-white/[0.08] rounded-full mb-6 relative font-sans text-[11px] text-[#4ade80] uppercase tracking-widest font-medium">
          <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full" />
          Ecosystem
        </div>
        <h2 className="text-4xl md:text-6xl font-sans font-bold text-white tracking-tighter mb-4">
          All Models. One API.
        </h2>
        <p className="text-lg text-white/50 font-sans max-w-2xl font-medium">
          Stop manually integrating new models. We do it for you, instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 relative z-10 border-t border-l border-white/10">

        {/* Frontier Models - Left Side */}
        <div className="w-full bg-black p-8 md:p-12 border-b border-r border-white/10 flex flex-col items-start group transition-colors hover:bg-neutral-900/30">
          <div className="w-10 h-10 mb-6 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors">
            <Sparkles className="w-5 h-5 text-white/50 group-hover:text-white" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight mb-2">Flagship Models</h3>
          <p className="text-sm font-medium text-white/50 mb-8 leading-relaxed">
            Unmatched reasoning, coding, and context size. Maximize output quality.
          </p>

          <div className="w-full flex flex-col border border-white/10 rounded-md bg-white/[0.01]">
            {frontierModels.map((m, i) => (
              <div
                key={m.name}
                className={`p-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.04] transition-colors ${i !== frontierModels.length - 1 ? 'border-b border-white/10' : ''}`}
              >
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-semibold text-white/80">{m.name}</p>
                  <p className="text-xs text-white/40">{m.provider}</p>
                </div>
                <span className="text-[10px] font-medium text-white/60 bg-white/5 px-2 py-1 rounded-sm border border-white/10">
                  {m.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Speed Models - Right Side */}
        <div className="w-full bg-black p-8 md:p-12 border-b border-r border-white/10 flex flex-col items-start group transition-colors hover:bg-neutral-900/30">
          <div className="w-10 h-10 mb-6 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors">
            <Zap className="w-5 h-5 text-white/50 group-hover:text-white" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight mb-2">Speed Models</h3>
          <p className="text-sm font-medium text-white/50 mb-8 leading-relaxed">
            Low-latency and cost-efficient for consumer-facing features.
          </p>

          <div className="w-full flex flex-col border border-white/10 rounded-md bg-white/[0.01]">
            {speedModels.map((m, i) => (
              <div
                key={m.name}
                className={`p-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.04] transition-colors ${i !== speedModels.length - 1 ? 'border-b border-white/10' : ''}`}
              >
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-semibold text-white/80">{m.name}</p>
                  <p className="text-xs text-white/40">{m.provider}</p>
                </div>
                <span className="text-[10px] font-medium text-[#4ade80] bg-[#4ade80]/10 px-2 py-1 rounded-sm border border-[#4ade80]/20">
                  {m.latency}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
