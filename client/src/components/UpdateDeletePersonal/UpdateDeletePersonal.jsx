import { Input, Table, Button, Modal, Form, message } from "antd";
import { useState } from "react";
import { findEmployee } from "@services/findEmployee";
import { updateEmployee } from "@services/updateEmployee";
import { deleteEmployee } from "@services/deleteEmployee";
import PropTypes from "prop-types";

const { Search } = Input;

const UpdateDeletePersonal = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [form] = Form.useForm();

  const onSearch = async (employeeId) => {
    try {
      const employee = await findEmployee(employeeId);
      setEmployees(employee ? [employee] : []);
    } catch (error) {
      console.error(error);
      message.error("Empleado no encontrado");
      setEmployees([]);
    }
  };

  const showEditModal = (employee) => {
    setSelectedEmployee(employee);
    form.setFieldsValue({
      ...employee,
      manager_id: employee.manager.manager_id,
      manager_name: employee.manager_name || "",
    });
    setEditModalOpen(true);
  };

  const handleEdit = async (values) => {
    try {
      const response = await updateEmployee(selectedEmployee.id, values);
      message.success(response.message);
      setEditModalOpen(false);
      onSearch(selectedEmployee.id);
    } catch (error) {
      console.error(error);
      message.error("Error al actualizar el empleado");
    }
  };

  const showDeleteModal = (employee) => {
    setSelectedEmployee(employee);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    Modal.confirm({
      title:
        "¿Estás seguro que deseas eliminar este empleado y sus registros asociados?",
      content: "Esta acción no se puede deshacer.",
      okText: "Eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      onOk: async () => {
        try {
          await deleteEmployee(selectedEmployee.id);
          message.success("Empleado eliminado correctamente");

          setEmployees((prevEmployees) =>
            prevEmployees.filter((emp) => emp.id !== selectedEmployee.id)
          );

          setDeleteModalOpen(false);
        } catch (error) {
          console.error("Error al eliminar empleado:", error);
          message.error("Error al eliminar el empleado. Intenta nuevamente.");
        }
      },
      onCancel() {
        message.info("Eliminación cancelada");
      },
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Salario",
      dataIndex: "salary",
      key: "salary",
    },
    {
      title: "Cargo",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "Manager ID",
      dataIndex: ["manager", "manager_id"],
      key: "manager_id",
    },
    {
      title: "Manager Name",
      dataIndex: ["manager", "manager_name"],
      key: "manager_name",
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, employee) => (
        <>
          <Button onClick={() => showEditModal(employee)} type="link">
            Editar
          </Button>
          <Button onClick={() => showDeleteModal(employee)} type="link" danger>
            Eliminar
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="EmployeeManagementPage">
      <h2>Actualizar o eliminar Personal</h2>
      <div className="search-container">
        <Search placeholder="Buscar por ID de empleado" onSearch={onSearch} />
      </div>

      <Table columns={columns} dataSource={employees} rowKey="id" />

      <Modal
        title="Editar Empleado"
        open={isEditModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleEdit}>
          <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="salary" label="Salario" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="position" label="Cargo" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="manager_id"
            label="Manager_id"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Eliminar Empleado"
        open={isDeleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onOk={handleDelete}
        okText="Confirmar"
        okButtonProps={{ danger: true }}
        cancelText="Cancelar"
      >
        <p>¿Estás seguro de que deseas eliminar este empleado?</p>
      </Modal>
    </div>
  );
};

UpdateDeletePersonal.propTypes = {
  onIdChange: PropTypes.func.isRequired,
  reset: PropTypes.bool.isRequired,
  setReset: PropTypes.func.isRequired,
};

export default UpdateDeletePersonal;
