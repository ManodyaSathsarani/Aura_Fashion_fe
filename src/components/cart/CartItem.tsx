import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem as CartItemType } from '../../types/types';
import { useCartStore } from '../../store/cartStore';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCartStore();
  const BACKEND_URL = 'http://localhost:5000';
  const safeName = item.product.name || 'Untitled product';
  const safePrice = typeof item.product.price === 'number' ? item.product.price : Number(item.product.price) || 0;
  const safeStock = typeof item.product.stock === 'number' ? item.product.stock : Number(item.product.stock) || 0;

  const imageUrl = item.product.image
    ? item.product.image.startsWith('http')
      ? item.product.image
      : `${BACKEND_URL}/${item.product.image}`
    : 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=400&auto=format&fit=crop';

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > safeStock) {
      alert(`Only ${safeStock} items available`);
      return;
    }
    updateQuantity(item.product._id, newQuantity);
  };

  const handleRemove = () => {
    if (window.confirm('Remove this item from cart?')) {
      removeItem(item.product._id);
    }
  };

  return (
    <div className="flex items-center gap-4 py-5 px-6 hover:bg-violet-50/20 transition-colors duration-200 group">
      {/* Product Image */}
      <Link
        to={`/products/${item.product._id}`}
        className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-ink-100 bg-ink-50"
      >
        <img
          src={imageUrl}
          alt={safeName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              to={`/products/${item.product._id}`}
              className="text-sm font-semibold text-ink-900 hover:text-violet-700 transition-colors line-clamp-1"
            >
              {item.product.name}
            </Link>
            {item.product.category && (
              <span className="inline-block mt-0.5 text-[10px] font-medium text-violet-600 bg-violet-50 border border-violet-100 rounded-full px-2 py-0.5 uppercase tracking-wider">
                {item.product.category}
              </span>
            )}
          </div>

          {/* Remove */}
          <button
            onClick={handleRemove}
            className="flex-shrink-0 p-1.5 text-ink-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
            title="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between">
          {/* Qty Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-7 h-7 rounded-lg border border-ink-200 flex items-center justify-center text-ink-600 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Minus className="h-3 w-3" />
            </button>

            <span className="w-8 text-center text-sm font-semibold text-ink-900">
              {item.quantity}
            </span>

            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={item.quantity >= item.product.stock}
              className="w-7 h-7 rounded-lg border border-ink-200 flex items-center justify-center text-ink-600 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-base font-bold text-ink-900">
              Rs. {(safePrice * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            {item.quantity > 1 && (
              <p className="text-xs text-ink-400">
                Rs. {safePrice.toFixed(2)} each
              </p>
            )}
            {safeStock < 10 && (
              <p className="text-xs text-amber-600 font-medium mt-0.5">
                Only {safeStock} left
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;