import axios from "axios";

export const UserService = {
  login: async (email, password) => {
    try {
      const response = await fetch("https://localhost:7086/auth/login", {
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
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token no encontrado, inicie sesión nuevamente");
      }

      console.log("Token presente:", !!token);

      const response = await fetch(
        `https://localhost:7086/auth/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token no encontrado, inicie sesión nuevamente");
      }

      const response = await fetch(
        `https://localhost:7086/auth/change-password-admin`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
    const token = localStorage.getItem("token");
    const response = await axios.post(
      "https://localhost:7086/api/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    localStorage.removeItem("token"); // Eliminar token del almacenamiento local
    return response.data;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};
