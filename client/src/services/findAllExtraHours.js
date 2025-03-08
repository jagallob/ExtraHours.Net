export const findAllExtraHours = async (startDate = null, endDate = null) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado en localStorage");
      return;
    }

    let url = "https://localhost:7086/api/extra-hour/all-employees-extra-hours";

    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error al obtener todas las horas extras: ${response.status}`
      );
    }

    const data = await response.json();

    return data.map((record) => {
      if (record.extraHour && record.employee) {
        return {
          ...record.extraHour,
          ...record.employee,
        };
      }

      return record;
    });
  } catch (error) {
    console.error("Error al obtener todas las horas extras:", error);

    throw error;
  }
};
