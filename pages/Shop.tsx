
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils';
import { supabase } from '../utils/supabaseClient';
import EditModal from '../components/EditModal';
import ImageUploader from '../components/ImageUploader';
const Shop: React.FC<{ addToCart: (p: any) => void }> = ({ addToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(['Todas']);
  const [loading, setLoading] = useState(true);

  // Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCategoryDeleteModalOpen, setIsCategoryDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    image_url: '',
    images: [] as string[],
    image_position: '50% 50%',
    description: '',
    specs: [] as [string, string][],
    sizes: [] as string[],
    rating: '',
    reviews_count: 0,
    size_guide_url: '',
    shipping_info: 'Envio Expresso Grátis',
    return_policy: '30 Dias para Devolução'
  });

  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const [priceRange, setPriceRange] = useState(2000);
  const [appliedPriceRange, setAppliedPriceRange] = useState(2000);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setIsAdmin(localStorage.getItem('admin_auth') === 'true');
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, appliedPriceRange]);

  const fetchData = async () => {
    setLoading(true);
    // Fetch Categories
    const { data: catData } = await supabase.from('categories').select('name').order('name');
    if (catData) {
      setCategories(['Todas', ...catData.map(c => c.name)]);
    }

    // Fetch Products
    const { data: prodData } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          name
        )
      `)
      .order('created_at', { ascending: false });

    if (prodData) {
      const formattedProducts = prodData.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image_url,
        images: p.images || [],
        position: p.image_position || '50% 50%',
        category: p.categories?.name || 'Sem Categoria',
        onSale: false, // Default for now
        description: p.description,
        specs: p.specs || [],
        sizes: p.sizes || ['P', 'M', 'G', 'GG', 'XG'],
        rating: p.rating,
        reviewsCount: p.reviews_count || 0,
        sizeGuide: p.size_guide_url || '',
        shippingInfo: p.shipping_info || 'Envio Expresso Grátis',
        returnPolicy: p.return_policy || '30 Dias para Devolução'
      }));
      setProducts(formattedProducts);
    }
    setLoading(false);
  };

  const openModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        category: product.category, // Note: This stores the category NAME, but we might need ID for backend insert if we were strict. 
        // However, our backend update logic handles category name lookup or we should adjust here.
        // For simplicity in this demo, we'll fetch category ID during save.
        description: product.description || '',
        image_url: product.image,
        images: product.images || [],
        image_position: product.position || '50% 50%',
        specs: product.specs || [],
        sizes: product.sizes || ['P', 'M', 'G', 'GG', 'XG'],
        rating: product.rating ? String(product.rating) : '',
        reviews_count: product.reviewsCount || 0,
        size_guide_url: product.sizeGuide || '',
        shipping_info: product.shippingInfo || 'Envio Expresso Grátis',
        return_policy: product.returnPolicy || '30 Dias para Devolução'
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', price: '', category: '', description: '', image_url: '', images: [], image_position: '50% 50%', specs: [], sizes: ['P', 'M', 'G', 'GG', 'XG'], rating: '', reviews_count: 0, size_guide_url: '', shipping_info: 'Envio Expresso Grátis', return_policy: '30 Dias para Devolução' });
    }
    setIsModalOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!formData.name || !formData.price || !formData.category) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    try {
      // Get Category ID
      const { data: catData } = await supabase
        .from('categories')
        .select('id')
        .eq('name', formData.category)
        .single();

      if (!catData) throw new Error('Categoria inválida');

      const productPayload = {
        name: formData.name,
        price: parseFloat(formData.price),
        category_id: catData.id,
        description: formData.description,
        image_url: formData.images[0] || formData.image_url,
        images: formData.images,
        image_position: formData.image_position,
        specs: formData.specs.filter(([k, v]) => k.trim() && v.trim()),
        sizes: formData.sizes,
        rating: formData.rating ? parseFloat(formData.rating) : null,
        reviews_count: formData.reviews_count || 0,
        size_guide_url: formData.size_guide_url,
        shipping_info: formData.shipping_info,
        return_policy: formData.return_policy
      };

      let error;
      if (editingProduct) {
        const { error: updateError } = await supabase
          .from('products')
          .update(productPayload)
          .eq('id', editingProduct.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('products')
          .insert([productPayload]);
        error = insertError;
      }

      if (error) throw error;

      setIsModalOpen(false);
      fetchData(); // Refresh list

    } catch (err) {
      console.error(err);
      alert('Erro ao salvar produto.');
    }
  };

  const confirmDelete = (product: any) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      const { error } = await supabase.from('products').delete().eq('id', productToDelete.id);
      if (error) throw error;

      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir o produto.');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    const { error } = await supabase
      .from('categories')
      .insert([{ name: newCategoryName.trim() }]);

    if (error) {
      alert('Erro ao adicionar categoria. Talvez já exista?');
    } else {
      setNewCategoryName('');
      setIsAddingCategory(false);
      fetchData();
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('name', categoryToDelete);

      if (error) {
        if (error.code === '23503') {
          alert('Não é possível excluir esta categoria pois existem produtos vinculados a ela.');
        } else {
          throw error;
        }
      } else {
        if (selectedCategory === categoryToDelete) setSelectedCategory('Todas');
        fetchData();
      }
      setIsCategoryDeleteModalOpen(false);
      setCategoryToDelete(null);
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir categoria.');
    }
  };

  const confirmDeleteCategory = (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    if (name === 'Todas') {
      alert('Esta categoria não pode ser excluída.');
      return;
    }
    setCategoryToDelete(name);
    setIsCategoryDeleteModalOpen(true);
  };

  const filteredProducts = products.filter(p => {
    const categoryMatch = selectedCategory === 'Todas' || p.category === selectedCategory;
    const priceMatch = p.price <= appliedPriceRange;
    return categoryMatch && priceMatch;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-20 pt-32 pb-24 animate-in fade-in slide-in-from-bottom duration-500">
      <nav className="flex items-center gap-2 mb-12 text-sm">
        <Link to="/" className="text-gray-500 hover:text-primary">Início</Link>
        <span className="text-gray-300">/</span>
        <span className="font-bold">Loja</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="sticky top-32 flex flex-col gap-10">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black uppercase tracking-widest">Categorias</h3>
                {isAdmin && (
                  <button
                    onClick={() => setIsAddingCategory(!isAddingCategory)}
                    className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                    title="Nova Categoria"
                  >
                    <span className="material-symbols-outlined text-lg">{isAddingCategory ? 'close' : 'add'}</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap lg:flex-col gap-2">
                {isAddingCategory && isAdmin && (
                  <div className="flex gap-2 mb-4 animate-in slide-in-from-top-4 fade-in duration-300">
                    <input
                      type="text"
                      className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-primary"
                      placeholder="Nome da categoria..."
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                    />
                    <button
                      onClick={handleAddCategory}
                      className="bg-primary text-white px-3 rounded-xl hover:bg-primary/90 transition-all font-black text-[10px] uppercase tracking-widest"
                    >
                      OK
                    </button>
                  </div>
                )}

                {categories.map(cat => (
                  <div key={cat} className="group relative w-full overflow-hidden">
                    <button
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-5 py-3 rounded-xl transition-all font-bold text-sm flex items-center justify-between group ${selectedCategory === cat
                        ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                        : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                      <span>{cat}</span>
                      {isAdmin && cat !== 'Todas' && (
                        <button
                          onClick={(e) => confirmDeleteCategory(e, cat)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
                          title="Excluir Categoria"
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-6">Faixa de Preço</h3>
              <div className="px-2">
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="50"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between mt-4 text-xs font-bold text-gray-400">
                  <span>R$ 0</span>
                  <span className="text-primary">{formatCurrency(priceRange)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setAppliedPriceRange(priceRange)}
              className="w-full bg-primary text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all py-4 rounded-xl text-xs font-black uppercase tracking-widest"
            >
              Aplicar Filtros
            </button>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
            <div>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2">Coleção</p>
              <h2 className="text-4xl font-black tracking-tighter">{selectedCategory}</h2>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {isAdmin && (
                <button
                  onClick={() => openModal()}
                  className="bg-primary text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg hover:bg-primary/90 transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                  Novo Produto
                </button>
              )}
              <p className="text-sm text-gray-400 font-bold">{filteredProducts.length} Produtos Encontrados</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
            {currentItems.map(p => (
              <div key={p.id} className="group relative">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 mb-6 shadow-sm border border-transparent hover:border-gray-200 transition-all">
                  <Link to={`/product/${p.id}`}>
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      style={{ objectPosition: p.position || '50% 50%' }}
                    />
                  </Link>
                  <button
                    onClick={() => addToCart(p)}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-[#0d121b] px-8 py-3 rounded-xl text-xs font-bold opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl hover:bg-primary hover:text-white"
                  >
                    Adicionar
                  </button>
                  {p.onSale && <span className="absolute top-6 left-6 bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-lg">OFERTA</span>}

                  {isAdmin && (
                    <div className="absolute top-4 right-4 flex gap-2 z-20">
                      <button
                        onClick={(e) => { e.preventDefault(); openModal(p); }}
                        className="bg-white text-gray-700 p-2 rounded-lg shadow-md hover:text-primary transition-colors"
                        title="Editar"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button
                        onClick={(e) => { e.preventDefault(); confirmDelete(p); }}
                        className="bg-white text-red-500 p-2 rounded-lg shadow-md hover:bg-red-50 transition-colors"
                        title="Excluir"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  )}
                </div>
                <Link to={`/product/${p.id}`}>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">{p.category}</p>
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors mb-2">{p.name}</h3>
                  <div className="flex items-center gap-3">
                    <p className="font-black text-xl text-primary">{formatCurrency(p.price)}</p>
                    {p.onSale && <p className="text-sm text-gray-400 line-through">{p.oldPrice ? formatCurrency(p.oldPrice) : null}</p>}
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {filteredProducts.length > itemsPerPage && (
            <div className="mt-20 flex items-center justify-center gap-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="size-12 rounded-xl flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-500 hover:text-primary hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>

              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`size-12 rounded-xl text-sm font-black transition-all ${currentPage === i + 1
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'bg-white dark:bg-gray-800 text-gray-400 hover:text-primary border border-transparent hover:border-gray-100'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="size-12 rounded-xl flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-500 hover:text-primary hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          )}

          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-40 text-center">
              <span className="material-symbols-outlined text-6xl text-gray-200 mb-6">inventory_2</span>
              <p className="text-xl font-bold text-gray-400">Nenhum produto encontrado nesta categoria.</p>
              <button onClick={() => setSelectedCategory('Todas')} className="mt-6 text-primary font-bold hover:underline">Limpar filtros</button>
            </div>
          )}
        </div>
      </div>
      <EditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Editar Produto' : 'Novo Produto'}
        onSave={handleSaveProduct}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Nome do Produto</label>
            <input
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-bold focus:ring-primary focus:border-primary"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Camisa Linho"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Preço (R$)</label>
              <input
                type="number"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-bold focus:ring-primary focus:border-primary"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Categoria</label>
              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-bold focus:ring-primary focus:border-primary"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Selecione...</option>
                {categories.filter(c => c !== 'Todas').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-4">Galeria de Imagens (Até 4)</label>
            <div className="grid grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((idx) => (
                <div key={idx} className="space-y-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                    {idx === 0 ? 'Imagem Principal' : `Imagem ${idx + 1}`}
                  </p>
                  <ImageUploader
                    currentImage={formData.images[idx]}
                    onUpload={(url) => {
                      const newImages = [...formData.images];
                      newImages[idx] = url;
                      setFormData({ ...formData, images: newImages });
                    }}
                    aspectRatio="aspect-[4/5]"
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Descrição</label>
            <textarea
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-bold focus:ring-primary focus:border-primary h-24"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detalhes do produto..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-4">Tamanhos Disponíveis</label>
              <div className="flex flex-wrap gap-2">
                {['P', 'M', 'G', 'GG', 'XG'].map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      const newSizes = formData.sizes.includes(size)
                        ? formData.sizes.filter(s => s !== size)
                        : [...formData.sizes, size];
                      setFormData({ ...formData, sizes: newSizes });
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-black transition-all border-2 ${formData.sizes.includes(size)
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-100 dark:border-gray-800 text-gray-400'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold focus:ring-primary"
                  placeholder="Novo tamanho... (Pressione Enter)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = (e.target as HTMLInputElement).value.trim();
                      if (val && !formData.sizes.includes(val)) {
                        setFormData({ ...formData, sizes: [...formData.sizes, val] });
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase text-gray-400">Especificações Técnicas</label>
              {(formData.specs.length > 0 ? formData.specs : [['', '']]).map(([label, value], idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold focus:ring-primary"
                    value={label}
                    onChange={e => {
                      const newSpecs = [...formData.specs];
                      if (!newSpecs[idx]) newSpecs[idx] = ['', ''];
                      newSpecs[idx][0] = e.target.value;
                      setFormData({ ...formData, specs: newSpecs });
                    }}
                    placeholder="Chave (Ex: Material)"
                  />
                  <input
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold focus:ring-primary"
                    value={value}
                    onChange={e => {
                      const newSpecs = [...formData.specs];
                      if (!newSpecs[idx]) newSpecs[idx] = ['', ''];
                      newSpecs[idx][1] = e.target.value;
                      setFormData({ ...formData, specs: newSpecs });
                    }}
                    placeholder="Valor (Ex: 100% Algodão)"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newSpecs = formData.specs.filter((_, i) => i !== idx);
                      setFormData({ ...formData, specs: newSpecs });
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, specs: [...formData.specs, ['', '']] })}
                className="text-primary text-xs font-black uppercase tracking-widest flex items-center gap-1 hover:underline"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Adicionar Especificação
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100 mt-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Nota (0.0 - 5.0)</label>
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-bold focus:ring-primary"
                value={formData.rating}
                onChange={e => setFormData({ ...formData, rating: e.target.value })}
                placeholder="5.0"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Nº Avaliações</label>
              <input
                type="number"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-bold focus:ring-primary"
                value={formData.reviews_count}
                onChange={e => setFormData({ ...formData, reviews_count: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Link Guia de Tamanhos</label>
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-bold focus:ring-primary"
                value={formData.size_guide_url}
                onChange={e => setFormData({ ...formData, size_guide_url: e.target.value })}
                placeholder="URL do guia..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Informação de Envio</label>
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-bold focus:ring-primary"
                value={formData.shipping_info}
                onChange={e => setFormData({ ...formData, shipping_info: e.target.value })}
                placeholder="Ex: Envio Expresso Grátis"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Política de Devolução</label>
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-bold focus:ring-primary"
                value={formData.return_policy}
                onChange={e => setFormData({ ...formData, return_policy: e.target.value })}
                placeholder="Ex: 30 Dias para Devolução"
              />
            </div>
          </div>
        </div>
      </EditModal>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 max-w-sm w-full relative z-10 animate-in fade-in zoom-in duration-200">
            <div className="size-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-red-500 mb-6">
              <span className="material-symbols-outlined text-3xl">delete_forever</span>
            </div>
            <h3 className="text-2xl font-black tracking-tighter mb-2">Excluir Produto?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">
              Você está prestes a excluir <span className="font-bold text-gray-900 dark:text-white">"{productToDelete?.name}"</span>. Esta ação não pode ser desfeita.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Delete Confirmation Modal */}
      {isCategoryDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCategoryDeleteModalOpen(false)}></div>
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 max-w-sm w-full relative z-10 animate-in fade-in zoom-in duration-200">
            <div className="size-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-red-500 mb-6">
              <span className="material-symbols-outlined text-3xl">folder_delete</span>
            </div>
            <h3 className="text-2xl font-black tracking-tighter mb-2">Excluir Categoria?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">
              Você está prestes a excluir a categoria <span className="font-bold text-gray-900 dark:text-white">"{categoryToDelete}"</span>. Esta ação não poderá ser desfeita e afetará a organização dos produtos.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setIsCategoryDeleteModalOpen(false)}
                className="py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteCategory}
                className="py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
