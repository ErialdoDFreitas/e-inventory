// --- Models, que refletem o que tem no backend

export interface Category {
    id: number;
    name: string;
    description: string;
    product_count?: number;
}

export interface Product {
    id: number;
    name: string;
    sku: string;
    price: number;
    quantity: number;
    category: number; // ID para o POST
    category_name: string; // Nome, para o GET
    is_in_stock: boolean;
}
