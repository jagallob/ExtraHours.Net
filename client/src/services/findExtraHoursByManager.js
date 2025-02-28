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
        },
      }
    );

    // Verificar si la respuesta no es exitosa
    if (!response.ok) {
      throw new Error("Error al obtener los registros de horas extra.");
    }

    // Parsear y retornar los datos obtenidos
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error; // Propagar el error para manejarlo en el componente
  }
};
