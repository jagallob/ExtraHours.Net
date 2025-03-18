import EmployeeManagement from "../../components/EmployeeManagement/EmployeeManagement";
import "./EmployeeManagementPage.scss";

const EmployeeManagementPage = () => {
  return (
    <div className="employee-management-page">
      <h2>Gestión de Empleados</h2>
      <div className="employee-management-container">
        <section className="employee-management-info">
          <article>
            <h3>Instrucciones</h3>
            <p>
              Este módulo permite la gestión completa de los empleados en el
              sistema. Puede agregar nuevos empleados y realizar operaciones de
              búsqueda, actualización y eliminación.
            </p>
            <h4>Características principales:</h4>
            <ul>
              <li>
                Registro de nuevos empleados con asignación automática de email
              </li>
              <li>Búsqueda de empleados por ID</li>
              <li>Actualización de datos de empleados existentes</li>
              <li>Eliminación segura de registros de empleados</li>
            </ul>
            <p>
              <strong>Nota:</strong> Los cambios realizados en esta sección
              afectan directamente a la base de datos de empleados y pueden
              impactar otros módulos del sistema.
            </p>
          </article>
        </section>

        <section className="employee-management-form">
          <EmployeeManagement />
        </section>
      </div>
    </div>
  );
};

export default EmployeeManagementPage;
