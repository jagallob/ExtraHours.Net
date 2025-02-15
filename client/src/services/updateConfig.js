export const updateConfig = async (newConfig) => {
  try {
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(newConfig),
    };

    const response = await fetch(`https://localhost:7086/api/config`, options);

    if (!response.ok) {
      throw new Error("Error actualizando la configuración");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al actualizar configuración:", error);
    throw error;
  }
};
