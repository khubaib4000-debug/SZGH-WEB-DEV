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
  ChevronDown,
  ChevronRight,
  CornerDownRight,
  Home,
  LayoutGrid,
  Wrench,
  FolderTree,
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  ProductCategory,
  OFFICIAL_SUBCATEGORY_GROUPS,
} from '../data/products';

export type NavSection = 'home' | 'products' | 'videos' | 'application' | 'services' | 'contact';

interface NavbarProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  onSelectCategorySubcategory?: (
    category: ProductCategory | 'All',
    subcategory?: string | null
  ) => void;
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
  onSelectCategorySubcategory,
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
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);
  const [mobileProductsExpanded, setMobileProductsExpanded] = useState(true);

  const navItems: { id: NavSection; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products' },
    { id: 'videos', label: 'Videos' },
    { id: 'application', label: 'Retrofit Booking' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (section: NavSection, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    onNavigate(section);
    setMobileMenuOpen(false);
    setProductsMenuOpen(false);
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubcategoryJump = (
    category: ProductCategory | 'All',
    subcategory: string | null = null
  ) => {
    setProductsMenuOpen(false);
    setMobileMenuOpen(false);
    if (onSelectCategorySubcategory) {
      onSelectCategorySubcategory(category, subcategory);
    } else {
      onNavigate('products');
    }
  };

  const userShortLabel =
    currentUser?.displayName?.split(' ')[0] ||
    currentUser?.email?.split('@')[0] ||
    'Account';

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-white backdrop-blur-md border-b border-slate-200 transition-colors duration-150">
        <div className="max-w-[1360px] mx-auto px-2 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-1.5 sm:gap-4 bg-transparent dark:bg-white">
          {/* Zone 1: Brand Logo & Wordmark */}
          <a
            href="#home"
            onClick={(e) => handleNavClick('home', e)}
            className="flex items-center gap-1.5 sm:gap-3 min-w-0 shrink group focus:outline-none"
          >
            <div className="h-11 sm:h-16 w-auto flex items-center justify-center overflow-hidden bg-white rounded px-1 sm:px-1.5 py-0.5 border border-slate-100 shrink-0">
              <img
                src="/assets/aistudio/szgh-pakistan-logo_baed6be7.png"
                alt="SZGH Pakistan - KH Enterprises Pvt Ltd Logo"
                className="h-10 sm:h-15 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="flex flex-col sm:inline text-xs sm:text-xl font-extrabold tracking-tight text-slate-900 leading-tight whitespace-nowrap">
              <span>SZGH</span>{' '}
              <span className="text-[#0D5C2B]">PAKISTAN</span>
            </span>
          </a>

          {/* Zone 2: Primary Navigation Links (with Products Subcategory Mega-Dropdown) */}
          <nav className="hidden xl:flex items-center gap-6 text-sm font-semibold">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              if (item.id === 'products') {
                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => setProductsMenuOpen(true)}
                    onMouseLeave={() => setProductsMenuOpen(false)}
                  >
                    <a
                      href="#products"
                      onClick={(e) => handleNavClick('products', e)}
                      className={`relative py-2 inline-flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors duration-150 ${
                        isActive
                          ? 'text-[#1E2985]'
                          : 'text-slate-600 hover:text-slate-950'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-150 ${
                          productsMenuOpen ? 'rotate-180' : ''
                        }`}
                      />
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0D5C2B] rounded-full" />
                      )}
                    </a>

                    {/* Products & Subcategories Mega-Menu Dropdown */}
                    {productsMenuOpen && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[780px] z-50">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-5 space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                            <div>
                              <div className="text-xs font-extrabold uppercase tracking-wider text-[#0D5C2B] dark:text-emerald-400">
                                Official SZGH Product Categories &amp; Subcategories
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Select any main category or subcategory to filter equipment immediately
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleSubcategoryJump('All', null)}
                              className="px-3 py-1.5 rounded-md bg-[#1E2985] hover:bg-[#161f69] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                            >
                              View Full Catalog →
                            </button>
                          </div>

                          <div className="grid grid-cols-3 gap-5">
                            {OFFICIAL_SUBCATEGORY_GROUPS.map((group) => (
                              <div
                                key={group.id}
                                className="p-3 rounded-lg bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 space-y-2"
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleSubcategoryJump(group.category, null)
                                  }
                                  className="flex items-center gap-1.5 text-left font-extrabold text-xs text-slate-900 dark:text-white hover:text-[#1E2985] dark:hover:text-emerald-400 transition-colors cursor-pointer"
                                >
                                  <CornerDownRight className="w-3.5 h-3.5 text-amber-500 shrink-0 stroke-[2.5]" />
                                  <span>{group.groupTitle}</span>
                                </button>
                                <ul className="space-y-1 pl-2">
                                  {group.subcategories.map((subcat) => (
                                    <li key={subcat}>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleSubcategoryJump(
                                            group.category,
                                            subcat
                                          )
                                        }
                                        className="w-full flex items-start gap-1.5 py-1 text-left text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-[#1E2985] dark:hover:text-emerald-400 transition-colors cursor-pointer group"
                                      >
                                        <ChevronRight className="w-3 h-3 mt-0.5 text-slate-400 group-hover:text-[#1E2985] dark:group-hover:text-emerald-400 shrink-0" />
                                        <span className="leading-snug">{subcat}</span>
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

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

          {/* Zone 3: Theme Toggle, Sign In / Account, Admin Portal (Admin Only), Cart & 3-Bar Navigation Button */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
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
              className="flex items-center justify-center gap-1.5 h-8 w-8 sm:h-10 sm:w-auto sm:px-2.5 rounded-md border border-slate-200 bg-slate-100/80 text-slate-700 hover:bg-slate-200/80 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="hidden md:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-[#1E2985] shrink-0" />
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
                className="flex items-center justify-center gap-1 sm:gap-1.5 h-8 sm:h-10 px-2 sm:px-3 rounded-md border border-[#1E2985] sm:border-2 bg-white text-[#1E2985] hover:bg-[#1E2985] hover:text-white text-[11px] sm:text-xs font-extrabold transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-2xs"
              >
                <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>Sign In</span>
              </button>
            ) : (
              <div className="flex items-center gap-1 sm:gap-1.5">
                <div
                  title={`Signed in as ${currentUser.email}`}
                  className="hidden sm:flex items-center gap-1.5 h-10 px-2.5 rounded-md border border-slate-200 bg-slate-50 text-slate-800 text-xs font-bold whitespace-nowrap shrink-0"
                >
                  {isAdmin ? (
                    <ShieldCheck className="w-4 h-4 text-[#0D5C2B]" />
                  ) : (
                    <UserCheck className="w-4 h-4 text-[#1E2985]" />
                  )}
                  <span className="max-w-28 truncate">{userShortLabel}</span>
                </div>

                <button
                  type="button"
                  onClick={onSignOut}
                  title={`Sign out (${currentUser.email})`}
                  className="flex items-center justify-center gap-1 h-8 w-8 sm:h-10 sm:w-auto sm:px-2.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:text-red-600 hover:border-red-300 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span className="hidden md:inline">Sign Out</span>
                </button>
              </div>
            )}

            {/* Admin Stock & Orders Manager Button — ONLY VISIBLE WHEN SIGNED IN WITH AUTHORIZED ADMIN EMAIL */}
            {isAdmin && (
              <button
                type="button"
                onClick={onOpenAdminStock}
                title="Admin Portal — Live Stock, Excel (.xlsx) & Customer Orders"
                className="relative flex items-center justify-center gap-1.5 h-8 w-8 sm:h-10 sm:w-auto sm:px-3 rounded-md border border-emerald-500/50 bg-emerald-50 text-[#0D5C2B] hover:bg-emerald-100 text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Package className="w-4 h-4 text-[#0D5C2B] shrink-0" />
                <span className="hidden lg:inline">Stock &amp; Orders Admin</span>
                {ordersCount > 0 && (
                  <span className="hidden sm:inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[11px] font-mono-tabular font-extrabold bg-[#0D5C2B] text-white">
                    {ordersCount}
                  </span>
                )}
              </button>
            )}

            {/* Shopping Cart Drawer Button */}
            <button
              type="button"
              onClick={onOpenCart}
              aria-label={`Shopping Cart (${cartCount} items)`}
              className="relative flex items-center justify-center gap-1 sm:gap-2 h-8 sm:h-10 px-2 sm:px-3.5 rounded-md bg-[#1E2985] hover:bg-[#161f69] text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
            >
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden sm:inline">Cart</span>
              <span
                className="inline-flex items-center justify-center min-w-4 sm:min-w-5 h-4 sm:h-5 px-1 rounded text-[10px] sm:text-xs font-mono-tabular font-bold bg-white text-[#1E2985]"
                aria-label={`${cartCount} items in cart`}
              >
                {cartCount}
              </span>
            </button>

            {/* 3-Bar Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="xl:hidden flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 shrink-0 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-2.5 max-h-[82dvh] overflow-y-auto shadow-2xl">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              if (item.id === 'products') {
                return (
                  <div key={item.id} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <a
                        href="#products"
                        onClick={(e) => handleNavClick('products', e)}
                        className={`flex-1 px-3.5 py-3 rounded-lg text-sm font-bold transition-colors ${
                          isActive
                            ? 'bg-slate-100 dark:bg-slate-800 text-[#1E2985] dark:text-emerald-400'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {item.label} (Full Catalog)
                      </a>
                      <button
                        type="button"
                        onClick={() =>
                          setMobileProductsExpanded(!mobileProductsExpanded)
                        }
                        className="px-3 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-[#1E2985] dark:text-emerald-400 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Categories</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            mobileProductsExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </div>

                    {mobileProductsExpanded && (
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                        {OFFICIAL_SUBCATEGORY_GROUPS.map((group) => (
                          <div key={group.id} className="space-y-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                handleSubcategoryJump(group.category, null)
                              }
                              className="w-full flex items-center gap-2 py-1.5 text-left text-xs font-extrabold text-slate-900 dark:text-white cursor-pointer"
                            >
                              <CornerDownRight className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span>{group.groupTitle}</span>
                            </button>
                            <div className="pl-4 grid grid-cols-1 sm:grid-cols-2 gap-1">
                              {group.subcategories.map((subcat) => (
                                <button
                                  key={subcat}
                                  type="button"
                                  onClick={() =>
                                    handleSubcategoryJump(group.category, subcat)
                                  }
                                  className="w-full flex items-center gap-1.5 py-2 px-2 rounded-md text-left text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:text-[#1E2985] dark:hover:text-emerald-400 cursor-pointer"
                                >
                                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span>{subcat}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(item.id, e)}
                  className={`block px-3.5 py-3 rounded-lg text-sm font-bold transition-colors ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-[#1E2985] dark:text-emerald-400'
                      : 'text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {!currentUser ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onSignIn();
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#1E2985] text-white text-xs font-extrabold cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In with Google</span>
                </button>
              ) : (
                <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <div className="text-xs text-slate-600 dark:text-slate-300 truncate">
                    Signed in:{' '}
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
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-red-600 dark:text-red-400 shrink-0 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}

              {/* Admin Stock & Orders Manager Button in Mobile Drawer — ONLY VISIBLE FOR AUTHORIZED ADMINS */}
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdminStock();
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/50 text-[#0D5C2B] dark:text-emerald-300 text-xs font-extrabold cursor-pointer"
                >
                  <Package className="w-4 h-4" />
                  <span>Stock &amp; Orders Admin</span>
                  {ordersCount > 0 && (
                    <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[11px] font-mono-tabular font-extrabold bg-[#0D5C2B] text-white">
                      {ordersCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Fixed Bottom Mobile Thumb-Zone Navigation Bar (Smartphone Ergonomics) */}
      <nav
        aria-label="Mobile Bottom Quick Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-safe shadow-[0_-4px_16px_rgba(15,23,42,0.08)]"
      >
        <div className="grid grid-cols-5 items-center h-14 px-1">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className={`flex flex-col items-center justify-center h-full gap-0.5 transition-colors cursor-pointer ${
              activeSection === 'home' && !mobileMenuOpen
                ? 'text-[#1E2985] dark:text-emerald-400 font-extrabold'
                : 'text-slate-500 dark:text-slate-400 font-semibold'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-[10px] tracking-tight">Home</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubcategoryJump('All', null)}
            className={`flex flex-col items-center justify-center h-full gap-0.5 transition-colors cursor-pointer ${
              activeSection === 'products' && !mobileMenuOpen
                ? 'text-[#1E2985] dark:text-emerald-400 font-extrabold'
                : 'text-slate-500 dark:text-slate-400 font-semibold'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="text-[10px] tracking-tight">Products</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileProductsExpanded(true);
              setMobileMenuOpen((prev) => !prev);
            }}
            className={`flex flex-col items-center justify-center h-full gap-0.5 transition-colors cursor-pointer ${
              mobileMenuOpen
                ? 'text-[#0D5C2B] dark:text-emerald-400 font-extrabold'
                : 'text-slate-500 dark:text-slate-400 font-semibold'
            }`}
          >
            <FolderTree className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] tracking-tight">Categories</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('application')}
            className={`flex flex-col items-center justify-center h-full gap-0.5 transition-colors cursor-pointer ${
              activeSection === 'application' && !mobileMenuOpen
                ? 'text-[#1E2985] dark:text-emerald-400 font-extrabold'
                : 'text-slate-500 dark:text-slate-400 font-semibold'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span className="text-[10px] tracking-tight">Retrofit</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCart();
            }}
            className="relative flex flex-col items-center justify-center h-full gap-0.5 text-slate-700 dark:text-slate-200 font-extrabold cursor-pointer"
          >
            <div className="relative">
              <ShoppingCart className="w-4 h-4 text-[#1E2985] dark:text-emerald-400" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-[#0D5C2B] text-white text-[9px] font-mono-tabular font-extrabold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight">Cart</span>
          </button>
        </div>
      </nav>
    </>
  );
};

