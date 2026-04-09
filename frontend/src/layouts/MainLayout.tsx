import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <header
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #d1d5db",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <nav
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "center",
            }}
          >
            <Link to="/characters">Characters</Link>
            <Link to="/characters/create">Create</Link>
            <Link to="/characters/create-from-prompt">Create from prompt</Link>
          </nav>

          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
            }}
          >
            <span>{user?.email}</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      <main
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "24px",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;