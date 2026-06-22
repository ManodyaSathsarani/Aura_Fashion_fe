import React from 'react';
import {
  Package, Mail, Phone, MapPin, Facebook,
  Twitter, Instagram, Youtube, Send,
  CreditCard, ShieldCheck, Globe, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { label: 'Facebook',  href: 'https://www.facebook.com/', Icon: Facebook },
    { label: 'Twitter',   href: 'https://x.com/',           Icon: Twitter },
    { label: 'Instagram', href: 'https://www.instagram.com/', Icon: Instagram },
    { label: 'YouTube',   href: 'https://www.youtube.com/',  Icon: Youtube },
  ];

  const companyLinks = ['About Us', 'Our Services', 'Privacy Policy', 'Terms of Service', 'Contact'];
  const shopLinks    = ['Electronics', "Men's Fashion", "Women's Fashion", 'Home & Garden', 'Gadgets'];

  return (
    <footer className="mt-24 bg-black text-white/60 border-t border-white/10">

      {/* ── Newsletter Banner ── */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <span className="text-[#D4FF3F] text-xs font-mono font-semibold uppercase tracking-[0.2em] mb-2 block">
                // Stay in the loop
              </span>
              <h3
                className="text-2xl text-white mb-1 font-bold tracking-tight"
                style={{ fontFamily: '"Space Grotesk", sans-serif' }}
              >
                Subscribe to our newsletter
              </h3>
              <p className="text-white/40 text-sm font-mono">
                New arrivals, exclusive deals — delivered to your inbox.
              </p>
            </div>
            <div className="w-full max-w-md">
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/15 text-white placeholder:text-white/30
                               focus:outline-none focus:border-[#D4FF3F] transition-colors text-sm font-mono"
                  />
                </div>
                <div className="relative shrink-0">
                  <div className="absolute inset-0 translate-x-1 translate-y-1 bg-white/15" />
                  <button
                    className="relative flex items-center gap-2 px-5 py-3 bg-[#D4FF3F] hover:bg-[#c4ef2f] text-black font-bold transition-colors duration-200 text-sm whitespace-nowrap"
                    id="footer-newsletter-btn"
                  >
                    <Send className="h-4 w-4" />
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Footer Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="w-9 h-9 bg-[#D4FF3F] flex items-center justify-center group-hover:bg-[#c4ef2f] transition-colors">
                <Package className="h-5 w-5 text-black" />
              </div>
              <div className="flex flex-col -space-y-0.5">
                <span
                  className="text-xl font-bold text-white"
                  style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.3rem' }}
                >
                  Mano<span className="text-[#D4FF3F]">Fashion</span>
                </span>
                <span className="h-[2px] w-full bg-[#D4FF3F]" />
              </div>
            </Link>

            <p className="text-white/40 text-sm leading-relaxed font-mono">
              Your premier destination for curated products across fashion, tech, and home. Premium quality, delivered.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center border border-white/15 text-white/50 hover:bg-[#D4FF3F] hover:text-black hover:border-[#D4FF3F] transition-all duration-200"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-[0.15em] mb-6 font-mono">// Company</h4>
            <ul className="space-y-3.5">
              {companyLinks.map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(/ /g, '-')}`}
                    className="group flex items-center text-white/40 hover:text-[#D4FF3F] transition-colors text-sm font-mono"
                  >
                    <ArrowRight className="h-3 w-3 mr-0 opacity-0 group-hover:opacity-100 group-hover:mr-2 transition-all duration-200" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-[0.15em] mb-6 font-mono">// Shop</h4>
            <ul className="space-y-3.5">
              {shopLinks.map((item) => (
                <li key={item}>
                  <Link
                    to="/products"
                    className="group flex items-center text-white/40 hover:text-[#D4FF3F] transition-colors text-sm font-mono"
                  >
                    <ArrowRight className="h-3 w-3 mr-0 opacity-0 group-hover:opacity-100 group-hover:mr-2 transition-all duration-200" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-[0.15em] mb-6 font-mono">// Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/40 text-sm font-mono">
                <MapPin className="h-4 w-4 text-[#D4FF3F] mt-0.5 shrink-0" />
                <span>123 Commerce Way, Tech Park,<br />Colombo 07, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-3 text-white/40 text-sm font-mono">
                <Phone className="h-4 w-4 text-[#D4FF3F] shrink-0" />
                <span>+94 11 234 5678</span>
              </li>
              <li className="flex items-center gap-3 text-white/40 text-sm font-mono">
                <Mail className="h-4 w-4 text-[#D4FF3F] shrink-0" />
                <span>manoFashion@gmail.com</span>
              </li>
            </ul>

            {/* Trust Badges */}
            <div className="mt-6 flex gap-4">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold text-white/40 uppercase tracking-widest">
                <ShieldCheck className="h-3.5 w-3.5 text-[#D4FF3F]" />
                Secure
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold text-white/40 uppercase tracking-widest">
                <Globe className="h-3.5 w-3.5 text-[#D4FF3F]" />
                Worldwide
              </div>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="mt-16 h-px bg-white/10" />

        {/* ── Bottom Bar ── */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30 text-center md:text-left font-mono">
            &copy; {currentYear}{' '}
            <span className="text-[#D4FF3F]">aura Fashion</span>. All rights reserved.
            {' · '}Made with <span className="text-[#D4FF3F]">♥</span> in Sri Lanka
          </p>

          <div className="flex items-center gap-3 text-white/30 opacity-60 hover:opacity-100 transition-opacity duration-300">
            <CreditCard className="h-6 w-6" />
            <div className="h-4 w-px bg-white/10" />
            <span className="text-xs font-mono font-semibold tracking-widest uppercase">COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;