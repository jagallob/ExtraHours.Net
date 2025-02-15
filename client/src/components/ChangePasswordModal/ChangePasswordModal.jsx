import { useState, useEffect } from "react";
import { UserService } from "../../services/UserService";
import PropTypes from "prop-types";
import "./ChangePasswordModal.scss";

const ChangePasswordModal = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storeId = localStorage.getItem("id");
    if (storeId) {
      setId(storeId);
    } else {
      setMessage("No se encontró el ID del usuario. Inicia sesión nuevamente.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!id) {
      setMessage("No se pudo recuperar el ID del usuario.");
      return;
    }
    try {
      await UserService.changePassword(currentPassword, newPassword);
      setMessage("Contraseña actualizada exitosamente");
    } catch (error) {
      setMessage("Error al cambiar la contraseña. Verifica tus datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-container">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Cambiar Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ID de Usuario:</label>
            <input
              type="text"
              value={id}
              disabled
              placeholder="Ingrese su cédula"
            />

            <div className="password-input-container">
              <label>Contraseña Actual:</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Ingrese su contraseña actual"
                required
              />

              <label>Nueva Contraseña:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ingrese su nueva contraseña"
                required
              />
            </div>

            <div className="button-group">
              <button type="submit" disabled={loading} className="save-button">
                Cambiar Contraseña
              </button>
              <button type="button" className="cancel-button" onClick={onClose}>
                Cancelar
              </button>
            </div>
          </div>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default ChangePasswordModal;

ChangePasswordModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};
