import { API_CONFIG } from "../environments/api.config";
import { getAuthHeaders } from "../environments/http-headers";

export const updateConfig = async (configData) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/config`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(configData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || "Error actualizando la configuración"
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error en updateConfig:", error);
    throw error;
  }
};
