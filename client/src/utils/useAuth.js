import { useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }

  const { auth, login, logout } = context;

  const getEmployeeIdFromToken = () => {
    if (auth?.token) {
      try {
        const decodedToken = jwtDecode(auth.token);
        if (decodedToken.id) {
          return decodedToken.id;
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }

    try {
      // Intentar obtener directamente desde localStorage si está almacenado
      const storedId = localStorage.getItem("id");
      if (storedId) {
        return storedId;
      }

      // Si no hay ID almacenado, intentar decodificar el token del localStorage
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        if (decodedToken.id) {
          // Guardar para futuros usos
          localStorage.setItem("id", decodedToken.id);
          return decodedToken.id;
        }
      }
    } catch (error) {
      console.error("Error al obtener ID del localStorage:", error);
    }

    return null;
  };

  const getUserRole = () => {
    if (auth?.token) {
      try {
        const decodedToken = jwtDecode(auth.token);
        return decodedToken.role || null;
      } catch (error) {
        console.error(
          "Error al decodificar el token para obtener el rol:",
          error
        );
      }
    }

    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        return decodedToken.role || null;
      }
    } catch (error) {
      console.error("Error al obtener rol del localStorage:", error);
    }

    return null;
  };

  const userRole = getUserRole();

  return { auth, login, logout, getEmployeeIdFromToken, userRole, getUserRole };
};
