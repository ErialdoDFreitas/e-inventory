import {Route, Routes} from "react-router-dom";
import {ProductPage} from "./pages/ProductPage";
import {CategoryPage} from "./pages/CategoryPage";
import {HomePage} from "./pages/HomePage.tsx";

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/produtos" element={<ProductPage />} />
            <Route path="/categorias" element={<CategoryPage/>} />
            <Route path="*" element={<h2>Página não encontrada</h2>} />
        </Routes>
    )
}