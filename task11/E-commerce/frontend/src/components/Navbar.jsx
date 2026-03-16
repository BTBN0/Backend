import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const isAdmin = role === 'ADMIN';

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const active = (path) => location.pathname === path ? { color: 'var(--text)' } : {};

  return (
    <nav className="navbar">
      <Link to="/products" className="brand">LUXE SHOP</Link>
      <div className="nav-links">
        <Link to="/products" style={active('/products')}>Shop</Link>
        {token ? (
          <>
            <Link to="/orders" style={active('/orders')}>Orders</Link>
            {isAdmin && (
              <Link to="/admin" style={{ ...active('/admin'), color: location.pathname === '/admin' ? 'var(--accent)' : '' }}>
                Admin
              </Link>
            )}
            <button className="btn-logout" onClick={logout}>Sign Out</button>
          </>
        ) : (
          <>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
