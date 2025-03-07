import { useState, useEffect } from "react";
import { addExtraHour } from "@services/addExtraHour";
import "./FormExtraHour.scss";
import { determineExtraHourType } from "../../utils/determineExtraHourType";
import { useConfig } from "../../utils/useConfig";
import dayjs from "dayjs";
import { useAuth } from "../../utils/useAuth";

export const FormExtraHour = () => {
  const { getEmployeeIdFromToken } = useAuth();
  const [extraHours, setExtraHours] = useState({
    id: null,
    date: "",
    startTime: "",
    endTime: "",
    diurnal: 0,
    nocturnal: 0,
    diurnalHoliday: 0,
    nocturnalHoliday: 0,
    extrasHours: 0,
    observations: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { config, isLoading } = useConfig();

  // Establecer el ID del empleado automáticamente
  useEffect(() => {
    const employeeId = getEmployeeIdFromToken() || localStorage.getItem("id");
    if (employeeId && !extraHours.id) {
      setExtraHours((prevData) => ({
        ...prevData,
        id: parseInt(employeeId, 10),
      }));
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExtraHours((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // useEffect para calcular horas extra automáticamente cuando se cambian los tiempos o la configuración
  useEffect(() => {
    if (
      !isLoading &&
      config &&
      extraHours.date &&
      extraHours.startTime &&
      extraHours.endTime
    ) {
      console.log("Configuración obtenida:", config);

      determineExtraHourType(
        extraHours.date,
        extraHours.startTime,
        extraHours.endTime,
        setError,
        setExtraHours,
        config
      );
    }
  }, [
    extraHours.date,
    extraHours.startTime,
    extraHours.endTime,
    config,
    isLoading,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let formData = { ...extraHours };

    const currentEmployeeId =
      getEmployeeIdFromToken() || localStorage.getItem("id");
    if (!currentEmployeeId) {
      setError(
        "No se pudo obtener el ID del empleado. Por favor, inicia sesión de nuevo."
      );
      setLoading(false);
      return;
    }

    formData.id = parseInt(currentEmployeeId, 10);

    try {
      const formattedStartTime = dayjs(extraHours.startTime, "HH:mm").format(
        "HH:mm:ss"
      );
      const formattedEndTime = dayjs(extraHours.endTime, "HH:mm").format(
        "HH:mm:ss"
      );

      const formattedData = {
        id: formData.id,
        date: formData.date,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        diurnal: parseFloat(formData.diurnal),
        nocturnal: parseFloat(formData.nocturnal),
        diurnalHoliday: parseFloat(formData.diurnalHoliday),
        nocturnalHoliday: parseFloat(formData.nocturnalHoliday),
        extraHours: parseFloat(formData.extrasHours),
        observations: formData.observations,
        approved: false, // Valor predeterminado
      };

      console.log("Datos enviados:", formattedData);

      await addExtraHour(formattedData);
      alert("Horas extras agregadas exitosamente");

      const currentId = formData.id;
      setExtraHours({
        id: currentId,
        date: "",
        startTime: "",
        endTime: "",
        diurnal: 0,
        nocturnal: 0,
        diurnalHoliday: 0,
        nocturnalHoliday: 0,
        extrasHours: 0,
        observations: "",
      });
    } catch (error) {
      setError(
        error.response?.data?.title ||
          error.message ||
          "Error al agregar horas extra."
      );
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading extra hours configuration...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group-date-time">
        <div>
          <label htmlFor="date">Fecha</label>
          <input
            type="date"
            id="date"
            name="date"
            value={extraHours.date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="startTime">Hora de inicio</label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={extraHours.startTime}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="endTime">Hora de fin</label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={extraHours.endTime}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="form-group-horizontal">
        <div className="hora-extra-item">
          <label>Diurna</label>
          <input
            type="number"
            name="diurnal"
            value={extraHours.diurnal}
            step="0.01"
            readOnly
          />
        </div>
        <div className="hora-extra-item">
          <label>Nocturna</label>
          <input
            type="number"
            name="nocturnal"
            value={extraHours.nocturnal}
            step="0.01"
            readOnly
          />
        </div>
        <div className="hora-extra-item">
          <label>Diurna Festiva</label>
          <input
            type="number"
            name="diurnalHoliday"
            value={extraHours.diurnalHoliday}
            step="0.01"
            readOnly
          />
        </div>
        <div className="hora-extra-item">
          <label>Nocturna Festiva</label>
          <input
            type="number"
            name="nocturnalHoliday"
            value={extraHours.nocturnalHoliday}
            step="0.01"
            readOnly
          />
        </div>
        <div className="hora-extra-item total-horas-extra">
          <label>Total horas extra</label>
          <input
            type="number"
            name="extrasHours"
            value={extraHours.extrasHours}
            step="0.01"
            readOnly
          />
        </div>
      </div>

      <div className="observaciones-container">
        <label htmlFor="observations">Observaciones</label>
        <textarea
          id="observations"
          name="observations"
          value={extraHours.observations}
          onChange={handleChange}
        />
      </div>
      <div className="submit-container">
        <button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Agregar"}
        </button>
      </div>
      {error && <p className="error-message">Error: {error}</p>}
    </form>
  );
};
