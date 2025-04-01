import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; 
import { useAuth } from "../../utils/useAuth";
import "./Header.scss";
import ChangePasswordModal from "../ChangePasswordModal/ChangePasswordModal";
import Inicio from "../../assets/images/Inicio.png"; 
import LogoutIcon from "../../assets/images/logout_4034229.png"; 
import ChangePasswordIcon from "../../assets/images/password-reset_18954456.png"; 


const Header = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // <-- Obtenemos la ruta actual
  const [showDropdown, setShowDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    setShowDropdown(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <header className="app-header">
      {/* Logo que lleva al menú */}
      <img
        src="src/assets/images/imagen.png"
        alt="Logo"
        className="login-logo"
        onClick={() => navigate("/menu")}
        style={{ cursor: "pointer" }}
      />

     
      

      <div className="header-title">
        {auth && (
          <div className="user-info">
            <div className="user-name-container" onClick={toggleDropdown}>
              <span className="user-name">{auth.uniqueName || "Usuario"}</span>
              <span className="user-role">{auth.role && `(${auth.role})`}</span>
            </div>

            {showDropdown && (
              <div className="button-container">
                <img
                     src={LogoutIcon}
                     alt="Cerrar Sesión"
                     className="icon-button"
                     onClick={handleLogout}
                 />
                <img
                     src={ChangePasswordIcon}
                     alt="Cambiar Contraseña"
                     className="icon-button"
                     onClick={openModal}
                 />
              </div>
            )}
            {isModalOpen && <ChangePasswordModal onClose={closeModal} />}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
