// Define tipos baseados nas interfaces (Utility Types)
import type {Category, Product} from "./models";

export type ProductFormData = {
    name: string;
    description: string;
    sku: string;
    price: string;
    quantity: string;
    category: string;
}

export type CreateProductDTO = Omit<
        Product,
        'id' | 'category_name' | 'is_in_stock' | 'is_active' >;

export type CreateCategoryDTO = Omit<
        Category,
        'id' | 'product_count' | 'is_active' >;