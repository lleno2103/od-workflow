import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const success = login(email, password);

        if (success) {
            navigate('/home');
        } else {
            setError('Email ou senha incorretos');
            setTimeout(() => setError(''), 3000);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <div className="w-full max-w-[400px] bg-white rounded-xl shadow-lg p-8">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-black mb-1 tracking-tight">2 1 0 3</h1>
                    <p className="text-xs text-gray-500 tracking-[0.2em] font-medium uppercase">Creative</p>
                </div>

                <h2 className="text-center text-lg font-medium text-gray-900 mb-6">Login to ERP</h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Input */}
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="jane@example.com"
                            required
                            className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="•••••"
                            required
                            className="w-full pl-10 pr-20 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-black font-medium"
                        >
                            {showPassword ? 'ocultar' : 'mostrar'}
                        </button>
                    </div>

                    {/* Forgot Password */}
                    <div className="text-right">
                        <a href="#" className="text-xs text-gray-500 hover:text-black transition-colors">
                            Esqueceu a senha?
                        </a>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
                    >
                        Entrar
                    </button>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs text-center">
                            {error}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Login;
