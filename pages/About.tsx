
import React from 'react';
import { IMAGES } from '../constants';
import hugoImg from '../assets/hugo.png';

const About: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-700">
      {/* Split Hero */}
      <section className="flex flex-col lg:flex-row min-h-screen items-stretch">
        <div className="lg:w-1/2 flex flex-col justify-center px-10 md:px-24 py-40 bg-white dark:bg-background-dark">
          <div className="max-w-[540px]">
            <span className="text-primary font-bold tracking-[0.4em] uppercase text-xs mb-6 block">Est. 2024</span>
            <h1 className="text-5xl md:text-8xl font-black leading-[1.0] tracking-tighter mb-10">
              O Espírito de <span className="text-primary italic">Liberdade</span> & Elegância
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed mb-12">
              A Arablue nasceu de uma visão singular: criar um guarda-roupa que equilibre o espírito indomável da natureza com a precisão refinada da alfaiataria moderna. Inspirados pela majestosa arara-azul, criamos roupas para o homem que valoriza tanto a liberdade quanto o luxo.
            </p>
            <div className="flex flex-wrap gap-6">
              <button className="bg-primary hover:bg-blue-700 text-white font-black py-5 px-12 rounded-xl transition-all shadow-xl shadow-primary/20 uppercase tracking-widest text-xs">
                Explorar Visão
              </button>
              <button className="border-2 border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 font-black py-5 px-12 rounded-xl transition-all uppercase tracking-widest text-xs">
                Artesanato
              </button>
            </div>
          </div>
        </div>
        <div className="lg:w-1/2 relative min-h-[600px]">
          <div className="absolute inset-0 bg-center bg-no-repeat bg-cover grayscale hover:grayscale-0 transition-all duration-1000"
            style={{ backgroundImage: `url("${IMAGES.ABOUT_HERO}")` }}></div>
          <div className="absolute inset-0 bg-primary/20 mix-blend-overlay"></div>
          <div className="absolute bottom-20 left-20 bg-white/10 backdrop-blur-xl p-10 border border-white/20 hidden xl:block rounded-3xl">
            <p className="text-white text-xs font-black tracking-[0.4em] uppercase">Série No. 01 — Graça Autêntica</p>
          </div>
        </div>
      </section>

      {/* Symbolism */}
      <section className="py-40 px-6 lg:px-40 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-32 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black mb-10 tracking-tighter">O Simbolismo da Arara</h2>
            <div className="w-24 h-1.5 bg-primary mx-auto mb-10 rounded-full"></div>
            <p className="text-xl text-gray-500 leading-relaxed font-light">
              A arara-azul é mais do que apenas nosso logotipo; é nossa filosofia. Sua plumagem vibrante representa a coragem de se destacar, enquanto seu voo gracioso encarna a mobilidade.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="relative group">
              <div className="absolute -top-10 -left-10 w-full h-full border-4 border-primary/10 rounded-3xl group-hover:top-0 group-hover:left-0 transition-all duration-700"></div>
              <img src={IMAGES.MACAW} alt="Arara-Azul" className="relative w-full rounded-3xl shadow-2xl z-10 filter grayscale group-hover:grayscale-0 transition-all duration-700" />
            </div>
            <div className="flex flex-col gap-12">
              {[
                { icon: 'brush', title: 'Expressão Vívida', text: 'Buscamos cores que capturem a profundidade do oceano e do céu, espelhando o brilho da arara.' },
                { icon: 'auto_awesome', title: 'Resiliência Natural', text: 'Algodão orgânico e linhos premium que, como o espírito da arara, permanecem resilientes ao longo do tempo.' },
                { icon: 'eco', title: 'Gestão Ética', text: 'Protegendo o ambiente que nosso símbolo habita através de práticas sustentáveis.' }
              ].map(pillar => (
                <div key={pillar.title} className="flex gap-8 group">
                  <div className="size-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <span className="material-symbols-outlined text-3xl">{pillar.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black mb-3 tracking-tight">{pillar.title}</h4>
                    <p className="text-gray-500 leading-relaxed">{pillar.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-40 px-6 lg:px-40">
        <div className="mb-24">
          <h2 className="text-5xl font-black mb-6 tracking-tighter uppercase">Nossos Pilares</h2>
          <p className="text-gray-400 max-w-[500px] text-lg font-bold">A Arablue é construída sobre valores fundamentais que guiam cada costura e silhueta.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {[
            { title: 'Autenticidade', desc: 'Honrando a tradição enquanto abraçamos o design moderno. Sem atalhos, apenas qualidade pura.' },
            { title: 'Elegância', desc: 'Estética sofisticada para o homem moderno. A verdadeira elegância reside na simplicidade.' },
            { title: 'Liberdade', desc: 'Estilo que permite que você se mova, respire e seja você mesmo. Independente e audaz.' }
          ].map(p => (
            <div key={p.title} className="group">
              <div className="aspect-[4/3] rounded-3xl bg-gray-100 mb-8 overflow-hidden shadow-lg border-2 border-transparent group-hover:border-primary transition-all">
                <div className="w-full h-full bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-1000" style={{ backgroundImage: `url("${IMAGES.URBAN}")` }}></div>
              </div>
              <h3 className="text-3xl font-black mb-4 flex items-center gap-4 uppercase tracking-tighter">
                {p.title}
                <span className="w-12 h-1 bg-primary rounded-full"></span>
              </h3>
              <p className="text-gray-500 leading-relaxed font-bold text-sm tracking-wide">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quote */}
      <section className="py-60 px-6 bg-white dark:bg-background-dark text-center overflow-hidden relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] text-primary pointer-events-none uppercase font-black text-[20vw] leading-none select-none italic">
          Arablue
        </div>
        <div className="max-w-[1000px] mx-auto relative z-10">
          <span className="material-symbols-outlined text-primary text-8xl mb-12 opacity-30 italic">format_quote</span>
          <h2 className="text-4xl md:text-6xl font-light leading-snug mb-20 italic font-display">
            "O estilo é a expressão máxima da liberdade. Na Arablue, não apenas vestimos o homem; celebramos sua jornada através das lentes da elegância atemporal."
          </h2>
          <div className="flex flex-col items-center gap-6">
            <div className="size-24 rounded-full border-4 border-primary p-1 shadow-2xl overflow-hidden group">
              <img src={hugoImg} alt="Hugo Marques" className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div>
              <p className="font-black text-2xl uppercase tracking-[0.2em] mb-1">Hugo Marques</p>
              <p className="text-primary text-sm font-black uppercase tracking-[0.4em]">Diretor Criativo e Fundador</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
