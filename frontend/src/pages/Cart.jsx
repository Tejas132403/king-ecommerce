import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Cart = () => {
    const { cartItems, removeFromCart, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCheckout = async () => {
        if (!user) return navigate('/login');
        try {
            const orderData = {
                items: cartItems.map(i => ({ product: i._id, quantity: i.quantity, price: i.price })),
                totalAmount: cartTotal,
                address: 'University Campus, Project Demo' // Placeholder address
            };
            await api.post('/api/orders', orderData);
            alert('Order placed successfully!');
            clearCart();
            navigate('/dashboard');
        } catch (error) {
            console.error('Checkout failed', error);
        }
    };

    if (cartItems.length === 0) return <div className="text-center py-20 text-slate-500 text-xl">Your cart is empty.</div>;

    return (
        <div className="space-y-12 max-w-5xl mx-auto py-4">
            <div className="space-y-2 border-b border-white/5 pb-10">
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Review Your</p>
                <h1 className="text-6xl font-black text-white tracking-tighter uppercase">Selection.</h1>
            </div>

            {cartItems.length === 0 ? (
                <div className="glass p-32 rounded-[50px] text-center space-y-6 border border-white/5 relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full"></div>
                    <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-xs">Your collection is empty.</p>
                    <Link to="/" className="inline-block bg-white text-slate-900 px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform active:scale-95">Discover Products</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                    <div className="lg:col-span-2 space-y-6">
                        {cartItems.map((item, index) => (
                            <div key={index} className="glass p-6 rounded-[32px] border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all">
                                <div className="flex items-center space-x-6">
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden glass border border-white/10 group-hover:scale-105 transition-transform shadow-xl">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover brightness-90 group-hover:brightness-100" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-black text-xl text-white tracking-tight">{item.name}</h3>
                                        <p className="text-blue-400 font-black tracking-tighter text-lg">₹{item.price}</p>
                                        <div className="flex items-center space-x-2">
                                             <span className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-50"></span>
                                             <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{item.category}</p>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => removeFromCart(item._id)}
                                    className="p-4 bg-white/5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all border border-white/5 hover:border-red-500/20 shadow-xl group/btn"
                                >
                                    <svg className="w-6 h-6 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" /></svg>
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="glass p-10 rounded-[40px] border border-white/5 space-y-8 sticky top-32 shadow-2xl overflow-hidden bg-white/5 backdrop-blur-3xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[60px] rounded-full"></div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter">Manifest</h2>
                        <div className="space-y-4 border-y border-white/5 py-8">
                            <div className="flex justify-between items-center px-2">
                                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Subtotal</span>
                                <span className="text-white font-bold tracking-tighter">₹{cartTotal}</span>
                            </div>
                            <div className="flex justify-between items-center px-2">
                                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Handling</span>
                                <span className="text-emerald-400 font-bold uppercase text-[10px] tracking-widest">Complimentary</span>
                            </div>
                            <div className="flex justify-between items-center px-4 py-4 glass rounded-2xl border border-white/10 mt-6 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors"></div>
                                <span className="text-white text-xs font-black uppercase tracking-widest relative">Total Investment</span>
                                <span className="text-3xl font-black text-white tracking-tighter relative">₹{cartTotal}</span>
                            </div>
                        </div>

                        <button 
                            onClick={handleCheckout}
                            className="w-full bg-blue-600 text-white font-black py-6 rounded-2xl hover:bg-blue-500 transition-all transform active:scale-[0.98] shadow-2xl shadow-blue-600/30 uppercase text-xs tracking-[0.3em]"
                        >
                            Finalize Acquisition
                        </button>
                        <p className="text-center text-[8px] font-black text-slate-600 uppercase tracking-widest">By finalizing, you agree to the conditions of merchant fulfillment.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
