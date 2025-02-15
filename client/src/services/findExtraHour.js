export const findExtraHour = async (identifier, type = "id") => {
  try {
    const url =
      type === "id"
        ? `https://localhost:7086/api/extra-hour/id/${identifier}`
        : `https://localhost:7086/api/extra-hour/registry/${identifier}`;

    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token no encontrado en localStorage");
      return;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error HTTP! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en findExtraHour:", error);
    throw error;
  }
};
