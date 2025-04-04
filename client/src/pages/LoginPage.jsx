import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import { useAuth } from "../utils/useAuth";
import { UserService } from "../services/UserService";
import "./LoginPage.scss";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (values) => {
    setLoading(true);

    try {
      const data = await UserService.login(values.email, values.password);
      console.log("Respuesta del backend:", data);

      const { token } = data;
      const decodedToken = jwtDecode(token);

      if (decodedToken.role) {
        login({ token, role: decodedToken.role });
        navigate("/menu");
        message.success(`Bienvenid@ ${decodedToken.unique_name}`);
      } else {
        message.error("No se pudo determinar el rol del usuario");
      }
    } catch (error) {
      message.error("Usuario o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login-page">
      <div id="login-background"></div>
      <div className="login-container">
        <Form
          name="login-form"
          onFinish={handleLogin}
          layout="vertical"
          className="login-form"
        >
         <div className="login-header">
  <img 
    src="/src/assets/images/amadeus.png"
    alt="Logo" 
    className="login-logo" 
  />
  <h2>Inicia sesión</h2>
</div>
          
          <Form.Item
            label="Correo Electrónico"
            name="email"
            rules={[
              {
                required: true,
                message: "Por favor ingrese su correo electrónico",
              },
            ]}
          >
            <Input placeholder="example@mail.com" />
          </Form.Item>
          
          <Form.Item
            label="Contraseña"
            name="password"
            rules={[
              {
                required: true,
                message: "Por favor ingrese su contraseña",
              },
            ]}
          >
            <Input.Password placeholder="Contraseña" />
          </Form.Item>
          
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              Iniciar Sesión
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;