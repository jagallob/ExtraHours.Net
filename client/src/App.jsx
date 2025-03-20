import "./App.scss";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ExtraHoursMenu from "./components/ExtraHoursMenu";
import LoginPage from "./pages/LoginPage";
import ReportsPage from "./pages/ReportsPage";
import ExtraHoursSettingsPage from "./pages/Settings/ExtraHoursSettingsPage";
import EmployeeManagementPage from "./pages/Settings/EmployeeManagementPage";
// import UpdateDeletePersonal from "./components/UpdateDeletePersonal/UpdateDeletePersonal";
import AddExtrahour from "./pages/AddExtrahour";
import UpdateDeleteApprovePage from "./pages/UpdateDeleteApprovePage";
import { AuthProvider } from "./utils/AuthProvider";
import { ConfigProvider } from "./utils/ConfigProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import SettingsPage from "./pages/Settings/SettingsPage";
import Layout from "./components/Layout/Layout";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ConfigProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/menu"
              element={
                <Layout>
                  <ExtraHoursMenu />
                </Layout>
              }
            />
            <Route
              path="/add"
              element={
                <ProtectedRoute
                  allowedRoles={["empleado", "manager", "superusuario"]}
                  element={
                    <Layout>
                      <AddExtrahour />
                    </Layout>
                  }
                />
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute
                  allowedRoles={["manager", "superusuario", "empleado"]}
                  element={
                    <Layout>
                      <ReportsPage />
                    </Layout>
                  }
                />
              }
            />
            <Route
              path="/ManagementExtraHour"
              element={
                <ProtectedRoute
                  allowedRoles={["manager", "superusuario"]}
                  element={
                    <Layout>
                      <UpdateDeleteApprovePage />
                    </Layout>
                  }
                />
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute
                  allowedRoles={["superusuario"]}
                  element={
                    <Layout>
                      <SettingsPage />
                    </Layout>
                  }
                />
              }
            >
              <Route
                path="ExtraHoursSettings"
                element={<ExtraHoursSettingsPage />}
              />
              <Route
                path="EmployeeManagement"
                element={<EmployeeManagementPage />}
              />
              {/* <Route
                path="UpdateDeletePersonal"
                element={<UpdateDeletePersonal />}
              /> */}
            </Route>
          </Routes>
        </ConfigProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
