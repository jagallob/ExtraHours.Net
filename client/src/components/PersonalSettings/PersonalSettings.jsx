import { useState } from "react";
import { addEmployee } from "@services/addEmployee";
import "./PersonalSettings.scss";

export const PersonalSettings = () => {
  const [newEmployee, setNewEmployee] = useState({
    id: "",
    name: "",
    position: "",
    salary: "",
    manager: "",
    manager_id: "",
    email: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEmployeeChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prevData) => {
      const email =
        name === "name"
          ? `${value.toLowerCase().replace(/ /g, ".")}@empresa.com`
          : prevData.email;
      const username =
        name === "name"
          ? value.toLowerCase().replace(/ /g, ".")
          : prevData.username;

      return { ...prevData, [name]: value, email, username };
    });
  };

  const handleSubmitNewEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await addEmployee(newEmployee);
      alert("Empleado agregado exitosamente");
      setNewEmployee({
        id: "",
        name: "",
        position: "",
        salary: "",
        manager: "",
        manager_id: "",
        email: "",
        role: "",
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmitNewEmployee}>
      <h3>Agregar Nuevo Empleado</h3>
      <div>
        <label htmlFor="id">ID</label>
        <input
          type="number"
          id="id"
          name="id"
          value={newEmployee.id}
          onChange={handleEmployeeChange}
          required
        />
      </div>
      <div>
        <label htmlFor="name">Nombre</label>
        <input
          type="text"
          id="name"
          name="name"
          value={newEmployee.name}
          onChange={handleEmployeeChange}
          required
        />
      </div>
      <div>
        <label htmlFor="position">Posición</label>
        <input
          type="text"
          id="position"
          name="position"
          value={newEmployee.position}
          onChange={handleEmployeeChange}
          required
        />
      </div>
      <div>
        <label htmlFor="salary">Salario</label>
        <input
          type="number"
          id="salary"
          name="salary"
          value={newEmployee.salary}
          onChange={handleEmployeeChange}
          required
        />
      </div>
      <div>
        <label htmlFor="manager">Manager</label>
        <input
          type="text"
          id="manager"
          name="manager"
          value={newEmployee.manager}
          onChange={handleEmployeeChange}
          required
        />
      </div>
      <div>
        <label htmlFor="manager_id">Manager ID</label>
        <input
          type="number"
          id="manager_id"
          name="manager_id"
          value={newEmployee.manager_id}
          onChange={handleEmployeeChange}
          required
        />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          name="email"
          value={newEmployee.email}
          readOnly
        />
      </div>
      <div>
        <label htmlFor="role">Rol</label>
        <select
          id="role"
          name="role"
          value={newEmployee.role}
          onChange={handleEmployeeChange}
          required
        >
          <option value=""></option>
          <option value="manager">Manager</option>
          <option value="empleado">Empleado</option>
          <option value="superusuario">Superusuario</option>
        </select>
      </div>
      <button className="addNewButton" type="submit" disabled={loading}>
        {loading ? "Agregando..." : "Agregar Empleado"}
      </button>
      {error && <p>Error: {error}</p>}
    </form>
  );
};
