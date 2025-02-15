import "./App.scss";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ExtraHoursMenu from "./components/ExtraHoursMenu";
import LoginPage from "./pages/LoginPage";
import ReportsPage from "./pages/ReportsPage";
import ExtraHoursSettingsPage from "./pages/Settings/ExtraHoursSettingsPage";
import { PersonalSettings } from "./components/PersonalSettings/PersonalSettings";
import UpdateDeletePersonal from "./components/UpdateDeletePersonal/UpdateDeletePersonal";
import AddExtrahour from "./pages/AddExtrahour";
import UpdateDeleteApprovePage from "./pages/UpdateDeleteApprovePage";
import { AuthProvider } from "./utils/AuthContext";
import { ConfigProvider } from "./utils/ConfigProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import SettingsPage from "./pages/Settings/SettingsPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ConfigProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/menu" element={<ExtraHoursMenu />} />
            <Route
              path="/add"
              element={
                <ProtectedRoute
                  allowedRoles={["empleado", "manager", "superusuario"]}
                  element={<AddExtrahour />}
                />
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute
                  allowedRoles={["manager", "superusuario", "empleado"]}
                  element={<ReportsPage />}
                />
              }
            />
            <Route
              path="/ManagementExtraHour"
              element={
                <ProtectedRoute
                  allowedRoles={["manager", "superusuario"]}
                  element={<UpdateDeleteApprovePage />}
                />
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute
                  allowedRoles={["superusuario"]}
                  element={<SettingsPage />}
                />
              }
            >
              <Route
                path="ExtraHoursSettings"
                element={<ExtraHoursSettingsPage />}
              />
              <Route path="PersonalSettings" element={<PersonalSettings />} />
              <Route
                path="UpdateDeletePersonal"
                element={<UpdateDeletePersonal />}
              />
            </Route>
          </Routes>
        </ConfigProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
