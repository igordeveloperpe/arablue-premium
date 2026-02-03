
import React from 'react';
import { IMAGES } from '../constants';
import { formatCurrency } from '../utils';

const Dashboard: React.FC = () => {
  return (
    <div className="max-w-[1440px] mx-auto flex w-full animate-in fade-in duration-500">
      {/* Sidebar Navigation */}
      <aside className="hidden lg:flex w-80 flex-col border-r border-[#e7ebf3] dark:border-gray-800 bg-white dark:bg-background-dark p-10 min-h-screen pt-32">
        <div className="space-y-12">
          <div>
            <p className="px-3 pb-6 text-xs font-black uppercase tracking-[0.4em] text-gray-400">Navegação</p>
            <nav className="flex flex-col gap-2">
              <a className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-primary text-white font-black shadow-xl shadow-primary/20" href="#">
                <span className="material-symbols-outlined">dashboard</span>
                Painel
              </a>
              <a className="flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-400 hover:text-primary hover:bg-primary/5 transition-all font-bold" href="#">
                <span className="material-symbols-outlined">inventory_2</span>
                Meus Pedidos
              </a>
              <a className="flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-400 hover:text-primary hover:bg-primary/5 transition-all font-bold" href="#">
                <span className="material-symbols-outlined">favorite</span>
                Lista de Desejos
              </a>
            </nav>
          </div>
          <div>
            <p className="px-3 pb-6 text-xs font-black uppercase tracking-[0.4em] text-gray-400">Conta</p>
            <nav className="flex flex-col gap-2">
              <a className="flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-400 hover:text-primary hover:bg-primary/5 transition-all font-bold" href="#">
                <span className="material-symbols-outlined">location_on</span>
                Endereços
              </a>
              <a className="flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-400 hover:text-primary hover:bg-primary/5 transition-all font-bold" href="#">
                <span className="material-symbols-outlined">settings</span>
                Configurações
              </a>
            </nav>
          </div>
          <div className="pt-20">
            <button className="flex items-center gap-4 px-5 py-4 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all font-bold w-full text-left">
              <span className="material-symbols-outlined">logout</span>
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-background-light dark:bg-background-dark px-10 pt-32 pb-24 lg:px-20 overflow-y-auto">
        <nav className="mb-8 flex items-center gap-2 text-sm">
          <span className="text-gray-400">Conta</span>
          <span className="text-gray-300">/</span>
          <span className="font-bold">Painel</span>
        </nav>

        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Bem-vindo de volta, James</h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Membro Premium Arablue desde 2023</p>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl">
            <div className="flex h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-black uppercase tracking-widest">Nível: Arara-Azul Elite</span>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { label: 'Total de Pedidos', val: '12', icon: 'shopping_bag' },
            { label: 'Pontos de Fidelidade', val: '2,450', icon: 'workspace_premium' },
            { label: 'Lista de Desejos', val: '8', icon: 'favorite' }
          ].map(stat => (
            <div key={stat.label} className="group rounded-3xl bg-white dark:bg-gray-900 p-8 border border-gray-50 dark:border-gray-800 shadow-xl transition-all hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-400 text-xs font-black uppercase tracking-widest">{stat.label}</p>
                <span className="material-symbols-outlined text-primary group-hover:rotate-12 transition-transform">{stat.icon}</span>
              </div>
              <p className="text-4xl font-black italic">{stat.val}</p>
            </div>
          ))}
        </div>

        {/* content grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-16">
          <div className="xl:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black tracking-tighter uppercase">Pedidos Recentes</h3>
              <button className="text-sm font-black text-primary hover:underline underline-offset-8">Ver Tudo</button>
            </div>
            <div className="overflow-hidden rounded-3xl border border-gray-50 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-50 dark:border-gray-800">
                  <tr>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">ID do Pedido</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Total</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-all group">
                    <td className="px-8 py-8">
                      <div className="flex flex-col">
                        <span className="font-black text-lg">#AB-98234</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase mt-1">24 Out, 2023</span>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <span className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary">Enviado</span>
                    </td>
                    <td className="px-8 py-8 font-black text-lg">{formatCurrency(345.00)}</td>
                    <td className="px-8 py-8 text-right">
                      <button className="text-xs font-black uppercase tracking-widest text-primary hover:underline">Rastrear</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-all">
                    <td className="px-8 py-8">
                      <div className="flex flex-col">
                        <span className="font-black text-lg">#AB-98122</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase mt-1">15 Set, 2023</span>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <span className="inline-flex items-center rounded-lg bg-green-100 dark:bg-green-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-green-700 dark:text-green-400">Entregue</span>
                    </td>
                    <td className="px-8 py-8 font-black text-lg">{formatCurrency(1220.00)}</td>
                    <td className="px-8 py-8 text-right">
                      <button className="text-xs font-black uppercase tracking-widest text-primary hover:underline">Repetir</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black tracking-tighter uppercase">Lista de Desejos</h3>
              <button className="text-sm font-black text-primary hover:underline underline-offset-8">Gerenciar</button>
            </div>
            <div className="flex flex-col gap-6">
              {[
                { name: 'Sobretudo Grafite', price: 495, img: IMAGES.URBAN },
                { name: 'Blazer Slim Marinho', price: 320, img: IMAGES.PREMIUM }
              ].map(item => (
                <div key={item.name} className="flex gap-6 rounded-3xl border border-gray-50 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xl hover:translate-x-2 transition-transform">
                  <div className="h-28 w-24 rounded-2xl overflow-hidden shadow-md">
                    <img src={item.img} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-center gap-3">
                    <h4 className="font-black text-lg uppercase tracking-tight leading-none">{item.name}</h4>
                    <p className="font-black text-primary">{formatCurrency(item.price)}</p>
                    <button className="w-fit bg-primary/10 p-2.5 rounded-full text-primary hover:bg-primary hover:text-white transition-all">
                      <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-20 rounded-3xl bg-primary p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none transform translate-x-1/4">
            <svg fill="currentColor" viewBox="0 0 48 48" className="w-full h-full"><path d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z" /></svg>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="text-white text-center md:text-left">
              <h3 className="text-3xl font-black tracking-tighter mb-4 uppercase">Lançamentos Exclusivos</h3>
              <p className="text-blue-100 font-bold max-w-sm">Acesso antecipado a coleções sazonais e edições limitadas.</p>
            </div>
            <div className="flex w-full md:w-auto gap-4">
              <input className="bg-white/20 border-none rounded-2xl h-14 px-8 text-sm font-bold text-white placeholder:text-blue-200 focus:ring-white flex-grow" placeholder="Seu e-mail" />
              <button className="bg-white text-primary px-10 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-50 transition-all shadow-xl">Inscrever-se</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
