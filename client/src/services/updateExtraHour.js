export const updateExtraHour = async (registry, updatedValues) => {
  try {
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updatedValues),
    };

    const response = await fetch(
      `https://localhost:7086/api/extra-hour/${registry}/update`,
      options
    );

    if (!response.ok) {
      throw new Error(
        `Error al actualizar la hora extra: ${response.statusText}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("Error al actualizar las horas extra:", error);
    throw error;
  }
};
