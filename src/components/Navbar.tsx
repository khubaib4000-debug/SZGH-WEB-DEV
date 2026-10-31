import React, { useState } from 'react';
import {
  ShoppingCart,
  Sun,
  Moon,
  Menu,
  X,
  Package,
  LogIn,
  LogOut,
  UserCheck,
  ShieldCheck,
} from 'lucide-react';
import { User } from 'firebase/auth';

export type NavSection = 'home' | 'products' | 'videos' | 'application' | 'services' | 'contact';

interface NavbarProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  cartCount: number;
  onOpenCart: () => void;
  currentUser: User | null;
  isAdmin: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
  onOpenAdminStock: () => void;
  ordersCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  theme,
  onToggleTheme,
  cartCount,
  onOpenCart,
  currentUser,
  isAdmin,
  onSignIn,
  onSignOut,
  onOpenAdminStock,
  ordersCount = 0,
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

  const userShortLabel =
    currentUser?.displayName?.split(' ')[0] ||
    currentUser?.email?.split('@')[0] ||
    'Account';

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-150">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 bg-white dark:bg-slate-900">
        {/* Zone 1: Brand Logo & Wordmark */}
        <a
          href="#home"
          onClick={(e) => handleNavClick('home', e)}
          className="flex items-center gap-3 whitespace-nowrap shrink-0 group focus:outline-none"
        >
          <div className="h-12 w-auto flex items-center justify-center overflow-hidden bg-white rounded px-1.5 py-0.5">
            <img
              src="/assets/aistudio/szgh-pakistan-logo_baed6be7.png"
              alt="SZGH Pakistan - KH Enterprises Pvt Ltd Logo"
              className="h-11 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            SZGH <span className="text-[#0D5C2B] dark:text-emerald-400">PAKISTAN</span>
          </span>
        </a>

        {/* Zone 2: Primary Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-semibold">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(item.id, e)}
                className={`relative py-2 whitespace-nowrap shrink-0 transition-colors duration-150 ${
                  isActive
                    ? 'text-[#1E2985] dark:text-emerald-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0D5C2B] dark:bg-emerald-400 rounded-full" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Theme Toggle, Sign In / Account, Admin Portal & Cart Trigger */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Persistent Theme Switcher */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={
              theme === 'dark'
                ? 'Switch to Moderate Light Theme'
                : 'Switch to Industrial Dark Theme'
            }
            title={
              theme === 'dark'
                ? 'Switch to Moderate Light Theme'
                : 'Switch to Industrial Dark Theme'
            }
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-[#1E2985]" />
                <span className="hidden md:inline">Dark</span>
              </>
            )}
          </button>

          {/* Visible Sign In / Signed-In User Account Controls */}
          {!currentUser ? (
            <button
              type="button"
              onClick={onSignIn}
              title="Sign in with Google (Customers & Administrators)"
              className="flex items-center gap-1.5 px-3 py-2 rounded-md border-2 border-[#1E2985] dark:border-emerald-500 bg-white dark:bg-slate-950 text-[#1E2985] dark:text-emerald-400 hover:bg-[#1E2985] hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white text-xs font-extrabold transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-2xs"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onOpenAdminStock}
                title={`Signed in as ${currentUser.email}. Click to open Account / Admin Portal.`}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {isAdmin ? (
                  <ShieldCheck className="w-4 h-4 text-[#0D5C2B] dark:text-emerald-400" />
                ) : (
                  <UserCheck className="w-4 h-4 text-[#1E2985] dark:text-sky-400" />
                )}
                <span className="max-w-28 truncate">{userShortLabel}</span>
              </button>

              <button
                type="button"
                onClick={onSignOut}
                title={`Sign out (${currentUser.email})`}
                className="flex items-center gap-1 px-2.5 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            </div>
          )}

          {/* Admin Stock & Orders Manager Button */}
          <button
            type="button"
            onClick={onOpenAdminStock}
            title="Admin Portal — Live Stock, Excel (.xlsx) & Customer Orders"
            className={`relative flex items-center gap-1.5 px-3 py-2 rounded-md border text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isAdmin
                ? 'border-emerald-500/50 bg-emerald-50 dark:bg-emerald-950/60 text-[#0D5C2B] dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                : 'border-slate-200 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700'
            }`}
          >
            <Package className="w-4 h-4 text-[#0D5C2B] dark:text-emerald-400" />
            <span className="hidden sm:inline">
              {isAdmin ? 'Stock & Orders Admin' : 'Admin Portal'}
            </span>
            {isAdmin && ordersCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[11px] font-mono-tabular font-extrabold bg-[#0D5C2B] text-white">
                {ordersCount}
              </span>
            )}
          </button>

          {/* Shopping Cart Drawer Button */}
          <button
            type="button"
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3.5 py-2.5 rounded-md bg-[#1E2985] hover:bg-[#161f69] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
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
            className="xl:hidden p-2 rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-5 space-y-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(item.id, e)}
                className={`block px-3 py-2.5 rounded-md text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-slate-100 dark:bg-slate-800 text-[#1E2985] dark:text-emerald-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                {item.label}
              </a>
            );
          })}

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2">
            {!currentUser ? (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSignIn();
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-[#1E2985] text-white text-xs font-bold cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In with Google</span>
              </button>
            ) : (
              <>
                <div className="w-full text-xs text-slate-600 dark:text-slate-400 px-1">
                  Signed in as{' '}
                  <strong className="text-slate-900 dark:text-white">
                    {currentUser.email}
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onSignOut();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdminStock();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/50 text-[#0D5C2B] dark:text-emerald-300 text-xs font-bold cursor-pointer"
            >
              <Package className="w-4 h-4" />
              <span>Stock &amp; Orders Admin</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
