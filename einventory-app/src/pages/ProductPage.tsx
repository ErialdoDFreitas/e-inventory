import {useState, type FormEvent, type ChangeEvent} from "react";
import { Package, PlusCircle, AlertCircle } from "lucide-react";
import type {CreateProductDTO, ProductFormData} from "../types";
import {useProducts} from "../hooks/useProducts.ts";
import {useCategories} from "../hooks/useCategories.ts";


export const ProductPage = () => {
    const { productsQuery, createProductMutation } = useProducts();
    const categoriesQuery = useCategories().categoriesQuery;
    const [formData, setFormData] = useState<ProductFormData>({ name: '', description: '', sku: '', price: '', quantity: '', category: '' });
    const jsonCreateMutationErrors = createProductMutation.error
        ? JSON.stringify((createProductMutation.error as any).errors)
        : null;

    const payload: CreateProductDTO = {
        name: formData.name,
        description: formData.description,
        sku: formData.sku,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        category: Number(formData.category),
    }

      // Atualização genérica dos inputs
    const handleChange =
        (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            setFormData((prev) => ({
              ...prev,
              [name]: value,
            }));
        };

    // Handler de submissão dos dados
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const productFormData: ProductFormData =
            { name: '', description: '', sku: '', price: '', quantity: '', category: '' }
        createProductMutation.mutate(payload, {
            onSuccess: () => setFormData(productFormData),
        });
    };


    return (
      <div>
        <h1><Package /> Gestão de Inventário Online</h1>

        {/* --- FORMULÁRIO DE CADASTRO --- */}
        <section>
          <h3><PlusCircle size={20} /> Novo Produto</h3>

          <form
            onSubmit={handleSubmit}
          >
            <input
              name="name"
              placeholder="Nome"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              name="sku"
              placeholder="SKU"
              value={formData.sku}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="price"
              placeholder="Preço"
              value={formData.price}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="quantity"
              placeholder="Quantidade"
              value={formData.quantity}
              onChange={handleChange}
              required
            />

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Selecione a Categoria</option>
              {categoriesQuery.data?.results?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              name="description"
              placeholder="Descrição"
              value={formData.description}
              onChange={handleChange}
              required
            />

            <button type="submit" disabled={createProductMutation.isPending}>
              {createProductMutation.isPending
                ? 'Salvando...'
                : 'Cadastrar Produto'}
            </button>
          </form>

          {/* --- ERROS DO BACKEND --- */}
          {createProductMutation.isError && (
            <div id="create-mut-error">
              <AlertCircle size={15} />
              {jsonCreateMutationErrors}
            </div>
          )}
        </section>

        {/* --- TABELA DE LISTAGEM --- */}
        <section>
          <h3>Produtos Ativos</h3>

          {productsQuery.isLoading ? (
            <p>Carregando...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Descrição</th>
                  <th>SKU</th>
                  <th>Categoria</th>
                  <th>Preço</th>
                  <th>Estoque</th>
                </tr>
              </thead>

              <tbody>
                {productsQuery.data?.results?.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>{product.sku}</td>
                    <td>{product.category_name}</td>
                    <td>R$ {product.price}</td>
                    <td>{product.quantity}</td>
                  </tr>
                ))}
              </tbody>

            </table>
          )}

        </section>
      </div>
    );

}