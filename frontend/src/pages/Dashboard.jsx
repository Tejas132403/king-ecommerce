import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import SellerPanel from '../components/SellerPanel';
import AdminPanel from '../components/AdminPanel';

const Dashboard = () => {
    const { user, loading } = useAuth();
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) navigate('/login');
    }, [user, loading, navigate]);

    useEffect(() => {
        const fetchOrders = async () => {
            const { data } = await api.get('/api/orders/myorders');
            setOrders(data);
        };
        if (user) fetchOrders();
    }, [user]);

    if (loading || !user) return (
        <div className="flex flex-col items-center justify-center py-40 space-y-4 font-sans">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm animate-pulse">Synchronizing Session...</p>
        </div>
    );

    return (
        <div className="space-y-16 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-12 gap-8">
                <div className="space-y-4">
                    <div className="inline-flex items-center space-x-2 glass px-3 py-1 rounded-full border border-white/10">
                         <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                         <span className="text-[10px] font-black text-blue-200 uppercase tracking-[0.2em]">{user.role} Verified</span>
                    </div>
                    <h1 className="text-7xl font-black text-white tracking-tighter uppercase leading-none">{user.name.split(' ')[0]}'s Hub</h1>
                    <p className="text-slate-400 font-medium italic">Welcome back to the KING ecosystem.</p>
                </div>
                <div className="glass p-6 rounded-[32px] border border-white/10 flex items-center space-x-6 shadow-2xl bg-white/5 backdrop-blur-xl">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                         <span className="text-xl font-black text-white">{user.name[0]}</span>
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-white font-black text-sm tracking-tight">{user.email}</p>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Active Identity</p>
                    </div>
                </div>
            </div>

            <div className="space-y-10">
                {user.role === 'customer' && (
                    <>
                        <div className="flex items-center space-x-4">
                            <div className="h-0.5 w-16 bg-blue-600"></div>
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.6em]">Acquisition Pipeline</h2>
                        </div>

                        {orders.length === 0 ? (
                            <div className="glass p-32 rounded-[60px] text-center space-y-8 border border-white/5 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="space-y-2">
                                    <p className="text-slate-300 font-black text-2xl tracking-tight">Your history is a blank canvas.</p>
                                    <p className="text-slate-500 font-medium">Acquire your first curated item to begin your legacy.</p>
                                </div>
                                <Link to="/" className="inline-block bg-white text-slate-900 px-12 py-5 rounded-3xl font-black uppercase text-[10px] tracking-[0.3em] hover:scale-105 transition-transform shadow-2xl shadow-white/10">Explore Catalog</Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-8">
                                {orders.map(order => (
                                    <div key={order._id} className="glass p-10 rounded-[40px] border border-white/5 hover:border-white/10 transition-all duration-500 flex flex-col lg:flex-row justify-between items-center group relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-10 relative">
                                            <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-blue-600/10 group-hover:border-blue-600/20 transition-all shadow-inner">
                                                <svg className="w-10 h-10 text-blue-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
                                            </div>
                                            <div className="space-y-2 text-center md:text-left">
                                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] italic leading-none">ORDER_REF: {order._id.slice(-8).toUpperCase()}</p>
                                                <p className="text-3xl font-black text-white tracking-tighter leading-none">₹{order.totalAmount}</p>
                                                <div className="flex items-center justify-center md:justify-start space-x-3 mt-2">
                                                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                    <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                                                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{order.items.length} Curated Items</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-8 lg:mt-0 relative">
                                            <div className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border shadow-2xl transition-all group-hover:scale-105 ${
                                                order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10' : 
                                                order.status === 'pending' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-orange-500/10' : 
                                                'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-500/10'
                                            }`}>
                                                {order.status}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {user.role === 'seller' && (
                <div className="mt-12 space-y-12">
                     <div className="flex items-center space-x-4">
                        <div className="h-0.5 w-16 bg-indigo-600"></div>
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.6em]">Merchant Terminal</h2>
                    </div>
                    <div className="glass p-12 rounded-[50px] border border-white/10 shadow-3xl bg-white/5 backdrop-blur-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full"></div>
                        <SellerPanel />
                    </div>
                </div>
            )}

            {user.role === 'admin' && (
                <div className="mt-12 space-y-12">
                    <div className="flex items-center space-x-4">
                        <div className="h-0.5 w-16 bg-purple-600"></div>
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.6em]">Global Oversight</h2>
                    </div>
                    <div className="glass p-12 rounded-[50px] border border-white/10 shadow-3xl bg-white/5 backdrop-blur-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full"></div>
                        <AdminPanel />
                    </div>
                </div>
            )}
        </div>
    );
};


export default Dashboard;
