import { useState, useEffect } from "react";
import { InputNumber, TimePicker, Form, Button, message } from "antd";
import { useConfig } from "../../utils/useConfig";
import { updateConfig } from "../../services/updateConfig";
import { useAuth } from "../../utils/useAuth";
import dayjs from "dayjs";
import "dayjs/locale/es";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "./ExtraHoursSettings.scss";

dayjs.extend(customParseFormat);

const ExtraHoursSettings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { config, setConfig } = useConfig();
  const { auth } = useAuth();

  useEffect(() => {
    if (config) {
      form.setFieldsValue({
        weeklyExtraHoursLimit: config.weeklyExtraHoursLimit,
        diurnalMultiplier: config.diurnalMultiplier,
        nocturnalMultiplier: config.nocturnalMultiplier,
        diurnalHolidayMultiplier: config.diurnalHolidayMultiplier,
        nocturnalHolidayMultiplier: config.nocturnalHolidayMultiplier,
        diurnalStart: dayjs(config.diurnalStart, "HH:mm"),
        diurnalEnd: dayjs(config.diurnalEnd, "HH:mm"),
      });
    }
  }, [config, form]);

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const updatedValues = {
        weeklyExtraHoursLimit: values.weeklyExtraHoursLimit,
        diurnalMultiplier: values.diurnalMultiplier,
        nocturnalMultiplier: values.nocturnalMultiplier,
        diurnalHolidayMultiplier: values.diurnalHolidayMultiplier,
        nocturnalHolidayMultiplier: values.nocturnalHolidayMultiplier,
        diurnalStart: values.diurnalStart.format("HH:mm"),
        diurnalEnd: values.diurnalEnd.format("HH:mm"),
      };

      if (!auth?.token) {
        message.error("No tienes autorización para realizar esta acción.");
        setLoading(false);
        return;
      }

      console.log("Token enviado:", auth.token);

      const updatedConfig = await updateConfig(updatedValues, auth.token);
      setConfig(updatedConfig);
      message.success("Configuración actualizada correctamente");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        message.error(error.response.data); // Mostrar mensaje del backend si excede el límite
      } else {
        message.error("Error al actualizar la configuración");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!config) {
    return <div>Loading configuration...</div>;
  }

  return (
    <div className="config-extra-hours">
      <h3>Configuración de Horas Extra</h3>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Límite semanal */}
        <div className="input-group limits-group">
          <h4>Límites de Horas Extra</h4>
          <div className="input-container">
            <Form.Item
              label="Límite de horas extra semanales"
              name="weeklyExtraHoursLimit"
              rules={[
                {
                  required: true,
                  message: "Por favor, ingresa un límite válido.",
                },
              ]}
            >
              <InputNumber min={1} step={1} />
            </Form.Item>
          </div>
        </div>

        {/* Multiplicadores regulares */}
        <div className="input-group regular-multipliers-group">
          <h4>Multiplicadores Regulares</h4>
          <div className="input-container">
            <Form.Item
              label="Multiplicador Hora Diurna"
              name="diurnalMultiplier"
              rules={[{ required: true, message: "Este campo es requerido" }]}
            >
              <InputNumber min={1} step={0.1} />
            </Form.Item>

            <Form.Item
              label="Multiplicador Hora Nocturna"
              name="nocturnalMultiplier"
              rules={[{ required: true, message: "Este campo es requerido" }]}
            >
              <InputNumber min={1} step={0.1} />
            </Form.Item>
          </div>
        </div>

        {/* Multiplicadores festivos */}
        <div className="input-group holiday-multipliers-group">
          <h4>Multiplicadores en Días Festivos</h4>
          <div className="input-container">
            <Form.Item
              label="Multiplicador Hora Festiva Diurna"
              name="diurnalHolidayMultiplier"
              rules={[{ required: true, message: "Este campo es requerido" }]}
            >
              <InputNumber min={1} step={0.1} />
            </Form.Item>

            <Form.Item
              label="Multiplicador Hora Festiva Nocturna"
              name="nocturnalHolidayMultiplier"
              rules={[{ required: true, message: "Este campo es requerido" }]}
            >
              <InputNumber min={1} step={0.1} />
            </Form.Item>
          </div>
        </div>

        {/* Horarios */}
        <div className="input-group schedule-group">
          <h4>Definición de Jornada Laboral</h4>
          <div className="input-container">
            <Form.Item
              label="Inicio Hora Diurna (24h)"
              name="diurnalStart"
              rules={[{ required: true, message: "Este campo es requerido" }]}
            >
              <TimePicker format="HH:mm" />
            </Form.Item>

            <Form.Item
              label="Fin Hora Diurna (24h)"
              name="diurnalEnd"
              rules={[{ required: true, message: "Este campo es requerido" }]}
            >
              <TimePicker format="HH:mm" />
            </Form.Item>
          </div>
        </div>

        <Form.Item className="submit-button">
          <Button
            type="primary"
            htmlType="submit"
            className="button"
            loading={loading}
          >
            Guardar cambios
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ExtraHoursSettings;
