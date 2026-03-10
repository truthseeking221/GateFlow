import { useState } from 'react';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { useLinesWebGL } from '../hooks/useLinesWebGL';

const snippets = {
  node: {
    label: 'Node.js',
    code: `import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.gateflow.io/v1",
  apiKey:  process.env.GATEFLOW_API_KEY,
});

const res = await client.chat.completions.create({
  model: "gpt-4o",          // or claude-3.5-sonnet, gemini-1.5-pro
  messages: [{ role: "user", content: "Hello!" }],
});

console.log(res.choices[0].message.content);`,
  },
  python: {
    label: 'Python',
    code: `from openai import OpenAI

client = OpenAI(
    base_url="https://api.gateflow.io/v1",
    api_key=os.environ["GATEFLOW_API_KEY"],
)

res = client.chat.completions.create(
    model="claude-3.5-sonnet",   # or gpt-4o, gemini-1.5-pro
    messages=[{"role": "user", "content": "Hello!"}],
)

print(res.choices[0].message.content)`,
  },
  curl: {
    label: 'cURL',
    code: `curl https://api.gateflow.io/v1/chat/completions \\
  -H "Authorization: Bearer $GATEFLOW_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gemini-1.5-pro",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'`,
  },
} as const;

type Lang = keyof typeof snippets;

export default function CodePreview() {
  const [lang, setLang] = useState<Lang>('node');
  const sectionRef = useRevealOnScroll<HTMLElement>();
  const canvasRef = useLinesWebGL();

  return (
    <section id="docs" ref={sectionRef} className="max-w-7xl mx-auto px-6 pb-24 pt-24 relative bg-black font-sans border-b border-white/10 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-50 z-0 mix-blend-screen" />

      <div className="flex flex-col items-center text-center mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/[0.02] border border-white/[0.08] rounded-full mb-6 relative font-sans text-[11px] text-[#4ade80] uppercase tracking-widest font-medium">
          <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full" />
          Integration
        </div>
        <h2 className="text-4xl md:text-5xl font-sans font-bold text-white tracking-tighter mb-4">
          One Line of Code.
          <br /><span className="text-white/40">Every Model.</span>
        </h2>
        <p className="text-lg text-white/50 font-sans max-w-2xl mx-auto font-medium">
          Change the <code className="text-white bg-white/10 px-1 py-0.5 rounded text-sm font-mono mx-1">baseURL</code> — done. 100% compatible with the OpenAI SDK.
        </p>
      </div>

      <div className="max-w-4xl mx-auto relative z-10 w-full">
        <div className="bg-black border border-white/10 rounded-xl overflow-hidden shadow-2xl relative">

          {/* Faux terminal header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80 border border-white/10" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-white/10" />
              <div className="w-3 h-3 rounded-full bg-green-500/80 border border-white/10" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4">
            {/* Sidebar Language tabs */}
            <div className="flex flex-row md:flex-col border-b md:border-b-0 md:border-r border-white/10 bg-black">
              {(Object.keys(snippets) as Lang[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setLang(key)}
                  className={`px-6 py-4 text-[13px] font-sans font-medium transition-colors text-left border-b-2 md:border-b-0 md:border-l-2 ${lang === key
                    ? 'text-white border-[#4ade80] bg-white/[0.04]'
                    : 'text-white/50 hover:text-white border-transparent hover:bg-white/[0.02]'
                    }`}
                >
                  {snippets[key].label}
                </button>
              ))}
            </div>

            {/* Code block */}
            <div className="col-span-1 md:col-span-3 p-6 sm:p-8 bg-black overflow-x-auto h-[350px]">
              <div className="font-mono text-[14px] leading-relaxed w-full">
                <pre className="whitespace-pre-wrap">
                  <code className="text-white/80">{snippets[lang].code}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
