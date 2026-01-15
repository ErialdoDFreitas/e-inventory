import {useState, type FormEvent, type ChangeEvent} from "react";
import { useInventory } from "../hooks/useInventory.ts";
import { Package, PlusCircle, AlertCircle } from "lucide-react";
import type {CreateProductDTO, ProductFormData} from "../types";


export const ProductPage = () => {
    const { productsQuery, categoriesQuery, createProductMutation } = useInventory();
    const [formData, setFormData] = useState<ProductFormData>({ name: '', sku: '', price: '', quantity: '', category: '' });
    const jsonCreateMutationErrors = createProductMutation.error
        ? JSON.stringify((createProductMutation.error as any).errors)
        : null;

    const payload: CreateProductDTO = {
        name: formData.name,
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
        createProductMutation.mutate(payload, {
            onSuccess: () => setFormData({ name: '', sku: '', price: '', quantity: '', category: '' }),
        });
    };


    return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h1><Package /> Gestão de Inventário Online</h1>

        {/* --- FORMULÁRIO DE CADASTRO --- */}
        <section
          style={{
            marginBottom: '40px',
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
          }}
        >
          <h3><PlusCircle size={20} /> Novo Produto</h3>

          <form
            onSubmit={handleSubmit}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}
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
              {categoriesQuery.data?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <button type="submit" disabled={createProductMutation.isPending}>
              {createProductMutation.isPending
                ? 'Salvando...'
                : 'Cadastrar Produto'}
            </button>
          </form>

          {/* --- ERROS DO BACKEND --- */}
          {createProductMutation.isError && (
            <div style={{ color: 'red', marginTop: '10px' }}>
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
            <table
              width="100%"
              border={1}
              style={{ borderCollapse: 'collapse', textAlign: 'left' }}
            >
              <thead>
                <tr style={{ backgroundColor: '#f9f9f9' }}>
                  <th>Produto</th>
                  <th>SKU</th>
                  <th>Categoria</th>
                  <th>Preço</th>
                  <th>Estoque</th>
                </tr>
              </thead>

              <tbody>
                {productsQuery.data?.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
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