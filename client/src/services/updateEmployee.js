export const updateEmployee = async (employeeId, employeeData) => {
  try {
    const transformedData = {
      Name: employeeData.name,
      Position: employeeData.position,
      Salary: employeeData.salary,
      ManagerId: employeeData.manager_id,
      Role: employeeData.role,
    };

    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(transformedData),
    };

    const response = await fetch(
      `https://localhost:7086/api/employee/${employeeId}`,
      options
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Error en la solicitud");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al actualizar empleado:", error);
    throw error;
  }
};
