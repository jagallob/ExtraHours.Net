import dayjs from "dayjs";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Tag } from "antd";

export const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 70,
    align: "center",
  },
  {
    title: "Empleado",
    dataIndex: "name",
    key: "name",
    width: 180,
    align: "center",
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
    dataIndex: ["manager", "name"],
    key: "manager",
    width: 180,
    align: "center",
    render: (name) => name || "N/A",
  },
  {
    title: "Fecha",
    dataIndex: "date",
    key: "date",
    width: 120,
    align: "center",
    render: (date) => dayjs(date).format("YYYY-MM-DD"),
  },
  {
    title: "Diurnas",
    dataIndex: "diurnal",
    key: "diurnal",
    width: 100,
    align: "center",
  },
  {
    title: "Nocturnas",
    dataIndex: "nocturnal",
    key: "nocturnal",
    width: 100,
    align: "center",
  },
  {
    title: "Diurnas Festivas",
    dataIndex: "diurnalHoliday",
    key: "diurnalHoliday",
    width: 140,
    align: "center",
  },
  {
    title: "Nocturnas Festivas",
    dataIndex: "nocturnalHoliday",
    key: "nocturnalHoliday",
    width: 140,
    align: "center",
  },
  {
    title: "Total Horas Extras",
    dataIndex: "extrasHours",
    key: "extrasHours",
    width: 140,
    align: "center",
  },
  {
    title: "Observaciones",
    dataIndex: "observations",
    key: "observations",
    width: 200,
    align: "center",
    ellipsis: true,
  },
  {
    title: "Registro",
    dataIndex: "registry",
    key: "registry",
    width: 120,
    align: "center",
  },
  {
    title: "Estado",
    dataIndex: "approved",
    key: "status",
    width: 120,
    render: (approved) => (
      <Tag
        color={approved ? "success" : "warning"}
        icon={approved ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
      >
        {approved ? "Aprobado" : "Pendiente"}
      </Tag>
    ),
    filters: [
      { text: "Aprobado", value: true },
      { text: "Pendiente", value: false },
    ],
    onFilter: (value, record) => record.approved === value,
  },
  {
    title: "Aprobado por",
    dataIndex: "approvedByManagerName",
    key: "approvedByManagerName",
    render: (text, record) => (record.approved ? text : "Pendiente"),
  },
];
