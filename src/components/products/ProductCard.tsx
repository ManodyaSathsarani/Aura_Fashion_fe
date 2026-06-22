import React from 'react';
import { ShoppingCart, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types/types';
import { useCartStore } from '../../store/cartStore';
import { cartService } from '../../services/cartService';
import { useAuthStore } from '../../store/authStore';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const BACKEND_URL = 'http://localhost:5000';
  const fallbackImage = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=400&auto=format&fit=crop';
  const safeName = product.name || 'Untitled product';
  const safeCategory = product.category || 'Other';
  const safePrice = typeof product.price === 'number' ? product.price : Number(product.price) || 0;
  const imageUrl = product.image
    ? product.image.startsWith('http')
      ? product.image
      : `${BACKEND_URL}/${product.image}`
    : fallbackImage;

  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const handleViewDetails = () => navigate(`/products/${product._id}`);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      addItem(product, 1);
      if (isAuthenticated) {
        await cartService.addToCart(product._id, 1);
      }
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  return (
    <div
      onClick={handleViewDetails}
      className="group bg-white rounded-2xl border border-ink-100 overflow-hidden flex flex-col h-full cursor-pointer
                 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(124,58,237,0.12)] hover:border-violet-200
                 transition-all duration-300 shadow-luxury"
    >
      {/* Image */}
      <div className="relative h-60 overflow-hidden bg-ink-50">
        <img
          src={imageUrl}
          alt={safeName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-ink-950/0 group-hover:bg-ink-950/8 transition-colors duration-300" />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-block px-2.5 py-1 text-[10px] font-semibold text-violet-700 bg-white/90 backdrop-blur-sm border border-violet-100 rounded-full uppercase tracking-widest shadow-sm">
            {safeCategory}
          </span>
        </div>

        {/* Action buttons — slide in from right on hover */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
          <button
            onClick={(e) => { e.stopPropagation(); handleViewDetails(); }}
            className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl shadow-md flex items-center justify-center text-ink-600 hover:text-violet-700 hover:bg-white transition-all duration-200"
            title="Quick view"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={handleAddToCart}
            className="w-9 h-9 bg-violet-600 rounded-xl shadow-violet-sm flex items-center justify-center text-white hover:bg-violet-700 transition-all duration-200"
            title="Add to cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-sm font-semibold text-ink-900 group-hover:text-violet-700 transition-colors duration-200 line-clamp-1 mb-1">
          {safeName}
        </h3>
        <p className="text-xs text-ink-400 line-clamp-2 flex-grow leading-relaxed">
          {product.description || 'No description available.'}
        </p>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-ink-50">
          <div>
            <span className="text-[10px] text-ink-400 uppercase tracking-widest font-medium block">Price</span>
            <span
              className="text-lg font-bold text-violet-700"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              Rs.{safePrice.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white text-xs font-semibold rounded-full
                       hover:bg-violet-700 transition-all duration-200 shadow-violet-sm hover:shadow-violet-md"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;