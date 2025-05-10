import { API_CONFIG } from "../environments/api.config";

export const UserService = {
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("id", data.id);
      localStorage.setItem("role", data.role);

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/auth/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Respuesta completa:", errorText);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.text();
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  },

  changePasswordAdmin: async (id, newPassword) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/auth/change-password-admin`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ id, newPassword }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Respuesta completa:", errorText);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.text();
    } catch (error) {
      console.error("Change password admin error:", error);
      throw error;
    }
  },
};

export const logout = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("role");

    return response.ok;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};
