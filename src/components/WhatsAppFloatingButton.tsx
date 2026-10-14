import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

interface WhatsAppFloatingButtonProps {
  phoneNumber?: string;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({
  phoneNumber = '+91 98201 45890'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'hinglish' | 'english'>('hinglish');
  const [customQuery, setCustomQuery] = useState('');

  const quickMessages = {
    hinglish: [
      "Namaste Nexora! Mujhe kal ke liye salon haircut aur head massage appointment book karni hai.",
      "Hello, mujhe bridal glow facial packages ke rates aur timings pata karne hai.",
      "Kya aapke Bandra / Delhi salon branch me aaj walk-in slots available hai?"
    ],
    english: [
      "Hi Nexora Salon! I would like to book an appointment for tomorrow.",
      "Could you please share details and price for the 24K Gold Bridal Glow facial?",
      "Are there open styling slots available today at the salon?"
    ]
  };

  const handleSendToWhatsApp = (messageText: string) => {
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(messageText);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encoded}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Popover Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#E8E8E8] overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-[#25D366] text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">Nexora WhatsApp Support</h4>
                <span className="text-[11px] text-white/90">Direct Salon Helpline • {phoneNumber}</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-white cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 bg-[#FCF9F8]">
            <div className="text-xs text-[#594047] leading-relaxed">
              Salon ja rahe ho? Direct WhatsApp par baat kijiye aur apna appointment 2 minute me confirm karein!
            </div>

            {/* Language Selection */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedLanguage('hinglish')}
                className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                  selectedLanguage === 'hinglish'
                    ? 'bg-[#8e004b] text-white'
                    : 'bg-[#F0EDEC] text-[#594047] hover:bg-[#ece7e7]'
                }`}
              >
                Hindi / Hinglish
              </button>
              <button
                type="button"
                onClick={() => setSelectedLanguage('english')}
                className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                  selectedLanguage === 'english'
                    ? 'bg-[#8e004b] text-white'
                    : 'bg-[#F0EDEC] text-[#594047] hover:bg-[#ece7e7]'
                }`}
              >
                Simple English
              </button>
            </div>

            {/* Quick Prompts */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#594047]">
                Choose a quick message:
              </span>
              {quickMessages[selectedLanguage].map((msg, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendToWhatsApp(msg)}
                  className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-[#FDE7F3]/40 border border-[#E8E8E8] text-xs text-[#1c1b1b] hover:text-[#8e004b] hover:border-[#ffcbd9] transition-all cursor-pointer flex items-center justify-between group"
                >
                  <span className="line-clamp-2 pr-2">{msg}</span>
                  <Send className="w-3.5 h-3.5 text-[#25D366] opacity-70 group-hover:opacity-100 flex-shrink-0" />
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="pt-2 border-t border-[#E8E8E8]">
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  placeholder="Apna sawaal likhiye (e.g. Price for haircut)..."
                  className="flex-1 p-2 bg-white border border-[#E8E8E8] rounded-lg text-xs text-[#1c1b1b] focus:outline-none focus:border-[#25D366]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customQuery.trim()) {
                      handleSendToWhatsApp(customQuery);
                      setCustomQuery('');
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customQuery.trim()) {
                      handleSendToWhatsApp(customQuery);
                      setCustomQuery('');
                    }
                  }}
                  className="p-2 bg-[#25D366] hover:bg-[#1faa53] text-white rounded-lg cursor-pointer transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer ring-4 ring-[#25D366]/20"
        aria-label="WhatsApp Us"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="text-xs font-bold uppercase tracking-wider">WhatsApp Us</span>
      </button>
    </div>
  );
};
