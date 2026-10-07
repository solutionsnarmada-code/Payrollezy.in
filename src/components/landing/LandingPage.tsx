import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { Features } from './Features';
import { InteractiveDemo } from './InteractiveDemo';
import { ComplianceSection } from './ComplianceSection';
import { PricingSection } from './PricingSection';
import { FaqSection } from './FaqSection';
import { Footer } from './Footer';
import { LegalModal } from './LegalModal';
import { PlanId } from '../../types';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'signup', planId?: PlanId) => void;
  onTryQuickDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, onTryQuickDemo }) => {
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | 'compliance' | null>(null);

  const handleSeeDemo = () => {
    const el = document.getElementById('see-demo');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar
        onLogin={() => onOpenAuth('login')}
        onGetStarted={() => onOpenAuth('signup')}
        onSeeDemo={handleSeeDemo}
      />

      <main className="flex-1">
        <Hero
          onGetStarted={() => onOpenAuth('signup')}
          onSeeDemo={handleSeeDemo}
          onTryQuickDemo={onTryQuickDemo}
        />

        <Features />

        <InteractiveDemo onGetStarted={() => onOpenAuth('signup')} />

        <ComplianceSection />

        <PricingSection onSelectPlan={(planId) => onOpenAuth('signup', planId)} />

        <FaqSection />

        {/* Final CTA Strip */}
        <section className="py-16 bg-blue-700 text-white text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Ready to simplify your Indian payroll?
            </h2>
            <p className="mt-3 text-blue-100 text-sm max-w-xl mx-auto">
              Join startups and enterprises running compliant, transparent payroll with zero friction.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onOpenAuth('signup')}
                className="w-full sm:w-auto px-6 py-3 bg-white text-blue-900 hover:bg-slate-100 font-bold text-sm rounded-xl transition-colors shadow-lg cursor-pointer"
              >
                Get Started with payrollezy.in
              </button>
              <button
                onClick={onTryQuickDemo}
                className="w-full sm:w-auto px-6 py-3 bg-blue-900/60 hover:bg-blue-900 text-blue-100 font-semibold text-sm rounded-xl transition-colors border border-blue-500/60 cursor-pointer"
              >
                Explore Live Demo Org
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer
        onOpenLegal={(type) => setLegalModalType(type)}
        onSeeDemo={handleSeeDemo}
      />

      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
};
