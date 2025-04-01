import { useAuth } from "../../utils/useAuth";
import "./Header.scss";

const Header = () => {
  const { auth } = useAuth();

  return (
    <header className="app-header">
      <div className="logo">
        <>Bienvenid@</>
      </div>

      {auth && (
        <div className="user-info">
          <span className="user-name">{auth.uniqueName || "Usuario"}</span>
          <span className="user-role">{auth.role && `(${auth.role})`}</span>
        </div>
      )}
    </header>
  );
};

export default Header;
