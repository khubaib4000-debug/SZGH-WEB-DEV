import React, { useState } from 'react';
import { ShoppingCart, Sun, Moon, Menu, X, Package } from 'lucide-react';

export type NavSection = 'home' | 'products' | 'videos' | 'application' | 'services' | 'contact';

interface NavbarProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  cartCount: number;
  onOpenCart: () => void;
  isAdmin: boolean;
  onOpenAdminStock: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  theme,
  onToggleTheme,
  cartCount,
  onOpenCart,
  isAdmin,
  onOpenAdminStock,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavSection; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products' },
    { id: 'videos', label: 'Videos' },
    { id: 'application', label: 'Retrofit Booking' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (section: NavSection, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(section);
    setMobileMenuOpen(false);
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 transition-colors duration-150">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8 bg-white">
        {/* Zone 1: Brand Logo & Wordmark */}
        <a
          href="#home"
          onClick={(e) => handleNavClick('home', e)}
          className="flex items-center gap-3 whitespace-nowrap shrink-0 group focus:outline-none"
        >
          <div className="h-12 w-auto flex items-center justify-center overflow-hidden">
            <img
              src="/assets/aistudio/szgh-pakistan-logo_baed6be7.png"
              alt="SZGH Pakistan - KH Enterprises Pvt Ltd Logo"
              className="h-11 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
            SZGH <span className="text-[#0D5C2B]">PAKISTAN</span>
          </span>
        </a>

        {/* Zone 2: Primary Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(item.id, e)}
                className={`relative py-2 whitespace-nowrap shrink-0 transition-colors duration-150 ${
                  isActive
                    ? 'text-[#1E2985]'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0D5C2B] rounded-full" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Theme Toggle & Functional Cart Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Persistent Theme Switcher */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Moderate Light Theme' : 'Switch to Industrial Dark Theme'}
            title={theme === 'dark' ? 'Switch to Moderate Light Theme' : 'Switch to Industrial Dark Theme'}
            className="flex items-center gap-2 px-3 py-2 rounded-md border border-slate-200 bg-slate-100/80 text-slate-700 hover:bg-slate-200/80 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="hidden sm:inline">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-[#1E2985]" />
                <span className="hidden sm:inline">Dark Mode</span>
              </>
            )}
          </button>

          {/* Admin Stock Manager Button — Visible ONLY to the 2 Verified Admins */}
          {isAdmin && (
            <button
              type="button"
              onClick={onOpenAdminStock}
              title="Admin Live Stock & Price Manager (Firebase)"
              className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-emerald-500/40 bg-emerald-50 text-[#0D5C2B] hover:bg-emerald-100 text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Package className="w-4 h-4 text-[#0D5C2B]" />
              <span>Stock Admin</span>
            </button>
          )}

          {/* Shopping Cart Drawer Button */}
          <button
            type="button"
            onClick={onOpenCart}
            className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-md bg-[#1E2985] hover:bg-[#161f69] text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Cart</span>
            <span
              className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded text-xs font-mono-tabular font-bold bg-white text-[#1E2985]"
              aria-label={`${cartCount} items in cart`}
            >
              {cartCount}
            </span>
          </button>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(item.id, e)}
                className={`block px-3 py-2.5 rounded-md text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-slate-100 text-[#1E2985]'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
};
