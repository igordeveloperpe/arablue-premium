
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import PasswordManager from '../components/admin/PasswordManager';
import ContactEditor from '../components/admin/ContactEditor';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('password');

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('admin_auth') === 'true';
        if (!isAuthenticated) {
            navigate('/admin/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('admin_auth');
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background-dark p-8 pt-52">
            <div className="max-w-[1440px] mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-4xl font-black text-primary">Painel Administrativo</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-colors uppercase text-xs tracking-widest"
                    >
                        Sair
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-10 border border-gray-100 dark:border-gray-700">
                    <div className="flex gap-8 mb-8 border-b dark:border-gray-700 pb-4">
                        <button
                            onClick={() => setActiveTab('password')}
                            className={`font-bold pb-4 -mb-4 border-b-2 transition-colors ${activeTab === 'password' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                        >
                            Alterar Senha
                        </button>
                        <button
                            onClick={() => setActiveTab('contact')}
                            className={`font-bold pb-4 -mb-4 border-b-2 transition-colors ${activeTab === 'contact' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                        >
                            Contato
                        </button>
                    </div>

                    {activeTab === 'password' && <PasswordManager />}
                    {activeTab === 'contact' && <ContactEditor />}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
