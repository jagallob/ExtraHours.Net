import { useEffect, useState } from "react";
import { Typography } from "antd";
import PropTypes from "prop-types";

const { Title, Text } = Typography;

const PowerBIDashboard = ({ userId }) => {
  const [powerBIUrl, setPowerBIUrl] = useState("");

  useEffect(() => {
    if (userId) {
      generatePowerBIUrl(userId);
    }
  }, [userId]);

  const generatePowerBIUrl = (userId) => {
    try {
      const powerBIBaseUrl =
        "https://app.powerbi.com/groups/me/reports/f9bc5f1d-ff44-4bd0-87ee-91529632de89/3dbd1e6bc96b0ea5a346?experience=power-bi";

      const filter = encodeURIComponent(`extra-hour/id eq '${userId}'`);

      const url = `${powerBIBaseUrl}&filter=${filter}`;

      console.log("URL de Power BI generada:", url);
      setPowerBIUrl(url);
    } catch (error) {
      console.error("Error al generar URL de Power BI:", error);
    }
  };

  return (
    <div className="powerbi-container">
      <Title level={3}>Dashboard de Horas Extras</Title>
      {powerBIUrl ? (
        <iframe
          src={powerBIUrl}
          width="100%"
          height="600px"
          frameBorder="0"
          allowFullScreen
          title="Reporte Power BI de Horas Extras"
          // Atributos para mejorar la compatibilidad con Power BI
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          // Identificador para facilitar la depuración
          id="powerbi-iframe"
          // Importante: agregar esto para CSP más restrictivas
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      ) : (
        <div className="powerbi-placeholder">
          <Text>
            Seleccione un empleado o realice una búsqueda para cargar el
            dashboard.
          </Text>
        </div>
      )}
    </div>
  );
};

PowerBIDashboard.propTypes = {
  userId: PropTypes.string,
};

export default PowerBIDashboard;
