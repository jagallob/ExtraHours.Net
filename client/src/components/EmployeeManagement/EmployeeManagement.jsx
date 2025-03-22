import { useState, useEffect } from "react";
import {
  Tabs,
  Form,
  Input,
  Button,
  Table,
  Modal,
  message,
  Select,
  InputNumber,
  Space,
  Tooltip,
  Popconfirm,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { addEmployee } from "@services/addEmployee";
import { findEmployee } from "@services/findEmployee";
import { updateEmployee } from "@services/updateEmployee";
import { deleteEmployee } from "@services/deleteEmployee";
import { UserService } from "../../services/UserService";
import "./EmployeeManagement.scss";

const { TabPane } = Tabs;
const { Search } = Input;

const EmployeeManagement = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [newEmployeeForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    newEmployeeForm.setFieldsValue({
      email: generateEmail(newEmployeeForm.getFieldValue("name") || ""),
    });
  }, [newEmployeeForm.getFieldValue("name")]);

  const generateEmail = (name) => {
    return name ? `${name.toLowerCase().replace(/ /g, ".")}@empresa.com` : "";
  };

  const handleAddEmployee = async (values) => {
    setLoading(true);

    try {
      await addEmployee({
        ...values,
        email: generateEmail(values.name),
      });

      message.success("Empleado agregado exitosamente");
      newEmployeeForm.resetFields();
    } catch (error) {
      message.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value) => {
    setSearchValue(value);
    if (!value) {
      setEmployees([]);
      return;
    }
    setLoading(true);
    try {
      const employee = await findEmployee(value);
      setEmployees(employee ? [employee] : []);
      if (!employee) {
        message.info("No se encontraron resultados");
      }
    } catch (error) {
      message.error("Error al buscar empleado");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const showEditModal = (employee) => {
    console.log(employee);
    setSelectedEmployee(employee);
    editForm.setFieldsValue({
      name: employee.name,
      position: employee.position,
      salary: employee.salary,
      manager_id: employee.manager?.id,
      role: employee.role,
    });
    setEditModalOpen(true);
  };

  const handleEdit = async (values) => {
    setLoading(true);
    try {
      await updateEmployee(selectedEmployee.id, values);

      if (values.newPassword) {
        await UserService.changePasswordAdmin(
          selectedEmployee.id,
          values.newPassword
        );
      }

      message.success("Empleado actualizado correctamente");
      setEditModalOpen(false);
      handleSearch(searchValue); // Refresh data
    } catch (error) {
      message.error("Error al actualizar el empleado");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (employeeId) => {
    setLoading(true);
    try {
      await deleteEmployee(employeeId);
      message.success("Empleado eliminado correctamente");
      setEmployees((prevEmployees) =>
        prevEmployees.filter((emp) => emp.id !== employeeId)
      );
    } catch (error) {
      message.error("Error al eliminar el empleado");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Cargo",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "Salario",
      dataIndex: "salary",
      key: "salary",
      sorter: (a, b) => a.salary - b.salary,
      render: (salary) => `$${Number(salary).toLocaleString()}`,
    },
    {
      title: "Manager",
      dataIndex: ["manager", "name"],
      key: "manager_name",
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, employee) => (
        <Space>
          <Tooltip title="Editar">
            <Button
              icon={<EditOutlined />}
              onClick={() => showEditModal(employee)}
              type="primary"
              size="small"
            />
          </Tooltip>
          <Tooltip title="Eliminar">
            <Popconfirm
              title="¿Estás seguro de eliminar este empleado?"
              description="Esta acción no se puede deshacer."
              onConfirm={() => handleDelete(employee.id)}
              okText="Eliminar"
              cancelText="Cancelar"
              okButtonProps={{ danger: true }}
            >
              <Button icon={<DeleteOutlined />} danger size="small" />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="employee-management">
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Agregar Empleado" key="1">
          <div className="add-employee-form">
            <Form
              form={newEmployeeForm}
              layout="vertical"
              onFinish={handleAddEmployee}
            >
              <div className="form-columns">
                <div className="form-column">
                  <Form.Item
                    label="ID"
                    name="id"
                    rules={[
                      {
                        required: true,
                        message: "Por favor ingrese el ID del empleado",
                      },
                    ]}
                  >
                    <InputNumber min={1} style={{ width: "100%" }} />
                  </Form.Item>

                  <Form.Item
                    label="Nombre"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Por favor ingrese el nombre del empleado",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Posición"
                    name="position"
                    rules={[
                      {
                        required: true,
                        message: "Por favor ingrese la posición del empleado",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item label="Email" name="email">
                    <Input disabled />
                  </Form.Item>
                </div>

                <div className="form-column">
                  <Form.Item
                    label="Salario"
                    name="salary"
                    rules={[
                      {
                        required: true,
                        message: "Por favor ingrese el salario del empleado",
                      },
                    ]}
                  >
                    <InputNumber
                      formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      style={{ width: "100%" }}
                      min={1}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Manager ID"
                    name="manager_id"
                    rules={[
                      {
                        required: true,
                        message: "Por favor ingrese el ID del manager",
                      },
                    ]}
                  >
                    <InputNumber min={1} style={{ width: "100%" }} />
                  </Form.Item>

                  <Form.Item
                    label="Rol"
                    name="role"
                    rules={[
                      {
                        required: true,
                        message: "Por favor seleccione el rol del empleado",
                      },
                    ]}
                  >
                    <Select>
                      <Select.Option value="manager">Manager</Select.Option>
                      <Select.Option value="empleado">Empleado</Select.Option>
                      <Select.Option value="superusuario">
                        Superusuario
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>

              <Form.Item className="submit-button-container">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<PlusOutlined />}
                >
                  Agregar Empleado
                </Button>
              </Form.Item>
            </Form>
          </div>
        </TabPane>

        <TabPane tab="Gestionar Empleados" key="2">
          <div className="manage-employees">
            <div className="search-container">
              <Search
                placeholder="Buscar por ID de empleado"
                onSearch={handleSearch}
                enterButton={<SearchOutlined />}
                loading={loading}
                allowClear
              />
            </div>

            <div className="employee-table">
              <Table
                columns={columns}
                dataSource={employees}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                locale={{
                  emptyText: searchValue
                    ? "No se encontraron resultados"
                    : "Ingrese un ID para buscar",
                }}
              />
            </div>
          </div>
        </TabPane>
      </Tabs>

      {/* Edit Modal */}
      <Modal
        title="Editar Empleado"
        open={isEditModalOpen}
        onCancel={() => setEditModalOpen(false)}
        footer={null}
      >
        <Form form={editForm} onFinish={handleEdit} layout="vertical">
          <Form.Item
            name="name"
            label="Nombre"
            rules={[{ required: true, message: "Este campo es requerido" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="position"
            label="Cargo"
            rules={[{ required: true, message: "Este campo es requerido" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="salary"
            label="Salario"
            rules={[{ required: true, message: "Este campo es requerido" }]}
          >
            <InputNumber
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              style={{ width: "100%" }}
              min={1}
            />
          </Form.Item>

          <Form.Item
            name="manager_id"
            label="ID del Manager"
            rules={[{ required: true, message: "Este campo es requerido" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="role"
            label="Rol"
            rules={[{ required: true, message: "Este campo es requerido" }]}
          >
            <Select>
              <Select.Option value="manager">Manager</Select.Option>
              <Select.Option value="empleado">Empleado</Select.Option>
              <Select.Option value="superusuario">Superusuario</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="newPassword" label="Nueva contraseña">
            <Input
              type="password"
              placeholder="Dejar en blanco si no se va a cambiar contraseña"
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Guardar Cambios
              </Button>
              <Button onClick={() => setEditModalOpen(false)}>Cancelar</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EmployeeManagement;
