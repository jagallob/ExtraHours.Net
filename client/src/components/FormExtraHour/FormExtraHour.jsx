import { useState, useEffect } from "react";
import { addExtraHour } from "@services/addExtraHour";
import { EmployeeInfo } from "../EmployeeInfo/EmployeeInfo";
import "./FormExtraHour.scss";
import { determineExtraHourType } from "@utils/determineExtraHourType";
import { useConfig } from "../../utils/ConfigProvider";

export const FormExtraHour = () => {
  const [extraHours, setExtraHours] = useState({
    registry: "",
    id: "",
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
  const [resetEmployeeInfo, setResetEmployeeInfo] = useState(false);
  const { config, isLoading } = useConfig();

  const handleIdChange = (id) => {
    setExtraHours((prevData) => ({
      ...prevData,
      id: parseInt(id, 10),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExtraHours((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // useEffect para calcular horas extra automáticamente cuando se cambian los tiempos o la configuración
  useEffect(() => {
    if (!isLoading && config) {
      console.log("Configuración obtenida:", config);
      if (extraHours.date && extraHours.startTime && extraHours.endTime) {
        determineExtraHourType(
          extraHours.date,
          extraHours.startTime,
          extraHours.endTime,
          setError,
          setExtraHours,
          config
        );
      }
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

    try {
      await addExtraHour(extraHours);
      alert("Horas extras agregadas exitosamente");

      setExtraHours({
        registry: "",
        id: "",
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

      setResetEmployeeInfo(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading extra hours configuration...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <EmployeeInfo
        onIdChange={handleIdChange}
        reset={resetEmployeeInfo}
        setReset={setResetEmployeeInfo}
      />
      <div className="form-group-date-time">
        <div>
          <label htmlFor="date">Fecha</label>
          <input
            type="date"
            id="date"
            name="date"
            value={extraHours.date}
            onChange={handleChange}
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
          />
        </div>
        <div>
          <label htmlFor="endTime">
            {" "}
            <br />
            Hora de fin
          </label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={extraHours.endTime}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="form-group-horizontal">
        <label>Diurna</label>
        <input
          type="number"
          name="diurnal"
          value={extraHours.diurnal}
          step="0.01"
          readOnly
        />
        <label>Nocturna</label>
        <input
          type="number"
          name="nocturnal"
          value={extraHours.nocturnal}
          step="0.01"
          readOnly
        />
        <label>Diurna Festiva</label>
        <input
          type="number"
          name="diurnalHoliday"
          value={extraHours.diurnalHoliday}
          step="0.01"
          readOnly
        />
        <label>Nocturna Festiva</label>
        <input
          type="number"
          name="nocturnalHoliday"
          value={extraHours.nocturnalHoliday}
          step="0.01"
          readOnly
        />
        <label>Total horas extra</label>
        <input
          type="number"
          name="extrasHours"
          value={extraHours.extrasHours}
          step="0.01"
          readOnly
        />
      </div>
      <div>
        <label htmlFor="observations">
          {" "}
          <br />
          Observaciones
        </label>
        <textarea
          id="observations"
          name="observations"
          value={extraHours.observations}
          onChange={handleChange}
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Agregar"}
      </button>
      {error && <p>Error: {error}</p>}
    </form>
  );
};
