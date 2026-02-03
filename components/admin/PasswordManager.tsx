
import React, { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

const PasswordManager: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'As senhas não coincidem.' });
            return;
        }

        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'A nova senha deve ter pelo menos 6 caracteres.' });
            return;
        }

        setLoading(true);

        try {
            // 1. Verify current password
            const { data: config, error: fetchError } = await supabase
                .from('site_config')
                .select('value')
                .eq('key', 'admin_password')
                .single();

            const storedPassword = config?.value?.password || '88187375'; // Default fallback

            if (currentPassword !== storedPassword) {
                setMessage({ type: 'error', text: 'Senha atual incorreta.' });
                setLoading(false);
                return;
            }

            // 2. Update to new password
            const { error: updateError } = await supabase
                .from('site_config')
                .upsert({
                    key: 'admin_password',
                    value: { password: newPassword }
                });

            if (updateError) throw updateError;

            setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error('Erro ao alterar senha:', error);
            setMessage({ type: 'error', text: 'Erro ao processar a solicitação.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto space-y-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Alterar Senha de Admin</h3>
                <p className="text-sm text-gray-500 mt-2">Mantenha sua conta de administrador segura trocando sua senha periodicamente.</p>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
                {/* Current Password */}
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Senha Atual</label>
                    <div className="relative">
                        <input
                            type={showCurrent ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-primary font-bold transition-all pr-12"
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrent(!showCurrent)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                        >
                            <span className="material-symbols-outlined">
                                {showCurrent ? 'visibility_off' : 'visibility'}
                            </span>
                        </button>
                    </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Nova Senha</label>
                    <div className="relative">
                        <input
                            type={showNew ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-primary font-bold transition-all pr-12"
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                        >
                            <span className="material-symbols-outlined">
                                {showNew ? 'visibility_off' : 'visibility'}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Confirmar Nova Senha</label>
                    <div className="relative">
                        <input
                            type={showConfirm ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-primary font-bold transition-all pr-12"
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                        >
                            <span className="material-symbols-outlined">
                                {showConfirm ? 'visibility_off' : 'visibility'}
                            </span>
                        </button>
                    </div>
                </div>

                {message.text && (
                    <div className={`p-4 rounded-2xl text-sm font-bold text-center animate-in fade-in duration-300 ${message.type === 'success'
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                            : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                        }`}>
                        {message.text}
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
                            <span className="material-symbols-outlined text-sm">lock_reset</span>
                            Atualizar Senha
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default PasswordManager;
