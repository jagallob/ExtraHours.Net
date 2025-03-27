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
  Typography,
  Space,
  Badge,
  DatePicker,
  Row,
  Col,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  FileSearchOutlined,
  FilterOutlined,
  CloseOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { findExtraHoursByManager } from "../../services/findExtraHoursByManager";
import { findAllExtraHours } from "@services/findAllExtraHours";
import { updateExtraHour } from "@services/updateExtraHour";
import { deleteExtraHour } from "../../services/deleteExtraHour";
import { approveExtraHour } from "@services/approveExtraHour";
import { columns as staticColumns } from "@utils/tableColumns";
import { useConfig } from "../../utils/useConfig";
import { useAuth } from "../../utils/useAuth";
import "./UpdateDeleteApprove.scss";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { confirm } = Modal;
const { RangePicker } = DatePicker;

export const UpdateDeleteApprove = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const { config } = useConfig();
  const { userRole } = useAuth();
  const weeklyLimit = config?.weekly_extra_hours_limit;
  const navigate = useNavigate();
  const isSuperuser = userRole === "superusuario";

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
      let startDateStr = null;
      let endDateStr = null;

      if (dateRange && dateRange[0] && dateRange[1]) {
        startDateStr = dateRange[0].format("YYYY-MM-DD");
        endDateStr = dateRange[1].format("YYYY-MM-DD");
      }
      let data;
      if (isSuperuser) {
        data = await findAllExtraHours(startDateStr, endDateStr);
      } else {
        data = await findExtraHoursByManager(startDateStr, endDateStr);
      }
      setEmployeeData(data);

      if (data.length > 0) {
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
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setError(
        "Error al cargar los datos de horas extras. Por favor, intente nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
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
    confirm({
      title: "¿Estás seguro que deseas eliminar este registro?",
      icon: <ExclamationCircleOutlined />,
      content: `Se eliminará el registro con ID: ${record.registry}`,
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

  const handleFilter = () => {
    loadEmployeeData();
  };

  const handleRefresh = () => {
    loadEmployeeData();
  };

  const actionColumn = {
    title: "Acciones",
    key: "actions",
    // fixed: "right",
    width: 150,
    render: (text, record) => (
      <Space size="small">
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => handleUpdate(record)}
          className="edit-button"
        />
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record)}
          className="delete-button"
        />
        <Button
          type="primary"
          icon={<CheckCircleOutlined />}
          onClick={() => handleApprove(record)}
          disabled={record.approved}
          className={record.approved ? "approved-button" : "approve-button"}
        />
      </Space>
    ),
  };

  const columns = [...staticColumns, actionColumn];

  return (
    <div className="UpdateDeleteApprove manager-component">
      <div className="component-header">
        <Title level={2}>
          {" "}
          {isSuperuser
            ? "Gestión de Horas Extras - Todos los Empleados"
            : "Gestión de Horas Extras"}
        </Title>
        <Text type="secondary">
          Panel de administración para aprobar, modificar o eliminar registros
          {isSuperuser
            ? " de todos los empleados"
            : " de los empleados a su cargo"}
        </Text>
      </div>

      <div className="filter-section">
        <Row gutter={16} align="middle">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Text strong>Filtrar por rango de fechas:</Text>
            <RangePicker
              style={{ width: "100%", marginTop: "8px" }}
              value={dateRange}
              onChange={handleDateRangeChange}
            />
          </Col>
          <Col xs={24} sm={12} md={4} lg={3} style={{ marginTop: "8px" }}>
            <Button
              type="primary"
              icon={<FilterOutlined />}
              onClick={handleFilter}
              style={{ width: "100%" }}
            >
              Filtrar
            </Button>
          </Col>
        </Row>
      </div>

      <div className="actions-bar">
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={handleRefresh}
          className="refresh-button"
        >
          Actualizar Datos
        </Button>

        <Badge
          count={employeeData.filter((record) => !record.approved).length}
          offset={[0, 0]}
        >
          <Text>Pendientes de Aprobación</Text>
        </Badge>

        <Button
          type="default"
          icon={<FileSearchOutlined />}
          onClick={() => navigate("/reports")}
          className="reports-button"
        >
          Ver Reportes
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
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "50", "100"],
                }}
                scroll={{
                  x: 1500,
                  y: 500,
                }}
                rowClassName={(record) =>
                  record.approved
                    ? "table-row-approved"
                    : record.extrasHours > weeklyLimit / 7
                    ? "table-row-warning"
                    : "table-row-normal"
                }
              />
            </div>
          ) : (
            <div className="empty-data">
              <Text>
                {isSuperuser
                  ? "No hay registros de horas extras en el sistema."
                  : "No hay registros de horas extras para los empleados a su cargo."}
              </Text>
            </div>
          )}
        </>
      )}

      {isEditModalOpen && (
        <Modal
          title={
            <div className="modal-title-container">
              <EditOutlined className="modal-title-icon" />
              <span>Actualizar Registro de Horas Extras</span>
              <Badge
                status="processing"
                text={`Empleado: ${selectedRow?.name}`}
              />
            </div>
          }
          open={isEditModalOpen}
          onCancel={() => setEditModalOpen(false)}
          footer={null}
          className="edit-modal"
          width={600}
          centered
          destroyOnClose
        >
          <div className="modal-container">
            <Form
              initialValues={{
                ...selectedRow,
                date: selectedRow?.date ? dayjs(selectedRow.date) : null,
              }}
              onFinish={handleSave}
              onValuesChange={handleFormChange}
              layout="vertical"
            >
              <div className="form-row">
                <Form.Item
                  name="diurnal"
                  label="Horas Diurnas"
                  rules={[{ required: true, message: "Campo requerido" }]}
                  className="form-item-half"
                >
                  <InputNumber
                    min={0}
                    precision={1}
                    addonAfter="hrs"
                    placeholder="0.0"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item
                  name="nocturnal"
                  label="Horas Nocturnas"
                  rules={[{ required: true, message: "Campo requerido" }]}
                  className="form-item-half"
                >
                  <InputNumber
                    min={0}
                    precision={1}
                    addonAfter="hrs"
                    placeholder="0.0"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </div>

              <div className="form-row">
                <Form.Item
                  name="diurnalHoliday"
                  label="Horas Diurnas Festivas"
                  rules={[{ required: true, message: "Campo requerido" }]}
                  className="form-item-half"
                >
                  <InputNumber
                    min={0}
                    precision={1}
                    addonAfter="hrs"
                    placeholder="0.0"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item
                  name="nocturnalHoliday"
                  label="Horas Nocturnas Festivas"
                  rules={[{ required: true, message: "Campo requerido" }]}
                  className="form-item-half"
                >
                  <InputNumber
                    min={0}
                    precision={1}
                    addonAfter="hrs"
                    placeholder="0.0"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </div>

              <div className="hours-summary">
                <Form.Item
                  name="extrasHours"
                  label="Total Horas Extras"
                  className="total-hours"
                >
                  <InputNumber
                    value={selectedRow?.extrasHours}
                    disabled
                    style={{
                      width: "100%",
                      backgroundColor: "#f0f7ff",
                    }}
                    addonAfter="hrs"
                    formatter={(value) => {
                      // Comprobación para evitar el error
                      if (
                        value !== null &&
                        value !== undefined &&
                        typeof value === "number"
                      ) {
                        return value.toFixed(1);
                      }
                      return "0.0";
                    }}
                    parser={(value) => value.replace(/[^\d.]/g, "")}
                  />
                </Form.Item>
              </div>

              <Form.Item
                name="date"
                label="Fecha"
                rules={[{ required: true, message: "Campo requerido" }]}
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  style={{ width: "100%" }}
                  placeholder="Seleccionar fecha"
                />
              </Form.Item>

              <Form.Item name="observations" label="Observaciones">
                <Input.TextArea
                  rows={3}
                  placeholder="Agregar observaciones sobre este registro"
                  showCount
                  maxLength={500}
                />
              </Form.Item>

              <div className="form-actions">
                <Button
                  onClick={() => setEditModalOpen(false)}
                  icon={<CloseOutlined />}
                  className="cancel-button"
                >
                  Cancelar
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  className="save-button"
                >
                  Guardar Cambios
                </Button>
              </div>
            </Form>
          </div>
        </Modal>
      )}
    </div>
  );
};
