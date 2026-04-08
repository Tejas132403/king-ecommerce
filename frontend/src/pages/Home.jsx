import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Home = () => {
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/api/products');
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products', error);
            }
            setLoading(false);
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) || 
        p.category.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm animate-pulse">Loading KING Experience...</p>
        </div>
    );

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 py-4">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black text-white tracking-tighter">Discover.</h1>
                    <p className="text-slate-400 font-medium">Unique products from verified shopkeepers.</p>
                </div>
                <div className="relative w-full md:w-[450px]">
                    <div className="absolute inset-0 bg-blue-500/20 blur-3xl opacity-20 -z-10"></div>
                    <input 
                        type="text" 
                        placeholder="Search products, brands, categories..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl shadow-2xl focus:ring-2 focus:ring-blue-500 outline-none backdrop-blur-md text-white placeholder:text-slate-500 transition-all font-medium"
                    />
                    <svg className="w-6 h-6 absolute left-5 top-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {filteredProducts.length === 0 ? (
                <div className="text-center py-32 glass rounded-3xl border-dashed border-2 border-white/5">
                    <p className="text-slate-500 font-bold uppercase tracking-widest">No products found matching your search.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProducts.map(product => (
                        <div key={product._id} className="group glass rounded-3xl overflow-hidden shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border border-white/5 hover:border-white/20 active:scale-95">
                            <div className="h-64 bg-slate-800 relative overflow-hidden">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                                <div className="absolute top-4 left-4 glass px-3 py-1.5 rounded-xl text-[10px] font-black text-blue-200 uppercase tracking-widest">
                                    {product.category}
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <Link to={`/product/${product._id}`} className="block">
                                    <h3 className="font-bold text-xl text-white group-hover:text-blue-400 transition-colors line-clamp-1 leading-tight">{product.name}</h3>
                                </Link>
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Price</p>
                                        <span className="text-3xl font-black text-white group-hover:text-blue-400 transition-colors tracking-tighter">₹{product.price}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter border border-white/5 px-2 py-1 rounded-lg">By {product.seller?.name || 'Seller'}</span>
                                </div>
                                <button 
                                    onClick={() => addToCart(product)}
                                    className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 active:translate-y-1 uppercase text-xs tracking-widest mt-2"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
