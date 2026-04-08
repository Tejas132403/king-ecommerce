import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import SuccessModal from '../components/SuccessModal';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer');
    const [shopName, setShopName] = useState('');
    const [shopDescription, setShopDescription] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const userData = await register({ name, email, password, role, shopName, shopDescription });
            setSuccess(true);
            setTimeout(() => {
                if (userData.role === 'customer') {
                    navigate('/');
                } else {
                    navigate('/dashboard');
                }
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };


    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)] relative p-4">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[130px] rounded-full -z-10"></div>
            
            <SuccessModal 
                isOpen={success} 
                title="Legacy Created." 
                message="Your identity has been established in the KING ecosystem. Synchronizing access..."
            />

            <form onSubmit={handleSubmit} className="glass p-12 rounded-[40px] shadow-2xl w-full max-w-lg space-y-8 border border-white/10 backdrop-blur-2xl bg-white/5 relative">
                <div className="space-y-3">
                    <h2 className="text-4xl font-black text-white tracking-tighter">Join Kingdom.</h2>
                    <p className="text-slate-400 font-medium">Start your journey as a buyer or merchant.</p>
                </div>
                {error && <div className="bg-red-500/10 text-red-400 p-4 rounded-2xl text-xs font-bold uppercase tracking-widest border border-red-500/20">{error}</div>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-white font-medium" 
                            required 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-white font-medium" 
                            required 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-white font-medium" 
                            required 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Account Type</label>
                        <select 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-white font-medium appearance-none"
                        >
                            <option value="customer" className="bg-slate-900">Customer</option>
                            <option value="seller" className="bg-slate-900">Seller</option>
                        </select>
                    </div>
                </div>

                {role === 'seller' && (
                    <div className="grid grid-cols-1 gap-6 pt-4 border-t border-white/10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Store Name</label>
                            <input 
                                type="text" 
                                value={shopName} 
                                onChange={(e) => setShopName(e.target.value)} 
                                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-white font-medium" 
                                required={role === 'seller'} 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Store Description</label>
                            <textarea 
                                value={shopDescription} 
                                onChange={(e) => setShopDescription(e.target.value)} 
                                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-white font-medium resize-none h-24" 
                                required={role === 'seller'} 
                            ></textarea>
                        </div>
                    </div>
                )}

                <button type="submit" className="w-full bg-blue-600 text-white font-black p-5 rounded-2xl hover:bg-blue-500 transition-all transform active:scale-95 shadow-xl shadow-blue-600/20 uppercase text-xs tracking-[0.25em]">
                    Create My Account
                </button>
                <p className="text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
                    Already a member? <Link to="/login" className="text-white hover:text-blue-400 transition-colors">Sign In</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;
