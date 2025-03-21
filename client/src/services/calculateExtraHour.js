export const calculateExtraHour = async (extraHourData) => {
  try {
    const response = await fetch(
      `https://localhost:7086/api/extra-hour/calculate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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

    return response.json();
  } catch (error) {
    console.error("Error al calcular horas extras:", error);
    throw error;
  }
};
