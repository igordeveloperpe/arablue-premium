
import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { formatCurrency } from '../../utils';

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    image_url: string;
    category_id: string;
}

interface Category {
    id: string;
    name: string;
}

const ProductManager: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<Product | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const { data: prodData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        const { data: catData } = await supabase.from('categories').select('*').order('name');

        if (prodData) setProducts(prodData);
        if (catData) setCategories(catData);
        setLoading(false);
    };

    const handleSave = async (product: Partial<Product>) => {
        const { error } = await supabase.from('products').upsert(product);
        if (!error) {
            setEditing(null);
            fetchData();
        } else {
            alert('Erro ao salvar produto');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir?')) {
            await supabase.from('products').delete().eq('id', id);
            fetchData();
        }
    };

    if (loading) return <div>Carregando produtos...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Gerenciar Produtos</h3>
            </div>

            {editing && (
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl space-y-4 border dark:border-gray-600">
                    <h4 className="font-bold">Editar Produto</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            placeholder="Nome"
                            className="p-2 rounded border dark:bg-gray-800 dark:border-gray-600"
                            value={editing.name}
                            onChange={e => setEditing({ ...editing, name: e.target.value })}
                        />
                        <input
                            placeholder="Preço"
                            type="number"
                            className="p-2 rounded border dark:bg-gray-800 dark:border-gray-600"
                            value={editing.price}
                            onChange={e => setEditing({ ...editing, price: parseFloat(e.target.value) })}
                        />
                        <textarea
                            placeholder="Descrição"
                            className="p-2 rounded border dark:bg-gray-800 dark:border-gray-600 col-span-2"
                            value={editing.description}
                            onChange={e => setEditing({ ...editing, description: e.target.value })}
                        />
                        <input
                            placeholder="URL da Imagem"
                            className="p-2 rounded border dark:bg-gray-800 dark:border-gray-600"
                            value={editing.image_url}
                            onChange={e => setEditing({ ...editing, image_url: e.target.value })}
                        />
                        <select
                            className="p-2 rounded border dark:bg-gray-800 dark:border-gray-600"
                            value={editing.category_id}
                            onChange={e => setEditing({ ...editing, category_id: e.target.value })}
                        >
                            <option value="">Selecione Categoria</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => handleSave(editing)} className="bg-green-500 text-white px-4 py-2 rounded font-bold">Salvar</button>
                        <button onClick={() => setEditing(null)} className="bg-gray-500 text-white px-4 py-2 rounded font-bold">Cancelar</button>
                    </div>
                </div>
            )}

            <div className="grid gap-4">
                {products.map(p => (
                    <div key={p.id} className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <img src={p.image_url} alt={p.name} className="w-12 h-12 object-cover rounded" />
                            <div>
                                <p className="font-bold">{p.name}</p>
                                <p className="text-sm text-gray-500">{formatCurrency(p.price)}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setEditing(p)} className="text-blue-500 font-bold text-sm">Editar</button>
                            <button onClick={() => handleDelete(p.id)} className="text-red-500 font-bold text-sm">Excluir</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductManager;
