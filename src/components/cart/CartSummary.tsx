import React from 'react';
import { useCartStore } from '../../store/cartStore';
import { ShoppingBag, Tag, Truck, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CartSummary: React.FC = () => {
  const { items } = useCartStore();
  const navigate = useNavigate();

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 350;
  const total    = subtotal + shipping;
  const remaining = 5000 - subtotal;

  return (
    <div className="bg-ink-950 rounded-2xl overflow-hidden shadow-luxury-lg">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-white/8">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-violet-400" />
          <h2
            className="text-lg text-white"
            style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 400, fontSize: '1.35rem' }}
          >
            Order Summary
          </h2>
        </div>
      </div>

      {/* Line Items */}
      <div className="px-6 py-5 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-ink-400">Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
          <span className="text-sm font-semibold text-white">
            Rs. {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1.5 text-sm text-ink-400">
            <Truck className="h-3.5 w-3.5" />
            Shipping
          </span>
          <span className={`text-sm font-semibold ${shipping === 0 ? 'text-emerald-400' : 'text-white'}`}>
            {shipping === 0 ? 'FREE' : `Rs. ${shipping.toLocaleString()}`}
          </span>
        </div>

        {/* Free shipping progress */}
        {subtotal > 0 && subtotal < 5000 && (
          <div className="pt-2">
            <div className="flex justify-between text-xs text-ink-500 mb-1.5">
              <span className="flex items-center gap-1">
                <Tag className="h-3 w-3 text-violet-400" />
                Add Rs. {remaining.toLocaleString()} for free shipping
              </span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((subtotal / 5000) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="pt-2 border-t border-white/10">
          <div className="flex justify-between items-center pt-2">
            <span className="text-sm font-semibold text-white">Total</span>
            <div className="text-right">
              <span
                className="text-2xl font-bold text-violet-400"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                Rs. {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 pb-6">
        <button
          id="cart-checkout-btn"
          onClick={() => navigate('/checkout')}
          disabled={items.length === 0}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-violet-sm hover:shadow-violet-md disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Proceed to Checkout
          <ArrowRight className="h-4 w-4" />
        </button>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-ink-500">
          <ShieldCheck className="h-3.5 w-3.5 text-violet-500" />
          Secure checkout · Cash on Delivery available
        </div>
      </div>
    </div>
  );
};

export default CartSummary;