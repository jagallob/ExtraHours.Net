import axios from "axios";

export const addExtraHour = async (extraHour) => {
  try {
    const token = localStorage.getItem("token");

    console.log("Enviando a API:", extraHour); // Verificar antes de enviar

    const response = await axios.post(
      "https://localhost:7086/api/extra-hour",
      extraHour,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error al agregar horas extra:",
      error.response?.data || error.message
    );

    throw error;
  }
};
