import { useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContext";

export const useAuth = () => {
  const auth = useContext(AuthContext);

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

  return { ...auth, getEmployeeIdFromToken };
};
