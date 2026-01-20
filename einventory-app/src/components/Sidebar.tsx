import { NavLink } from 'react-router-dom';
// import './Sidebar.css';

export function Sidebar() {
  return (
    <nav className="sidebar">
      <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''} >
        Home
      </NavLink>
      <NavLink to="/produtos" end className={({ isActive }) => isActive ? 'active' : ''} >
        Produtos
      </NavLink>
      <NavLink to="/categorias" end className={({ isActive }) => isActive ? 'active' : ''} >
        Categorias
      </NavLink>
    </nav>
  );
}
