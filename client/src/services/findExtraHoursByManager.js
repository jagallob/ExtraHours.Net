export const findExtraHoursByManager = async (
  startDate = null,
  endDate = null
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado en localStorage");
      return [];
    }

    let url =
      "https://localhost:7086/api/extra-hour/manager/employees-extra-hours";

    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }

    // Realizar la solicitud al endpoint específico para obtener las horas extra de los empleados del manager
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error al obtener horas extras de empleados: ${response.status}`
      );
    }

    const data = await response.json();

    return data.map((record) => {
      // Asegurarse de que el objeto tenga una estructura uniforme
      if (record.extraHour && record.employee) {
        return {
          ...record.extraHour,
          ...record.employee,
        };
      }

      return record;
    });
  } catch (error) {
    console.error("Error al obtener horas extras de empleados:", error);
    throw error;
  }
};
