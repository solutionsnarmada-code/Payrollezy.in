import React, { useState } from 'react';
import { Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onLogin: () => void;
  onGetStarted: () => void;
  onSeeDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLogin, onGetStarted, onSeeDemo }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="flex items-baseline">
              <span className="text-xl font-black text-slate-900 tracking-tight">payrollezy<span className="text-blue-600">.in</span></span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <button onClick={() => scrollTo('features')} className="hover:text-blue-600 transition-colors">
              Product
            </button>
            <button onClick={() => scrollTo('see-demo')} className="hover:text-blue-600 transition-colors">
              How It Works
            </button>
            <button onClick={() => scrollTo('pricing')} className="hover:text-blue-600 transition-colors">
              Pricing
            </button>
            <button onClick={onSeeDemo} className="hover:text-blue-600 text-blue-600 font-bold transition-colors">
              See Demo
            </button>
            <button onClick={() => scrollTo('compliance')} className="hover:text-blue-600 transition-colors">
              Compliance
            </button>
            <button onClick={() => scrollTo('faq')} className="hover:text-blue-600 transition-colors">
              FAQ
            </button>
          </div>

          {/* CTA Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onLogin}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={onGetStarted}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              Get Started
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <button
            onClick={() => scrollTo('features')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-blue-600"
          >
            Product
          </button>
          <button
            onClick={() => scrollTo('see-demo')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-blue-600"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollTo('pricing')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-blue-600"
          >
            Pricing
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); onSeeDemo(); }}
            className="block w-full text-left py-2 text-sm font-bold text-blue-600"
          >
            See Demo
          </button>
          <button
            onClick={() => scrollTo('compliance')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-blue-600"
          >
            Compliance
          </button>
          <button
            onClick={() => scrollTo('faq')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-blue-600"
          >
            FAQ
          </button>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onLogin(); }}
              className="w-full py-2.5 text-center text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg"
            >
              Sign In
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onGetStarted(); }}
              className="w-full py-2.5 text-center text-xs font-bold text-white bg-blue-600 rounded-lg"
            >
              Get Started Free
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
