import { useState } from "react";
import { InputNumber, TimePicker, Form, Button, message } from "antd";
import { useConfig } from "../../utils/ConfigProvider";
import { updateConfig } from "../../services/updateConfig";
import dayjs from "dayjs";
import "dayjs/locale/es";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "./ExtraHoursSettings.scss";

dayjs.extend(customParseFormat);

const ExtraHoursSettings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { config, setConfig } = useConfig();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const updatedValues = {
        ...values,
        diurnal_start: values.diurnal_start.format("HH:mm"),
        diurnal_end: values.diurnal_end.format("HH:mm"),
      };

      const updatedConfig = await updateConfig(updatedValues); // Llama a la función updateConfig y Pasa el token como argumento
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
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          ...config,
          diurnal_start: dayjs(config.diurnal_start, "HH:mm"),
          diurnal_end: dayjs(config.diurnal_end, "HH:mm"),
          weekly_extra_hours_limit: config.weekly_extra_hours_limit,
        }}
      >
        <Form.Item
          label="Límite de horas extra semanales"
          name="weekly_extra_hours_limit"
          rules={[
            { required: true, message: "Por favor, ingresa un límite válido." },
          ]}
        >
          <InputNumber min={1} step={1} />
        </Form.Item>

        <Form.Item
          label="Multiplicador Hora Diurna"
          name="diurnal_multiplier"
          initialValue={config.diurnal_multiplier}
        >
          <InputNumber min={1} step={0.1} />
        </Form.Item>

        <Form.Item
          label="Multiplicador Hora Nocturna"
          name="nocturnal_multiplier"
          initialValue={config.nocturnal_multiplier}
        >
          <InputNumber min={1} step={0.1} />
        </Form.Item>

        <Form.Item
          label="Multiplicador Hora Festiva Diurna"
          name="diurnal_holiday_multiplier"
          initialValue={config.diurnal_holiday_multiplier}
        >
          <InputNumber min={1} step={0.1} />
        </Form.Item>

        <Form.Item
          label="Multiplicador Hora Festiva Nocturna"
          name="nocturnal_holiday_multiplier"
          initialValue={config.nocturnal_holiday_multiplier}
        >
          <InputNumber min={1} step={0.1} />
        </Form.Item>

        <Form.Item
          label="Inicio Hora Diurna (24h)"
          name="diurnal_start"
          initialValue={dayjs(config.diurnal_start, "HH:mm")}
        >
          <TimePicker format="HH:mm" />
        </Form.Item>

        <Form.Item
          label="Fin Hora Diurna (24h)"
          name="diurnal_end"
          initialValue={dayjs(config.diurnal_end, "HH:mm")}
        >
          <TimePicker format="HH:mm" />
        </Form.Item>

        <Form.Item>
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
