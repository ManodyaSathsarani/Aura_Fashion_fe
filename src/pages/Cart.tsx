import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';

const Cart: React.FC = () => {
  const { items, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 bg-violet-50 border border-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="h-9 w-9 text-violet-400" />
        </div>
        <h2
          className="text-3xl text-ink-950 mb-3"
          style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 500 }}
        >
          Your cart is empty
        </h2>
        <p className="text-sm text-ink-400 mb-8 max-w-xs">
          You haven't added anything yet. Discover our curated collection.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-violet-600 text-white text-sm font-semibold rounded-full hover:bg-violet-700 transition-all duration-200 shadow-violet-sm hover:shadow-violet-md"
        >
          <ShoppingBag className="h-4 w-4" />
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-50/40">
      {/* Page header */}
      <div className="bg-white border-b border-ink-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1
            className="text-4xl text-ink-950"
            style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 600 }}
          >
            Shopping Cart
          </h1>
          <span className="block h-[2px] w-10 bg-gradient-to-r from-gold-400 to-gold-600 mt-3 rounded-full" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Cart Items ── */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden shadow-luxury">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-ink-50">
                <span className="text-sm font-semibold text-ink-700">
                  {items.length} {items.length === 1 ? 'item' : 'items'} in cart
                </span>
                <button
                  onClick={clearCart}
                  className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 transition-colors hover:bg-red-50 px-3 py-1.5 rounded-lg"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear all
                </button>
              </div>

              {/* Items */}
              <div className="divide-y divide-ink-50">
                {items.map((item) => (
                  <CartItem key={item.product._id} item={item} />
                ))}
              </div>
            </div>

            {/* Continue shopping */}
            <div className="mt-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-violet-600 transition-colors"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* ── Summary ── */}
          <div className="lg:w-80 xl:w-96">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;