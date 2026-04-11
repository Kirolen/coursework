import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ThemeToggle from "../../components/common/ThemeToggle/ThemeToggle";
import "./MainLayout.css";

function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="layout">
      <header className="layout__header">
        <div className="layout__header-inner">
          <div className="layout__brand">
            <Link to="/characters" className="layout__brand-link">
              Character Cards
            </Link>
          </div>

          <nav className="layout__nav">
  <NavLink
    to="/characters"
    end
    className={({ isActive }) =>
      `layout__nav-link ${isActive ? "layout__nav-link--active" : ""}`
    }
  >
    Characters
  </NavLink>

            <NavLink
              to="/characters/create"
              className={({ isActive }) =>
                `layout__nav-link ${isActive ? "layout__nav-link--active" : ""}`
              }
            >
              Create
            </NavLink>

            <NavLink
              to="/characters/create-from-prompt"
              className={({ isActive }) =>
                `layout__nav-link ${isActive ? "layout__nav-link--active" : ""}`
              }
            >
              Prompt
            </NavLink>
          </nav>

          <div className="layout__actions">
            <ThemeToggle />
            <span className="layout__user-email">{user?.email}</span>

            <button
              type="button"
              className="layout__logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;