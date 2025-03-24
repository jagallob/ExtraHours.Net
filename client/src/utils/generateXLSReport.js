import ExcelJS from "exceljs";

export const generateXLSReport = async (data, approvalFilter) => {
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

    return await workbook.xlsx.writeBuffer();
  } catch (err) {
    console.error("Error generating XLS file:", err);
    throw new Error("Error generating XLS file");
  }
};
