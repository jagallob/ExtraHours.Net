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

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formattedData),
    };

    console.log("Enviando datos:", formattedData);

    const response = await fetch(
      `https://localhost:7086/api/employee`,
      options
    );

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
