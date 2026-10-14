import React, { useState } from 'react';
import { NEXORA_ASSETS, SANCTUARIES } from '../data/mockData';
import { Check } from 'lucide-react';

interface FooterProps {
  onOpenAuth?: (tab?: 'login' | 'signup') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAuth }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#1c1b1b] text-white pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-stone-800">
          
          {/* Col 1: Brand & Details */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white p-1 flex items-center justify-center">
                <img src={NEXORA_ASSETS.logo} alt="Nexora Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-serif-display text-2xl tracking-[0.1em] font-bold text-white block">
                  NEXORA
                </span>
                <span className="text-[9px] uppercase tracking-[0.22em] text-[#ffcbd9] block font-medium">
                  Salon जा रहे हो? NEXORA किया क्या?
                </span>
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Bringing together pure Ayurvedic herbal care, precision haircuts, private AC styling rooms, and 100% original beauty products across India.
            </p>
            <div className="text-xs text-stone-400 pt-2 space-y-1">
              <div><strong>Salon Customer Helpline:</strong> +91 (022) 8492-8800</div>
              <div><strong>Customer Support Email:</strong> care@nexorabeauty.in</div>
            </div>
          </div>

          {/* Col 2: Salon Branches */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs uppercase tracking-[0.2em] text-[#ffcbd9] font-bold block">
              Our Salon Branches
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-300">
              {SANCTUARIES.map((s) => (
                <div key={s.id} className="space-y-0.5">
                  <span className="font-bold text-white block">{s.name} ({s.city})</span>
                  <span className="text-stone-400 block text-[11px]">{s.address}</span>
                  <span className="text-[10px] text-[#ffcbd9] block">{s.openHours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Col 3: Newsletter */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-xs uppercase tracking-[0.2em] text-[#ffcbd9] font-bold block">
              Get Special Offers & Deals
            </span>
            <p className="text-xs text-stone-400">
              Subscribe to get exclusive festival discount codes, bridal packages, and new product launch deals.
            </p>
            {subscribed ? (
              <div className="p-3 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Thank you! You are subscribed to Nexora deals.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email ID"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-stone-900 border border-stone-700 rounded-lg text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#8e004b]"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#8e004b] hover:bg-[#b90064] text-white text-xs uppercase tracking-wider font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Subscribe for Deals
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-4">
          <div>
            © {new Date().getFullYear()} Nexora Beauty Collective Private Limited. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center space-x-6">
            <span className="hover:text-stone-400 cursor-pointer">Salon Timings & Rules</span>
            <span className="hover:text-stone-400 cursor-pointer">100% Herbal Products</span>
            {onOpenAuth && (
              <>
                <button 
                  type="button" 
                  onClick={() => onOpenAuth('login')} 
                  className="hover:text-[#ffcbd9] text-stone-300 font-semibold cursor-pointer underline underline-offset-2"
                >
                  Member Login
                </button>
                <button 
                  type="button" 
                  onClick={() => onOpenAuth('signup')} 
                  className="hover:text-[#ffcbd9] text-stone-300 font-semibold cursor-pointer underline underline-offset-2"
                >
                  Create Account
                </button>
              </>
            )}
            <span className="hover:text-stone-400 cursor-pointer">Privacy Policy</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
