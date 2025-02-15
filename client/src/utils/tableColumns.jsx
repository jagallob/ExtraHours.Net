export const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Empleado",
    dataIndex: "name",
    key: "name",
  },
  // {
  //   title: "Salario",
  //   dataIndex: "salary",
  //   key: "salary",
  // },
  // {
  //   title: "Cargo",
  //   dataIndex: "position",
  //   key: "position",
  // },
  {
    title: "Manager",
    dataIndex: ["manager", "manager_name"],
    key: "manager",
  },
  {
    title: "Fecha",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Diurnas",
    dataIndex: "diurnal",
    key: "diurnal",
  },
  {
    title: "Nocturnas",
    dataIndex: "nocturnal",
    key: "nocturnal",
  },
  {
    title: "Diurnas Festivas",
    dataIndex: "diurnalHoliday",
    key: "diurnalHoliday",
  },
  {
    title: "Nocturnas Festivas",
    dataIndex: "nocturnalHoliday",
    key: "nocturnalHoliday",
  },
  {
    title: "Total Horas Extras",
    dataIndex: "extrasHours",
    key: "extrasHours",
  },
  {
    title: "Observaciones",
    dataIndex: "observations",
    key: "observations",
  },
  {
    title: "Registro",
    dataIndex: "registry",
    key: "registry",
  },
  {
    title: "Aprobado",
    dataIndex: "approved",
    key: "approved",
    width: 100,
    render: (approved) => (
      <span style={{ color: approved ? "green" : "red" }}>
        {approved ? "Sí" : "No"}
      </span>
    ),
  },
];
