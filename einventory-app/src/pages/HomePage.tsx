import { LayoutDashboard } from "lucide-react";
// import { useInventory } from "../hooks/useInventory";

export const HomePage = () => {
  // const { productsQuery, categoriesQuery } = useInventory();

  return (
    <div className="page-container">
      {/* Título padronizado com o ícone */}
      <h1><LayoutDashboard /> Gestão de Inventário Online</h1>

      {/*  cards de estatísticas aqui... */}
    </div>
  );
};