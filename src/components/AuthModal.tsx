import React, { useState } from 'react';
import { Booking, LoyaltyDiscountCoupon, User } from '../types';
import { LoyaltyPointsSection } from './LoyaltyPointsSection';
import { InviteFriendsSection } from './InviteFriendsSection';
import confetti from 'canvas-confetti';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User as UserIcon, 
  X, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Gift,
  Coins,
  Settings,
  Phone,
  Coffee,
  Flower2,
  Users
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onLoginSuccess: (user: User) => void;
  onLogout: () => void;
  initialTab?: 'login' | 'signup';
  bookings?: Booking[];
  redeemedCoupons?: LoyaltyDiscountCoupon[];
  onRedeemPoints?: (pointsCost: number, discountINR: number, discountUSD: number, title: string) => void;
  onApplyCouponToBooking?: (coupon: LoyaltyDiscountCoupon) => void;
  currency?: 'INR' | 'USD';
  onUpdateUserPoints?: (pointsToAdd: number, reason: string) => void;
}

const EDITORIAL_BG = "https://lh3.googleusercontent.com/aida-public/AB6AXuBmmsTYgO4KkZDlWKkIpb7-l5WlI0bLSPtBUI2sEuZT1bd3VAYVNlMd1y_qaxonyUXcnACW4n15ZzZ97nl1EoYpxnKCrAIChus7vWybNtE47Cwpfv0Oy2nDvCLYfdvq8YsMjKzuDf5ObjTKe14yirCPPWJAnP3tQp9TVXnpnT7nZChBMaSexcs1rt_bJht787Bf4aFIo9nLVvr06bZ3WIG55zdOeb_xwO9DQ83Y9oonHT4M1aaRQGBqKQ";
const NEXORA_AUTH_LOGO = "https://lh3.googleusercontent.com/aida-public/AB6AXuBspP0nXJYdVtS2bVRXCkeRIGRU0bp-6vwHoKjPSs2NCQ5mceJgB0102o-z9cNvYdFsej-XaXNerRZvXPgaDzg8tNkkjwFk8HYCaOtT_BCZK01Bmol7nkHKmuhB5gj5mFWNhwY9qWZ_qM-MzfAZGl42rb1JfT_rns8_3NdOP2pu3bGPAAYixTAqRK18yhK6YXO77UTNsNzQ_64wjXtJw6ZOQEuFuLeWgNJhr7Q1rquZnZNeIijd0TrEIQducc64LzDXkZQ";

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
  initialTab = 'login',
  bookings = [],
  redeemedCoupons = [],
  onRedeemPoints,
  onApplyCouponToBooking,
  currency = 'INR',
  onUpdateUserPoints,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);
  const [profileTab, setProfileTab] = useState<'loyalty' | 'invite' | 'details'>('loyalty');
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('riya.sharma@example.com');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Signup Form State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupMobile, setSignupMobile] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupReferralCode, setSignupReferralCode] = useState('');

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [forgotModal, setForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Profile preferences state
  const [prefDrink, setPrefDrink] = useState('Kashmiri Saffron Kahwa');
  const [prefFragrance, setPrefFragrance] = useState('Madurai Jasmine & Kannauj Rose');
  const [prefSavedMessage, setPrefSavedMessage] = useState(false);

  if (!isOpen) return null;

  const handleQuickDemoLogin = () => {
    const demoUser: User = {
      id: 'usr-riya-01',
      name: 'Riya Sharma',
      email: 'riya.sharma@example.com',
      phone: '+91 98201 45890',
      membershipTier: 'Suvarna Circle',
      loyaltyPoints: 1250,
    };
    onLoginSuccess(demoUser);
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#8e004b', '#d4af37', '#ffd700'],
      });
    } catch (e) {
      // ignore
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedbackMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      const authenticatedUser: User = {
        id: 'usr-' + Date.now(),
        name: loginEmail.includes('riya') ? 'Riya Sharma' : (loginEmail.split('@')[0] || 'Valued Member'),
        email: loginEmail,
        phone: '+91 98201 45890',
        membershipTier: 'Suvarna Circle',
        loyaltyPoints: 1250,
      };

      onLoginSuccess(authenticatedUser);

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#8e004b', '#d4af37', '#ffd700'],
        });
      } catch (err) {
        // ignore
      }
    }, 600);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail) return;

    setIsLoading(true);
    setFeedbackMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      const hasReferral = Boolean(signupReferralCode && signupReferralCode.trim().length >= 4);
      const pointsAwarded = hasReferral ? 1000 : 500; // 500 welcome + 500 referral bonus!
      const userRefCode = signupName.split(' ')[0].toUpperCase() + Math.floor(100 + Math.random() * 900);

      const newUser: User = {
        id: 'usr-' + Date.now(),
        name: signupName,
        email: signupEmail,
        phone: signupMobile ? `+91 ${signupMobile}` : '+91 98201 45890',
        membershipTier: 'Nexora Circle',
        loyaltyPoints: pointsAwarded,
        referralCode: userRefCode,
        referralCount: 0,
        referralBonusPoints: 0,
      };

      onLoginSuccess(newUser);

      // If user joined with a referral code, credit the referrer 500 bonus points!
      if (hasReferral && onUpdateUserPoints) {
        onUpdateUserPoints(500, `${signupName} joined using code ${signupReferralCode}`);
      }

      try {
        confetti({
          particleCount: 95,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#8e004b', '#b90064', '#d4af37', '#ffd700'],
        });
      } catch (err) {
        // ignore
      }
    }, 700);
  };

  const handleSavePreferences = () => {
    setPrefSavedMessage(true);
    setTimeout(() => setPrefSavedMessage(false), 3000);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setForgotModal(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in" id="auth-modal-root">
      
      {/* Main Container */}
      <div className={`relative w-full ${currentUser ? 'max-w-4xl' : 'max-w-4xl'} bg-[#FCF9F8] rounded-2xl shadow-2xl border border-[#E8E8E8] overflow-hidden flex flex-col max-h-[92vh]`}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white/80 hover:bg-white text-[#594047] hover:text-[#8e004b] border border-[#E8E8E8] transition-colors shadow-xs cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* If user is already logged in, show User Profile View */}
        {currentUser ? (
          <div className="w-full flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
            
            {/* User Profile Header Card */}
            <div className="bg-white rounded-2xl border border-[#E8E8E8] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8e004b] to-[#b90064] text-white flex items-center justify-center font-serif-display text-2xl font-bold shadow-md flex-shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="font-serif-display text-2xl font-bold text-[#1c1b1b]">
                      {currentUser.name}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FDE7F3] text-[#8e004b] border border-[#ffcbd9] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#d4af37]" />
                      <span>{currentUser.membershipTier}</span>
                    </span>
                  </div>
                  <p className="text-xs text-[#594047] mt-0.5">
                    {currentUser.email} • {currentUser.phone || '+91 98201 45890'}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    setFeedbackMessage('You have been logged out.');
                  }}
                  className="px-3.5 py-2 border border-[#E8E8E8] hover:border-red-300 text-xs font-semibold text-[#594047] hover:text-red-700 rounded-lg transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-[#8e004b] hover:bg-[#b90064] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Profile Navigation Tabs */}
            <div className="flex items-center space-x-2 border-b border-[#E8E8E8] pb-1 overflow-x-auto">
              <button
                onClick={() => setProfileTab('loyalty')}
                className={`px-4 py-2.5 text-xs uppercase tracking-wider font-bold rounded-lg transition-all flex items-center space-x-2 cursor-pointer whitespace-nowrap ${
                  profileTab === 'loyalty'
                    ? 'bg-[#8e004b] text-white shadow-xs'
                    : 'bg-white text-[#594047] hover:bg-[#F0EDEC] border border-[#E8E8E8]'
                }`}
              >
                <Coins className="w-4 h-4 text-[#ffd700]" />
                <span>Loyalty Points & Rewards</span>
              </button>

              <button
                onClick={() => setProfileTab('invite')}
                className={`px-4 py-2.5 text-xs uppercase tracking-wider font-bold rounded-lg transition-all flex items-center space-x-2 cursor-pointer whitespace-nowrap ${
                  profileTab === 'invite'
                    ? 'bg-[#8e004b] text-white shadow-xs'
                    : 'bg-white text-[#594047] hover:bg-[#F0EDEC] border border-[#E8E8E8]'
                }`}
              >
                <Users className="w-4 h-4 text-[#ffd700]" />
                <span>Invite Friends</span>
                <span className="px-1.5 py-0.5 rounded-full bg-[#ffd700] text-[#1c1b1b] text-[9px] font-black uppercase tracking-tight">
                  +500 PTS
                </span>
              </button>

              <button
                onClick={() => setProfileTab('details')}
                className={`px-4 py-2.5 text-xs uppercase tracking-wider font-bold rounded-lg transition-all flex items-center space-x-2 cursor-pointer whitespace-nowrap ${
                  profileTab === 'details'
                    ? 'bg-[#8e004b] text-white shadow-xs'
                    : 'bg-white text-[#594047] hover:bg-[#F0EDEC] border border-[#E8E8E8]'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Salon Preferences & Profile</span>
              </button>
            </div>

            {/* TAB 1: Loyalty Points Section */}
            {profileTab === 'loyalty' && (
              <LoyaltyPointsSection
                currentUser={currentUser}
                bookings={bookings}
                redeemedCoupons={redeemedCoupons}
                onRedeemPoints={onRedeemPoints || (() => {})}
                onApplyCouponToBooking={onApplyCouponToBooking}
                currency={currency}
              />
            )}

            {/* TAB 2: Invite Friends Section */}
            {profileTab === 'invite' && (
              <InviteFriendsSection
                currentUser={currentUser}
                onUpdateUserPoints={onUpdateUserPoints}
                onNavigateToBookings={onClose}
              />
            )}

            {/* TAB 2: Personal Details & Salon Preferences */}
            {profileTab === 'details' && (
              <div className="bg-white rounded-2xl border border-[#E8E8E8] p-6 sm:p-8 space-y-6 animate-fade-in shadow-xs">
                <div>
                  <h3 className="font-serif-display text-xl font-bold text-[#1c1b1b]">
                    Your Salon Hospitality Preferences
                  </h3>
                  <p className="text-xs text-[#594047] mt-1">
                    Your preferences are automatically remembered by your stylist and private room team whenever you visit.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#8e004b] flex items-center gap-1.5 uppercase tracking-wider">
                      <Coffee className="w-3.5 h-3.5" />
                      <span>Preferred Welcome Drink</span>
                    </label>
                    <select
                      value={prefDrink}
                      onChange={(e) => setPrefDrink(e.target.value)}
                      className="w-full p-2.5 bg-[#F0EDEC] border border-[#E8E8E8] rounded-xl text-xs font-semibold text-[#1c1b1b]"
                    >
                      <option value="Kashmiri Saffron Kahwa">Kashmiri Saffron Kahwa (Warm)</option>
                      <option value="Chilled Madurai Jasmine & Rose Sharbat">Chilled Madurai Jasmine & Rose Sharbat</option>
                      <option value="Haldi Doodh (Turmeric Milk)">Haldi Doodh (Warm Turmeric Golden Milk)</option>
                      <option value="Darjeeling First Flush Green Tea">Darjeeling First Flush Green Tea</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#8e004b] flex items-center gap-1.5 uppercase tracking-wider">
                      <Flower2 className="w-3.5 h-3.5" />
                      <span>Private Room Fragrance</span>
                    </label>
                    <select
                      value={prefFragrance}
                      onChange={(e) => setPrefFragrance(e.target.value)}
                      className="w-full p-2.5 bg-[#F0EDEC] border border-[#E8E8E8] rounded-xl text-xs font-semibold text-[#1c1b1b]"
                    >
                      <option value="Madurai Jasmine & Kannauj Rose">Madurai Jasmine & Kannauj Rose</option>
                      <option value="Mysore Sandalwood & Camphor">Mysore Sandalwood & Camphor</option>
                      <option value="Fresh Himalayan Cedar & Vetiver">Fresh Himalayan Cedar & Vetiver (Khus)</option>
                    </select>
                  </div>
                </div>

                {prefSavedMessage && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Your salon preferences have been updated successfully!</span>
                  </div>
                )}

                <div className="pt-4 border-t border-[#E8E8E8] flex justify-end">
                  <button
                    onClick={handleSavePreferences}
                    className="px-6 py-2.5 bg-[#8e004b] hover:bg-[#b90064] text-white text-xs uppercase tracking-wider font-bold rounded-lg cursor-pointer"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="flex flex-col lg:flex-row w-full min-h-[620px]">
            {/* Left Column: Editorial Image */}
            <div className="hidden lg:block lg:w-1/2 relative bg-[#F0EDEC]">
              <div 
                className="absolute inset-0 bg-cover bg-center" 
                style={{ backgroundImage: `url(${EDITORIAL_BG})` }}
              />
              <div className="absolute inset-0 bg-[#313030]/30 mix-blend-multiply" />
              
              <div className="absolute bottom-8 left-8 right-8 p-6 bg-black/40 backdrop-blur-md rounded-xl border border-white/20 text-white">
                <div className="flex items-center space-x-2 text-[#ffd9e2] text-xs uppercase tracking-[0.16em] font-semibold mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#ffcbd9]" />
                  <span>Nexora Member Benefits</span>
                </div>
                <p className="text-xs text-white/90 leading-relaxed font-light">
                  Quick salon appointments, member-only deals, reward points, and dedicated customer support across Mumbai, Delhi, Bengaluru & Udaipur.
                </p>
              </div>
            </div>

            {/* Right Column: Authentication Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 relative">
              <div className="w-full max-w-md flex flex-col gap-6">
                
                {/* Header Brand */}
                <div className="flex flex-col gap-2 items-center text-center">
                  <img 
                    alt="Nexora Logo" 
                    className="mx-auto w-40 object-contain mb-1" 
                    src={NEXORA_AUTH_LOGO} 
                  />
                  <div>
                    <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#1c1b1b] leading-tight">
                      Salon जा रहे हो?<br />
                      <span className="text-[#8e004b] tracking-tight font-sans">NEXORA</span> किया क्या?
                    </h1>
                    <p className="text-xs sm:text-sm text-[#594047] mt-1 font-medium">
                      Beauty Products • Distributors • Deals
                    </p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-[#E8E8E8] w-full relative">
                  <button 
                    type="button"
                    onClick={() => { setActiveTab('login'); setFeedbackMessage(null); }}
                    className={`w-1/2 py-3 text-center text-sm font-semibold transition-colors cursor-pointer ${
                      activeTab === 'login'
                        ? 'text-[#8e004b] border-b-2 border-[#8e004b]'
                        : 'text-[#594047] hover:text-[#8e004b]'
                    }`}
                  >
                    Login
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setActiveTab('signup'); setFeedbackMessage(null); }}
                    className={`w-1/2 py-3 text-center text-sm font-semibold transition-colors cursor-pointer ${
                      activeTab === 'signup'
                        ? 'text-[#8e004b] border-b-2 border-[#8e004b]'
                        : 'text-[#594047] hover:text-[#8e004b]'
                    }`}
                  >
                    Sign Up / New Member
                  </button>
                </div>

                {/* Forms Container */}
                <div className="relative min-h-[340px]">
                  
                  {/* LOGIN FORM */}
                  {activeTab === 'login' && (
                    <form 
                      onSubmit={handleLoginSubmit}
                      className="flex flex-col gap-4 w-full animate-fade-in"
                    >
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-[#594047] px-1" htmlFor="login-email">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c7077]" />
                          <input 
                            id="login-email"
                            type="email"
                            required
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            placeholder="riya.sharma@example.com"
                            className="w-full bg-[#F0EDEC] py-3 pl-12 pr-4 text-[#1c1b1b] text-sm rounded-t-lg border-b-2 border-[#E8E8E8] focus:outline-none focus:border-[#8e004b] focus:bg-white focus:rounded-lg transition-all"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-[#594047] px-1" htmlFor="login-password">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c7077]" />
                          <input 
                            id="login-password"
                            type={showLoginPassword ? 'text' : 'password'}
                            required
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-[#F0EDEC] py-3 pl-12 pr-12 text-[#1c1b1b] text-sm rounded-t-lg border-b-2 border-[#E8E8E8] focus:outline-none focus:border-[#8e004b] focus:bg-white focus:rounded-lg transition-all"
                          />
                          <button 
                            type="button"
                            onClick={() => setShowLoginPassword(!showLoginPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8c7077] hover:text-[#8e004b] transition-colors cursor-pointer"
                          >
                            {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-end w-full">
                        <button 
                          type="button"
                          onClick={() => setForgotModal(true)}
                          className="text-xs font-semibold text-[#8e004b] hover:text-[#b90064] transition-colors cursor-pointer"
                        >
                          Forgot Password?
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleQuickDemoLogin}
                        className="w-full bg-[#FDE7F3] hover:bg-[#ffd9e2] text-[#8e004b] border border-[#ffcbd9] font-bold text-xs py-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                      >
                        <Coins className="w-4 h-4 text-[#d4af37]" />
                        <span>1-Click Demo Login as Riya Sharma (1,250 PTS)</span>
                      </button>

                      <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#8e004b] hover:bg-[#b90064] text-white font-semibold text-sm py-3.5 rounded-lg mt-1 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.98] cursor-pointer flex items-center justify-center space-x-2"
                      >
                        {isLoading ? (
                          <span>Signing In...</span>
                        ) : (
                          <>
                            <span>Login to Account</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      <p className="text-center text-xs text-[#594047] mt-2">
                        Don't have an account?{' '}
                        <button 
                          type="button" 
                          onClick={() => setActiveTab('signup')}
                          className="text-[#8e004b] font-semibold hover:underline cursor-pointer"
                        >
                          Create one now
                        </button>
                      </p>
                    </form>
                  )}

                  {/* SIGN UP FORM */}
                  {activeTab === 'signup' && (
                    <form 
                      onSubmit={handleSignupSubmit}
                      className="flex flex-col gap-3.5 w-full animate-fade-in"
                    >
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-[#594047] px-1" htmlFor="signup-name">
                          Full Name
                        </label>
                        <div className="relative">
                          <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c7077]" />
                          <input 
                            id="signup-name"
                            type="text"
                            required
                            value={signupName}
                            onChange={(e) => setSignupName(e.target.value)}
                            placeholder="Riya Sharma"
                            className="w-full bg-[#F0EDEC] py-2.5 pl-12 pr-4 text-[#1c1b1b] text-sm rounded-t-lg border-b-2 border-[#E8E8E8] focus:outline-none focus:border-[#8e004b] focus:bg-white focus:rounded-lg transition-all"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-[#594047] px-1" htmlFor="signup-email">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c7077]" />
                          <input 
                            id="signup-email"
                            type="email"
                            required
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            placeholder="riya.sharma@example.com"
                            className="w-full bg-[#F0EDEC] py-2.5 pl-12 pr-4 text-[#1c1b1b] text-sm rounded-t-lg border-b-2 border-[#E8E8E8] focus:outline-none focus:border-[#8e004b] focus:bg-white focus:rounded-lg transition-all"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-[#594047] px-1" htmlFor="signup-mobile">
                          Mobile Number
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#594047] text-sm font-medium">
                            +91
                          </span>
                          <input 
                            id="signup-mobile"
                            type="tel"
                            value={signupMobile}
                            onChange={(e) => setSignupMobile(e.target.value)}
                            placeholder="98765 43210"
                            className="w-full bg-[#F0EDEC] py-2.5 pl-14 pr-4 text-[#1c1b1b] text-sm tracking-wide rounded-t-lg border-b-2 border-[#E8E8E8] focus:outline-none focus:border-[#8e004b] focus:bg-white focus:rounded-lg transition-all"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-[#594047] px-1" htmlFor="signup-password">
                          Create Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c7077]" />
                          <input 
                            id="signup-password"
                            type={showSignupPassword ? 'text' : 'password'}
                            required
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-[#F0EDEC] py-2.5 pl-12 pr-12 text-[#1c1b1b] text-sm rounded-t-lg border-b-2 border-[#E8E8E8] focus:outline-none focus:border-[#8e004b] focus:bg-white focus:rounded-lg transition-all"
                          />
                          <button 
                            type="button"
                            onClick={() => setShowSignupPassword(!showSignupPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8c7077] hover:text-[#8e004b] transition-colors cursor-pointer"
                          >
                            {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Referral / Invite Code Input (Optional) */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#594047] px-1" htmlFor="signup-referral">
                            Have an Invite / Referral Code? (Optional)
                          </label>
                          <button
                            type="button"
                            onClick={() => setSignupReferralCode('RIYA500')}
                            className="text-[10px] text-[#8e004b] font-bold hover:underline cursor-pointer"
                          >
                            Apply Friend Code (RIYA500)
                          </button>
                        </div>
                        <div className="relative">
                          <Gift className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c7077]" />
                          <input 
                            id="signup-referral"
                            type="text"
                            value={signupReferralCode}
                            onChange={(e) => setSignupReferralCode(e.target.value.toUpperCase())}
                            placeholder="e.g. RIYA500 or GLOW2026"
                            className="w-full bg-[#F0EDEC] py-2.5 pl-12 pr-4 text-[#1c1b1b] text-sm uppercase font-mono tracking-wider rounded-t-lg border-b-2 border-[#E8E8E8] focus:outline-none focus:border-[#8e004b] focus:bg-white focus:rounded-lg transition-all"
                          />
                        </div>
                        {signupReferralCode.trim().length >= 4 && (
                          <div className="mt-1 p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-800 flex items-center gap-1.5 animate-fade-in font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            <span>
                              <strong>Bonus unlocked!</strong> You will receive <strong>500 extra loyalty points</strong> (1,000 PTS total = ₹1,000 discount) upon sign up!
                            </span>
                          </div>
                        )}
                      </div>

                      <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#8e004b] hover:bg-[#b90064] text-white font-semibold text-sm py-3.5 rounded-lg mt-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.98] cursor-pointer flex items-center justify-center space-x-2"
                      >
                        {isLoading ? (
                          <span>Creating Your Account...</span>
                        ) : (
                          <>
                            <span>Join Nexora Circle</span>
                            <Sparkles className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  )}

                </div>

                {/* Forgot Password Sub-Modal */}
                {forgotModal && (
                  <div className="absolute inset-0 bg-[#FCF9F8] p-6 rounded-xl border border-[#E8E8E8] z-20 flex flex-col justify-center animate-fade-in">
                    <h3 className="font-serif-display text-lg font-bold text-[#1c1b1b] mb-1">
                      Reset Your Password
                    </h3>
                    <p className="text-xs text-[#594047] mb-4">
                      Enter your registered email address to receive a password reset link.
                    </p>

                    {forgotSuccess ? (
                      <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-800 space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Reset link sent successfully!</span>
                        </div>
                        <p>Please check your email inbox at <strong>{forgotEmail}</strong>.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleForgotPassword} className="space-y-3">
                        <input 
                          type="email"
                          required
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="riya.sharma@example.com"
                          className="w-full p-2.5 bg-[#F0EDEC] border border-[#E8E8E8] rounded-lg text-xs focus:outline-none focus:border-[#8e004b]"
                        />
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="flex-1 py-2 bg-[#8e004b] text-white text-xs font-semibold rounded-lg hover:bg-[#b90064] cursor-pointer"
                          >
                            Send Reset Link
                          </button>
                          <button
                            type="button"
                            onClick={() => setForgotModal(false)}
                            className="px-4 py-2 border border-[#E8E8E8] text-[#594047] text-xs font-semibold rounded-lg hover:bg-[#F0EDEC] cursor-pointer"
                          >
                            Back
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
