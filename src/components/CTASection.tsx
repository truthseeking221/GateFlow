import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="flex flex-col text-center min-h-[50vh] px-6 relative items-center justify-center pt-32 pb-32 bg-black font-sans border-b border-white/10 overflow-hidden">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/[0.02] border border-white/[0.08] rounded-full mb-6 relative font-sans text-[11px] text-[#4ade80] uppercase tracking-widest font-medium z-10">
        <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full" />
        Final Step
      </div>
      <h2 className="text-5xl md:text-7xl font-sans font-bold text-white tracking-tighter mb-8 relative z-10">
        Ship Faster.
      </h2>
      <p className="text-xl text-white/50 mb-12 max-w-lg mx-auto relative z-10 font-sans font-medium">
        Join 10,000+ developers shipping AI apps with GateFlow. Free forever for individuals.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 w-full sm:w-auto">
        <button className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-semibold text-sm rounded-md transition-all hover:bg-neutral-200 border border-transparent flex items-center justify-center gap-2 group">
          Get Started
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
        <a
          href="#docs"
          className="w-full sm:w-auto px-8 py-3.5 font-semibold text-sm text-white border border-white/20 hover:bg-white/[0.05] rounded-md transition-colors flex items-center justify-center"
        >
          Read Docs
        </a>
      </div>
    </section>
  );
}
