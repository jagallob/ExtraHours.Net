import { useNavigate, Outlet, useLocation } from "react-router-dom";
import "./SettingsPage.scss";
import parametroset from "../../assets/images/parametroset.png";
import agregarset from "../../assets/images/agregarset.png";

const SettingsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isSubPage = location.pathname !== "/settings";
  const currentSubPage = location.pathname.split("/").pop();

  return (
    <div>
      <div className={isSubPage ? "subpage-container" : "settings-container"}>
        <header className="page__header"></header>
        <div className="settingsMenu">
          {isSubPage && (
            <div className="submenu-navigation">
              <div className="navigation-buttons">
                <div
                  className={`nav-button ${
                    currentSubPage === "ExtraHoursSettings" ? "active" : ""
                  }`}
                  onClick={() => navigate("/settings/ExtraHoursSettings")}
                >
                  <img src={parametroset} alt="Engranage" />
                  <p>Parámetros Horas Extra</p>
                </div>
                <div
                  className={`nav-button ${
                    currentSubPage === "EmployeeManagement" ? "active" : ""
                  }`}
                  onClick={() => navigate("/settings/EmployeeManagement")}
                >
                  <img src={agregarset} alt="Signo más dentro de un círculo" />
                  <p>Gestionar Empleados</p>
                </div>
              </div>
            </div>
          )}

          <h2>Configuraciones</h2>

          {!isSubPage && (
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
                onClick={() => navigate("/settings/EmployeeManagement")}
              >
                <img src={agregarset} alt="Ícono de perfil con engranage" />
                <p>Gestionar Empleados</p>
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
