import React, { useState } from 'react';
import { CartItem } from '../types';
import confetti from 'canvas-confetti';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Gift, 
  Check, 
  ArrowRight
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  currency: 'INR' | 'USD';
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  currency,
}) => {
  const [giftWrapping, setGiftWrapping] = useState(true);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  if (!isOpen) return null;

  const totalINR = cart.reduce((acc, item) => acc + item.product.priceINR * item.quantity, 0);
  const totalUSD = cart.reduce((acc, item) => acc + item.product.priceUSD * item.quantity, 0);

  const displayTotal = currency === 'INR' 
    ? `₹${totalINR.toLocaleString('en-IN')}` 
    : `$${totalUSD}`;

  const handleCheckout = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#8e004b', '#E6007E', '#ffd9e2'],
      });
    } catch (e) {
      // ignore
    }
    setCheckoutComplete(true);
  };

  const handleFinish = () => {
    setCheckoutComplete(false);
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#E8E8E8] relative">
        
        {/* Top Header */}
        <div className="p-6 border-b border-[#E8E8E8] flex items-center justify-between bg-[#fdf8f8]">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-[#8e004b]" />
            <h3 className="font-serif-display text-xl font-bold text-[#1c1b1b]">
              Your Shopping Bag
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F0EDEC] hover:bg-[#ece7e7] text-[#1c1b1b] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {checkoutComplete ? (
            <div className="text-center py-12 space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="font-serif-display text-2xl font-bold text-[#1c1b1b]">
                Order Placed Successfully!
              </h3>
              <p className="text-xs text-[#594047] leading-relaxed">
                Thank you! Your beauty products are being packed with care in our Banarasi silk box. Expected delivery in 2–3 business days with free express shipping across India.
              </p>
              <div className="p-4 bg-[#F0EDEC] rounded-xl text-xs text-[#1c1b1b] text-left space-y-1">
                <div><strong>Order ID:</strong> NX-{Math.floor(100000 + Math.random() * 900000)}</div>
                <div><strong>Packaging:</strong> Free Banarasi Silk Gift Box</div>
                <div><strong>Shipping:</strong> Free Express Courier Delivery</div>
              </div>
              <button
                onClick={handleFinish}
                className="w-full py-3 bg-[#8e004b] text-white text-xs uppercase tracking-widest font-bold rounded-lg mt-4 cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-12 h-12 text-[#d4c7ca] mx-auto" />
              <h4 className="font-serif-display text-xl font-bold text-[#1c1b1b]">Your Bag is Empty</h4>
              <p className="text-xs text-[#594047]">
                Check out our hair oils, face creams, and scented candles in the beauty store.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => {
                const itemPrice = currency === 'INR' 
                  ? `₹${(item.product.priceINR * item.quantity).toLocaleString('en-IN')}` 
                  : `$${item.product.priceUSD * item.quantity}`;

                return (
                  <div 
                    key={item.product.id}
                    className="p-3.5 bg-[#F0EDEC] rounded-xl border border-[#E8E8E8] flex items-center justify-between gap-3"
                  >
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-14 h-14 object-contain bg-white rounded-lg p-1 border border-[#E8E8E8] flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-xs text-[#1c1b1b] truncate">
                        {item.product.name}
                      </h4>
                      <span className="text-[10px] text-[#594047] block">
                        {item.product.volume}
                      </span>
                      <span className="font-serif-display text-sm font-bold text-[#8e004b]">
                        {itemPrice}
                      </span>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center space-x-1.5 bg-white border border-[#E8E8E8] rounded-md px-1.5 py-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="text-[#594047] hover:text-[#8e004b] p-0.5 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold px-1">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="text-[#594047] hover:text-[#8e004b] p-0.5 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-[10px] text-[#594047] hover:text-red-700 flex items-center gap-0.5 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Free Silk Gift Box Toggle */}
              <div 
                onClick={() => setGiftWrapping(!giftWrapping)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  giftWrapping 
                    ? 'border-[#8e004b] bg-[#FDE7F3]/40' 
                    : 'border-[#E8E8E8] bg-[#F0EDEC]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Gift className="w-4 h-4 text-[#8e004b]" />
                  <div>
                    <span className="text-xs font-bold text-[#1c1b1b] block">Free Luxury Silk Gift Packaging</span>
                    <span className="text-[10px] text-[#594047] block">Complimentary Banarasi raw silk gift box & personal note</span>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  giftWrapping ? 'border-[#8e004b] bg-[#8e004b] text-white' : 'border-stone-400'
                }`}>
                  {giftWrapping && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Checkout Bar */}
        {!checkoutComplete && cart.length > 0 && (
          <div className="p-6 bg-[#fdf8f8] border-t border-[#E8E8E8] space-y-4">
            <div className="flex items-center justify-between text-xs text-[#594047]">
              <span>Delivery Charges (All Across India)</span>
              <span className="font-semibold text-emerald-700">FREE DELIVERY</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-bold text-[#1c1b1b]">
                Total Amount to Pay
              </span>
              <span className="font-serif-display text-2xl font-bold text-[#8e004b]">
                {displayTotal}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-3.5 bg-[#8e004b] hover:bg-[#b90064] text-white text-xs uppercase tracking-widest font-bold rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Place Order (Cash on Delivery / UPI)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
