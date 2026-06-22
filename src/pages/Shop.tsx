import React, { useEffect, useState } from 'react';
import ProductCard from '../components/products/ProductCard';
import type { Product } from '../types/types';
import { productService } from '../services/productService';
import { Loader2, Search, ShoppingBag, X } from 'lucide-react';

const CATEGORIES = [
  'Electronics', 'Clothing', 'Home & Kitchen',
];

const Shop: React.FC = () => {
  const [products, setProducts]               = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [search, setSearch]                   = useState('');
  const [category, setCategory]               = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAll();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;
    if (category !== 'all') {
      filtered = filtered.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
    }
    if (search) {
      const sl = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          (p.name || '').toLowerCase().includes(sl) ||
          (p.description || '').toLowerCase().includes(sl)
      );
    }
    setFilteredProducts(filtered);
  }, [search, category, products]);

  const clearFilters = () => {
    setSearch('');
    setCategory('all');
  };

  const hasFilters = search || category !== 'all';

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
        <p className="text-sm text-ink-400 font-medium">Opening the shop&hellip;</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ── Page Header ── */}
      <div className="bg-ink-950 py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <h1
              className="text-4xl md:text-5xl text-white"
              style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 500 }}
            >
              Our Shop
            </h1>
          </div>
          <span className="block h-[2px] w-12 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full mb-4" />
          <p className="text-ink-400 text-sm">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} available
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Filters ── */}
        <div className="mb-10 space-y-5">
          {/* Search */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400 pointer-events-none" />
            <input
              id="shop-search"
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-11 py-3 border border-ink-200 rounded-xl bg-white text-ink-900 placeholder-ink-400
                         focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400
                         transition-all duration-200 text-sm shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category pill tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              id="shop-cat-all"
              onClick={() => setCategory('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                category === 'all'
                  ? 'bg-violet-600 text-white border-violet-600 shadow-violet-sm'
                  : 'bg-white text-ink-600 border-ink-200 hover:border-violet-300 hover:text-violet-600'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                id={`shop-cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setCategory(cat.toLowerCase())}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                  category === cat.toLowerCase()
                    ? 'bg-violet-600 text-white border-violet-600 shadow-violet-sm'
                    : 'bg-white text-ink-600 border-ink-200 hover:border-violet-300 hover:text-violet-600'
                }`}
              >
                {cat}
              </button>
            ))}

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="ml-2 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-all duration-200"
              >
                <X className="h-3 w-3" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* ── Products Grid ── */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-ink-200 rounded-2xl bg-ink-50/50">
            <div className="w-16 h-16 bg-ink-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <Search className="h-7 w-7 text-ink-300" />
            </div>
            <h3
              className="text-2xl text-ink-800 mb-2"
              style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 500 }}
            >
              No results found
            </h3>
            <p className="text-sm text-ink-500 mb-6 max-w-xs mx-auto">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-full hover:bg-violet-700 transition-all shadow-violet-sm"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;