import { API_CONFIG } from "../environments/api.config";
import { getAuthHeaders } from "../environments/http-headers";

export const addEmployee = async (employeeData) => {
  try {
    const formattedData = {
      Id: employeeData.ObjectId || employeeData.id,
      Name: employeeData.name,
      Position: employeeData.position,
      Salary: employeeData.salary,
      ManagerId: employeeData.manager_id || employeeData.ManagerId,
      Role: employeeData.role,
    };

    const response = await fetch(`${API_CONFIG.BASE_URL}/api/employee`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(formattedData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Error en la solicitud");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al agregar empleado:", error);
    throw error;
  }
};

export const findEmployee = async (id) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/employee/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorMessage = `Error ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Error al buscar empleado:", error.message);
    throw error;
  }
};

export const updateEmployee = async (employeeId, employeeData) => {
  try {
    const transformedData = {
      Name: employeeData.name,
      Position: employeeData.position,
      Salary: employeeData.salary,
      ManagerId: employeeData.manager_id,
      Role: employeeData.role,
    };

    const response = await fetch(
      `${API_CONFIG.BASE_URL}/api/employee/${employeeId}`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(transformedData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Error en la solicitud");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al actualizar empleado:", error);
    throw error;
  }
};

export const deleteEmployee = async (employeeId) => {
  if (!employeeId || isNaN(employeeId)) {
    throw new Error("El id del empleado es incorrecto");
  }
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/api/employee/${employeeId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al eliminar el empleado");
    }
    return true;
  } catch (error) {
    console.error("Error al eliminar empleado:", error);
    throw error;
  }
};
