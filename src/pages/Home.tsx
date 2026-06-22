import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Truck, RefreshCw, Sparkles } from 'lucide-react';
import ProductList from '../components/products/ProductList';
import type { Product } from '../types/types';
import { productService } from '../services/productService';
import Spinner from '../components/ui/Spinner';



const CTA_IMAGE =
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=80';

const FEATURES = [
  { icon: Truck,     title: 'Free Shipping',      desc: 'Free delivery on orders over Rs. 5,000' },
  { icon: Shield,    title: 'Secure Payment',      desc: '100% encrypted payment processing' },
  { icon: RefreshCw, title: 'Easy Returns',        desc: '30-day hassle-free return policy' },
  { icon: Star,      title: 'Quality Guarantee',   desc: 'Premium curated products only' },
];

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await productService.getAll();
        setFeaturedProducts(products.slice(0, 4));
        setNewArrivals(products.slice(-8).reverse());
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 bg-black">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-0 pb-0 bg-black">

      {/* ═══════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-black pt-4 pb-16 md:pb-20">
        {/* Lime grid texture — matches login/dashboard signature */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #D4FF3F 1px, transparent 1px), linear-gradient(to bottom, #D4FF3F 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

            {/* Left — Copy */}
            <div className="max-w-xl animate-fade-in-up">
              <div className="inline-flex items-center gap-2 border border-[#D4FF3F]/30 bg-[#D4FF3F]/5 px-4 py-1.5 mb-8">
                <Sparkles className="h-3.5 w-3.5 text-[#D4FF3F]" />
                <span className="text-xs font-mono font-semibold text-[#D4FF3F] uppercase tracking-[0.2em]">
                  Fresh drops daily
                </span>
              </div>

              <h1
                className="text-5xl md:text-6xl lg:text-7xl leading-[0.98] text-white font-bold tracking-tight"
                style={{ fontFamily: '"Space Grotesk", sans-serif' }}
              >
                Curated for the<br />
                <span className="text-[#D4FF3F]">discerning.</span>
              </h1>

              <span className="block h-[3px] w-14 bg-[#D4FF3F] mt-6" />

              <p className="mt-4 text-base text-white/50 leading-relaxed max-w-md font-mono">
                Explore an expertly curated collection of fashion, tech, and lifestyle
                products — elevated beyond the ordinary.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-white/15" />
                  <Link
                    to="/products"
                    id="hero-shop-now-btn"
                    className="relative inline-flex items-center justify-center gap-2 bg-[#D4FF3F] px-8 py-4 text-sm font-bold text-black hover:bg-[#c4ef2f] transition-colors duration-200"
                  >
                    Shop Now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 border border-white/20 bg-transparent px-8 py-4 text-sm font-semibold text-white hover:border-[#D4FF3F] hover:text-[#D4FF3F] transition-all duration-200"
                >
                  Create Account
                </Link>
              </div>

              {/* Social proof */}
              <div className="mt-10 flex items-center gap-6">
                <div className="flex -space-x-2">
                  {['bg-[#D4FF3F]', 'bg-[#bdea2c]', 'bg-white/30', 'bg-white/15'].map((c, i) => (
                    <div key={i} className={`w-8 h-8 border-2 border-black ${c}`} />
                  ))}
                </div>
                <p className="text-xs text-white/40 font-mono">
                  Trusted by <span className="font-semibold text-white">10,000+</span> shoppers
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FEATURES STRIP
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-[#0A0A0A] py-14 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 stagger">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center group animate-fade-in-up"
              >
                <div className="w-14 h-14 border border-white/15 flex items-center justify-center mb-4 text-[#D4FF3F] group-hover:bg-[#D4FF3F] group-hover:text-black group-hover:border-[#D4FF3F] transition-all duration-200">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                  {title}
                </h3>
                <p className="text-xs text-white/40 leading-relaxed font-mono">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FEATURED PRODUCTS
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-black py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <span className="text-xs font-mono font-semibold text-[#D4FF3F] uppercase tracking-[0.2em] block mb-2">
                // Handpicked for you
              </span>
              <h2
                className="text-4xl md:text-5xl text-white font-bold tracking-tight"
                style={{ fontFamily: '"Space Grotesk", sans-serif' }}
              >
                Featured Products
              </h2>
              <span className="block h-[3px] w-14 bg-[#D4FF3F] mt-4" />
            </div>
            <Link
              to="/products"
              className="flex items-center gap-2 text-sm font-semibold text-white hover:text-[#D4FF3F] transition-colors group font-mono"
            >
              View all
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <ProductList
            products={featuredProducts}
            columns={4}
            emptyMessage="No featured products available"
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          NEW ARRIVALS
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-[#0A0A0A] py-20 px-4 border-y border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <span className="text-xs font-mono font-semibold text-[#D4FF3F] uppercase tracking-[0.2em] block mb-2">
                // Just dropped
              </span>
              <h2
                className="text-4xl md:text-5xl text-white font-bold tracking-tight"
                style={{ fontFamily: '"Space Grotesk", sans-serif' }}
              >
                New Arrivals
              </h2>
              <span className="block h-[3px] w-14 bg-[#D4FF3F] mt-4" />
            </div>
            <Link
              to="/products"
              className="flex items-center gap-2 text-sm font-semibold text-white hover:text-[#D4FF3F] transition-colors group font-mono"
            >
              View all
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <ProductList
            products={newArrivals}
            columns={4}
            emptyMessage="No new arrivals"
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CTA
      ═══════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden py-28 px-6 text-center text-white"
        style={{ backgroundImage: `url('${CTA_IMAGE}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* Heavy black overlay, lime-tinted grid on top */}
        <div className="absolute inset-0 bg-black/90" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #D4FF3F 1px, transparent 1px), linear-gradient(to bottom, #D4FF3F 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto animate-fade-in-up">
          <span className="text-xs font-mono font-semibold text-[#D4FF3F] uppercase tracking-[0.3em] block mb-6">
            // Grow with us
          </span>
          <h2
            className="text-4xl md:text-6xl leading-[1.0] mb-6 font-bold tracking-tight"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
          >
            Ready to start<br />your business?
          </h2>
          <span className="inline-block h-[3px] w-16 bg-[#D4FF3F] mb-8" />
          <p className="text-base text-white/50 mb-10 leading-relaxed font-mono">
            Join thousands of successful sellers on EShop. List your products today
            and reach customers across Sri Lanka.
          </p>
          <div className="relative inline-block">
            <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-white/15" />
            <Link
              to="/register"
              id="cta-register-btn"
              className="relative inline-flex items-center justify-center gap-2 px-10 py-4 bg-[#D4FF3F] text-black text-sm font-bold hover:bg-[#c4ef2f] transition-colors duration-200"
            >
              Get started today
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;