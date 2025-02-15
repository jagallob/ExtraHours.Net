import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

/**
 * ConfigContext proporciona el estado de configuración para el cálculo de horas extra
 * en la aplicación. Incluye multiplicadores y horarios de trabajo.
 */

const ConfigContext = createContext();

/**
 * ConfigProvider es un componente que envuelve a su hijo y proporciona acceso
 * al contexto de configuración a través de su valor.
 */

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("https://localhost:7086/api/config", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setConfig(data);
        } else {
          console.error("Error fetching configuration:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching configuration:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, []);

  if (isLoading) {
    return <div>Loading configuration...</div>;
  }

  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

ConfigProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useConfig = () => useContext(ConfigContext);
