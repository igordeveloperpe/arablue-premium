
import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import EditModal from '../components/EditModal';

const Contact: React.FC = () => {
  const [contact, setContact] = useState({
    whatsapp: 'https://wa.me/5511999999999',
    instagram: '@ArablueOfficial',
    email: 'support@arablue.com'
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<'whatsapp' | 'instagram' | 'email' | null>(null);
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    setIsAdmin(localStorage.getItem('admin_auth') === 'true');
    const fetchContact = async () => {
      const { data } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'contact_info')
        .single();

      if (data?.value) {
        setContact(prev => ({ ...prev, ...data.value }));
      }
    };
    fetchContact();
  }, []);

  const handleEdit = (field: 'whatsapp' | 'instagram' | 'email') => {
    setEditingField(field);
    setNewValue(contact[field]);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingField) return;

    const newContact = { ...contact, [editingField]: newValue };

    const { error } = await supabase
      .from('site_config')
      .update({ value: newContact })
      .eq('key', 'contact_info');

    if (!error) {
      setContact(newContact);
      setIsModalOpen(false);
    } else {
      alert('Erro ao salvar contato.');
    }
  };
  return (
    <div className="max-w-[1200px] mx-auto px-6 pt-40 pb-24 animate-in fade-in slide-in-from-bottom duration-500">
      <div className="mb-20">
        <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter mb-6 uppercase italic">Suporte <span className="text-primary not-italic">Arablue</span></h1>
        <p className="text-gray-400 text-xl max-w-2xl leading-relaxed">Nossa equipe está aqui para ajudar com suas dúvidas sobre moda premium. Seja sobre tamanho ou um pedido personalizado, estamos prontos para atender.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white dark:bg-gray-900 rounded-[2.5rem] p-12 shadow-2xl border border-gray-50 dark:border-gray-800">
          <form className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 px-1">Nome Completo</span>
                <input className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl h-16 px-6 text-sm font-bold focus:ring-primary" placeholder="James Arathea" />
              </div>
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 px-1">E-mail</span>
                <input className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl h-16 px-6 text-sm font-bold focus:ring-primary" placeholder="james@arablue.com" />
              </div>
            </div>
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 px-1">Tipo de Solicitação</span>
              <select className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl h-16 px-6 text-sm font-bold focus:ring-primary">
                <option>Status do Pedido</option>
                <option>Aconselhamento de Tamanho</option>
                <option>Pedidos Personalizados</option>
              </select>
            </div>
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 px-1">Mensagem</span>
              <textarea className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-3xl p-6 text-sm font-bold focus:ring-primary min-h-[220px]" placeholder="Como podemos ajudar você hoje?"></textarea>
            </div>
            <button className="w-full bg-primary hover:bg-blue-700 text-white font-black py-6 rounded-2xl transition-all shadow-2xl shadow-primary/30 uppercase tracking-[0.2em] text-sm">
              Enviar Mensagem
            </button>
          </form>
        </div>

        {/* Support Channels */}
        <div className="lg:col-span-5 space-y-12">
          <div className="flex flex-col gap-6">
            {[
              { id: 'whatsapp', icon: 'chat_bubble', title: 'WhatsApp', text: 'Fale com um personal stylist', link: contact.whatsapp },
              { id: 'instagram', icon: 'alternate_email', title: 'Instagram', text: contact.instagram, link: `https://instagram.com/${contact.instagram.replace('@', '')}` },
              { id: 'email', icon: 'mail', title: 'Suporte por E-mail', text: contact.email, link: `mailto:${contact.email}` }
            ].map(channel => (
              <div key={channel.title} className="relative group">
                <a href={channel.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 p-8 rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-50 dark:border-gray-800 hover:border-primary transition-all shadow-sm">
                  <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <span className="material-symbols-outlined text-2xl">{channel.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-black uppercase tracking-tight text-lg">{channel.title}</h3>
                    <p className="text-sm text-gray-400 font-bold">{channel.text}</p>
                    {channel.id === 'email' && <p className="text-xs text-primary font-bold">{contact.email}</p>}
                  </div>
                </a>
                {isAdmin && (
                  <button
                    onClick={() => handleEdit(channel.id as any)}
                    className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full hover:bg-gray-200 text-primary z-20"
                    title="Editar"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="rounded-[2.5rem] overflow-hidden bg-white dark:bg-gray-900 border border-gray-50 dark:border-gray-800 shadow-2xl">
            <div className="h-56 bg-gray-200 dark:bg-gray-800 relative">
              <div className="absolute inset-0 bg-cover bg-center grayscale opacity-50" style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDq3KH5EVrRa47ffnka3NuJKiipyHaHbe-I4QygJvVHD_6KMfDB5nfOCdsBCzIOPQPNak8HwPOFAGuizh1ZffY3wmiSlzEBjE8ulgCA9l0EpOFwxL8woL5KGZxk43FXhbhRZ27vWwQGx1-5aWp7s8i1cZQWyw_BO6OiV-zrX-LqpdK3IIwbfDO14BYLR7MNUV1Nio2qSaElkdSQtqHv7BZBvKP4O7MbbgEDL1MIU_tzTpYmkpLNeJy5AOSR4rLSlxdF-FS3eWowwd0")` }}></div>
              <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
              <div className="absolute bottom-6 left-8 text-white">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-1">Loja Conceito</p>
                <p className="text-2xl font-black uppercase italic tracking-tighter">Paris, França</p>
              </div>
            </div>
            <div className="p-10 space-y-8">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary">place</span>
                <div>
                  <p className="font-black uppercase tracking-tight text-sm">123 Rue de la Mode</p>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">75001 Paris, França</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary">schedule</span>
                <div>
                  <p className="font-black uppercase tracking-tight text-sm">Horário de Funcionamento</p>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Seg - Sáb: 10h - 20h</p>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Dom: 12h - 18h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <EditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Editar ${editingField}`}
        onSave={handleSave}
      >
        <div>
          <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Novo Valor</label>
          <input
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-bold focus:ring-primary focus:border-primary"
            value={newValue}
            onChange={e => setNewValue(e.target.value)}
          />
        </div>
      </EditModal>
    </div>
  );
};

export default Contact;
