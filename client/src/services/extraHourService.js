import { API_CONFIG } from "../environments/api.config";
import { getAuthHeaders } from "../environments/http-headers";

export const addExtraHour = async (extraHour) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/extra-hour`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(extraHour),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Error al agregar horas extra");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al agregar horas extra:", error.message);
    throw error;
  }
};

export const approveExtraHour = async (registry) => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/api/extra-hour/${registry}/approve`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Error al aprobar el registro: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error al aprobar el registro:", error);
    throw error;
  }
};

export const calculateExtraHour = async (extraHourData) => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/api/extra-hour/calculate`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          Date: extraHourData.date,
          StartTime: extraHourData.startTime,
          EndTime: extraHourData.endTime,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al calcular horas extras");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al calcular horas extras:", error);
    throw error;
  }
};

export const deleteExtraHour = async (registry) => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/api/extra-hour/${registry}/delete`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Error al eliminar el registro: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error al eliminar el registro:", error);
    throw error;
  }
};

export const findAllExtraHours = async (startDate = null, endDate = null) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado en localStorage");
      return;
    }

    let url = `${API_CONFIG.BASE_URL}/api/extra-hour/all-employees-extra-hours`;

    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
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

export const findExtraHour = async (identifier, type = "id") => {
  try {
    const url =
      type === "id"
        ? `${API_CONFIG.BASE_URL}/api/extra-hour/id/${identifier}`
        : `${API_CONFIG.BASE_URL}/api/extra-hour/registry/${identifier}`;

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en findExtraHour:", error);
    throw error;
  }
};

export const findExtraHourByDateRange = async (startDate, endDate) => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/api/extra-hour/date-range-with-employee?startDate=${startDate}&endDate=${endDate}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener la información de rango de fechas");
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
    console.error("Error al buscar fecha:", error);
    throw error;
  }
};

export const findExtraHoursByManager = async (
  startDate = null,
  endDate = null
) => {
  try {
    let url = `${API_CONFIG.BASE_URL}/api/extra-hour/manager/employees-extra-hours`;

    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(
        `Error al obtener horas extras de empleados: ${response.status}`
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
    console.error("Error al obtener horas extras de empleados:", error);
    throw error;
  }
};

export const findManagerEmployeesExtraHours = async (
  startDate = null,
  endDate = null
) => {
  try {
    if ((startDate && !endDate) || (!startDate && endDate)) {
      throw new Error("Debes proporcionar ambas fechas o ninguna");
    }

    const endpoint = new URL(
      `${API_CONFIG.BASE_URL}/api/extra-hour/manager/employees-extra-hours`
    );

    if (startDate && endDate) {
      endpoint.searchParams.append("startDate", startDate);
      endpoint.searchParams.append("endDate", endDate);
    }

    const response = await fetch(endpoint.toString(), {
      method: "GET",
      headers: getAuthHeaders(), // Headers centralizados
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || "Error al obtener horas extra del equipo"
      );
    }

    const data = await response.json();

    return data.map((item) => ({
      ...(item.extraHour || {}),
      ...(item.employee || {}),
      id: item.extraHour?.id || item.id,
    }));
  } catch (error) {
    console.error(
      "[ExtraHourService] Error en findManagerEmployeesExtraHours:",
      error
    );
    throw error;
  }
};

export const updateExtraHour = async (registry, updatedValues) => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/api/extra-hour/${registry}/update`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedValues),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error al actualizar la hora extra: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error al actualizar las horas extra:", error);
    throw error;
  }
};
