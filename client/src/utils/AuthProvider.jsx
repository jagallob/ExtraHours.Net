import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContext"; // Importar el contexto desde su archivo

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      const decodedToken = jwtDecode(token); // Decodificar el token
      console.log("Token decodificado:", decodedToken);

      // Almacenar el ID del usuario en localStorage si no está presente
      if (!localStorage.getItem("id")) {
        localStorage.setItem("id", decodedToken.id);
      }

      return { token, role };
    }
    return null;
  });

  const login = ({ token, role }) => {
    const formattedRole = role.replace(/[[\]]/g, "");
    const decodedToken = jwtDecode(token); // Decodificar el token

    // Almacenar el rol y el ID del usuario en localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("role", formattedRole);
    localStorage.setItem("id", decodedToken.id);

    setAuth({ token, role: formattedRole });
    navigate("/menu");
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("id"); // Eliminar el ID del usuario al cerrar sesión
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
