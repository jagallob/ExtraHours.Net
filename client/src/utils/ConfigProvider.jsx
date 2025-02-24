import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import ConfigContext from "./ConfigContext";

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found in localStorage.");
        }

        const response = await axios.get("https://localhost:7086/api/config", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = response.data;
        const transformedData = {
          weeklyExtraHoursLimit: data.weeklyExtraHoursLimit,
          diurnalMultiplier: data.diurnalMultiplier,
          nocturnalMultiplier: data.nocturnalMultiplier,
          diurnalHolidayMultiplier: data.diurnalHolidayMultiplier,
          nocturnalHolidayMultiplier: data.nocturnalHolidayMultiplier,
          diurnalStart: data.diurnalStart,
          diurnalEnd: data.diurnalEnd,
        };

        console.log("Datos transformados:", transformedData);
        setConfig(transformedData);
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
