import { useState, useEffect } from "react";
import { Input, Table, DatePicker } from "antd";
import { findEmployee } from "@services/findEmployee";
import { findExtraHour } from "@services/findExtraHour";
import { findExtraHourByDateRange } from "@services/findExtraHourByDateRange";
import ExcelJS from "exceljs";
import { columns } from "@utils/tableColumns.jsx";
import "./ReportInfo.scss";

const { RangePicker } = DatePicker;

export const ReportInfo = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRange, setSelectedRange] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [role, setRole] = useState(null);

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    if (userRole) {
      const roleWithoutBrackets = userRole.replace(/[[\]]/g, "");
      console.log("Rol del usuario almacenado:", roleWithoutBrackets);
      setRole(roleWithoutBrackets.trim()); // Asegúrate de eliminar espacios adicionales
    } else {
      console.log("No se encontró el rol del usuario en localStorage.");
    }
  }, []);

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

      if (searchValue) {
        const numericIdOrRegistry = parseInt(searchValue, 10);
        employee = await findEmployee(numericIdOrRegistry);

        extraHours = await findExtraHour(numericIdOrRegistry, "id");
        if (!extraHours.length) {
          extraHours = await findExtraHour(numericIdOrRegistry, "registry");
        }
      } else if (selectedRange.length === 2 && role !== "empleado") {
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
        setEmployeeData(
          extraHours.map((extraHour) => ({ ...employee, ...extraHour }))
        );
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
          manager_name: task.manager.manager_name,
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

  return (
    <div className="ReportInfo">
      <div className="filters-container">
        <div className="search-container">
          <Input.Search
            placeholder="Ingrese ID del empelado"
            onSearch={handleSearch}
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
          />
        </div>
        <div className="range-picker-container">
          {role !== "empleado" && (
            <RangePicker onChange={(dates) => setSelectedRange(dates)} />
          )}
          {role !== "empleado" && (
            <button onClick={handleSearch} style={{ marginLeft: 10 }}>
              Buscar
            </button>
          )}
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      {loading && <p>Cargando datos...</p>}

      {employeeData.length > 0 && (
        <div className="extra-hours-info">
          <h3>Registros de Horas Extras</h3>
          <Table
            columns={columns}
            dataSource={employeeData}
            rowKey="registry"
            pagination={false}
            scroll={{
              x: 1200,
              y: 800,
            }}
          />
        </div>
      )}
      <button onClick={handleExport}>Exportar a Excel</button>
    </div>
  );
};
