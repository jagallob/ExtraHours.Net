import { useState, useEffect } from "react";
import { addExtraHour } from "@services/extraHourService";
import "./FormExtraHour.scss";
import { useConfig } from "../../utils/useConfig";
import dayjs from "dayjs";
import { useAuth } from "../../utils/useAuth";
import { calculateExtraHour } from "../../services/extraHourService";
import { EmployeeInfo } from "../EmployeeInfo/EmployeeInfo";
import { CalendarIcon, ClockIcon, InfoIcon } from "lucide-react";
import PropTypes from "prop-types";

const tooltips = {
  diurnal: "Horas extras trabajadas en horario diurno en días regulares",
  nocturnal: "Horas extras trabajadas en horario nocturno en días regulares",
  diurnalHoliday: "Horas extras trabajadas en horario diurno en días festivos",
  nocturnalHoliday:
    "Horas extras trabajadas en horario nocturno en días festivos",
};

// Componente de notificación
const Notification = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification notification-${type}`}>
      <p>{message}</p>
      <button
        onClick={onClose}
        className="close-btn"
        aria-label="Cerrar notificación"
      >
        ×
      </button>
    </div>
  );
};

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

const Tooltip = ({ text, children }) => {
  return (
    <div className="tooltip-container">
      {children}
      <div className="tooltip-content">{text}</div>
    </div>
  );
};

Tooltip.propTypes = {
  text: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export const FormExtraHour = () => {
  const { getEmployeeIdFromToken, getUserRole } = useAuth();
  const [employeeId, setEmployeeId] = useState(null);
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
  const [reset, setReset] = useState(false);
  const { config, isLoading } = useConfig();
  const [notification, setNotification] = useState(null);
  const [calculating, setCalculating] = useState(false);

  const isSuperuser = getUserRole() === "superusuario";

  const handleEmployeeIdChange = (id) => {
    setEmployeeId(parseInt(id, 10));
    setExtraHours((prevState) => ({
      ...prevState,
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

  const calculateExtraHours = async () => {
    if (!extraHours.date || !extraHours.startTime || !extraHours.endTime) {
      return;
    }

    try {
      setLoading(true);
      setCalculating(true);
      const formattedStartTime = dayjs(extraHours.startTime, "HH:mm").format(
        "HH:mm:ss"
      );
      const formattedEndTime = dayjs(extraHours.endTime, "HH:mm").format(
        "HH:mm:ss"
      );

      const calculationResult = await calculateExtraHour({
        date: extraHours.date,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
      });

      setExtraHours((prevData) => ({
        ...prevData,
        diurnal: calculationResult.diurnal,
        nocturnal: calculationResult.nocturnal,
        diurnalHoliday: calculationResult.diurnalHoliday,
        nocturnalHoliday: calculationResult.nocturnalHoliday,
        extrasHours: calculationResult.extraHours,
      }));

      setError(null);
    } catch (err) {
      setError(err.message || "Error al calcular horas extras");
    } finally {
      setLoading(false);
      setCalculating(false);
    }
  };

  useEffect(() => {
    if (extraHours.date && extraHours.startTime && extraHours.endTime) {
      calculateExtraHours();
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

    const currentEmployeeId = isSuperuser
      ? employeeId
      : getEmployeeIdFromToken() || localStorage.getItem("id");

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

      await addExtraHour(formattedData);
      setNotification({
        message: "Horas extras agregadas exitosamente",
        type: "success",
      });

      setExtraHours({
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
      if (isSuperuser) {
        setReset(true);
        setEmployeeId(null);
      }
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
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando configuración de horas extras...</p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h1 className="form-title">Registrar Horas Extra</h1>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <form onSubmit={handleSubmit}>
        {isSuperuser && (
          <div className="superuser-employee-selection">
            <h2>Selección de Empleado</h2>
            <EmployeeInfo
              onIdChange={handleEmployeeIdChange}
              reset={reset}
              setReset={setReset}
            />
          </div>
        )}
        <div className="form-group-date-time">
          <div className="form-field">
            <label htmlFor="date">
              <CalendarIcon size={16} className="field-icon" />
              Fecha <span className="required">*</span>
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={extraHours.date}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>
          <div className="form-field">
            <label htmlFor="startTime">
              <ClockIcon size={16} className="field-icon" />
              Hora de inicio <span className="required">*</span>
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={extraHours.startTime}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>
          <div className="form-field">
            <label htmlFor="endTime">
              <ClockIcon size={16} className="field-icon" />
              Hora de fin <span className="required">*</span>
            </label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={extraHours.endTime}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>
        </div>

        <div className="calculation-status">
          {calculating && (
            <div className="calculating-indicator">
              <div className="loading-spinner-small"></div>
              <span>Calculando horas extra...</span>
            </div>
          )}
        </div>

        <h2 className="section-title">Detalle de Horas</h2>

        <div className="form-group-horizontal">
          <div className="hora-extra-item">
            <label>
              Diurna
              <Tooltip text={tooltips.diurnal}>
                <InfoIcon size={16} className="info-icon" />
              </Tooltip>
            </label>
            <input
              type="number"
              name="diurnal"
              value={extraHours.diurnal}
              step="0.01"
              readOnly
              className="calculated-field"
            />
          </div>
          <div className="hora-extra-item">
            <label>
              Nocturna
              <Tooltip text={tooltips.nocturnal}>
                <InfoIcon size={16} className="info-icon" />
              </Tooltip>
            </label>
            <input
              type="number"
              name="nocturnal"
              value={extraHours.nocturnal}
              step="0.01"
              readOnly
              className="calculated-field"
            />
          </div>
          <div className="hora-extra-item">
            <label>
              Diurna Festiva
              <Tooltip text={tooltips.diurnalHoliday}>
                <InfoIcon size={16} className="info-icon" />
              </Tooltip>
            </label>
            <input
              type="number"
              name="diurnalHoliday"
              value={extraHours.diurnalHoliday}
              step="0.01"
              readOnly
              className="calculated-field"
            />
          </div>
          <div className="hora-extra-item">
            <label>
              Nocturna Festiva
              <Tooltip text={tooltips.nocturnalHoliday}>
                <InfoIcon size={16} className="info-icon" />
              </Tooltip>
            </label>
            <input
              type="number"
              name="nocturnalHoliday"
              value={extraHours.nocturnalHoliday}
              step="0.01"
              readOnly
              className="calculated-field"
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
              className="calculated-field total-field"
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
            placeholder="Ingrese cualquier información relevante"
            rows="4"
          />
        </div>

        <div className="submit-container">
          <button
            type="submit"
            disabled={loading || calculating}
            className={loading ? "loading" : ""}
          >
            {loading ? (
              <span>
                <div className="loading-spinner-button"></div>Enviando...
              </span>
            ) : (
              "Registrar horas extra"
            )}
          </button>
        </div>

        {error && (
          <div className="error-message" role="alert">
            <p>Error: {error}</p>
          </div>
        )}
      </form>
    </div>
  );
};
