import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

const navLinks = [
  { label: 'Platform', href: '#models' },
  { label: 'Security', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Docs', href: '#docs' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setOpen(false);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent border-b border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 w-full flex items-center justify-between">
        {/* Brand */}
        <a href="#" className="flex items-center gap-2">
          <span className="font-sans font-semibold text-white tracking-tight text-base">
            GateFlow
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-white/60 hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <a
            href="#pricing"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80 group"
          >
            Get Started
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>

          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden text-white/60 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-black border-b border-white/10 pb-4 flex flex-col items-center">
          <div className="flex flex-col w-full px-6 pt-4 space-y-4">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
              >
                {l.label}
              </a>
            ))}
            <div className="h-px bg-white/10 w-full my-2" />
            <a
              href="#pricing"
              onClick={() => setOpen(false)}
              className="py-3 px-4 text-sm font-medium text-white hover:bg-white/5 w-full transition-colors flex items-center justify-between group"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
