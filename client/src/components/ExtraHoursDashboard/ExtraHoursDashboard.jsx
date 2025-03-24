import { Typography, Empty, Card, Row, Col } from "antd";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import PropTypes from "prop-types";
import "./ExtraHoursDashboard.scss";

const { Title } = Typography;

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ExtraHoursDashboard = ({ data }) => {
  // Procesar datos para los gráficos
  const processDataForCharts = (data) => {
    if (!data || data.length === 0)
      return { barData: [], pieData: [], monthlyData: [], cumulativeData: [] };

    // Agregar datos por empleado para gráfico de barras
    const employeeMap = new Map();
    data.forEach((record) => {
      const empKey = record.id.toString();
      if (!employeeMap.has(empKey)) {
        employeeMap.set(empKey, {
          name: record.name || `Emp ${record.id}`,
          diurnal: 0,
          nocturnal: 0,
          diurnalHoliday: 0,
          nocturnalHoliday: 0,
          total: 0,
        });
      }

      const emp = employeeMap.get(empKey);
      emp.diurnal += parseFloat(record.diurnal || 0);
      emp.nocturnal += parseFloat(record.nocturnal || 0);
      emp.diurnalHoliday += parseFloat(record.diurnalHoliday || 0);
      emp.nocturnalHoliday += parseFloat(record.nocturnalHoliday || 0);
      emp.total += parseFloat(record.extrasHours || 0);
    });

    // Datos para gráfico de pastel - distribución de tipos de horas extras
    const totalDiurnal = data.reduce(
      (sum, record) => sum + parseFloat(record.diurnal || 0),
      0
    );
    const totalNocturnal = data.reduce(
      (sum, record) => sum + parseFloat(record.nocturnal || 0),
      0
    );
    const totalDiurnalHoliday = data.reduce(
      (sum, record) => sum + parseFloat(record.diurnalHoliday || 0),
      0
    );
    const totalNocturnalHoliday = data.reduce(
      (sum, record) => sum + parseFloat(record.nocturnalHoliday || 0),
      0
    );

    const pieData = [
      { name: "Diurnas", value: totalDiurnal },
      { name: "Nocturnas", value: totalNocturnal },
      { name: "Diurnas Festivas", value: totalDiurnalHoliday },
      { name: "Nocturnas Festivas", value: totalNocturnalHoliday },
    ];

    // Procesar datos por mes para el gráfico de líneas
    const monthlyMap = new Map();
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    // Procesar datos mensuales
    data.forEach((record) => {
      if (record.date) {
        const date = new Date(record.date);
        const month = months[date.getMonth()];

        if (!monthlyMap.has(month)) {
          monthlyMap.set(month, {
            name: month,
            total: 0,
            diurnal: 0,
            nocturnal: 0,
            diurnalHoliday: 0,
            nocturnalHoliday: 0,
          });
        }

        const monthData = monthlyMap.get(month);
        monthData.total += parseFloat(record.extrasHours || 0);
        monthData.diurnal += parseFloat(record.diurnal || 0);
        monthData.nocturnal += parseFloat(record.nocturnal || 0);
        monthData.diurnalHoliday += parseFloat(record.diurnalHoliday || 0);
        monthData.nocturnalHoliday += parseFloat(record.nocturnalHoliday || 0);
      }
    });

    // Convertir el mapa a un array y ordenar por mes
    const monthOrder = {};
    months.forEach((month, index) => {
      monthOrder[month] = index;
    });

    const monthlyData = Array.from(monthlyMap.values()).sort(
      (a, b) => monthOrder[a.name] - monthOrder[b.name]
    );

    const cumulativeData = [];
    let totalAccumulatedHours = 0;

    const sortedData = data
      .filter((record) => record.date)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    sortedData.forEach((record) => {
      const currentHours = parseFloat(record.extrasHours || 0);
      totalAccumulatedHours += currentHours;

      const recordDate = new Date(record.date);

      cumulativeData.push({
        date: recordDate.toISOString().split("T")[0], // Formato YYYY-MM-DD
        name: record.name || `Registro`,
        accumulatedHours: totalAccumulatedHours,
        currentHours: currentHours,
      });
    });

    return {
      barData: Array.from(employeeMap.values()),
      pieData,
      monthlyData,
      cumulativeData,
    };
  };

  const { barData, pieData, monthlyData, cumulativeData } =
    processDataForCharts(data);

  if (!data || data.length === 0) {
    return (
      <Empty
        description="Seleccione un empleado o realice una búsqueda para cargar el dashboard"
        style={{ margin: "100px 0" }}
      />
    );
  }

  return (
    <div className="extra-hours-dashboard">
      <Title level={3}>Dashboard de Horas Extras</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <Card title="Distribución por Tipo de Hora Extra" bordered={false}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(1)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value.toFixed(1)} horas`, null]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} xl={12}>
          <Card title="Horas Extras por Empleado" bordered={false}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={barData.slice(0, 5)} // Limitar a 5 para claridad
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" name="Total Horas" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
      {monthlyData.length > 0 && (
        <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
          <Col span={24}>
            <Card title="Total de Horas Extras por Mes" bordered={false}>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={monthlyData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value.toFixed(1)} horas`, null]}
                  />
                  <Legend />
                  <Bar
                    dataKey="total"
                    fill="#8884d8"
                    name="Total Horas"
                    barSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      )}

      {cumulativeData.length > 0 && (
        <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
          <Col span={24}>
            <Card title="Horas Extras Acumuladas" bordered={false}>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={cumulativeData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    label={{
                      value: "Fecha",
                      position: "insideBottomRight",
                      offset: -10,
                    }}
                  />
                  <YAxis
                    label={{
                      value: "Horas Extras Acumuladas",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip
                    labelFormatter={(label) => `Fecha: ${label}`}
                    formatter={(value, name) => [
                      `${value.toFixed(1)} horas`,
                      name,
                    ]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="accumulatedHours"
                    stroke="#8884d8"
                    name="Total Acumulado"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="currentHours"
                    stroke="#82ca9d"
                    name="Horas en este Período"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

// Define PropTypes for the component
ExtraHoursDashboard.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string,
      date: PropTypes.string, // Añadido para soporte de fecha
      diurnal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      nocturnal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      diurnalHoliday: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      nocturnalHoliday: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      extrasHours: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
};

// Default props
ExtraHoursDashboard.defaultProps = {
  data: [],
};

export default ExtraHoursDashboard;
