import { createContext, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      const decodedToken = jwtDecode(token); // Decodificar el token
      console.log("Token decodificado:", decodedToken);

      return { token, role };
    }
    return null;
  });

  const login = ({ token, role }) => {
    const formattedRole = role.replace(/[[\]]/g, "");
    setAuth({ token, role: formattedRole });
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    navigate("/menu");
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
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
