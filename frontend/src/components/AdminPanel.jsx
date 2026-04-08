import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const AdminPanel = () => {
    const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newSeller, setNewSeller] = useState({ name: '', email: '', password: '', shopName: '', shopDescription: '' });
    const [adding, setAdding] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [u, p, o, s] = await Promise.all([
                api.get('/api/auth/profile').catch(() => ({ data: {} })), 
                api.get('/api/products'),
                api.get('/api/orders'),
                api.get('/api/admin/sellers')
            ]);
            setStats({ 
                users: 5, // Just mock for now based on original code
                products: p.data.length,
                orders: o.data.length 
            });
            setSellers(s.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleAddSeller = async (e) => {
        e.preventDefault();
        setAdding(true);
        try {
            const { data } = await api.post('/api/admin/sellers', newSeller);
            setSellers([...sellers, data]);
            setNewSeller({ name: '', email: '', password: '', shopName: '', shopDescription: '' });
            setSuccessMsg('Merchant identity successfully established.');
            setTimeout(() => setSuccessMsg(''), 5000);
        } catch (error) {

            alert(error.response?.data?.message || 'Error adding seller');
        }
        setAdding(false);
    };

    const handleRemoveSeller = async (id) => {
        if (!window.confirm('Are you sure you want to remove this seller and their shop?')) return;
        try {
            await api.delete(`/api/admin/sellers/${id}`);
            setSellers(sellers.filter(s => s._id !== id));
        } catch (error) {
            alert('Error removing seller');
        }
    };

    return (
        <div className="space-y-12">
            <div className="space-y-3">
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Infrastructure Status.</h2>
                <p className="text-slate-400 font-medium">Real-time overview of the KING ecosystem parameters.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glass p-8 rounded-[40px] border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 blur-[50px] rounded-full"></div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Total Entities</p>
                    <p className="text-6xl font-black mt-2 text-white group-hover:text-blue-400 transition-colors tracking-tighter">{stats.users}</p>
                </div>
                <div className="glass p-8 rounded-[40px] border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/10 blur-[50px] rounded-full"></div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Market Assets</p>
                    <p className="text-6xl font-black mt-2 text-white group-hover:text-indigo-400 transition-colors tracking-tighter">{stats.products}</p>
                </div>
                <div className="glass p-8 rounded-[40px] border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-600/10 blur-[50px] rounded-full"></div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Trade Volume</p>
                    <p className="text-6xl font-black mt-2 text-white group-hover:text-emerald-400 transition-colors tracking-tighter">{stats.orders}</p>
                </div>
            </div>

            <div className="glass p-10 rounded-[40px] border border-white/5 space-y-8 bg-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-600/5 blur-[80px] rounded-full"></div>
                
                <h3 className="text-sm font-black text-slate-300 uppercase tracking-[0.4em]">Manage Sellers</h3>
                
                {successMsg && (
                    <div className="bg-emerald-500/10 text-emerald-400 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 animate-in slide-in-from-top-4">
                        {successMsg}
                    </div>
                )}
                
                <form onSubmit={handleAddSeller} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/20 p-6 rounded-3xl border border-white/5">

                    <input type="text" placeholder="Seller Name" required value={newSeller.name} onChange={e => setNewSeller({...newSeller, name: e.target.value})} className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-blue-500 outline-none text-white w-full" />
                    <input type="email" placeholder="Seller Email" required value={newSeller.email} onChange={e => setNewSeller({...newSeller, email: e.target.value})} className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-blue-500 outline-none text-white w-full" />
                    <input type="password" placeholder="Temporary Password" required value={newSeller.password} onChange={e => setNewSeller({...newSeller, password: e.target.value})} className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-blue-500 outline-none text-white w-full" />
                    <input type="text" placeholder="Shop Name" required value={newSeller.shopName} onChange={e => setNewSeller({...newSeller, shopName: e.target.value})} className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-blue-500 outline-none text-white w-full" />
                    <textarea placeholder="Shop Description" value={newSeller.shopDescription} onChange={e => setNewSeller({...newSeller, shopDescription: e.target.value})} className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-blue-500 outline-none text-white w-full md:col-span-2 h-20 resize-none"></textarea>
                    
                    <div className="md:col-span-2 flex justify-end mt-2">
                        <button type="submit" disabled={adding} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-colors disabled:opacity-50">
                            {adding ? 'Adding...' : 'Add Seller & Shop'}
                        </button>
                    </div>
                </form>

                <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Sellers</h4>
                    {loading ? (
                         <div className="text-slate-500 text-xs text-center py-4">Loading sellers...</div>
                    ) : sellers.length === 0 ? (
                        <div className="text-slate-500 text-xs">No sellers found.</div>
                    ) : (
                        <div className="space-y-3">
                            {sellers.map(seller => (
                                <div key={seller._id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 glass rounded-3xl border border-white/5 relative group">
                                    <div className="space-y-1">
                                        <p className="text-sm font-black text-white">{seller.name} <span className="text-[10px] text-slate-500 font-normal">({seller.email})</span></p>
                                        <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Shop: {seller.shop?.name || 'No Shop Linked'}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleRemoveSeller(seller._id)}
                                        className="mt-4 md:mt-0 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-lg transition-colors border border-red-500/20"
                                    >
                                        Remove Seller
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
