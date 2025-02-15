export const deleteEmployee = async (employeeId) => {
  try {
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    const response = await fetch(
      `https://localhost:7086/api/employee/${employeeId}`,
      options
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al eliminar el empleado");
    }
  } catch (error) {
    console.error("Error al eliminar empleado:", error);
    throw error;
  }
};
