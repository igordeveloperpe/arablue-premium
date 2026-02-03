
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import { formatCurrency } from '../utils';
import { supabase } from '../utils/supabaseClient';

const ProductDetail: React.FC<{ addToCart: (p: any) => void }> = ({ addToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('M');
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('id', id)
        .single();

      if (data) {
        setProduct({
          ...data,
          image: data.image_url,
          images: data.images && data.images.length > 0 ? data.images : [data.image_url],
          category: data.categories?.name || 'Geral',
          rating: data.rating,
          reviewsCount: data.reviews_count,
          sizeGuide: data.size_guide_url || '',
          shippingInfo: data.shipping_info || 'Envio Expresso Grátis',
          returnPolicy: data.return_policy || '30 Dias para Devolução'
        });
        setActiveImage(data.image_url);
      } else {
        // Fallback to constants if not found in DB (for backward compatibility during transition)
        const fallback = PRODUCTS.find(p => p.id === id);
        if (fallback) setProduct(fallback);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h2 className="text-2xl font-black">Produto não encontrado</h2>
      <Link to="/shop" className="bg-primary text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs">Voltar para Loja</Link>
    </div>
  );

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-20 pt-32 pb-24 animate-in fade-in duration-500">
      <nav className="flex items-center gap-2 mb-12 text-sm">
        <Link to="/" className="text-gray-500 hover:text-primary">Início</Link>
        <span className="text-gray-300">/</span>
        <Link to="/shop" className="text-gray-500 hover:text-primary">Coleção</Link>
        <span className="text-gray-300">/</span>
        <span className="font-bold">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        {/* Image Gallery */}
        <div className="lg:col-span-7 flex gap-6">
          <div className="flex flex-col gap-4 w-24">
            {(product.images || [product.image]).map((img: string, idx: number) => (
              <div
                key={idx}
                onMouseEnter={() => setActiveImage(img)}
                onClick={() => setActiveImage(img)}
                className={`aspect-[3/4] rounded-xl bg-gray-100 overflow-hidden cursor-pointer border-2 transition-all ${activeImage === img ? 'border-primary shadow-md' : 'border-transparent hover:border-primary/30'}`}
              >
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover"
                  style={{ objectPosition: product.position || '50% 50%' }}
                />
              </div>
            ))}
          </div>
          <div className="flex-1 aspect-[3/4] rounded-3xl overflow-hidden bg-gray-100 shadow-2xl">
            <img
              src={activeImage || product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              style={{ objectPosition: product.position || '50% 50%' }}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:col-span-5 flex flex-col gap-8 sticky top-32 h-fit">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-primary text-xs font-black uppercase tracking-[0.3em]">{product.category}</span>
              {product.rating !== null && (
                <div className="flex items-center gap-1 text-yellow-500">
                  <span className="material-symbols-outlined text-sm">star</span>
                  <span className="text-sm font-black text-gray-800 dark:text-white">{Number(product.rating).toFixed(1)}</span>
                  <span className="text-sm text-gray-400">({product.reviewsCount || 0} Avaliações)</span>
                </div>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">{product.name}</h1>
            <p className="text-3xl font-black text-primary">{formatCurrency(product.price)}</p>
          </div>

          <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-lg">
            {product.description || "Descrição em breve..."}
          </p>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="font-black text-sm uppercase tracking-widest">Selecionar Tamanho</span>
              {product.sizeGuide && (
                <a href={product.sizeGuide} target="_blank" rel="noopener noreferrer" className="text-primary text-xs font-bold underline">
                  Guia de Tamanhos
                </a>
              )}
            </div>
            <div className="flex gap-4">
              {(product.sizes || ['P', 'M', 'G', 'GG', 'XG']).map((size: string) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`size-14 rounded-xl font-black transition-all flex items-center justify-center border-2 ${selectedSize === size
                    ? 'border-primary bg-primary text-white shadow-lg shadow-primary/20'
                    : 'border-gray-100 dark:border-gray-800 text-gray-500 hover:border-primary/50'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-6">
            <button
              onClick={() => addToCart({ ...product, selectedSize })}
              className="w-full bg-primary hover:bg-primary/90 text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
            >
              <span className="material-symbols-outlined">shopping_bag</span>
              Adicionar ao Carrinho
            </button>
            <button className="w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 font-black py-5 rounded-2xl transition-all uppercase tracking-widest text-sm">
              Comprar Agora
            </button>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="material-symbols-outlined text-primary">local_shipping</span>
              {product.shippingInfo}
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="material-symbols-outlined text-primary">history</span>
              {product.returnPolicy}
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specs */}
      {product.specs && product.specs.length > 0 && (
        <section className="mt-40 grid grid-cols-1 md:grid-cols-2 gap-32">
          <div>
            <h3 className="text-3xl font-black tracking-tighter mb-12 uppercase">Especificações Técnicas</h3>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {product.specs.map(([label, val]: [string, string]) => (
                <div key={label} className="flex justify-between py-5">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">{label}</span>
                  <span className="font-bold text-sm">{val}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black tracking-tighter mb-12 uppercase">Experiência do Cliente</h3>
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-50 dark:border-gray-800">
                <div className="flex items-center gap-4 mb-4">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary text-xs">JD</div>
                  <div>
                    <p className="font-black text-sm">James D.</p>
                    <p className="text-[10px] text-gray-400 font-bold">Comprador Verificado</p>
                  </div>
                </div>
                <p className="italic text-gray-500 leading-relaxed text-sm">"A qualidade do algodão é diferente de tudo que já comprei. O peso perfeito e a alfaiataria é impecável."</p>
              </div>
              <button className="text-primary font-black text-sm hover:underline">
                Ver Todas as {product.reviewsCount || 0} Avaliações
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
