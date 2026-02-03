
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const AdminLogin: React.FC = () => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(localStorage.getItem('admin_auth') === 'true');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data: config, error: fetchError } = await supabase
                .from('site_config')
                .select('value')
                .eq('key', 'admin_password')
                .single();

            const storedPassword = config?.value?.password || '88187375';

            if (password === storedPassword) {
                localStorage.setItem('admin_auth', 'true');
                navigate('/admin');
            } else {
                setError('Senha incorreta.');
            }
        } catch (err) {
            console.error('Erro no login:', err);
            setError('Erro ao validar acesso.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_auth');
        setIsAdmin(false);
        navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background-dark">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-700">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                        <span className="material-symbols-outlined text-primary text-4xl">admin_panel_settings</span>
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Administrador</h2>
                    <p className="text-gray-500 text-sm mt-2 font-medium">Acesso restrito ao sistema</p>
                </div>

                {isAdmin ? (
                    <div className="space-y-6 text-center">
                        <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-100 dark:border-green-800">
                            <span className="material-symbols-outlined text-green-500 text-3xl mb-2">check_circle</span>
                            <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Você já está autenticado.</p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => navigate('/admin')}
                                className="w-full bg-primary hover:bg-blue-700 text-white font-black py-5 rounded-2xl transition-all uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20"
                            >
                                Painel de Controle
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-600 dark:text-gray-300 hover:text-red-500 font-black py-5 rounded-2xl transition-all uppercase tracking-[0.2em] text-xs border border-transparent hover:border-red-200"
                            >
                                Finalizar Sessão
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Senha de Acesso</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">lock</span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-primary font-bold transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                                >
                                    <span className="material-symbols-outlined">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800 text-red-500 text-xs font-black text-center uppercase tracking-wider">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 ${loading
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-primary text-white hover:bg-blue-700 shadow-xl shadow-primary/20 active:scale-[0.98]'
                                }`}
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Acessar Painel
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AdminLogin;
