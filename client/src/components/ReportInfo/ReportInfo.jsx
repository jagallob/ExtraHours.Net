import { useState, useEffect } from "react";
import { Input, Table, DatePicker, Button, Typography } from "antd";
import {
  DownloadOutlined,
  SearchOutlined,
  EditOutlined,
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
const { Title } = Typography;

export const ReportInfo = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRange, setSelectedRange] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [role, setRole] = useState(null);
  const [loggedInEmployeeId, setLoggedInEmployeeId] = useState(null);
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
        setLoading(false);
        return;
      }

      if (extraHours.length > 0) {
        if (
          role === "manager" ||
          (role === "superusuario" && selectedRange.length === 2)
        ) {
          setEmployeeData(
            extraHours.map((extraHour) => ({
              ...extraHour,
              extrasHours: calculateTotalExtraHours(extraHour),
            }))
          );
        } else {
          setEmployeeData(
            extraHours.map((extraHour) => ({
              ...employee,
              ...extraHour,
              extrasHours: calculateTotalExtraHours(extraHour),
            }))
          );
        }
      } else {
        setError(
          "No se encontraron datos para los criterios de búsqueda proporcionados."
        );
        setEmployeeData([]);
      }
    } catch (error) {
      setError("Error al buscar los datos. Por favor, intente nuevamente.");
      setEmployeeData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const xlsBuffer = await generateXLS(employeeData);
      const blob = new Blob([xlsBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "data.xls";
      link.click();
    } catch (error) {
      console.error("Error generating XLS file:", error);
    }
  };

  const generateXLS = async (data) => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Tasks Data", {
        pageSetup: { paperSize: 9, orientation: "landscape" },
      });

      worksheet.columns = [
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
        { header: "Aprobado", key: "approved", width: 10 },
      ];

      data.forEach((task) => {
        worksheet.addRow({
          ...task,
          approved: task.approved ? "Sí" : "No",
        });
      });

      worksheet.getRow(1).font = { bold: true };

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

        <div className="action-buttons">
          {employeeData.length > 0 && (
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

      {employeeData.length > 0 && (
        <div className="extra-hours-info">
          <Title level={3}>Registros de Horas Extras</Title>
          <Table
            columns={columns}
            dataSource={employeeData}
            rowKey="registry"
            pagination={false}
            scroll={{
              x: 1200,
              y: 800,
            }}
            rowClassName={(record, index) =>
              index % 2 === 0 ? "table-row-light" : "table-row-dark"
            }
          />
        </div>
      )}
    </div>
  );
};
