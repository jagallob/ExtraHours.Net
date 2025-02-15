export const findEmployee = async (employeeId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://localhost:7086/api/employee/${employeeId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener la información del empleado");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error al buscar empleado:", error);

    throw error;
  }
};
