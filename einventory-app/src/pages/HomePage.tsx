import {BarChart3, LayoutDashboard, Package} from "lucide-react";
import {useProducts} from "../hooks/useProducts";
import {useCategories} from "../hooks/useCategories";
import "./styles/Home.css";


export const HomePage = () => {
    const productsQuery = useProducts().productsQuery;
    const categoriesQuery = useCategories().categoriesQuery;

    // Extraindo o total diretamente do campo 'count' da paginação do Django
    const totalProducts = productsQuery.data?.count || 0;
    const totalCategories = categoriesQuery.data?.count || 0;

    return (
        <div className="page-container">
            {/* Título padronizado com o ícone */}
            <h1><LayoutDashboard/> Gestão de Inventário Online </h1>
            <h2><BarChart3 size={32}/> Dashboard </h2>

            {/* Grid de Cards de estatísticas aqui... */}
            <div className="dashboard-grid">

                <section className="desc-dashboard">
                    <h3>Bem vindo ao E-Inventory</h3>
                    <p>Utilize o menu lateral para gerenciar seus produtos e categorias</p>
                </section>

                <section className="stat-card blue">
                    <div className="stat-icon">
                        <Package size={30}/>
                    </div>
                    <div className="stat-info">
                        <h3>Total de Produtos</h3>
                        <p className="stat-number">{totalProducts}</p>
                    </div>
                </section>

                <section className="stat-card green">
                    <div className="stat-icon">
                        <Package size={30}/>
                    </div>
                    <div className="stat-info">
                        <h3>Total de Categorias</h3>
                        <p className="stat-number">{totalCategories}</p>
                    </div>
                </section>

                {/*   */}

            </div>

        </div>
    );
};