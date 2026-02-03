
import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';

const BannerEditor: React.FC = () => {
    const [banners, setBanners] = useState({ desktop: '', mobile: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const { data, error } = await supabase
                .from('site_config')
                .select('value')
                .eq('key', 'banners')
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            if (data) {
                setBanners(data.value);
            }
        } catch (error) {
            console.error('Error fetching banners:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            const { error } = await supabase
                .from('site_config')
                .upsert({ key: 'banners', value: banners });

            if (error) throw error;
            setMessage('Banners atualizados com sucesso!');
        } catch (error) {
            console.error('Error saving banners:', error);
            setMessage('Erro ao salvar banners.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Carregando banners...</div>;

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold">Editar Banners da Home</h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold mb-2">URL do Banner Desktop</label>
                    <input
                        type="text"
                        value={banners.desktop}
                        onChange={(e) => setBanners({ ...banners, desktop: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        placeholder="https://..."
                    />
                    {banners.desktop && <img src={banners.desktop} alt="Preview Desktop" className="mt-2 w-full max-h-40 object-cover rounded" />}
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2">URL do Banner Mobile</label>
                    <input
                        type="text"
                        value={banners.mobile}
                        onChange={(e) => setBanners({ ...banners, mobile: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        placeholder="https://..."
                    />
                    {banners.mobile && <img src={banners.mobile} alt="Preview Mobile" className="mt-2 w-full max-h-40 object-cover rounded" />}
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-primary text-white px-6 py-2 rounded-lg font-bold disabled:opacity-50"
                >
                    {saving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
                {message && <span className={message.includes('Erro') ? 'text-red-500' : 'text-green-500'}>{message}</span>}
            </div>
        </div>
    );
};

export default BannerEditor;
