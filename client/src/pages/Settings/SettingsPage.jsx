import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import logoamadeus from "../../assets/images/logoamadeus.png";
import "./SettingsPage.scss";
import parametroset from "../../assets/images/parametroset.png";
import eliminarset from "../../assets/images/eliminarset.png";
import Regresar from "../../assets/images/Regresar.png";
import agregarset from "../../assets/images/agregarset.png";

const SettingsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Verificar si estamos en una subpágina
  const isSubPage = location.pathname !== "/settings";

  return (
    <div>
      <div className={isSubPage ? "subpage-container" : "settings-container"}>
        <header className="page__header">
          <Link to="/menu">
            <img className="logoamadeus" src={logoamadeus} alt="Logo Amadeus" />
          </Link>
        </header>
        <div className="settingsMenu">
          <h2>Configuraciones</h2>
          {isSubPage ? (
            <div className="mini-icons">
              <div onClick={() => navigate("/settings")}>
                <img className="regresar" src={Regresar} alt="Inicio" />
                <p>Regresar</p>
              </div>
            </div>
          ) : (
            // Mostrar el menú principal si no estamos en una subpágina
            <div className="grid">
              <div
                className="menu-item"
                id="extra-hours-settings"
                onClick={() => navigate("/settings/ExtraHoursSettings")}
              >
                <div id="imgagregar">
                  <img src={parametroset} alt="Engranage" />
                </div>
                <p>Parámetros Horas Extra</p>
              </div>
              <div
                className="menu-item"
                id="extra-hours-settings"
                onClick={() => navigate("/settings/PersonalSettings")}
              >
                <img src={agregarset} alt="Ícono de perfil con engranage" />
                <p>Agregar Empleado</p>
              </div>
              <div
                className="menu-item"
                id="extra-hours-settings"
                onClick={() => navigate("/settings/UpdateDeletePersonal")}
              >
                <img src={eliminarset} alt="ïcono de más (+)" />
                <p>Actualizar ó Eliminar Personal</p>
              </div>
            </div>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
