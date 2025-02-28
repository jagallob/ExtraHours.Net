import { useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContext";

export const useAuth = () => {
  const auth = useContext(AuthContext);

  const getEmployeeIdFromToken = () => {
    if (auth?.token) {
      try {
        const decodedToken = jwtDecode(auth.token);
        return decodedToken.id;
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        return null;
      }
    }
    return null;
  };

  return { ...auth, getEmployeeIdFromToken };
};
