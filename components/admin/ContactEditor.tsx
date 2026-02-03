
import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';

const ContactEditor: React.FC = () => {
    const [contact, setContact] = useState({ whatsapp: '', instagram: '', email: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchContact();
    }, []);

    const fetchContact = async () => {
        try {
            const { data, error } = await supabase
                .from('site_config')
                .select('value')
                .eq('key', 'contact_info')
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            if (data) {
                setContact(data.value);
            }
        } catch (error) {
            console.error('Error fetching contact info:', error);
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
                .upsert({ key: 'contact_info', value: contact });

            if (error) throw error;
            setMessage('Informações de contato atualizadas!');
        } catch (error) {
            console.error('Error saving contact info:', error);
            setMessage('Erro ao salvar contato.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Carregando contato...</div>;

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold">Editar Informações de Contato</h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold mb-2">WhatsApp Link</label>
                    <input
                        type="text"
                        value={contact.whatsapp}
                        onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        placeholder="https://wa.me/..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2">Instagram (@usuario)</label>
                    <input
                        type="text"
                        value={contact.instagram}
                        onChange={(e) => setContact({ ...contact, instagram: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        placeholder="@ArablueOfficial"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2">Email de Suporte</label>
                    <input
                        type="email"
                        value={contact.email}
                        onChange={(e) => setContact({ ...contact, email: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        placeholder="support@arablue.com"
                    />
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

export default ContactEditor;
