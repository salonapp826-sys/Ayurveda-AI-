import React, { useState } from 'react';
import { User, ReferralHistoryItem } from '../types';
import confetti from 'canvas-confetti';
import {
  Users,
  Gift,
  Share2,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  Send,
  MessageCircle,
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Plus
} from 'lucide-react';

interface InviteFriendsSectionProps {
  currentUser: User | null;
  onUpdateUserPoints?: (pointsToAdd: number, reason: string) => void;
  referralHistory?: ReferralHistoryItem[];
  onAddReferral?: (item: ReferralHistoryItem) => void;
  onNavigateToBookings?: () => void;
}

export const InviteFriendsSection: React.FC<InviteFriendsSectionProps> = ({
  currentUser,
  onUpdateUserPoints,
  referralHistory = [],
  onAddReferral,
  onNavigateToBookings,
}) => {
  // Generate default referral code based on user name
  const defaultCode = currentUser?.referralCode || (
    currentUser?.name 
      ? currentUser.name.split(' ')[0].toUpperCase() + '500'
      : 'NEXORA500'
  );

  const [referralCode, setReferralCode] = useState<string>(defaultCode);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);
  const [customCodeInput, setCustomCodeInput] = useState<string>(defaultCode);
  
  // Interactive friend signup test/simulator
  const [testFriendName, setTestFriendName] = useState<string>('Pooja Mehta');
  const [testFriendPhone, setTestFriendPhone] = useState<string>('+91 98204 12345');
  const [simulationSuccess, setSimulationSuccess] = useState<string | null>(null);

  // Initial referral history sample if none provided
  const [localReferrals, setLocalReferrals] = useState<ReferralHistoryItem[]>(() => {
    const saved = localStorage.getItem('nexora_referral_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [
      {
        id: 'ref-01',
        friendName: 'Ananya Patel',
        friendPhoneOrEmail: '+91 98192 44321',
        date: '12 Oct 2026',
        bonusPointsAwarded: 500,
        status: 'Completed',
      },
      {
        id: 'ref-02',
        friendName: 'Priya Nair',
        friendPhoneOrEmail: '+91 97690 88124',
        date: '28 Sep 2026',
        bonusPointsAwarded: 500,
        status: 'Completed',
      }
    ];
  });

  const totalBonusPointsEarned = localReferrals.reduce((sum, r) => sum + r.bonusPointsAwarded, 0);

  const inviteUrl = `https://nexorasalon.com/signup?ref=${referralCode}`;

  const shareText = `Hi! I get my hair and beauty treatments done at Nexora Salon & Spa. Use my invite code *${referralCode}* when you sign up to get 500 bonus loyalty points (flat ₹500 discount on your first appointment)! Book here: ${inviteUrl}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2200);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const handleGenerateNewCode = () => {
    const prefixes = ['NEXORA', 'GLOW', 'LUXE', 'BEAUTY', 'VIP'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNum = Math.floor(100 + Math.random() * 900);
    const newCode = `${randomPrefix}${randomNum}`;
    setReferralCode(newCode);
    setCustomCodeInput(newCode);
    localStorage.setItem('nexora_user_referral_code', newCode);
  };

  const handleSaveCustomCode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customCodeInput.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (clean.length >= 4) {
      setReferralCode(clean);
      setIsCustomizing(false);
      localStorage.setItem('nexora_user_referral_code', clean);
    }
  };

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(shareText);
    const url = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, '_blank');
  };

  // Live simulation: simulate a new friend signing up with this referral code
  const handleSimulateFriendSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testFriendName) return;

    const newRef: ReferralHistoryItem = {
      id: 'ref-' + Date.now(),
      friendName: testFriendName,
      friendPhoneOrEmail: testFriendPhone || '+91 98xxx xxxxx',
      date: 'Today, Just now',
      bonusPointsAwarded: 500,
      status: 'Completed',
    };

    const updated = [newRef, ...localReferrals];
    setLocalReferrals(updated);
    localStorage.setItem('nexora_referral_history', JSON.stringify(updated));

    if (onAddReferral) {
      onAddReferral(newRef);
    }

    if (onUpdateUserPoints) {
      onUpdateUserPoints(500, `Referral bonus: ${testFriendName} joined using code ${referralCode}`);
    }

    setSimulationSuccess(
      `Great news! ${testFriendName} just signed up using your code ${referralCode}. 500 bonus loyalty points have been added to your balance!`
    );

    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8e004b', '#d4af37', '#ffd700', '#22c55e'],
      });
    } catch (err) {
      // ignore
    }

    // Reset test input for next simulation
    setTestFriendName('');
    setTestFriendPhone('');
    setTimeout(() => setSimulationSuccess(null), 8000);
  };

  return (
    <div className="space-y-6 animate-fade-in text-[#1c1b1b]">
      
      {/* Hero Invitation Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#8e004b] via-[#650033] to-[#450022] rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-[#a8145e]/30">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none blur-2xl" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-56 h-56 rounded-full bg-[#d4af37]/10 pointer-events-none blur-xl" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#d4af37]/25 border border-[#d4af37]/40 text-[#ffd700] text-xs font-semibold uppercase tracking-wider">
              <Gift className="w-3.5 h-3.5" />
              <span>Give ₹500 • Get ₹500</span>
            </div>
            
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Invite Friends, Earn 500 Bonus Points
            </h2>
            
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
              Share your love for Nexora Salon! When your friend signs up using your personal code, <strong className="text-white">they get 500 bonus points</strong> and <strong className="text-[#ffd700]">you also get 500 bonus points</strong> (worth ₹500 off on any haircut, spa, or styling service).
            </p>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 min-w-[220px] text-center flex-shrink-0 self-stretch sm:self-auto flex flex-col justify-center">
            <div className="text-[11px] font-bold uppercase tracking-wider text-white/70">
              Total Referral Earnings
            </div>
            <div className="text-3xl font-serif-display font-bold text-[#ffd700] mt-1 flex items-center justify-center gap-1">
              <span>+{totalBonusPointsEarned}</span>
              <span className="text-xs uppercase font-sans text-white/80 font-normal">PTS</span>
            </div>
            <div className="text-xs text-white/90 mt-1 font-medium">
              = ₹{totalBonusPointsEarned.toLocaleString('en-IN')} in salon discounts
            </div>
            <div className="text-[11px] text-white/70 mt-2 pt-2 border-t border-white/15">
              {localReferrals.length} friends joined so far
            </div>
          </div>
        </div>
      </div>

      {/* Main Referral Code Card */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h3 className="font-serif-display text-xl font-bold text-[#1c1b1b] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#8e004b]" />
            <span>Your Personal Referral Code</span>
          </h3>
          <p className="text-xs text-[#594047] mt-1">
            Share this unique code or your personal invite link with your friends on WhatsApp or social media.
          </p>
        </div>

        {/* Code Box & Actions */}
        <div className="bg-[#fdf8f8] p-5 rounded-2xl border-2 border-dashed border-[#8e004b]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-xl bg-[#FDE7F3] flex items-center justify-center text-[#8e004b] flex-shrink-0 shadow-inner">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-[#594047] tracking-wider">
                Your Shareable Code
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-bold tracking-widest text-[#8e004b]">
                {referralCode}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleCopyCode}
              className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white border border-[#E8E8E8] hover:border-[#8e004b] text-[#1c1b1b] text-xs font-semibold shadow-xs hover:bg-[#FDE7F3]/30 transition-all cursor-pointer"
            >
              {copiedCode ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#8e004b]" />
                  <span>Copy Code</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white border border-[#E8E8E8] hover:border-[#8e004b] text-[#1c1b1b] text-xs font-semibold shadow-xs hover:bg-[#FDE7F3]/30 transition-all cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-[#8e004b]" />
                  <span>Copy Invite Link</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Share on WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Custom Code Generator Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 text-xs text-[#594047] border-t border-[#E8E8E8]">
          <div className="flex items-center space-x-2">
            <span>Want a customized or easy-to-remember code?</span>
            <button
              type="button"
              onClick={() => setIsCustomizing(!isCustomizing)}
              className="text-[#8e004b] font-bold hover:underline cursor-pointer"
            >
              {isCustomizing ? 'Cancel' : 'Edit My Code'}
            </button>
          </div>

          <button
            type="button"
            onClick={handleGenerateNewCode}
            className="inline-flex items-center space-x-1.5 text-xs font-medium text-[#594047] hover:text-[#8e004b] cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate Random Code</span>
          </button>
        </div>

        {/* Custom Code Form */}
        {isCustomizing && (
          <form onSubmit={handleSaveCustomCode} className="bg-[#F0EDEC] p-4 rounded-xl space-y-3 animate-fade-in">
            <label className="block text-xs font-bold text-[#1c1b1b]">
              Enter Your Preferred Referral Code (4 to 12 characters, letters & numbers only):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customCodeInput}
                onChange={(e) => setCustomCodeInput(e.target.value.toUpperCase())}
                placeholder="e.g. RIYASTYLE500"
                maxLength={12}
                className="flex-1 px-3 py-2 bg-white rounded-lg border border-[#E8E8E8] text-xs font-mono font-bold uppercase tracking-wider focus:outline-none focus:border-[#8e004b]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#8e004b] hover:bg-[#b90064] text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Save Code
              </button>
            </div>
          </form>
        )}
      </div>

      {/* How it works in 3 Simple Steps */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h3 className="font-serif-display text-xl font-bold text-[#1c1b1b]">
            How the Referral Bonus Works
          </h3>
          <p className="text-xs text-[#594047] mt-1">
            Simple, honest rewards without complicated terms. Both of you win on day one!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#fdf8f8] p-5 rounded-2xl border border-[#ffcbd9]/40 relative">
            <div className="w-8 h-8 rounded-full bg-[#8e004b] text-white text-xs font-bold flex items-center justify-center mb-3">
              1
            </div>
            <h4 className="font-bold text-sm text-[#1c1b1b] mb-1">
              Send Your Code
            </h4>
            <p className="text-xs text-[#594047] leading-relaxed">
              Send your personal referral code <strong className="text-[#8e004b] font-mono">{referralCode}</strong> to your friends, family, or colleagues on WhatsApp or message.
            </p>
          </div>

          <div className="bg-[#fdf8f8] p-5 rounded-2xl border border-[#ffcbd9]/40 relative">
            <div className="w-8 h-8 rounded-full bg-[#8e004b] text-white text-xs font-bold flex items-center justify-center mb-3">
              2
            </div>
            <h4 className="font-bold text-sm text-[#1c1b1b] mb-1">
              Friend Gets 500 Bonus Points
            </h4>
            <p className="text-xs text-[#594047] leading-relaxed">
              When your friend registers and enters your code, they immediately receive <strong>500 bonus loyalty points</strong> on top of their welcome gift.
            </p>
          </div>

          <div className="bg-[#fdf8f8] p-5 rounded-2xl border border-[#ffcbd9]/40 relative">
            <div className="w-8 h-8 rounded-full bg-[#8e004b] text-white text-xs font-bold flex items-center justify-center mb-3">
              3
            </div>
            <h4 className="font-bold text-sm text-[#1c1b1b] mb-1">
              You Receive 500 Points Instantly
            </h4>
            <p className="text-xs text-[#594047] leading-relaxed">
              The moment their account is created, <strong>500 bonus loyalty points</strong> (worth ₹500 off) are added to your wallet for your next hair or spa visit.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Simulation / Test Widget */}
      <div className="bg-gradient-to-r from-[#FDE7F3]/60 to-[#FFF4E5]/60 rounded-2xl border border-[#ffcbd9] p-6 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-[#8e004b]">
          <Sparkles className="w-5 h-5 text-[#d4af37]" />
          <h4 className="font-bold text-sm uppercase tracking-wider">
            Test the Invite & Signup Flow (Live Demo)
          </h4>
        </div>
        <p className="text-xs text-[#594047]">
          Want to see how it works in real-time? Simulate a friend signing up with your referral code <span className="font-mono font-bold text-[#8e004b]">{referralCode}</span>. This will immediately credit 500 loyalty points to your account balance!
        </p>

        <form onSubmit={handleSimulateFriendSignup} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            placeholder="Friend's Name (e.g. Pooja Mehta)"
            value={testFriendName}
            onChange={(e) => setTestFriendName(e.target.value)}
            className="flex-1 px-3.5 py-2.5 bg-white rounded-xl border border-[#E8E8E8] text-xs text-[#1c1b1b] focus:outline-none focus:border-[#8e004b]"
          />
          <input
            type="text"
            placeholder="Friend's Mobile (Optional)"
            value={testFriendPhone}
            onChange={(e) => setTestFriendPhone(e.target.value)}
            className="w-full sm:w-48 px-3.5 py-2.5 bg-white rounded-xl border border-[#E8E8E8] text-xs text-[#1c1b1b] focus:outline-none focus:border-[#8e004b]"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#8e004b] hover:bg-[#b90064] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Simulate Friend Signup (+500 Pts)</span>
          </button>
        </form>

        {simulationSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-fade-in font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{simulationSuccess}</span>
          </div>
        )}
      </div>

      {/* Referral History Table */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif-display text-lg font-bold text-[#1c1b1b] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#8e004b]" />
              <span>Friends Who Joined Using Your Code ({localReferrals.length})</span>
            </h3>
            <p className="text-xs text-[#594047] mt-0.5">
              500 bonus points are automatically credited for each successful sign up.
            </p>
          </div>
          
          <div className="text-right">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              +{totalBonusPointsEarned} Points Credited
            </span>
          </div>
        </div>

        {localReferrals.length === 0 ? (
          <div className="text-center py-8 bg-[#fdf8f8] rounded-xl border border-dashed border-[#E8E8E8]">
            <Heart className="w-8 h-8 text-[#8e004b]/40 mx-auto mb-2" />
            <p className="text-xs text-[#594047]">No friends have joined yet. Share your code above on WhatsApp to get started!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#E8E8E8] text-[#594047] uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3 font-semibold">Friend's Name</th>
                  <th className="py-2.5 px-3 font-semibold">Mobile / Contact</th>
                  <th className="py-2.5 px-3 font-semibold">Joined Date</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Points Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E8]">
                {localReferrals.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FDE7F3]/20 transition-colors">
                    <td className="py-3 px-3 font-semibold text-[#1c1b1b] flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#8e004b] text-white flex items-center justify-center font-bold text-[11px]">
                        {item.friendName.charAt(0)}
                      </div>
                      <span>{item.friendName}</span>
                    </td>
                    <td className="py-3 px-3 text-[#594047] font-mono">{item.friendPhoneOrEmail}</td>
                    <td className="py-3 px-3 text-[#594047]">{item.date}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <Check className="w-3 h-3" />
                        <span>Credited to Wallet</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-700 font-mono text-sm">
                      +{item.bonusPointsAwarded} PTS
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
