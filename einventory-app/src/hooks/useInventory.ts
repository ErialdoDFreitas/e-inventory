import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {apiClient} from "../api/apiClient.ts";
import type {Category, CreateCategoryDTO, CreateProductDTO, Product} from "../types";

export const useInventory = () => {
    const queryClient = useQueryClient();

    // GET: Lista de Produtos
    const productsQuery = useQuery<Product[]>({
        queryKey: ['products'],
        queryFn: () => apiClient.get('/products'),
    });

    // GET: Lista de Categorias, usado para o Select (lista suspensa no front) do formulário
    const categoriesQuery = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: () => apiClient.get('/categories'),
    });

    // POST: Criar Produto
    const createProductMutation = useMutation<Product, Error, CreateProductDTO>({
        mutationFn: (newProduct) => apiClient.post('/products', newProduct),
        onSuccess: () => {
            // Invalida o cache para atualizar a lista automaticamente
            queryClient.invalidateQueries({queryKey: ['products']})
                    .then(() => {});
        }
    });

    // POST: Criar Categoria (Caso você queira um formulário de categorias no futuro)
    const createCategoryMutation = useMutation<Category, Error, CreateCategoryDTO>({
        mutationFn: (newCategory) => apiClient.post('/categories/', newCategory),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['categories']})
                    .then(() => {});
        }
    });

    return { productsQuery, categoriesQuery, createProductMutation, createCategoryMutation};
}