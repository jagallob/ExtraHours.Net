export const deleteExtraHour = async (registry) => {
  try {
    const response = await fetch(
      `https://localhost:7086/api/extra-hour/${registry}/delete`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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
