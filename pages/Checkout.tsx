
import React from 'react';
import { Link } from 'react-router-dom';
import { CartItem } from '../types';
import { formatCurrency } from '../utils';

interface CheckoutProps {
  cart: CartItem[];
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cart, removeFromCart, updateQuantity }) => {
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxes = subtotal * 0.08;
  const total = subtotal + taxes;

  if (cart.length === 0) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 pt-60 pb-80 text-center animate-in fade-in zoom-in duration-500">
        <span className="material-symbols-outlined text-8xl text-gray-200 mb-8">shopping_basket</span>
        <h2 className="text-4xl font-black mb-6 tracking-tighter uppercase">Seu carrinho está vazio</h2>
        <p className="text-gray-400 mb-10 max-w-sm mx-auto font-bold uppercase tracking-widest text-sm">Parece que você ainda não descobriu sua próxima peça exclusiva.</p>
        <Link to="/shop" className="bg-primary hover:bg-blue-700 text-white font-black py-5 px-12 rounded-2xl shadow-xl shadow-primary/20 transition-all uppercase tracking-widest text-sm inline-block">
          Explorar Loja
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-20 pt-32 pb-24 animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center gap-2 mb-12 text-sm">
        <Link to="/shop" className="text-gray-500 hover:text-primary">Loja</Link>
        <span className="text-gray-300">/</span>
        <span className="font-bold">Checkout</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-20">
        {/* Cart Items */}
        <div className="flex-grow space-y-12">
          <section className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-50 dark:border-gray-800">
            <div className="px-10 py-8 border-b border-gray-50 dark:border-gray-800">
              <h2 className="text-3xl font-black tracking-tighter uppercase">Itens no Carrinho ({cart.length})</h2>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {cart.map(item => (
                <div key={item.id} className="p-10 flex gap-10 items-center">
                  <div className="size-32 rounded-2xl overflow-hidden bg-gray-100 shadow-md">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-2">{item.category}</p>
                    <h3 className="text-xl font-black tracking-tight mb-2 uppercase">{item.name}</h3>
                    <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Tamanho: {item.selectedSize || 'M'} | Cor: {item.color}</p>
                    <p className="text-primary font-black mt-3 text-lg">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-6">
                    <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 px-5 py-2.5 rounded-2xl">
                      <button onClick={() => updateQuantity(item.id, -1)} className="hover:text-primary transition-colors font-black">-</button>
                      <span className="font-black text-sm w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="hover:text-primary transition-colors font-black">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-xl border border-gray-50 dark:border-gray-800">
              <h3 className="text-xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">local_shipping</span>
                Cálculo de Frete
              </h3>
              <div className="space-y-4">
                <select className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl h-14 px-5 text-sm font-bold focus:ring-primary">
                  <option>Brasil</option>
                  <option>Estados Unidos</option>
                </select>
                <div className="flex gap-4">
                  <input className="flex-1 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl h-14 px-5 text-sm font-bold focus:ring-primary" placeholder="CEP" />
                  <button className="bg-gray-100 dark:bg-gray-800 px-8 rounded-2xl text-xs font-black uppercase tracking-widest">Calcular</button>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-xl border border-gray-50 dark:border-gray-800">
              <h3 className="text-xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">sell</span>
                Cupom de Desconto
              </h3>
              <div className="flex gap-4">
                <input className="flex-1 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl h-14 px-5 text-sm font-bold focus:ring-primary" placeholder="Digite o código" />
                <button className="bg-primary text-white px-8 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all">Aplicar</button>
              </div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-4">Membros Arablue ganham frete expresso grátis.</p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[480px] shrink-0">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 border border-gray-50 dark:border-gray-800 sticky top-32">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-10">Resumo do Pedido</h2>
            <div className="space-y-6 mb-10">
              <div className="flex justify-between font-bold text-sm tracking-widest uppercase">
                <span className="text-gray-400">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm tracking-widest uppercase">
                <span className="text-gray-400">Frete</span>
                <span className="text-primary italic">Grátis</span>
              </div>
              <div className="flex justify-between font-bold text-sm tracking-widest uppercase">
                <span className="text-gray-400">Impostos</span>
                <span>{formatCurrency(taxes)}</span>
              </div>
              <div className="border-t border-gray-50 dark:border-gray-800 pt-8 flex justify-between items-baseline">
                <span className="text-xl font-black tracking-tighter uppercase">Total</span>
                <span className="text-4xl font-black text-primary italic">{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="space-y-6 mb-12">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-4">Forma de Pagamento</p>
              <div className="grid grid-cols-3 gap-4">
                <button className="border-2 border-primary bg-primary/5 p-5 rounded-2xl flex flex-col items-center gap-2 group transition-all">
                  <span className="material-symbols-outlined text-primary">credit_card</span>
                  <span className="text-[9px] font-black uppercase tracking-widest">Cartão</span>
                </button>
                <button className="border-2 border-transparent bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-all">
                  <span className="material-symbols-outlined">account_balance_wallet</span>
                  <span className="text-[9px] font-black uppercase tracking-widest">PayPal</span>
                </button>
                <button className="border-2 border-transparent bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-all">
                  <span className="material-symbols-outlined">phone_iphone</span>
                  <span className="text-[9px] font-black uppercase tracking-widest">Apple</span>
                </button>
              </div>
              <div className="space-y-4 pt-6">
                <input className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl h-14 px-5 text-sm font-bold focus:ring-primary" placeholder="Nome no Cartão" />
                <input className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl h-14 px-5 text-sm font-bold focus:ring-primary" placeholder="Número do Cartão" />
              </div>
            </div>

            <button className="w-full bg-primary text-white py-6 rounded-2xl font-black text-lg shadow-2xl shadow-primary/20 hover:bg-blue-700 transition-all uppercase tracking-[0.2em] transform active:scale-95">
              Confirmar Pedido
            </button>
            <div className="mt-8 flex items-center justify-center gap-10 opacity-30">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                <span className="material-symbols-outlined text-sm">lock</span>
                Seguro
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                <span className="material-symbols-outlined text-sm">verified</span>
                Verificado
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
