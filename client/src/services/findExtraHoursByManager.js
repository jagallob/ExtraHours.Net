export const findExtraHoursByManager = async () => {
  try {
    const token = localStorage.getItem("token");

    // Realizar la solicitud al endpoint específico para obtener las horas extra de los empleados del manager
    const response = await fetch(
      "https://localhost:7086/api/extra-hour/manager/employees-extra-hours",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Verificar si la respuesta no es exitosa
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Error al obtener los registros de horas extra."
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};
