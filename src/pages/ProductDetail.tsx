import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Plus, Minus, BadgeCheck, Loader2, Package } from 'lucide-react';
import type { Product } from '../types/types';
import { productService } from '../services/productService';
import { useCartStore } from '../store/cartStore';
import { cartService } from '../services/cartService';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const BACKEND_URL = 'http://localhost:5000';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (id) {
          const data = await productService.getById(id);
          setProduct(data);
        }
      } catch {
        toast.error('Product not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (product) {
      addItem(product, quantity);
      if (isAuthenticated) await cartService.addToCart(product._id, quantity);
      toast.success('Added to cart!');
    }
  };

  const safeName = product?.name || 'Untitled product';
  const safeDescription = product?.description || 'No description available.';
  const safeCategory = product?.category || '';
  const safePrice = typeof product?.price === 'number' ? product.price : Number(product?.price) || 0;
  const safeStock = typeof product?.stock === 'number' ? product.stock : Number(product?.stock) || 0;
  const imageUrl = product?.image
    ? product.image.startsWith('http')
      ? product.image
      : `${BACKEND_URL}/${product.image}`
    : 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=400&auto=format&fit=crop';

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-96 text-ink-500">
        Product not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-ink-100 bg-ink-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-violet-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">

          {/* ── Image ── */}
          <div className="bg-ink-50 rounded-2xl border border-ink-100 flex items-center justify-center min-h-[360px] p-8 overflow-hidden">
            <img
              src={imageUrl}
              alt={safeName}
              className="max-h-[420px] w-auto object-contain rounded-xl hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* ── Details ── */}
          <div className="flex flex-col justify-center space-y-6">
            {/* Badge */}
            <div className="flex items-center gap-2">
              {safeCategory && (
                <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-violet-700 bg-violet-50 border border-violet-100 rounded-full uppercase tracking-widest">
                  {safeCategory}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                <BadgeCheck className="h-3.5 w-3.5" />
                Verified
              </span>
            </div>

            {/* Name */}
            <h1
              className="text-4xl lg:text-5xl text-ink-950 leading-tight"
              style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 600 }}
            >
              {safeName}
            </h1>

            {/* Price */}
            <div>
              <span className="text-3xl font-bold text-violet-700" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                Rs. {safePrice.toFixed(2)}
              </span>
              {safeStock <= 10 && safeStock > 0 && (
                <p className="text-sm text-amber-600 font-medium mt-1">
                  Only {safeStock} left in stock
                </p>
              )}
              {safeStock === 0 && (
                <p className="text-sm text-red-500 font-medium mt-1">Out of stock</p>
              )}
            </div>

            {/* Description */}
            <p className="text-ink-500 leading-relaxed border-t border-ink-100 pt-6">
              {safeDescription}
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-ink-600 uppercase tracking-wider">Quantity</span>
              <div className="flex items-center bg-ink-50 border border-ink-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="px-4 py-2.5 text-ink-600 hover:bg-ink-100 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center text-sm font-bold text-ink-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((prev) => Math.min(safeStock, prev + 1))}
                  disabled={quantity >= safeStock}
                  className="px-4 py-2.5 text-ink-600 hover:bg-ink-100 transition-colors disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                id="product-add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={safeStock === 0}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl
                           transition-all duration-200 shadow-violet-sm hover:shadow-violet-md disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>
              <button
                onClick={() => navigate('/products')}
                className="sm:w-auto flex items-center justify-center gap-2 px-6 py-4 border border-ink-200 text-ink-700 font-semibold rounded-xl hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50 transition-all duration-200"
              >
                <Package className="h-5 w-5" />
                Browse More
              </button>
            </div>

            {/* Trust */}
            <div className="flex gap-6 pt-4 border-t border-ink-100">
              {['Free shipping over Rs.5,000', '30-day returns', 'Secure checkout'].map((t) => (
                <span key={t} className="text-xs text-ink-400 font-medium">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;