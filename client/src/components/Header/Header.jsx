import { useAuth } from "../../utils/useAuth";
import "./Header.scss";

const Header = () => {
  const { auth } = useAuth();

  return (
    <header className="app-header">
       <img 
    src="src/assets/images/imagen.png" 
    alt="Logo" 
    className="login-logo" 
  />
<div className="header-title">
      {auth && (
        <div>
          <span className="user-name">{auth.uniqueName || "Usuario"}</span>
          <span className="user-role">{auth.role && `(${auth.role})`}</span>
        </div>
        
      )}
      </div>
    </header>
  );
};

export default Header;
