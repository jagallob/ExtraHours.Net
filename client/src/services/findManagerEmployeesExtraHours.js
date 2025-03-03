export const findManagerEmployeesExtraHours = async (startDate, endDate) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado en localStorage");
      return [];
    }

    let url = `https://localhost:7086/api/extra-hour/manager/employees-extra-hours`;

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
      throw new Error("Error al obtener la información de los empleados");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al buscar datos de empleados del manager:", error);
    throw error;
  }
};
