
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { CartItem } from './types';
import logo from './assets/logo_ararblue.svg';

// Layout Components
const MobileBottomNav: React.FC<{ cartCount: number }> = ({ cartCount }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/90 dark:bg-background-dark/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 z-50 md:hidden pb-safe">
      <div className="flex justify-around items-center h-16">
        <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-primary' : 'text-gray-400'}`}>
          <span className={`material-symbols-outlined transition-all ${isActive('/') ? 'font-bold scale-110' : ''}`}>home</span>
          <span className="text-[10px] font-bold tracking-wider">HOME</span>
        </Link>
        <Link to="/shop" className={`flex flex-col items-center gap-1 ${isActive('/shop') ? 'text-primary' : 'text-gray-400'}`}>
          <span className={`material-symbols-outlined transition-all ${isActive('/shop') ? 'font-bold scale-110' : ''}`}>storefront</span>
          <span className="text-[10px] font-bold tracking-wider">LOJA</span>
        </Link>
        <Link to="/checkout" className={`flex flex-col items-center gap-1 relative ${isActive('/checkout') ? 'text-primary' : 'text-gray-400'}`}>
          <div className="relative">
            <span className={`material-symbols-outlined transition-all ${isActive('/checkout') ? 'font-bold scale-110' : ''}`}>shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 size-3 bg-primary text-white text-[8px] font-bold flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-wider">SACOLA</span>
        </Link>
        <Link to="/dashboard" className={`flex flex-col items-center gap-1 ${isActive('/dashboard') ? 'text-primary' : 'text-gray-400'}`}>
          <span className={`material-symbols-outlined transition-all ${isActive('/dashboard') ? 'font-bold scale-110' : ''}`}>person</span>
          <span className="text-[10px] font-bold tracking-wider">PERFIL</span>
        </Link>
      </div>
    </div>
  );
};

const Header: React.FC<{ cartCount: number }> = ({ cartCount }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = () => {
      setIsAdmin(localStorage.getItem('admin_auth') === 'true');
    };
    checkAdmin();
    // Check whenever localStorage might change or location changes
    window.addEventListener('storage', checkAdmin);
    return () => window.removeEventListener('storage', checkAdmin);
  }, [location]);

  const handleLogoutNavigate = () => {
    navigate('/admin');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparent = location.pathname === '/' && !isScrolled;

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${isTransparent ? 'bg-transparent' : 'bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-[#e7ebf3] dark:border-gray-800 shadow-sm'
        }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-4 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-3 text-primary z-50 relative">
            <div className="h-20 w-auto">
              <img src={logo} alt="Arablue Logo" className="h-full w-auto object-contain" />
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/shop" className={`${isActive('/shop') ? 'text-primary font-bold' : (isTransparent ? 'text-white' : 'text-[#0d121b] dark:text-gray-300')} text-sm font-semibold hover:text-primary transition-colors`}>Loja</Link>
            <Link to="/about" className={`${isActive('/about') ? 'text-primary font-bold' : (isTransparent ? 'text-white' : 'text-[#0d121b] dark:text-gray-300')} text-sm font-semibold hover:text-primary transition-colors`}>Nossa História</Link>
            <Link to="/contact" className={`${isActive('/contact') ? 'text-primary font-bold' : (isTransparent ? 'text-white' : 'text-[#0d121b] dark:text-gray-300')} text-sm font-semibold hover:text-primary transition-colors`}>Contato</Link>
          </nav>
        </div>
        <div className="flex items-center gap-6 z-50 relative">

          <div className="flex items-center gap-4">
            <Link to="/dashboard" className={`p-2 hover:bg-white/10 rounded-full transition-colors ${isTransparent ? 'text-white' : 'text-[#0d121b] dark:text-white'}`}>
              <span className="material-symbols-outlined">person</span>
            </Link>
            {isAdmin ? (
              <button
                onClick={handleLogoutNavigate}
                className={`p-2 hover:bg-white/10 rounded-full transition-colors ${isTransparent ? 'text-white' : 'text-[#0d121b] dark:text-white'}`}
                title="Ir para Painel Admin"
              >
                <span className="material-symbols-outlined text-primary">lock_open</span>
              </button>
            ) : (
              <Link to="/admin/login" className={`p-2 hover:bg-white/10 rounded-full transition-colors ${isTransparent ? 'text-white' : 'text-[#0d121b] dark:text-white'}`} title="Acesso Admin">
                <span className="material-symbols-outlined">lock</span>
              </Link>
            )}
            <Link to="/checkout" className={`p-2 hover:bg-white/10 rounded-full transition-colors relative ${isTransparent ? 'text-white' : 'text-[#0d121b] dark:text-white'}`}>
              <span className="material-symbols-outlined">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 size-4 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

    </header>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-white dark:bg-background-dark border-t border-gray-200 dark:border-gray-800 pt-20 pb-10 px-6 lg:px-20">
    <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
      <div className="space-y-6">
        <div className="flex items-center gap-3 text-primary">
          <div className="h-20 w-auto">
            <img src={logo} alt="Arablue Logo" className="h-full w-auto object-contain" />
          </div>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed">
          Moda masculina premium. Definindo autenticidade através de design minimalista e artesanato superior.
        </p>
        <div className="flex gap-4">
          <a href="#" className="size-9 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
            <span className="material-symbols-outlined text-lg">public</span>
          </a>
          <a href="#" className="size-9 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
            <span className="material-symbols-outlined text-lg">camera</span>
          </a>
        </div>
      </div>
      <div>
        <h5 className="font-bold text-sm uppercase tracking-widest mb-6">Compras</h5>
        <ul className="space-y-4 text-sm text-gray-500">
          <li><Link to="/shop" className="hover:text-primary">Todas as Coleções</Link></li>
          <li><Link to="/shop" className="hover:text-primary">Novidades</Link></li>
          <li><Link to="/shop" className="hover:text-primary">Mais Vendidos</Link></li>
        </ul>
      </div>
      <div>
        <h5 className="font-bold text-sm uppercase tracking-widest mb-6">Assistência</h5>
        <ul className="space-y-4 text-sm text-gray-500">
          <li><Link to="/contact" className="hover:text-primary">Envios e Devoluções</Link></li>
          <li><Link to="/contact" className="hover:text-primary">Guia de Tamanhos</Link></li>
          <li><Link to="/contact" className="hover:text-primary">Contate-nos</Link></li>
        </ul>
      </div>
      <div>
        <h5 className="font-bold text-sm uppercase tracking-widest mb-6">Garantia de Qualidade</h5>
        <p className="text-gray-500 text-sm leading-relaxed font-bold">
          Cada peça Arablue é submetida a rigorosos padrões de inspeção. Nosso compromisso é entregar excelência absoluta em cada costura, garantindo longevidade e sofisticação incomparáveis.
        </p>
      </div>
    </div>
    <div className="max-w-[1440px] mx-auto pt-10 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
      <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">© 2024 Arablue Industries. Autenticidade Garantida.</p>
      <div className="flex gap-8 text-[10px] uppercase tracking-widest font-bold text-gray-400">
        <a href="#" className="hover:text-[#0d121b] dark:hover:text-white">Política de Privacidade</a>
        <a href="#" className="hover:text-[#0d121b] dark:hover:text-white">Termos de Serviço</a>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header cartCount={cartCount} />
        <MobileBottomNav cartCount={cartCount} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home addToCart={addToCart} />} />
            <Route path="/shop" element={<Shop addToCart={addToCart} />} />
            <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} />} />
            <Route path="/about" element={<About />} />
            <Route path="/checkout" element={<Checkout cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
