import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import SuccessModal from '../components/SuccessModal';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const userData = await login(email, password);
            setSuccess(true);
            setTimeout(() => {
                if (userData.role === 'customer') {
                    navigate('/');
                } else {
                    navigate('/dashboard');
                }
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };


    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)] relative px-4">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full -z-10"></div>
            
            <SuccessModal 
                isOpen={success} 
                title="Sovereignty Established." 
                message="Your access has been verified by the KING system. Syncing your dashboard..."
            />

            <form onSubmit={handleSubmit} className="glass p-12 rounded-[40px] shadow-2xl w-full max-w-md space-y-8 border border-white/10 backdrop-blur-2xl bg-white/5 relative overflow-hidden group">
                <div className="space-y-3">
                    <h2 className="text-4xl font-black text-white tracking-tighter">Welcome Back.</h2>
                    <p className="text-slate-400 font-medium">Elevate your experience with KING.</p>
                </div>
                {error && <div className="bg-red-500/10 text-red-400 p-4 rounded-2xl text-xs font-bold uppercase tracking-widest border border-red-500/20 animate-shake">{error}</div>}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder:text-slate-600 font-medium" 
                            placeholder="you@example.com"
                            required 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder:text-slate-600 font-medium" 
                            placeholder="••••••••"
                            required 
                        />
                    </div>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-black p-5 rounded-2xl hover:bg-blue-500 transition-all transform active:scale-95 shadow-xl shadow-blue-600/20 uppercase text-xs tracking-[0.25em]">
                    Sign In
                </button>
                <p className="text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
                    New here? <Link to="/register" className="text-white hover:text-blue-400 transition-colors">Create Account</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
