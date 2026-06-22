import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingCart, User, LogOut, Package, Menu, X,
  LayoutDashboard, ShoppingBag, ShieldCheck, Users
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const isAdmin = user?.roles?.includes('admin');
  const isSeller = user?.roles?.includes('seller');
  const canAccessDashboard = isAdmin || isSeller;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-black/95 backdrop-blur-xl border-b border-[#D4FF3F]/20'
            : 'bg-black/80 backdrop-blur-md border-b border-white/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-4">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              
              <div className="flex flex-col -space-y-0.5">
                <span
                  className="text-xl font-bold text-white tracking-tight leading-none"
                  style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.4rem' }}
                >
                  Aura<span className="text-[#D4FF3F]">Fashion</span>
                </span>
                <span className="h-[2px] w-full bg-[#D4FF3F]" />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {[
                { path: '/', label: 'Home' },
                { path: '/products', label: 'Shop' },
              ].map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`relative text-sm font-mono font-medium transition-colors duration-200 group ${
                    isActive(path) ? 'text-[#D4FF3F]' : 'text-white/60 hover:text-[#D4FF3F]'
                  }`}
                >
                  {label}
                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] bg-[#D4FF3F] transition-all duration-300 ${
                      isActive(path) ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              ))}

              {isAuthenticated && canAccessDashboard && (
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-1.5 text-sm font-mono font-medium transition-colors duration-200 group relative ${
                    isActive('/dashboard') ? 'text-[#D4FF3F]' : 'text-white/60 hover:text-[#D4FF3F]'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] bg-[#D4FF3F] transition-all duration-300 ${
                      isActive('/dashboard') ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              )}

              {isAuthenticated && isAdmin && (
                <Link
                  to="/admin/sellers"
                  className={`flex items-center gap-1.5 text-sm font-mono font-medium transition-colors duration-200 group relative ${
                    isActive('/admin/sellers') ? 'text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Users className="h-4 w-4" />
                  Sellers
                </Link>
              )}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-3">

              {/* Cart */}
              <Link
                to="/cart"
                id="header-cart-btn"
                className="relative p-2.5 text-white/60 hover:text-[#D4FF3F] hover:bg-white/5 transition-all duration-200"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#D4FF3F] text-black text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-black animate-scale-in">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </Link>

              <div className="hidden md:block h-6 w-px bg-white/15 mx-1" />

              {isAuthenticated ? (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to="/orders"
                    className="hidden lg:flex items-center gap-1.5 text-sm font-mono font-medium text-white/60 hover:text-[#D4FF3F] transition-colors px-3 py-2 hover:bg-white/5"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Orders
                  </Link>

                  {/* Profile Badge */}
                  <div className="flex items-center gap-2 bg-white/5 border border-white/15 pl-2 pr-3 py-1.5">
                    <div
                      className={`w-7 h-7 flex items-center justify-center text-xs ${
                        isAdmin
                          ? 'bg-white/10 text-white'
                          : 'bg-[#D4FF3F]/15 text-[#D4FF3F]'
                      }`}
                    >
                      {isAdmin ? <ShieldCheck size={16} /> : <User size={16} />}
                    </div>
                    <div className="flex flex-col -space-y-0.5">
                      <span className="text-xs font-semibold text-white truncate max-w-[80px]">
                        {user?.name}
                      </span>
                      <span className="text-[9px] font-mono font-medium text-white/40 uppercase tracking-widest">
                        {isAdmin ? 'Admin' : isSeller ? 'Seller' : 'Member'}
                      </span>
                    </div>
                  </div>

                  <button
                    id="header-logout-btn"
                    onClick={handleLogout}
                    className="p-2.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                    title="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-mono font-medium text-white/70 hover:text-[#D4FF3F] transition-colors hover:bg-white/5"
                  >
                    Sign In
                  </Link>
                  <div className="relative">
                    <div className="absolute inset-0 translate-x-1 translate-y-1 bg-white/15" />
                    <Link
                      to="/register"
                      className="relative block px-5 py-2 bg-[#D4FF3F] text-black text-sm font-bold hover:bg-[#c4ef2f] transition-colors duration-200"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                id="header-mobile-menu-btn"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2.5 text-white/80 hover:bg-white/10 transition-all"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-black/98 backdrop-blur-xl animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-1">

              {[
                { path: '/', label: 'Home' },
                { path: '/products', label: 'Shop' },
              ].map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center px-4 py-3 text-base font-mono font-medium transition-all ${
                    isActive(path)
                      ? 'text-[#D4FF3F] bg-[#D4FF3F]/10'
                      : 'text-white/70 hover:text-[#D4FF3F] hover:bg-white/5'
                  }`}
                >
                  {label}
                </Link>
              ))}

              {isAuthenticated && (
                <>
                  <Link
                    to="/orders"
                    className="flex items-center gap-2 px-4 py-3 text-base font-mono font-medium text-white/70 hover:text-[#D4FF3F] hover:bg-white/5 transition-all"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    My Orders
                  </Link>
                  {canAccessDashboard && (
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-4 py-3 text-base font-mono font-medium text-white/70 hover:text-[#D4FF3F] hover:bg-white/5 transition-all"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  )}
                  {isAdmin && (
                    <Link
                      to="/admin/sellers"
                      className="flex items-center gap-2 px-4 py-3 text-base font-mono font-medium text-white hover:bg-white/5 transition-all"
                    >
                      <Users className="h-4 w-4" />
                      Sellers Management
                    </Link>
                  )}
                  <div className="pt-4 border-t border-white/10 mt-2">
                    <div className="flex items-center gap-3 px-4 py-2 mb-3">
                      <div className={`w-9 h-9 flex items-center justify-center ${isAdmin ? 'bg-white/10 text-white' : 'bg-[#D4FF3F]/15 text-[#D4FF3F]'}`}>
                        {isAdmin ? <ShieldCheck size={18} /> : <User size={18} />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{user?.name}</p>
                        <p className="text-xs font-mono text-white/40 uppercase tracking-wider">{isAdmin ? 'Admin' : isSeller ? 'Seller' : 'Member'}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 py-3 text-red-400 font-semibold border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-all"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </div>
                </>
              )}

              {!isAuthenticated && (
                <div className="pt-4 border-t border-white/10 mt-2 flex flex-col gap-3">
                  <Link
                    to="/login"
                    className="block text-center py-3 text-base font-mono font-medium text-white/70 border border-white/15 hover:border-[#D4FF3F] hover:text-[#D4FF3F] transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block text-center py-3 text-base font-bold text-black bg-[#D4FF3F] hover:bg-[#c4ef2f] transition-all"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Spacer so content doesn't hide behind fixed header */}
      <div className="h-[72px]" />
    </>
  );
};

export default Header;