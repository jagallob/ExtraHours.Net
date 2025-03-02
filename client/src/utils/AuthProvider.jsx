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
    const uniqueName = localStorage.getItem("unique_name");

    if (token && role) {
      const decodedToken = jwtDecode(token); // Decodificar el token
      console.log("Token decodificado:", decodedToken);

      // Almacenar el ID del usuario en localStorage si no está presente
      if (!localStorage.getItem("id")) {
        localStorage.setItem("id", decodedToken.id);
      }

      if (decodedToken.unique_name && !uniqueName) {
        localStorage.setItem("unique_name", decodedToken.unique_name);
      }

      return {
        token,
        role,
        uniqueName: uniqueName || decodedToken.unique_name,
      };
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

    if (decodedToken.unique_name) {
      localStorage.setItem("unique_name", decodedToken.unique_name);
    }

    setAuth({
      token,
      role: formattedRole,
      uniqueName: decodedToken.unique_name,
    });
    navigate("/menu");
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    localStorage.removeItem("unique_name");
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
