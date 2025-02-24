import axios from "axios";

export const updateConfig = async (configData) => {
  try {
    const token = localStorage.getItem("token"); // Obtiene el token del almacenamiento local

    if (!token) {
      throw new Error("No se encontró un token en el almacenamiento local.");
    }

    const response = await axios.put(
      "https://localhost:7086/api/config",
      configData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Agrega el token en la cabecera
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error en updateConfig:", error);
    throw new Error(
      `Error actualizando la configuración: ${
        error.response?.status || "Desconocido"
      }`
    );
  }
};
