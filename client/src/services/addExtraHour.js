export const addExtraHour = async (extraHour) => {
  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(extraHour),
    };

    // console.log("Enviando datos:", body);

    const response = await fetch(
      `https://localhost:7086/api/extra-hour`,
      options
    );

    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error al agregar horas extra:", error);

    throw error;
  }
};
