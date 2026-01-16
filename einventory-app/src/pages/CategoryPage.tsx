import { useState, type FormEvent, type ChangeEvent } from "react";
import { Tags, PlusCircle, AlertCircle } from "lucide-react";
import type { CreateCategoryDTO } from "../types";
import {useCategories} from "../hooks/useCategories.ts";


export const CategoryPage = () => {
    const { categoriesQuery, createCategoryMutation } = useCategories();

    // Estado para o formulário
    const [formData, setFormData] = useState({ name: '', description: '' });

    // Tratamento de erro seguro
    const jsonCreateCategoryMutationError = createCategoryMutation.error
        ? JSON.stringify((createCategoryMutation.error as any).errors)
        : null;

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const payload: CreateCategoryDTO = {
            name: formData.name,
            description: formData.description
        };

        createCategoryMutation.mutate(payload, {
            onSuccess: () => setFormData({ name: '', description: '' }),
        });
    };

    return (
        <div>
            {/* Título Principal H1 - Igual ao de Produtos */}
            <h1><Tags /> Gestão de Categorias</h1>

            {/* --- SEÇÃO DE CADASTRO --- */}
            <section>
                <h3><PlusCircle size={20} /> Nova Categoria</h3>

                <form onSubmit={handleSubmit} className="category-form">
                    <input className="input-name-category"
                        name="name"
                        placeholder="Nome da Categoria"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit" disabled={createCategoryMutation.isPending}>
                        {createCategoryMutation.isPending ? 'Salvando...' : 'Cadastrar Categoria'}
                    </button>

                    <textarea
                        name="description"
                        placeholder="Descrição da Categoria"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </form>

                {/* --- ERROS DO BACKEND --- */}
                {createCategoryMutation.isError && (
                    <div id="create-mut-error">
                        <AlertCircle size={15} />
                        {jsonCreateCategoryMutationError}
                    </div>
                )}
            </section>

            {/* --- SEÇÃO DE LISTAGEM --- */}
            <section>
                <h3>Categorias Ativas</h3>

                {categoriesQuery.isLoading ? (
                    <p>Carregando...</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Descrição</th>
                                <th>Qtd. Produtos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categoriesQuery.data?.results?.map((categ)=> (
                                    <tr key={categ.id}>
                                        <td>{categ.name}</td>
                                        <td>{categ.description}</td>
                                        <td>{categ.product_count || 0}</td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
};