
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IMAGES, PRODUCTS } from '../constants';
import { formatCurrency } from '../utils';
import { supabase } from '../utils/supabaseClient';
import desktopBanner from '../assets/foto baneer arar 1.jpg';
import mobileBanner from '../assets/mobile arablue 2.png';
import EditModal from '../components/EditModal';
import ImageUploader from '../components/ImageUploader';

const Home: React.FC<{ addToCart: (p: any) => void }> = ({ addToCart }) => {
  const [banners, setBanners] = useState({
    desktop: desktopBanner,
    mobile: mobileBanner,
    desktopPosition: '50% 50%',
    mobilePosition: '50% 50%'
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempBanners, setTempBanners] = useState<{ desktop: string; mobile: string; desktopPosition: string; mobilePosition: string }>({
    desktop: '', mobile: '', desktopPosition: '50% 50%', mobilePosition: '50% 50%'
  });
  const [syncBanners, setSyncBanners] = useState(false);

  // Collections State
  const [featuredCollections, setFeaturedCollections] = useState<any[]>([
    { id: 1, title: 'Urbano', image: IMAGES.URBAN, desc: 'Essenciais para a cidade moderna.' },
    { id: 2, title: 'Essencial', image: IMAGES.ESSENTIAL, desc: 'Básicos atemporais redefinidos.' },
    { id: 3, title: 'Premium', image: IMAGES.PREMIUM, desc: 'Artesanato inigualável.' }
  ]);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<any>(null);

  // Trending Products State
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [productFormData, setProductFormData] = useState({
    name: '',
    price: '',
    category: '',
    image_url: ''
  });

  useEffect(() => {
    setIsAdmin(localStorage.getItem('admin_auth') === 'true');
    const fetchData = async () => {
      // Fetch Banners
      const { data: bannerData } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'banners')
        .single();

      if (bannerData?.value) {
        setBanners(prev => ({
          desktop: bannerData.value.desktop || prev.desktop,
          mobile: bannerData.value.mobile || prev.mobile,
          desktopPosition: bannerData.value.desktopPosition || '50% 50%',
          mobilePosition: bannerData.value.mobilePosition || '50% 50%'
        }));
      }

      // Fetch Collections
      const { data: collectionData } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'featured_collections')
        .single();

      if (collectionData?.value) {
        setFeaturedCollections(collectionData.value.map((c: any) => ({
          ...c,
          position: c.position || '50% 50%'
        })));
      }

      // Fetch Trending Products (Latest 4)
      const { data: prodData } = await supabase
        .from('products')
        .select('*, categories(name)')
        .order('created_at', { ascending: false })
        .limit(4);

      if (prodData) {
        setTrendingProducts(prodData.map(p => ({
          ...p,
          image: p.image_url,
          position: p.image_position || '50% 50%',
          category: p.categories?.name || 'Geral'
        })));
      }

      // Fetch Categories for Editor
      const { data: catData } = await supabase.from('categories').select('name');
      if (catData) setCategories(catData.map(c => c.name));
    };
    fetchData();
  }, []);

  const handleEdit = () => {
    setTempBanners({
      desktop: banners.desktop,
      mobile: banners.mobile,
      desktopPosition: banners.desktopPosition,
      mobilePosition: banners.mobilePosition
    });
    setSyncBanners(false);
    setIsModalOpen(true);
  };

  const handleUpdateTemp = (key: 'desktop' | 'mobile', url: string) => {
    setTempBanners(prev => {
      const updated = { ...prev, [key]: url };
      if (syncBanners) {
        updated.desktop = url;
        updated.mobile = url;
      }
      return updated;
    });
  };

  const handleUpdatePosition = (key: 'desktop' | 'mobile', pos: string) => {
    setTempBanners(prev => {
      const updated = { ...prev, [`${key}Position`]: pos };
      if (syncBanners) {
        updated.desktopPosition = pos;
        updated.mobilePosition = pos;
      }
      return updated;
    });
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from('site_config')
      .update({ value: tempBanners })
      .eq('key', 'banners');

    if (!error) {
      setBanners(tempBanners);
      setIsModalOpen(false);
    } else {
      alert('Erro ao salvar banner.');
    }
  };

  const handleEditCollection = (col: any) => {
    setEditingCollection({ ...col });
    setIsCollectionModalOpen(true);
  };

  const handleSaveCollection = async () => {
    const updatedCollections = featuredCollections.map(c =>
      c.id === editingCollection.id ? editingCollection : c
    );

    const { error } = await supabase
      .from('site_config')
      .update({ value: updatedCollections })
      .eq('key', 'featured_collections');

    if (!error) {
      setFeaturedCollections(updatedCollections);
      setIsCollectionModalOpen(false);
    } else {
      alert('Erro ao salvar coleção.');
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      image_url: product.image,
      image_position: product.position || '50% 50%'
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async () => {
    try {
      if (!productFormData.name || !productFormData.price || !productFormData.category) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      const price = parseFloat(productFormData.price);
      if (isNaN(price)) {
        alert('Preço inválido.');
        return;
      }

      const { data: catData } = await supabase
        .from('categories')
        .select('id')
        .eq('name', productFormData.category)
        .single();

      if (!catData) {
        console.error('Category not found:', productFormData.category);
        throw new Error('Categoria não encontrada no sistema.');
      }

      // Check if ID is a valid UUID before updating
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const isUuid = uuidRegex.test(editingProduct.id);

      if (!isUuid) {
        // If it's not a UUID, it means it's a constant product not yet in the DB
        // We should insert it instead of update, or just fail with a better message if we don't want to handle insertion here.
        // Given we just migrated, we can tell the user to refresh or try again.
        console.error('Invalid ID for update:', editingProduct.id);
        alert('Este produto ainda não está sincronizado com o banco de dados. Por favor, recarregue a página.');
        return;
      }

      const { error } = await supabase
        .from('products')
        .update({
          name: productFormData.name,
          price: price,
          category_id: catData.id,
          image_url: productFormData.image_url,
          image_position: productFormData.image_position
        })
        .eq('id', editingProduct.id);

      if (error) throw error;

      // Update local state
      setTrendingProducts(prev => prev.map(p =>
        p.id === editingProduct.id
          ? { ...p, ...productFormData, price: price, image: productFormData.image_url, position: productFormData.image_position }
          : p
      ));
      setIsProductModalOpen(false);
    } catch (err: any) {
      console.error('Error saving product:', err);
      alert(`Erro ao salvar produto: ${err.message || 'Erro desconhecido'}`);
    }
  };

  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative h-[85vh] lg:h-[90vh] overflow-hidden bg-black flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          {/* Desktop Banner */}
          <img
            src={banners.desktop}
            alt="Arablu Hero Desktop"
            className="hidden md:block w-full h-full object-cover opacity-70"
            style={{ objectPosition: banners.desktopPosition }}
          />
          {/* Mobile Banner */}
          <img
            src={banners.mobile}
            alt="Arablu Hero Mobile"
            className="block md:hidden w-full h-full object-cover opacity-70"
            style={{ objectPosition: banners.mobilePosition }}
          />
        </div>

        {/* Admin Banner Control Overlay */}
        {isAdmin && (
          <div className="absolute top-60 right-6 md:right-20 z-50 animate-in fade-in slide-in-from-right duration-500">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
              className="bg-white/90 backdrop-blur text-primary px-6 py-3 rounded-2xl shadow-2xl hover:bg-white transition-all transform hover:scale-110 flex items-center gap-3 font-black text-sm uppercase tracking-widest border border-white/50"
            >
              <span className="material-symbols-outlined text-xl">edit</span>
              Editar Banners
            </button>
          </div>
        )}

        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-white text-4xl md:text-8xl font-black leading-tight md:leading-[1.1] tracking-tighter mb-6 max-w-4xl uppercase animate-in slide-in-from-bottom duration-1000">
            Essencial que impõe <span className="text-primary italic">autenticidade</span>
          </h1>
          <p className="text-white/90 text-base md:text-xl font-light mb-10 tracking-widest max-w-xl animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
            Uma experiência curada para o homem moderno que valoriza qualidade, elegância e estilo atemporal.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 animate-in fade-in slide-in-from-bottom duration-1000 delay-500">
            <Link to="/shop" className="bg-primary hover:bg-primary/90 text-white px-12 py-5 rounded-lg font-bold text-sm tracking-widest uppercase transition-all transform hover:scale-105 shadow-xl">
              Ver Coleção
            </Link>
            <Link to="/about" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-12 py-5 rounded-lg font-bold text-sm tracking-widest uppercase transition-all">
              Nossa História
            </Link>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
          <span className="material-symbols-outlined text-3xl">expand_more</span>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="max-w-[1440px] mx-auto pt-32 pb-16 px-6 lg:px-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 dark:border-gray-800 pb-12">
          <div>
            <span className="text-primary font-bold text-xs tracking-[0.4em] uppercase mb-4 block">Coleções</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Curadoria Selecionada</h2>
          </div>
          <Link to="/shop" className="text-sm font-bold flex items-center gap-2 group text-primary">
            Explorar Categorias
            <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
          {featuredCollections.map((col) => (
            <div key={col.id} className="relative group overflow-hidden rounded-2xl bg-gray-100 cursor-pointer shadow-lg aspect-[3/4]">
              {isAdmin && (
                <button
                  onClick={() => handleEditCollection(col)}
                  className="absolute top-4 right-4 z-40 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-xl hover:bg-primary hover:text-white transition-all transform hover:scale-110 active:scale-95"
                  title="Editar Card"
                >
                  <span className="material-symbols-outlined text-xl">edit</span>
                </button>
              )}
              <Link to="/shop" className="block w-full h-full">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, transparent 60%), url("${col.image}")`,
                    backgroundPosition: col.position || '50% 50%'
                  }}></div>
                <div className="absolute bottom-0 left-0 p-10 w-full transform group-hover:-translate-y-2 transition-transform duration-300">
                  <h3 className="text-white text-3xl font-black mb-2 uppercase tracking-tight">{col.title}</h3>
                  <p className="text-white/80 text-sm mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">{col.desc}</p>
                  <div className="size-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-2xl">
                    <span className="material-symbols-outlined text-primary font-bold">arrow_forward</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="bg-white dark:bg-background-dark/30 py-32">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Tendências Agora</h2>
            <div className="w-24 h-1.5 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {(trendingProducts.length > 0 ? trendingProducts : PRODUCTS.slice(0, 4)).map((p) => (
              <div key={p.id} className="group cursor-pointer relative">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100 mb-6 shadow-md shadow-gray-200/50">
                  {isAdmin && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEditProduct(p); }}
                      className="absolute top-4 right-4 z-40 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-lg hover:bg-primary hover:text-white transition-all transform hover:scale-110 active:scale-95"
                      title="Editar Produto"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                  )}
                  <Link to={`/product/${p.id}`}>
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{ objectPosition: p.position || '50% 50%' }}
                    />
                  </Link>
                  <button
                    onClick={() => addToCart(p)}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-[#0d121b] px-8 py-3 rounded-xl text-xs font-bold opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-2xl hover:bg-primary hover:text-white"
                  >
                    Adicionar
                  </button>
                  {p.isNew && <span className="absolute top-6 left-6 bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-lg">NOVO</span>}
                </div>
                <Link to={`/product/${p.id}`}>
                  <h4 className="font-bold text-base mb-1 group-hover:text-primary transition-colors">{p.name}</h4>
                  <p className="text-gray-500 text-xs mb-3">{p.color || p.category}</p>
                  <p className="font-black text-lg text-primary">{formatCurrency(p.price)}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Heritage */}
      <section className="py-40 px-6 lg:px-20 bg-primary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none transform translate-x-1/4">
          <svg fill="currentColor" viewBox="0 0 48 48" className="w-full h-full">
            <path d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z" />
          </svg>
        </div>
        <div className="max-w-[960px] mx-auto text-center relative z-10">
          <div className="size-20 mx-auto mb-12 opacity-50">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-10 italic tracking-tighter">"Essencial que impõe autenticidade"</h2>
          <p className="text-white/80 text-lg md:text-2xl font-light leading-relaxed mb-16 tracking-wide">
            Mais do que uma marca, a Arablue representa um padrão de presença. Inspirada na majestosa arara-azul, nossas peças são desenhadas para o homem que não precisa gritar para ser notado. Autenticidade é o nosso luxo supremo.
          </p>
          <Link to="/about" className="inline-block border-b-2 border-white pb-2 font-black tracking-widest hover:text-white/70 transition-colors uppercase text-sm">
            Conheça Nossa Herança
          </Link>
        </div>
      </section>

      {/* Edit Modal */}
      <EditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Gerenciar Banners"
        onSave={handleSave}
      >
        <div className="space-y-8">
          <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-100 dark:border-blue-800">
            <input
              type="checkbox"
              id="syncBanners"
              checked={syncBanners}
              onChange={(e) => setSyncBanners(e.target.checked)}
              className="w-5 h-5 rounded text-primary focus:ring-primary border-gray-300"
            />
            <label htmlFor="syncBanners" className="text-sm font-bold text-gray-700 dark:text-gray-200 cursor-pointer">
              Usar a mesma imagem para Mobile e Desktop
            </label>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-primary mb-2 block">Desktop Banner</label>
              <ImageUploader
                currentImage={tempBanners.desktop}
                currentPosition={tempBanners.desktopPosition}
                onUpload={(url) => handleUpdateTemp('desktop', url)}
                onPositionChange={(pos) => handleUpdatePosition('desktop', pos)}
                aspectRatio="aspect-[21/9]"
              />
            </div>

            {!syncBanners && (
              <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                <label className="text-xs font-black uppercase tracking-widest text-primary mb-2 block">Mobile Banner</label>
                <ImageUploader
                  currentImage={tempBanners.mobile}
                  currentPosition={tempBanners.mobilePosition}
                  onUpload={(url) => handleUpdateTemp('mobile', url)}
                  onPositionChange={(pos) => handleUpdatePosition('mobile', pos)}
                  aspectRatio="aspect-[9/16]"
                />
              </div>
            )}
          </div>

          <p className="text-xs text-gray-400 text-center">
            As alterações só serão aplicadas após clicar em <strong>Salvar</strong>.
          </p>
        </div>
      </EditModal>

      {/* Collection Edit Modal */}
      <EditModal
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
        title="Editar Card de Coleção"
        onSave={handleSaveCollection}
      >
        {editingCollection && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500">Título</label>
              <input
                type="text"
                value={editingCollection.title}
                onChange={(e) => setEditingCollection({ ...editingCollection, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500">Descrição</label>
              <textarea
                value={editingCollection.desc}
                onChange={(e) => setEditingCollection({ ...editingCollection, desc: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary h-24 resize-none"
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500">Imagem de Fundo</label>
              <ImageUploader
                currentImage={editingCollection.image}
                currentPosition={editingCollection.position}
                onUpload={(url) => setEditingCollection({ ...editingCollection, image: url })}
                onPositionChange={(pos) => setEditingCollection({ ...editingCollection, position: pos })}
                aspectRatio="aspect-[3/4]"
              />
            </div>
          </div>
        )}
      </EditModal>

      {/* Product Edit Modal */}
      <EditModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        title="Editar Produto em Tendência"
        onSave={handleSaveProduct}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Nome do Produto</label>
            <input
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary"
              value={productFormData.name}
              onChange={e => setProductFormData({ ...productFormData, name: e.target.value })}
              placeholder="Ex: Polo Arablue"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400">Preço (R$)</label>
              <input
                type="number"
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary"
                value={productFormData.price}
                onChange={e => setProductFormData({ ...productFormData, price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400">Categoria</label>
              <select
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary"
                value={productFormData.category}
                onChange={e => setProductFormData({ ...productFormData, category: e.target.value })}
              >
                <option value="">Selecione...</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Imagem do Produto</label>
            <ImageUploader
              currentImage={productFormData.image_url}
              currentPosition={productFormData.image_position}
              onUpload={(url) => setProductFormData({ ...productFormData, image_url: url })}
              onPositionChange={(pos) => setProductFormData({ ...productFormData, image_position: pos })}
              aspectRatio="aspect-[4/5]"
            />
          </div>
        </div>
      </EditModal>
    </div>
  );
};

export default Home;
