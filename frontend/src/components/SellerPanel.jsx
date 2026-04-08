import React, { useState, useEffect } from 'react';
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

    const [myProducts, setMyProducts] = useState([]);
    const [myOrders, setMyOrders] = useState([]);
    const [view, setView] = useState('add_product'); // 'add_product', 'my_products', 'my_orders'

    useEffect(() => {
        if (view === 'my_products') fetchProducts();
        if (view === 'my_orders') fetchOrders();
    }, [view]);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/api/products/seller');
            setMyProducts(data);
        } catch (err) {
            console.error('Error fetching products', err);
        }
    };

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/api/orders/seller');
            setMyOrders(data);
        } catch (err) {
            console.error('Error fetching orders', err);
        }
    };

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

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Terminate this product listing permanently?')) return;
        try {
            await api.delete(`/api/products/${id}`);
            setMyProducts(myProducts.filter(p => p._id !== id));
        } catch (err) {
            alert('Termination failed.');
        }
    };

    const handleUpdateStatus = async (orderId, status) => {
        try {
            await api.put(`/api/orders/${orderId}`, { status });
            setMyOrders(myOrders.map(o => o._id === orderId ? { ...o, status } : o));
        } catch (err) {
            alert('Status update failed.');
        }
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-wrap gap-4 border-b border-white/5 pb-8">
                <button 
                    onClick={() => setView('add_product')}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'add_product' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                >
                    Add Product
                </button>
                <button 
                    onClick={() => setView('my_products')}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'my_products' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                >
                    My Inventory
                </button>
                <button 
                    onClick={() => setView('my_orders')}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'my_orders' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                >
                    Merchant Orders
                </button>
            </div>

            {view === 'add_product' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
            )}

            {view === 'my_products' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-3">
                        <h3 className="text-4xl font-black text-white tracking-tighter uppercase">Inventory Core.</h3>
                        <p className="text-slate-400 font-medium">Manage your active listings in the KING catalog.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myProducts.map(product => (
                            <div key={product._id} className="glass p-6 rounded-[32px] border border-white/5 group relative overflow-hidden flex flex-col justify-between">
                                <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="space-y-4">
                                    <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-inner">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-lg font-black text-white tracking-tight">{product.name}</h4>
                                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">₹{product.price} • {product.stock} Units</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleDeleteProduct(product._id)}
                                    className="mt-6 w-full py-3 rounded-xl bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                                >
                                    End Listing
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {view === 'my_orders' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-3">
                        <h3 className="text-4xl font-black text-white tracking-tighter uppercase">Merchant Orders.</h3>
                        <p className="text-slate-400 font-medium">Fulfill requests for your curated assets.</p>
                    </div>

                    <div className="space-y-6">
                        {myOrders.length === 0 ? (
                            <p className="text-slate-500 text-xs text-center py-20 font-black uppercase tracking-widest">No pending requests found.</p>
                        ) : (
                            myOrders.map(order => (
                                <div key={order._id} className="glass p-8 rounded-[40px] border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden group">
                                     <div className="absolute inset-0 bg-slate-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                     <div className="space-y-4 relative">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">REF_{order._id.slice(-6).toUpperCase()}</p>
                                            <h4 className="text-xl font-black text-white">Consignee: {order.customer?.name}</h4>
                                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{order.customer?.email}</p>
                                        </div>
                                        <div className="space-y-2">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center space-x-3 bg-white/5 p-2 rounded-xl border border-white/5">
                                                     <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-[10px] uppercase">{item.quantity}x</div>
                                                     <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{item.product?.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                     </div>
                                     <div className="space-y-4 text-right w-full md:w-auto relative">
                                         <p className="text-2xl font-black text-white tracking-widest">₹{order.totalAmount}</p>
                                         <select 
                                            value={order.status}
                                            onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                            className="w-full md:w-auto bg-white/5 border border-white/10 rounded-xl px-6 py-3 text-[10px] font-black uppercase tracking-widest text-indigo-400 focus:ring-2 focus:ring-indigo-600 outline-none appearance-none cursor-pointer"
                                         >
                                             <option value="pending" className="bg-slate-900">PENDING</option>
                                             <option value="accepted" className="bg-slate-900">ACCEPTED</option>
                                             <option value="shipped" className="bg-slate-900">SHIPPED</option>
                                             <option value="delivered" className="bg-slate-900">DELIVERED</option>
                                             <option value="cancelled" className="bg-slate-900">CANCELLED</option>
                                         </select>
                                     </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerPanel;

