export const findEmployee = async (id) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No se encontró un token en el almacenamiento local.");
    }

    const response = await fetch(`https://localhost:7086/api/employee/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorMessage = `Error ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al buscar empleado:", error.message);
    throw error;
  }
};
