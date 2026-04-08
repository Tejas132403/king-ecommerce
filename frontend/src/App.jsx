import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  
  const showCustomerLinks = !user || user.role === 'customer';

  return (
    <nav className="glass sticky top-0 z-50 px-8 py-4 flex justify-between items-center shadow-2xl backdrop-blur-2xl bg-slate-900/60 border-b border-white/10 transition-all duration-500">
      <Link to={user ? (user.role === 'customer' ? "/" : "/dashboard") : "/"} className="flex items-center space-x-2 group">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform">
            <span className="text-white font-black text-xl">K</span>
        </div>
        <span className="text-3xl font-black tracking-tighter bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          KING
        </span>
      </Link>
      
      <div className="hidden md:flex items-center space-x-10">
        {showCustomerLinks && (
          <>
            <Link to="/" className="text-slate-400 hover:text-white font-bold transition-all text-[10px] uppercase tracking-[0.2em]">Home</Link>
            <Link to="/cart" className="relative group flex items-center space-x-2">
                <span className="text-slate-400 group-hover:text-white transition-all text-[10px] uppercase tracking-[0.2em] font-bold">Cart</span>
                <div className="relative">
                    <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                    {cartItems.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-black shadow-lg shadow-blue-600/50 animate-pulse">
                            {cartItems.length}
                        </span>
                    )}
                </div>
            </Link>
          </>
        )}
        
        {user && user.role === 'admin' && (
          <Link to="/dashboard" className="text-purple-400 hover:text-purple-300 font-bold transition-all text-[10px] uppercase tracking-[0.2em] border border-purple-500/30 px-3 py-1 rounded-full bg-purple-500/5 shadow-lg shadow-purple-500/10">Admin Portal</Link>
        )}
        {user && user.role === 'seller' && (
          <Link to="/dashboard" className="text-indigo-400 hover:text-indigo-300 font-bold transition-all text-[10px] uppercase tracking-[0.2em] border border-indigo-500/30 px-3 py-1 rounded-full bg-indigo-500/5 shadow-lg shadow-indigo-500/10">Seller Portal</Link>
        )}

        {user ? (
          <div className="flex items-center space-x-6 pl-6 border-l border-white/10">
            <Link to="/dashboard" className="text-slate-400 hover:text-white font-bold transition-all text-[10px] uppercase tracking-[0.2em]">Dashboard</Link>
            <button onClick={logout} className="text-red-400 hover:text-red-300 font-black text-[10px] uppercase tracking-[0.2em] transition-colors">Logout</button>
            <div className="flex items-center space-x-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest leading-none">@{user.name.split(' ')[0]}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-6">
            <Link to="/login" className="text-slate-400 hover:text-white font-bold transition-all text-[10px] uppercase tracking-[0.2em]">Login</Link>
            <Link to="/register" className="bg-white text-slate-900 px-8 py-3 rounded-2xl font-black text-[10px] hover:bg-blue-500 hover:text-white transition-all uppercase tracking-[0.2em] shadow-2xl shadow-white/5">Join</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

const Footer = () => {
    const { user } = useAuth();
    const showCustomerLinks = !user || user.role === 'customer';

    return (
        <footer className="mt-32 border-t border-white/5 bg-slate-950/50 backdrop-blur-3xl pt-24 pb-12 px-8">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="space-y-6 md:col-span-1">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                            <span className="text-slate-900 font-black text-lg">K</span>
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-white">KING</span>
                    </Link>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">
                        Redefining the digital marketplace with elite curation and seamless merchant integration. Built for the modern ecosystem.
                    </p>
                    <div className="flex space-x-4">
                        <div className="w-10 h-10 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-white border border-white/5 hover:border-white/20 transition-all cursor-pointer">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                        </div>
                        <div className="w-10 h-10 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-white border border-white/5 hover:border-white/20 transition-all cursor-pointer">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h4 className="text-white font-black text-xs uppercase tracking-[0.4em]">Marketplace</h4>
                    <ul className="space-y-4">
                        {showCustomerLinks && (
                          <>
                            <li><Link to="/" className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Discover</Link></li>
                            <li><Link to="/cart" className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Acquisitions</Link></li>
                          </>
                        )}
                        <li><Link to="/login" className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Portal Access</Link></li>
                    </ul>
                </div>

                <div className="space-y-6">
                    <h4 className="text-white font-black text-xs uppercase tracking-[0.4em]">Protocols</h4>
                    <ul className="space-y-4">
                        <li><span className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest cursor-pointer">Security Ledger</span></li>
                        <li><span className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest cursor-pointer">Trade Terms</span></li>
                        <li><span className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest cursor-pointer">Privacy Matrix</span></li>
                    </ul>
                </div>

                <div className="space-y-8 glass p-8 rounded-[32px] border border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[60px] rounded-full group-hover:bg-blue-600/20 transition-all duration-500"></div>
                    <div className="relative space-y-4">
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.3em]">Nexus Subscription</h4>
                        <p className="text-slate-500 text-xs font-medium leading-relaxed">Receive elite updates and curated catalog drops directly.</p>
                        <div className="flex space-x-2">
                            <input type="text" placeholder="Identity Email" className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-blue-500 outline-none w-full text-white" />
                            <button className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-500 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="container mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.5em]">© 2026 KING OVERSEER CONGLOMERATE. ALL RIGHTS RESERVED.</p>
                <div className="flex space-x-8">
                     <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">EST. 2026</span>
                     <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">MERN ARCHITECTURE</span>
                </div>
            </div>
        </footer>
    );
};

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Link to="/login" />; // Actually should use Navigate
  if (roles && !roles.includes(user.role)) {
    return <div className="text-center py-20 text-white font-black uppercase tracking-widest">Unauthorized Access.</div>;
  }
  return children;
};

// Import Navigate for redirection
import { Navigate } from 'react-router-dom';

const App = () => {
  const { user } = useAuth();
  
  return (
    <Router>
      <div className="min-h-screen bg-mesh text-slate-100 font-sans selection:bg-blue-500/30 flex flex-col">
        <Navbar />
        <main className="container mx-auto px-4 py-12 flex-grow">
          <Routes>
            <Route path="/" element={
              user && (user.role === 'admin' || user.role === 'seller') ? <Navigate to="/dashboard" /> : <Home />
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={
              user && (user.role === 'admin' || user.role === 'seller') ? <Navigate to="/dashboard" /> : <Cart />
            } />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/product/:id" element={<ProductDetails />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};


export default App;
