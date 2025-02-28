import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../utils/useAuth";

// Componente para proteger las rutas
const ProtectedRoute = ({ element, allowedRoles }) => {
  const { auth } = useAuth();

  // Verificar si el usuario está autenticado y tiene un rol permitido
  if (!auth || !auth.role) {
    // Si no está autenticado, redirige al inicio de sesión
    return <Navigate to="/" replace />;
  }

  if (
    !allowedRoles
      .map((role) => role.toLowerCase())
      .includes(auth.role.toLowerCase())
  ) {
    // Si está autenticado pero no tiene el rol permitido, redirige a una página de acceso denegado o al menú
    return <Navigate to="/menu" replace />;
  }

  return element;
};

ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired, // 'element' debe ser un elemento React válido y obligatorio
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired, // 'allowedRoles' debe ser un array de strings y obligatorio
};

export default ProtectedRoute;
