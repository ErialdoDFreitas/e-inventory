import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import type {PaginatedResponse} from "../types/paginatedResponse.ts";
import type {CreateProductDTO, Product} from "../types";
import {apiClient} from "../api/apiClient";


export const useProducts = () => {
    const queryClient = useQueryClient();

    // GET: Lista de Produtos
    const productsQuery = useQuery<PaginatedResponse<Product>>({
        queryKey: ['products'],
        queryFn: () => apiClient.get('products'),
    });

    // POST: Criar Produto
    const createProductMutation = useMutation<Product, Error, CreateProductDTO>({
        mutationFn: (newProduct) => apiClient.post('/products', newProduct),
        onSuccess: () => {
            // Invalida o cache para atualizar a lista automaticamente
            queryClient.invalidateQueries({queryKey: ['products']})
                .then(() => {
                });
        }
    });

    return {productsQuery, createProductMutation};
}