import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { useGridWebGL } from '../hooks/useGridWebGL';
import { Check } from 'lucide-react';

const tiers = [
  {
    name: 'Explorer',
    price: '$0',
    period: '/mo',
    desc: 'Perfect for local testing and personal projects.',
    features: ['100k requests/mo', '5 frontier models', 'Community discord', 'Basic latency analytics'],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Builder',
    price: '$25',
    period: '/mo',
    desc: 'For growing teams managing production workloads.',
    features: ['5M requests/mo', '100+ active models', 'Priority email support', 'Advanced usage analytics', 'Team access controls', 'Custom rate limiting'],
    cta: 'Get Started',
    popular: true,
  },
  {
    name: 'Scale',
    price: 'Custom',
    period: '',
    desc: 'Dedicated enterprise SLA and volume discounts.',
    features: ['Unlimited requests', 'All models + Fine-tuned', 'Dedicated slack channel', 'SSO & Role-based access', 'Custom SLA (99.99%)', 'On-premise deployment'],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function PricingSection() {
  const sectionRef = useRevealOnScroll<HTMLElement>();
  const canvasRef = useGridWebGL();

  return (
    <section id="pricing" ref={sectionRef} className="max-w-7xl mx-auto pt-24 px-6 pb-24 relative bg-black font-sans border-b border-white/10 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-20 z-0 mix-blend-screen" />

      <div className="mb-16 flex flex-col items-center justify-center text-center pb-12 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/[0.02] border border-white/[0.08] rounded-full mb-6 relative font-sans text-[11px] text-[#4ade80] uppercase tracking-widest font-medium">
          <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full" />
          Pricing
        </div>
        <h2 className="text-4xl md:text-5xl font-sans font-bold text-white tracking-tighter mb-4">
          Pay for Usage.
        </h2>
        <p className="text-lg text-white/50 font-sans max-w-2xl mx-auto font-medium">
          Zero markup on model costs. Clear, predictable billing designed for global scale.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative z-10 border-t border-l border-white/10">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className="p-8 md:p-10 flex flex-col group relative bg-black border-b border-r border-white/10 transition-colors hover:bg-neutral-900/30"
          >
            <div className="relative z-10 flex flex-col h-full items-start">
              <div className="flex items-center justify-between w-full mb-4">
                <span className="text-base font-semibold text-white tracking-tight">
                  {tier.name}
                </span>
                {tier.popular && (
                  <span className="px-2 py-0.5 rounded-full bg-[#4ade80]/10 border border-[#4ade80]/20 text-[10px] font-medium text-[#4ade80] uppercase tracking-widest">
                    Recommended
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold tracking-tighter text-white">
                  {tier.price}
                </span>
                {tier.period && (
                  <span className="text-sm font-medium text-white/40">
                    {tier.period}
                  </span>
                )}
              </div>

              <p className="mb-8 text-white/50 text-sm font-medium leading-relaxed">
                {tier.desc}
              </p>

              <ul className="space-y-4 mb-10 flex-1 relative z-10 w-full">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <Check className={`w-4 h-4 flex-shrink-0 ${tier.popular ? 'text-[#4ade80]' : 'text-white/30'}`} strokeWidth={2.5} />
                    <span className="text-sm font-medium text-white/70">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-md text-sm font-medium transition-colors ${tier.popular
                  ? 'bg-white text-black hover:bg-neutral-200'
                  : 'bg-white/[0.02] border border-white/10 text-white hover:bg-white/10'
                  }`}
              >
                {tier.cta}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
