import { useState, useEffect } from "react";
import {
  Input,
  Table,
  Button,
  Modal,
  Form,
  InputNumber,
  message,
  Spin,
} from "antd";
import { findExtraHoursByManager } from "../../services/findExtraHoursByManager";
import { updateExtraHour } from "@services/updateExtraHour";
import { deleteExtraHour } from "../../services/deleteExtraHour";
import { approveExtraHour } from "@services/approveExtraHour";
import { columns as staticColumns } from "@utils/tableColumns";
import { useConfig } from "../../utils/useConfig";
import "./UpdateDeleteApprove.scss";
import dayjs from "dayjs";

export const UpdateDeleteApprove = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const { config } = useConfig();
  const weeklyLimit = config?.weekly_extra_hours_limit;

  // Función para calcular el total de horas extras semanales
  const calculateWeeklyExtraHours = (extraHours) => {
    return extraHours.reduce(
      (total, record) =>
        total +
        (Number(record.diurnal || 0) +
          Number(record.nocturnal || 0) +
          Number(record.diurnalHoliday || 0) +
          Number(record.nocturnalHoliday || 0)),
      0
    );
  };

  useEffect(() => {
    loadEmployeeData();
  }, []);

  const loadEmployeeData = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await findExtraHoursByManager();
      setEmployeeData(data);

      const employeeIds = [...new Set(data.map((item) => item.id))];

      employeeIds.forEach((id) => {
        const employeeRecords = data.filter((item) => item.id === id);
        const employeeName = employeeRecords[0]?.name || "Empleado";
        const weeklyTotal = calculateWeeklyExtraHours(employeeRecords);

        if (weeklyTotal > weeklyLimit) {
          message.error(
            `⚠️ El empleado ${employeeName} ha superado el límite semanal con un total de ${weeklyTotal.toFixed(
              2
            )} horas extras.`
          );
        } else if (weeklyTotal >= weeklyLimit * 0.9) {
          message.warning(
            `El empleado ${employeeName} está cerca del límite semanal con un total de ${weeklyTotal.toFixed(
              2
            )} horas extras.`
          );
        }
      });
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setError(
        "Error al cargar los datos de horas extras. Por favor, intente nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (record) => {
    try {
      console.log("Aprobando registro:", record.registry);

      // Llamada a la API para aprobar
      const response = await approveExtraHour(record.registry);
      console.log("Respuesta de la API:", response);

      // Actualizar el estado local
      setEmployeeData((prevData) =>
        prevData.map((item) =>
          item.registry === record.registry ? { ...item, approved: true } : item
        )
      );

      // Calcular total de horas extras semanales del empleado
      const totalExtraHours = employeeData
        .filter((item) => item.id === record.id) // Filtra registros del mismo empleado
        .reduce((sum, item) => sum + item.extrasHours, 0);
      // Suma las horas extras

      // Mostrar mensajes según el total de horas extras
      if (totalExtraHours > weeklyLimit) {
        message.warning(
          `⚠️ El empleado ${
            record.name
          } ha superado el límite semanal con un total de ${totalExtraHours.toFixed(
            2
          )} horas extras.`
        );
      } else if (totalExtraHours >= weeklyLimit - 2) {
        message.info(
          `El empleado ${
            record.name
          } está cerca del límite semanal con un total de ${totalExtraHours.toFixed(
            2
          )} horas extras.`
        );
      } else {
        message.success("Registro aprobado exitosamente");
      }
    } catch (error) {
      console.error("Error al aprobar el registro:", error);
      message.error("Error al aprobar el registro");
    }
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "¿Estás seguro que deseas eliminar este registro?",
      onOk: async () => {
        try {
          await deleteExtraHour(record.registry);

          setEmployeeData((prevData) =>
            prevData.filter((item) => item.registry !== record.registry)
          );

          message.success("Registro eliminado exitosamente");
        } catch (error) {
          message.error("Error al eliminar el registro");
        }
      },
    });
  };

  const handleUpdate = (record) => {
    setSelectedRow(record);
    setEditModalOpen(true);
  };

  const handleSave = async (values) => {
    try {
      if (!selectedRow) {
        throw new Error("No hay un registro seleccionado para actualizar.");
      }

      const registry = selectedRow.registry;

      const updatedValues = {
        ...values,
        diurnal: Number(values.diurnal),
        nocturnal: Number(values.nocturnal),
        diurnalHoliday: Number(values.diurnalHoliday),
        nocturnalHoliday: Number(values.nocturnalHoliday),
        extrasHours:
          Number(values.diurnal) +
          Number(values.nocturnal) +
          Number(values.diurnalHoliday) +
          Number(values.nocturnalHoliday),
        date: dayjs(values.date).format("YYYY-MM-DD"),
        observations: values.observations,
      };

      console.log("Datos a actualizar:", updatedValues);

      const response = await updateExtraHour(registry, updatedValues);
      console.log("Respuesta de la API:", response);

      // Actualiza el estado local
      setEmployeeData((prevData) =>
        prevData.map((item) =>
          item.registry === registry ? { ...item, ...updatedValues } : item
        )
      );

      message.success("Registro actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar:", error);
      message.error("Error al actualizar el registro");
    } finally {
      setEditModalOpen(false);
    }
  };

  const handleFormChange = (changedFields) => {
    const { diurnal, nocturnal, diurnalHoliday, nocturnalHoliday } =
      changedFields;

    const totalExtraHours =
      (diurnal || selectedRow?.diurnal || 0) +
      (nocturnal || selectedRow?.nocturnal || 0) +
      (diurnalHoliday || selectedRow?.diurnalHoliday || 0) +
      (nocturnalHoliday || selectedRow?.nocturnalHoliday || 0);

    setSelectedRow((prev) => ({
      ...prev,
      extrasHours: totalExtraHours,
    }));
  };

  const handleRefresh = () => {
    loadEmployeeData();
  };

  const actionColumn = {
    title: "Acciones",
    key: "actions",
    render: (text, record) => (
      <span>
        <Button
          type="link"
          onClick={() => handleUpdate(record)}
          style={{ marginRight: 8 }}
        >
          Editar
        </Button>
        <Button type="link" onClick={() => handleDelete(record)}>
          Eliminar
        </Button>
        <Button
          type="link"
          onClick={() => handleApprove(record)}
          disabled={record.approved}
          style={{ marginRight: 8 }}
        >
          {record.approved ? "Aprobado" : "Aprobar"}
        </Button>
      </span>
    ),
  };

  const columns = [...staticColumns, actionColumn]; // Combina las columnas

  return (
    <div className="ReportInfo">
      <div className="search-container">
        <Button
          type="primary"
          onClick={handleRefresh}
          style={{ marginBottom: 16 }}
        >
          Actualizar Datos
        </Button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
          <p>Cargando datos de empleados...</p>
        </div>
      ) : (
        <>
          {employeeData.length > 0 ? (
            <div className="extra-hours-info">
              <Table
                columns={columns}
                dataSource={employeeData}
                rowKey="registry"
                pagination={false}
                scroll={{
                  x: 900,
                  y: 500,
                }}
              />
            </div>
          ) : (
            <div className="empty-data">
              <p>
                No hay registros de horas extras para los empleados a su cargo.
              </p>
            </div>
          )}
        </>
      )}

      {isEditModalOpen && (
        <Modal
          open={isEditModalOpen}
          onCancel={() => setEditModalOpen(false)}
          footer={null}
        >
          <div className="modal__container">
            <header>
              <h2>Actualizar Registro</h2>
            </header>
            <Form
              initialValues={selectedRow}
              onFinish={handleSave}
              onValuesChange={handleFormChange}
            >
              <Form.Item name="diurnal" label="Diurnas">
                <InputNumber />
              </Form.Item>
              <Form.Item name="nocturnal" label="Nocturnas">
                <InputNumber />
              </Form.Item>
              <Form.Item name="diurnalHoliday" label="Diurnas Festivas">
                <InputNumber />
              </Form.Item>
              <Form.Item name="nocturnalHoliday" label="Nocturnas Festivas">
                <InputNumber />
              </Form.Item>
              <Form.Item name="extrasHours" label="Total Horas Extras">
                <InputNumber value={selectedRow?.extrasHours} disabled />
              </Form.Item>
              <Form.Item name="date" label="Date">
                <Input />
              </Form.Item>
              <Form.Item name="observations" label="Observaciones">
                <Input />
              </Form.Item>
              <Form.Item>
                <Button className="button" type="primary" htmlType="submit">
                  Guardar
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Modal>
      )}
    </div>
  );
};
