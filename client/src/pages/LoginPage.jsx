import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import { useAuth } from "../utils/useAuth";
import { UserService } from "../services/UserService";
import "./LoginPage.scss";
import Logo from "../../../client/src/assets/images/Logo.png";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { auth, login } = useAuth();

  useEffect(() => {
    console.log(auth);
    if (auth?.role) {
      navigate("/menu");
    }
  }, [auth, navigate]);

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
        message.success(`Bienvenido ${values.email}`);
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
    <>
      <h1 id="iniciar">Bienvenido</h1>
      <div className="login-container">
        <h2>Iniciar sesión</h2>

        <img className="Logo" src={Logo} alt="Logo Amadeus" />
        <Form
          name="login-form"
          onFinish={handleLogin}
          layout="vertical"
          className="custom-form"
        >
          <Form.Item
            label="Correo Electrónico"
            name="email"
            rules={[
              {
                // required: true,
                // message: "Por favor ingrese su correo electrónico",
              },
            ]}
          >
            <Input placeholder="example@mail.com" />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={
              [
                // { required: true, message: "Por favor ingrese su contraseña" },
              ]
            }
          >
            <Input.Password placeholder="Contraseña" />
          </Form.Item>

          <Form.Item>
            <Button
              className="button"
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
    </>
  );
};

export default Login;
