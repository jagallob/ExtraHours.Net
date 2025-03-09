import { useState, useEffect } from "react";
import {
  Input,
  Table,
  DatePicker,
  Button,
  Typography,
  Select,
  Space,
} from "antd";
import {
  DownloadOutlined,
  SearchOutlined,
  EditOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { findEmployee } from "@services/findEmployee";
import { findExtraHour } from "@services/findExtraHour";
import { findExtraHourByDateRange } from "@services/findExtraHourByDateRange";
import { findManagerEmployeesExtraHours } from "@services/findManagerEmployeesExtraHours";
import ExcelJS from "exceljs";
import { columns } from "@utils/tableColumns.jsx";
import "./ReportInfo.scss";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { Option } = Select;

export const ReportInfo = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRange, setSelectedRange] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [role, setRole] = useState(null);
  const [loggedInEmployeeId, setLoggedInEmployeeId] = useState(null);
  const [approvalFilter, setApprovalFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    if (userRole) {
      const cleanedRole = userRole.trim().replace(/[[\]]/g, "");
      console.log("Rol del usuario almacenado:", cleanedRole);

      if (
        cleanedRole === "empleado" ||
        cleanedRole === "superusuario" ||
        cleanedRole === "manager"
      ) {
        setRole(cleanedRole);
      } else {
        console.error("Rol inválido almacenado en localStorage:", cleanedRole);
      }
    } else {
      console.log("No se encontró el rol del usuario en localStorage.");
    }

    const userId = localStorage.getItem("id");
    if (userId) {
      const numericUserId = parseInt(userId, 10);
      if (!isNaN(numericUserId)) {
        setLoggedInEmployeeId(numericUserId);
      } else {
        console.error(
          "ID de usuario inválido almacenado en localStorage:",
          userId
        );
      }
    } else {
      console.log("No se encontró el ID del usuario en localStorage.");
    }
  }, []);

  useEffect(() => {
    // Si el usuario es un empleado, cargar automáticamente sus informes
    if (role === "empleado" && loggedInEmployeeId) {
      handleSearch();
    }
  }, [role, loggedInEmployeeId]);

  useEffect(() => {
    if (employeeData.length > 0) {
      filterDataByApprovalStatus();
    } else {
      setFilteredData([]);
    }
  }, [employeeData, approvalFilter]);

  const filterDataByApprovalStatus = () => {
    switch (approvalFilter) {
      case "approved":
        setFilteredData(employeeData.filter((item) => item.approved === true));
        break;
      case "pending":
        setFilteredData(employeeData.filter((item) => item.approved === false));
        break;
      default: // "all"
        setFilteredData(employeeData);
        break;
    }
  };

  const calculateTotalExtraHours = (extraHour) => {
    return (
      parseFloat(extraHour.diurnal || 0) +
      parseFloat(extraHour.nocturnal || 0) +
      parseFloat(extraHour.diurnalHoliday || 0) +
      parseFloat(extraHour.nocturnalHoliday || 0)
    );
  };

  const handleSearch = async () => {
    if (role === "empleado" && selectedRange.length === 2) {
      setError("No tienes permiso para buscar por rango de fechas.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      let employee = {};
      let extraHours = [];

      if (role === "empleado") {
        // Si el usuario es un empleado, usar su ID almacenado en loggedInEmployeeId
        if (!loggedInEmployeeId) {
          throw new Error("No se encontró el ID del empleado logueado.");
        }
        employee = await findEmployee(loggedInEmployeeId);
        extraHours = await findExtraHour(loggedInEmployeeId, "id");
      } else if (role === "manager" && selectedRange.length === 2) {
        const [startDate, endDate] = selectedRange;
        extraHours = await findManagerEmployeesExtraHours(
          startDate.format("YYYY-MM-DD"),
          endDate.format("YYYY-MM-DD")
        );
      } else if (searchValue) {
        const numericIdOrRegistry = parseInt(searchValue, 10);
        employee = await findEmployee(numericIdOrRegistry);

        extraHours = await findExtraHour(numericIdOrRegistry, "id");
        if (!extraHours.length) {
          extraHours = await findExtraHour(numericIdOrRegistry, "registry");
        }
      } else if (selectedRange.length === 2) {
        // Búsqueda por rango de fechas para superusuario
        const [startDate, endDate] = selectedRange;
        extraHours = await findExtraHourByDateRange(
          startDate.format("YYYY-MM-DD"),
          endDate.format("YYYY-MM-DD")
        );
      } else {
        setError("No tienes permiso para buscar por rango de fechas.");
        setEmployeeData([]);
        setFilteredData([]);
        setLoading(false);
        return;
      }

      if (extraHours.length > 0) {
        if (
          role === "manager" ||
          (role === "superusuario" && selectedRange.length === 2)
        ) {
          const processedData = extraHours.map((extraHour) => ({
            ...extraHour,
            extrasHours: calculateTotalExtraHours(extraHour),
          }));
          setEmployeeData(processedData);
        } else {
          const processedData = extraHours.map((extraHour) => ({
            ...employee,
            ...extraHour,
            extrasHours: calculateTotalExtraHours(extraHour),
          }));
          setEmployeeData(processedData);
        }
      } else {
        setError(
          "No se encontraron datos para los criterios de búsqueda proporcionados."
        );
        setEmployeeData([]);
        setFilteredData([]);
      }
    } catch (error) {
      setError("Error al buscar los datos. Por favor, intente nuevamente.");
      setEmployeeData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const xlsBuffer = await generateXLS(filteredData);
      const blob = new Blob([xlsBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);

      // Nombre del archivo que indica el filtro aplicado
      const dateStr = new Date().toISOString().split("T")[0];
      const approvalText =
        approvalFilter === "approved"
          ? "Aprobados"
          : approvalFilter === "pending"
          ? "Pendientes"
          : "Todos";
      link.download = `Horas_Extras_${approvalText}_${dateStr}.xlsx`;

      link.click();
    } catch (error) {
      console.error("Error generating XLS file:", error);
    }
  };

  const generateXLS = async (data) => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Horas Extras", {
        pageSetup: { paperSize: 9, orientation: "landscape" },
      });

      // Añadir título con información sobre el filtro aplicado
      const approvalText =
        approvalFilter === "approved"
          ? "aprobadas"
          : approvalFilter === "pending"
          ? "pendientes"
          : "todas";

      worksheet.mergeCells("A1:N1");
      const titleCell = worksheet.getCell("A1");
      titleCell.value = `Reporte de Horas Extras (${approvalText})`;
      titleCell.font = { size: 16, bold: true };
      titleCell.alignment = { horizontal: "center" };

      // Añadir información de fecha de generación
      worksheet.mergeCells("A2:N2");
      const dateCell = worksheet.getCell("A2");
      dateCell.value = `Generado: ${new Date().toLocaleString()}`;
      dateCell.font = { size: 12, italic: true };
      dateCell.alignment = { horizontal: "center" };

      // Añadir espacio
      worksheet.mergeCells("A3:N3");

      const excelColumns = [
        { header: "ID", key: "id", width: 15 },
        { header: "Empleado", key: "name", width: 30 },
        { header: "Salario", key: "salary", width: 15 },
        { header: "Cargo", key: "position", width: 30 },
        { header: "Manager", key: "manager_name", width: 30 },
        { header: "Fecha", key: "date", width: 15 },
        { header: "Diurnas", key: "diurnal", width: 10 },
        { header: "Nocturnas", key: "nocturnal", width: 10 },
        { header: "Diurnas Festivas", key: "diurnalHoliday", width: 15 },
        { header: "Nocturnas Festivas", key: "nocturnalHoliday", width: 15 },
        { header: "Total Horas Extras", key: "extrasHours", width: 20 },
        { header: "Observaciones", key: "observations", width: 30 },
        { header: "Registro", key: "registry", width: 15 },
        { header: "Estado", key: "status", width: 10 },
      ];

      worksheet.columns = excelColumns;

      const headerRow = worksheet.addRow(excelColumns.map((col) => col.header));

      // Estilos para la fila de encabezados (ahora en la fila 4)
      headerRow.font = { bold: true };
      headerRow.alignment = { horizontal: "center" };
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      };

      data.forEach((record) => {
        const row = worksheet.addRow({
          id: record.id,
          name: record.name,
          salary: record.salary,
          position: record.position,
          manager_name: record.manager?.name || "Sin asignar",
          date: record.date,
          diurnal: record.diurnal,
          nocturnal: record.nocturnal,
          diurnalHoliday: record.diurnalHoliday,
          nocturnalHoliday: record.nocturnalHoliday,
          extrasHours: record.extrasHours,
          observations: record.observations,
          registry: record.registry,
          status: record.approved ? "Aprobado" : "Pendiente",
        });

        // Colorear filas según estado de aprobación
        if (record.approved) {
          row.eachCell((cell) => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFE6F7E6" }, // Verde claro para aprobados
            };
          });
        }
      });

      // Añadir totales al final
      const totalRow = worksheet.addRow({
        name: "TOTAL",
        diurnal: data.reduce(
          (sum, record) => sum + parseFloat(record.diurnal || 0),
          0
        ),
        nocturnal: data.reduce(
          (sum, record) => sum + parseFloat(record.nocturnal || 0),
          0
        ),
        diurnalHoliday: data.reduce(
          (sum, record) => sum + parseFloat(record.diurnalHoliday || 0),
          0
        ),
        nocturnalHoliday: data.reduce(
          (sum, record) => sum + parseFloat(record.nocturnalHoliday || 0),
          0
        ),
        extrasHours: data.reduce(
          (sum, record) => sum + parseFloat(record.extrasHours || 0),
          0
        ),
      });

      totalRow.font = { bold: true };
      totalRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF0F0F0" },
        };
      });

      return workbook.xlsx.writeBuffer();
    } catch (err) {
      console.log(err);
      throw new Error("Error generating XLS file");
    }
  };

  const handleNavigateToManage = () => {
    navigate("/ManagementExtraHour");
  };

  return (
    <div className="ReportInfo report-component">
      <div className="component-header">
        <Title level={2}>Consulta de Horas Extras</Title>
      </div>

      <div className="actions-bar">
        <div className="filters-container">
          <div className="search-container">
            {role !== "empleado" && (
              <Input.Search
                placeholder="Ingrese ID del empleado"
                onSearch={handleSearch}
                onChange={(e) => setSearchValue(e.target.value)}
                value={searchValue}
                prefix={<SearchOutlined />}
              />
            )}
          </div>

          <div className="range-picker-container">
            {role !== "empleado" && (
              <RangePicker onChange={(dates) => setSelectedRange(dates)} />
            )}
            {role !== "empleado" && (
              <Button
                type="primary"
                onClick={handleSearch}
                className="search-button"
              >
                Buscar
              </Button>
            )}
          </div>
        </div>

        {employeeData.length > 0 && (
          <div className="approval-filter">
            <Space>
              <Text strong>Filtrar por estado:</Text>
              <Select
                value={approvalFilter}
                onChange={setApprovalFilter}
                style={{ width: 150 }}
              >
                <Option value="all">Todos</Option>
                <Option value="approved">Aprobados</Option>
                <Option value="pending">Pendientes</Option>
              </Select>
              <Button
                type="primary"
                icon={<FilterOutlined />}
                onClick={filterDataByApprovalStatus}
              >
                Aplicar
              </Button>
            </Space>
          </div>
        )}

        <div className="action-buttons">
          {filteredData.length > 0 && (
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleExport}
              className="export-button"
            >
              Exportar a Excel
            </Button>
          )}

          {(role === "manager" || role === "superusuario") && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={handleNavigateToManage}
              className="manage-button"
            >
              Gestionar Horas Extras
            </Button>
          )}
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}
      {loading && <p>Cargando datos...</p>}

      {filteredData.length > 0 && (
        <div className="extra-hours-info">
          <Title level={3}>
            Registros de Horas Extras
            {approvalFilter === "approved"
              ? " - Aprobados"
              : approvalFilter === "pending"
              ? " - Pendientes"
              : ""}
            <Text
              type="secondary"
              style={{ fontSize: "14px", marginLeft: "8px" }}
            >
              ({filteredData.length} registros)
            </Text>
          </Title>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="registry"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
            }}
            scroll={{
              x: 1200,
              y: 800,
            }}
            rowClassName={(record) =>
              record.approved ? "table-row-approved" : "table-row-pending"
            }
            summary={(pageData) => {
              // Calcular totales de la página actual
              const totalDiurnal = pageData.reduce(
                (sum, { diurnal }) => sum + parseFloat(diurnal || 0),
                0
              );
              const totalNocturnal = pageData.reduce(
                (sum, { nocturnal }) => sum + parseFloat(nocturnal || 0),
                0
              );
              const totalDiurnalHoliday = pageData.reduce(
                (sum, { diurnalHoliday }) =>
                  sum + parseFloat(diurnalHoliday || 0),
                0
              );
              const totalNocturnalHoliday = pageData.reduce(
                (sum, { nocturnalHoliday }) =>
                  sum + parseFloat(nocturnalHoliday || 0),
                0
              );
              const totalExtraHours = pageData.reduce(
                (sum, { extrasHours }) => sum + parseFloat(extrasHours || 0),
                0
              );

              return (
                <>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={4}>
                      <strong>Total Página Actual:</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={6}>
                      <strong>{totalDiurnal.toFixed(1)}</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={7}>
                      <strong>{totalNocturnal.toFixed(1)}</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={8}>
                      <strong>{totalDiurnalHoliday.toFixed(1)}</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={9}>
                      <strong>{totalNocturnalHoliday.toFixed(1)}</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={10}>
                      <strong>{totalExtraHours.toFixed(1)}</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell
                      index={11}
                      colSpan={3}
                    ></Table.Summary.Cell>
                  </Table.Summary.Row>
                </>
              );
            }}
          />
        </div>
      )}

      {filteredData.length === 0 && employeeData.length > 0 && (
        <div className="no-results">
          <Text>
            No hay registros que coincidan con el filtro seleccionado.
          </Text>
        </div>
      )}
    </div>
  );
};
