import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Zap, Star, ShieldCheck, Tag, Box, ArrowLeft, RefreshCcw } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const { addToCart } = useCart();
    const [activeTab, setActiveTab] = useState('description');
    
    // Magnifier state
    const [magnifierStyle, setMagnifierStyle] = useState({ display: 'none' });
    const imageRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0); // Always start at top
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/api/products/${id}`);
                setProduct(data);
            } catch(e) {
                console.error("Failed to fetch product", e);
            }
        };
        fetchProduct();
    }, [id]);

    const handleMouseMove = (e) => {
        if (!imageRef.current) return;
        const { left, top, width, height } = imageRef.current.getBoundingClientRect();
        
        let x = e.pageX - left - window.scrollX;
        let y = e.pageY - top - window.scrollY;

        // Calculate background position (zoom factor 2x)
        const bgPosX = (x / width) * 100;
        const bgPosY = (y / height) * 100;

        setMagnifierStyle({
            display: 'block',
            backgroundImage: `url('${product?.image}')`,
            backgroundPosition: `${bgPosX}% ${bgPosY}%`,
            backgroundSize: `${width * 2.5}px ${height * 2.5}px` // 2.5x zoom
        });
    };

    const handleMouseLeave = () => {
        setMagnifierStyle({ display: 'none' });
    };

    if (!product) return (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
            <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm animate-pulse">Loading Product Details...</p>
        </div>
    );

    // Mock calculations for premium view
    const originalPrice = Math.floor(product.price * 1.4); // 40% markup for visual discount
    const discountPercentage = Math.round(((originalPrice - product.price) / originalPrice) * 100);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            {/* Breadcrumb Header */}
            <div className="border-b border-white/5 bg-slate-950/80 backdrop-blur-3xl sticky top-[72px] z-40">
                <div className="container mx-auto px-4 py-3 flex items-center space-x-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                    <button onClick={() => navigate(-1)} className="hover:text-white transition-colors flex items-center"><ArrowLeft className="w-3 h-3 mr-1" /> Back</button>
                    <span>/</span>
                    <Link to="/" className="hover:text-white transition-colors">Catalog</Link>
                    <span>/</span>
                    <span className="text-blue-400">{product.category}</span>
                    <span>/</span>
                    <span className="text-white truncate max-w-[200px]">{product.name}</span>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative">
                    
                    {/* Left Column: Image Gallery & Magnifier */}
                    <div className="lg:col-span-4 space-y-6">
                        <div 
                            className="relative group rounded-3xl overflow-hidden glass border border-white/10 shadow-2xl bg-white/5 cursor-crosshair h-[500px]"
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            ref={imageRef}
                        >
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-full object-cover p-4" 
                            />
                            {/* Overlay tag */}
                            <div className="absolute top-4 left-4 bg-red-600/90 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg">
                                {discountPercentage}% OFF
                            </div>
                        </div>

                        {/* Interactive Magnifier Box - Appears adjacent when hovering */}
                        <div 
                            className="absolute top-0 left-full ml-4 w-[600px] h-[500px] rounded-3xl border border-white/20 shadow-3xl z-50 pointer-events-none transition-opacity duration-200"
                            style={{ 
                                ...magnifierStyle,
                                opacity: magnifierStyle.display === 'none' ? 0 : 1,
                                display: magnifierStyle.display === 'none' ? 'none' : 'block' // Keep block but toggle opacity for smoothness or simply toggle display
                            }}
                        />

                        {/* Thumbnail Bar */}
                        <div className="flex space-x-4">
                             {[product.image, product.image, product.image].map((img, i) => (
                                <div key={i} className={`w-24 h-24 rounded-xl border-2 ${i===0 ? 'border-blue-500' : 'border-white/5 opacity-50'} overflow-hidden cursor-pointer hover:opacity-100 transition-opacity`}>
                                   <img src={img} alt="thumbnail" className="w-full h-full object-cover p-2 bg-white/5" />
                                </div>
                             ))}
                        </div>
                    </div>

                    {/* Middle Column: Product Details */}
                    <div className="lg:col-span-5 space-y-8">
                        {/* Title and Reviews */}
                        <div className="space-y-4">
                            <h1 className="text-4xl font-black text-white leading-tight tracking-tight">{product.name}</h1>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center bg-blue-600/20 text-blue-400 px-2 py-1 rounded-lg">
                                    <span className="font-bold mr-1">4.8</span>
                                    <Star className="w-4 h-4 fill-current" />
                                </div>
                                <span className="text-slate-500 text-sm font-medium hover:text-blue-400 cursor-pointer transition-colors">1,245 Ratings & 342 Reviews</span>
                                <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                                <span className="text-emerald-400 text-sm font-bold flex items-center"><ShieldCheck className="w-4 h-4 mr-1" /> KING Verified</span>
                            </div>
                        </div>

                        <div className="w-full h-px bg-white/5"></div>

                        {/* Price Details */}
                        <div className="space-y-2">
                             <div className="flex items-end space-x-4">
                                 <span className="text-5xl font-black text-white tracking-tighter">₹{product.price}</span>
                                 <span className="text-xl text-slate-500 line-through font-bold mb-1">₹{originalPrice}</span>
                                 <span className="text-lg text-emerald-400 font-black mb-1">{discountPercentage}% off</span>
                             </div>
                             <p className="text-slate-400 text-xs font-medium">Inclusive of all physical and digital taxes</p>
                        </div>

                        {/* Offers */}
                        <div className="space-y-4">
                             <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center"><Tag className="w-4 h-4 mr-2 text-blue-500" /> Active Offers</h3>
                             <div className="space-y-3">
                                 <div className="flex items-start space-x-3 text-sm">
                                      <img src="https://img.icons8.com/color/48/000000/mastercard.png" className="w-5 h-5 mt-0.5" alt="bank" />
                                      <p className="text-slate-300"><span className="font-bold text-white">Bank Offer:</span> 5% Unlimited Cashback on Elite Credit Cards <span className="text-blue-400 cursor-pointer text-xs">T&C</span></p>
                                 </div>
                                 <div className="flex items-start space-x-3 text-sm">
                                      <img src="https://img.icons8.com/color/48/000000/discount--v1.png" className="w-5 h-5 mt-0.5" alt="promo" />
                                      <p className="text-slate-300"><span className="font-bold text-white">Special Price:</span> Get extra 10% off (price inclusive of cashback/coupon) <span className="text-blue-400 cursor-pointer text-xs">T&C</span></p>
                                 </div>
                             </div>
                        </div>

                        {/* Merchant Info */}
                        <div className="glass p-5 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Fulfilled By</p>
                                <p className="text-lg font-black text-indigo-400">{product.seller?.name || 'Authorized Merchant'}</p>
                            </div>
                            <div className="text-right space-y-1">
                                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Performance</p>
                                <p className="text-sm font-bold text-white">99.8% Positive</p>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Sticky Action Bar (Buy Box) */}
                    <div className="lg:col-span-3 pb-24">
                        <div className="sticky top-[140px] glass p-6 rounded-[32px] border border-white/10 bg-slate-900 shadow-2xl space-y-8">
                            
                            {/* Delivery Estimator */}
                            <div className="space-y-3">
                                <div className="flex items-start space-x-3 border-b border-white/10 pb-4">
                                     <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mt-1">
                                         <Box className="w-4 h-4" />
                                     </div>
                                     <div>
                                         <p className="text-sm font-bold text-emerald-400">Free Delivery</p>
                                         <p className="text-slate-300 font-bold block">Delivery by {new Date(Date.now() + 86400000 * 2).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
                                         <p className="text-xs text-slate-500 mt-1">Order within <span className="text-blue-400">12 hrs 30 mins</span></p>
                                     </div>
                                </div>
                                <div className="flex items-start space-x-3 border-b border-white/10 pb-4">
                                     <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mt-1">
                                         <RefreshCcw className="w-4 h-4" />
                                     </div>
                                     <div>
                                         <p className="text-sm font-bold text-white">7 Days Replacement</p>
                                         <p className="text-xs text-slate-500 mt-1">No questions asked return policy on damaged items.</p>
                                     </div>
                                </div>
                            </div>

                            {/* Stock & Actions */}
                            <div className="space-y-4">
                                <p className="text-2xl font-black text-emerald-400">In Stock</p>
                                <p className="text-xs text-slate-500 font-bold">Only {product.stock} units left in the central hub!</p>
                                
                                <div className="flex flex-col space-y-3 pt-2">
                                    <button 
                                        onClick={() => addToCart(product)}
                                        className="w-full bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-500 transition-all transform active:scale-95 shadow-xl shadow-blue-600/20 flex items-center justify-center space-x-2"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        <span>Add to Cart</span>
                                    </button>
                                    <button 
                                        className="w-full bg-orange-500 text-white font-black py-4 rounded-xl hover:bg-orange-400 transition-all transform active:scale-95 shadow-xl shadow-orange-500/20 flex items-center justify-center space-x-2"
                                    >
                                        <Zap className="w-5 h-5 fill-current" />
                                        <span>Buy Now</span>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-center space-x-2 text-slate-500 text-[10px] font-black uppercase tracking-widest pt-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                <span>Secure End-to-End Encryption</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Section: Tabs for Details */}
                <div className="mt-16 bg-white/5 border border-white/10 rounded-[40px] overflow-hidden">
                    <div className="flex border-b border-white/10 bg-slate-900/50">
                        <button 
                            onClick={() => setActiveTab('description')}
                            className={`flex-1 py-6 text-sm font-black uppercase tracking-widest transition-colors ${activeTab === 'description' ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            Product Manifesto
                        </button>
                        <button 
                            onClick={() => setActiveTab('specifications')}
                            className={`flex-1 py-6 text-sm font-black uppercase tracking-widest transition-colors ${activeTab === 'specifications' ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            Technical Specs
                        </button>
                        <button 
                            onClick={() => setActiveTab('reviews')}
                            className={`flex-1 py-6 text-sm font-black uppercase tracking-widest transition-colors ${activeTab === 'reviews' ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            Ecosystem Reviews (342)
                        </button>
                    </div>
                    
                    <div className="p-10 lg:p-16 min-h-[300px]">
                        {activeTab === 'description' && (
                            <div className="space-y-6 max-w-4xl text-slate-300 leading-relaxed text-lg font-medium">
                                <p>This premium item, curated specifically for the KING marketplace, offers unparalleled engagement with its environment. Specifically categorized under <span className="text-white font-bold">{product.category}</span>, it represents the pinnacle of modern asset design.</p>
                                <p className="italic text-slate-400 border-l-4 border-blue-500 pl-6 my-8">"{product.description}"</p>
                                <p>Whether you're acquiring this for immediate utility or as a long-term hold in your inventory, it provides the reliability backed by our authorized merchant network. Secure yours today before stock limits out.</p>
                            </div>
                        )}
                        {activeTab === 'specifications' && (
                            <div className="max-w-4xl">
                                <table className="w-full text-left text-sm text-slate-300">
                                    <tbody>
                                        <tr className="border-b border-white/5">
                                            <th className="py-4 font-black uppercase tracking-widest text-slate-500 w-1/3">Item Designation</th>
                                            <td className="py-4 font-medium text-white">{product.name}</td>
                                        </tr>
                                        <tr className="border-b border-white/5 bg-white/[0.02]">
                                            <th className="py-4 pl-4 font-black uppercase tracking-widest text-slate-500 w-1/3">Category classification</th>
                                            <td className="py-4 font-medium text-white">{product.category}</td>
                                        </tr>
                                        <tr className="border-b border-white/5">
                                            <th className="py-4 font-black uppercase tracking-widest text-slate-500 w-1/3">Stock Identifier</th>
                                            <td className="py-4 font-medium text-white">{product._id.slice(-8).toUpperCase()}-KNG</td>
                                        </tr>
                                        <tr className="bg-white/[0.02]">
                                            <th className="py-4 pl-4 font-black uppercase tracking-widest text-slate-500 w-1/3">Merchant Hash</th>
                                            <td className="py-4 font-medium text-white">{product.seller?._id || 'SYS-DEFAULT'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {activeTab === 'reviews' && (
                            <div className="space-y-8 max-w-4xl">
                                <div className="flex items-center space-x-6 pb-8 border-b border-white/10">
                                    <div className="text-center">
                                         <h2 className="text-6xl font-black text-white tracking-tighter">4.8</h2>
                                         <div className="flex text-blue-500 justify-center my-2">
                                             <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current opacity-50" />
                                         </div>
                                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Avg</p>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                         {/* Mock Rating Bars */}
                                         {[5,4,3,2,1].map(num => (
                                             <div key={num} className="flex items-center space-x-3 text-xs font-bold text-slate-400">
                                                 <span>{num} <Star className="w-3 h-3 inline-block -mt-1" /></span>
                                                 <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                                     <div className="h-full bg-blue-500" style={{ width: num === 5 ? '78%' : num === 4 ? '15%' : num === 3 ? '5%' : '1%' }}></div>
                                                 </div>
                                             </div>
                                         ))}
                                    </div>
                                </div>
                                <div className="space-y-6">
                                     <div className="space-y-2">
                                         <div className="flex items-center space-x-3">
                                             <div className="flex text-blue-500"><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /></div>
                                             <span className="text-white font-bold">Impeccable Quality</span>
                                         </div>
                                         <p className="text-slate-400 text-sm">Exceeded expectations. The shipping was extremely fast and the item was perfectly sealed.</p>
                                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Verified Buyer - 2 days ago</p>
                                     </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
