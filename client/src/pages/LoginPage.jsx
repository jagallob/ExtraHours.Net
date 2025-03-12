import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import { useAuth } from "../utils/useAuth";
import { UserService } from "../services/UserService";
import "./LoginPage.scss";
// import Logo from "../../../client/src/assets/images/Logo.png";
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
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Bienvenid@</h1>

        <div className="login-form-container">
          <h2 className="iniciar-sesion">Inicia sesión</h2>

          {/* <img className="Logo" src={Logo} alt="Logo Amadeus" /> */}
          <Form
            name="login-form"
            onFinish={handleLogin}
            layout="vertical"
            className="login-form"
          >
            <div className="form-field">
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
            </div>

            <div className="form-field">
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
            </div>

            <Form.Item className="login-button-container">
              <Button
                className="login-button"
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
    </div>
  );
};

export default Login;
