import { useState } from 'react';
import { useInventory } from '../hooks/useInventory';
import type {CreateCategoryDTO} from "../types";


export const CategoryPage = () => {
    const { categoriesQuery, createCategoryMutation } = useInventory();
    const [formData, setFormData] = useState<CreateCategoryDTO>({ name: '', description: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createCategoryMutation.mutate(formData, {
            onSuccess: () => setFormData({ name: '', description: '' })
        });
    };

    return (
        <div className="page-container">
            <h2>Gerenciar Categorias</h2>
            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Nome"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                />
                <textarea
                    placeholder="Descrição"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                />
                <button type="submit" disabled={createCategoryMutation.isPending}>
                    {createCategoryMutation.isPending ? 'Salvando...' : 'Criar Categoria'}
                </button>
            </form>

            <ul className="list">
                {categoriesQuery.data?.map(cat => (
                    <li key={cat.id}>{cat.name} ({cat.product_count} produtos)</li>
                ))}
            </ul>
        </div>
    );
};