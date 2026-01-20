import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {apiClient} from "../api/apiClient.ts";
import type {Category, CreateCategoryDTO} from "../types";
import type {PaginatedResponse} from "../types/paginatedResponse.ts";


export const useCategories = () => {
    const queryClient = useQueryClient();

    // GET: Lista de Categorias, usado para o Select (lista suspensa no front) do formulário
    const categoriesQuery = useQuery<PaginatedResponse<Category>>({
        queryKey: ['categories'],
        queryFn: () => apiClient.get('categories'),
    });


    // POST: Criar Categoria (Caso você queira um formulário de categorias no futuro)
    const createCategoryMutation = useMutation<Category, Error, CreateCategoryDTO>({
        mutationFn: (newCategory) => apiClient.post('categories', newCategory),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['categories']})
                    .then(() => {});
        }
    });

    return {categoriesQuery, createCategoryMutation};
}