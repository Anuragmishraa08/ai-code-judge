import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <Link to="/">AI Code Judge</Link>
      </div>
      <nav className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/problems">Problems</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        {user && <Link to="/profile">Profile</Link>}
        {user && <Link to="/submissions">Submissions</Link>}
        {user?.role === 'admin' && <Link to="/admin/problems">Admin</Link>}
        {user ? (
          <>
            <span className="navbar-user">{user.name}</span>
            <button className="button button-secondary" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
