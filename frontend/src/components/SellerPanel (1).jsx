import React, { useState } from 'react';
import api from '../utils/api';

const SellerPanel = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState('');
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/api/products', { name, price, description, category, stock, image });
            setMessage('Product successfully integrated into KING catalog.');
            setName(''); setPrice(''); setDescription(''); setCategory(''); setStock(''); setImage('');
        } catch (err) {
            setMessage('Integration failed. Verify catalog requirements.');
        }
        setLoading(false);
    };

    return (
        <div className="space-y-10">
            <div className="space-y-3">
                <h3 className="text-4xl font-black text-white tracking-tighter uppercase">List Innovation.</h3>
                <p className="text-slate-400 font-medium">Introduce a new product to the global marketplace.</p>
            </div>
            
            {message && <div className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${message.includes('success') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>{message}</div>}
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Product Designation</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-white font-medium" required />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Price (₹)</label>
                            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-white font-medium" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Inventory</label>
                            <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-white font-medium" required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Category</label>
                        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-white font-medium" required />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Visual Asset URL</label>
                        <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-white font-medium" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Product Manifesto (Description)</label>
                        <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-white font-medium resize-none" required></textarea>
                    </div>
                </div>

                <div className="md:col-span-2 pt-4">
                    <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white font-black py-5 rounded-3xl hover:bg-indigo-500 transition-all transform active:scale-95 shadow-2xl shadow-indigo-600/20 uppercase text-xs tracking-[0.3em] disabled:opacity-50">
                        {loading ? 'Initializing Integration...' : 'Authorize Listing'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SellerPanel;
