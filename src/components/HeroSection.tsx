import { Shield, Zap, Activity, GitCommit, Network, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useHeroWebGL } from '../hooks/useHeroWebGL';

export default function HeroSection() {
  const canvasRef = useHeroWebGL();

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center px-6 pt-32 pb-12 bg-black overflow-hidden font-sans border-b border-white/10">

      {/* WebGL Background Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-80 z-0 mix-blend-screen" />

      {/* Background radial gradient to give it a subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white opacity-[0.03] rounded-full blur-[120px] pointer-events-none z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16 max-w-7xl mx-auto w-full z-10 relative">

        {/* Text / Lead */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left relative z-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/[0.02] border border-white/[0.08] rounded-full mb-8 relative font-sans text-[11px] text-[#4ade80] uppercase tracking-widest font-medium group transition-all duration-300 hover:bg-white/[0.04] hover:border-[#4ade80]/30"
          >
            <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full animate-pulse" />
            GateFlow Architecture
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-sans font-bold text-white leading-tight tracking-tighter mb-6 relative"
          >
            Unified API.<br />
            <span className="text-white/40">Infinite Models.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/50 max-w-[500px] leading-relaxed mb-10 font-medium"
          >
            Connect to Opus 4.6, ChatGPT 5.4, and Gemini 3.1 through a single gateway. Built for massive scale and absolute security.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4 justify-center lg:justify-start font-medium text-sm w-full"
          >
            <button className="flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-neutral-200 transition-colors rounded-md group">
              Start Building <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href="#docs"
              className="flex items-center gap-2 px-6 py-3 text-white/70 hover:text-white transition-colors bg-white/[0.02] border border-white/[0.08] hover:border-white/20 rounded-md"
            >
              Read Documentation
            </a>
          </motion.div>
        </div>

        {/* Minimal Info-Graphic right side */}
        <div className="relative flex justify-center items-center h-[500px] w-full mt-10 lg:mt-0 font-mono text-[11px]">
          <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center">

            {/* Concentric rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              {[1, 2, 3].map((ring) => (
                <motion.div
                  key={ring}
                  className="absolute rounded-full border border-white/[0.04]"
                  style={{ width: `${ring * 110 + 100}px`, height: `${ring * 110 + 100}px` }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.5, delay: ring * 0.2 }}
                />
              ))}

              {/* Ping animation ring */}
              <motion.div
                className="absolute rounded-full border border-[#4ade80]/20"
                style={{ width: `100px`, height: `100px` }}
                animate={{
                  scale: [1, 3.5],
                  opacity: [0.8, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
            </div>

            {/* Faint connecting lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 400 400">
              {[
                { x: 200, y: 35 },
                { x: 365, y: 200 },
                { x: 200, y: 365 },
                { x: 35, y: 200 },
              ].map((p, i) => (
                <g key={i}>
                  <line x1="200" y1="200" x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 4" />

                  {/* Data packet flowing TO gateway */}
                  <motion.circle
                    r="2"
                    fill="#4ade80"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      cx: [p.x, 200],
                      cy: [p.y, 200]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.7,
                      ease: "easeOut"
                    }}
                  />

                  {/* Data packet flowing FROM gateway */}
                  <motion.circle
                    r="2"
                    fill="rgba(255,255,255,0.8)"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      cx: [200, p.x],
                      cy: [200, p.y]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.7 + 1,
                      ease: "easeOut"
                    }}
                  />
                </g>
              ))}
            </svg>

            {/* Central Node */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10 w-28 h-28 bg-[#030303] border border-white/20 rounded-[20px] flex flex-col items-center justify-center gap-3 shadow-[0_0_40px_rgba(74,222,128,0.06)] group cursor-pointer"
            >
              <Network className="w-8 h-8 text-white group-hover:text-[#4ade80] transition-colors duration-300" strokeWidth="1.5" />
              <span className="text-[#4ade80] tracking-widest text-[10px] uppercase font-bold group-hover:drop-shadow-[0_0_8px_rgba(74,222,128,0.5)] transition-all">GATEWAY</span>
            </motion.div>

            {/* Satellites */}
            {[
              { icon: Zap, label: 'OPENAI', pos: 'top-0 left-1/2 -translate-x-1/2 -translate-y-2' },
              { icon: Activity, label: 'ANTHROPIC', pos: 'right-0 top-1/2 translate-x-3 -translate-y-1/2' },
              { icon: GitCommit, label: 'GOOGLE', pos: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-2' },
              { icon: Shield, label: 'META', pos: 'left-0 top-1/2 -translate-x-3 -translate-y-1/2' },
            ].map((node, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.1, ease: "easeOut" }}
                className={`absolute ${node.pos} z-10 flex`}
              >
                <motion.div
                  whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.3)" }}
                  className="bg-[#050505] border border-white/10 p-2.5 pr-4 rounded-xl flex items-center gap-3 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.5)] group"
                >
                  <div className="w-9 h-9 rounded-lg bg-white/[0.03] flex items-center justify-center border border-white/[0.05] group-hover:bg-white/[0.06] transition-colors">
                    <node.icon className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" strokeWidth="1.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white/80 font-semibold tracking-wide text-xs mb-0.5">{node.label}</span>
                    <span className="text-white/30 text-[9px] font-mono tracking-widest">ACTIVE</span>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
