import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { FormExtraHour } from "./FormExtraHour";
import { useAuth } from "../../utils/useAuth";
import { useConfig } from "../../utils/useConfig";
import { calculateExtraHour } from "../../services/calculateExtraHour";
import { addExtraHour } from "../../services/addExtraHour";
import PropTypes from "prop-types";

// Mock de los hooks y servicios
jest.mock("../../utils/useAuth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../../utils/useConfig", () => ({
  useConfig: jest.fn(),
}));

jest.mock("../../services/addExtraHour", () => ({
  addExtraHour: jest.fn(),
}));

jest.mock("../../services/calculateExtraHour", () => ({
  calculateExtraHour: jest.fn(),
}));

// Mock del componente EmployeeInfo
jest.mock("../EmployeeInfo/EmployeeInfo", () => {
  const EmployeeInfoMock = ({ onIdChange }) => (
    <div data-testid="employee-info">
      <button data-testid="select-employee" onClick={() => onIdChange("123")}>
        Seleccionar empleado
      </button>
    </div>
  );

  EmployeeInfoMock.propTypes = {
    onIdChange: PropTypes.func.isRequired,
    reset: PropTypes.bool,
    setReset: PropTypes.func,
  };

  return { EmployeeInfo: EmployeeInfoMock };
});

describe("FormExtraHour", () => {
  // Setup para cada test
  beforeEach(() => {
    // Mocks por defecto
    useAuth.mockReturnValue({
      getEmployeeIdFromToken: jest.fn().mockReturnValue("101"),
      getUserRole: jest.fn().mockReturnValue("empleado"),
    });

    useConfig.mockReturnValue({
      config: { diurnalStart: "06:00", diurnalEnd: "21:00" },
      isLoading: false,
    });

    calculateExtraHour.mockResolvedValue({
      diurnal: 2,
      nocturnal: 1,
      diurnalHoliday: 0,
      nocturnalHoliday: 0,
      extraHours: 3,
    });

    addExtraHour.mockResolvedValue({ success: true });

    // Limpiar mocks después de cada test
    jest.clearAllMocks();
  });

  test("Renderiza correctamente el formulario para rol empleado", () => {
    render(<FormExtraHour />);

    // Verificar elementos base del formulario
    expect(screen.getByLabelText(/fecha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hora de inicio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hora de fin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/observaciones/i)).toBeInTheDocument();
    expect(screen.getByText(/registrar horas extra/i)).toBeInTheDocument();

    // Verificar que no se muestra el selector de empleado (no es superusuario)
    expect(screen.queryByTestId("employee-info")).not.toBeInTheDocument();
  });

  test("Renderiza selector de empleado cuando el usuario es superusuario", () => {
    useAuth.mockReturnValue({
      getEmployeeIdFromToken: jest.fn().mockReturnValue("101"),
      getUserRole: jest.fn().mockReturnValue("superusuario"),
    });

    render(<FormExtraHour />);

    // Verificar que se muestra el selector de empleado
    expect(screen.getByTestId("employee-info")).toBeInTheDocument();
  });

  test("Calcula horas extra cuando se ingresan fecha, hora inicio y fin", async () => {
    render(<FormExtraHour />);

    // Llenar el formulario
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/fecha/i), {
        target: { value: "2025-04-02" },
      });
      fireEvent.change(screen.getByLabelText(/hora de inicio/i), {
        target: { value: "08:00" },
      });
      fireEvent.change(screen.getByLabelText(/hora de fin/i), {
        target: { value: "11:00" },
      });
    });

    // Verificar que se llamó al servicio de cálculo
    await waitFor(() => {
      expect(calculateExtraHour).toHaveBeenCalledWith({
        date: "2025-04-02",
        startTime: "08:00:00",
        endTime: "11:00:00",
      });
    });

    // Verificar que se muestran los resultados calculados
    await waitFor(() => {
      const diurnalInput = screen.getByLabelText(/diurna/i);
      expect(diurnalInput.value).toBe("2");

      const nocturnalInput = screen.getByLabelText(/nocturna/i);
      expect(nocturnalInput.value).toBe("1");

      const totalInput = screen.getByLabelText(/total horas extra/i);
      expect(totalInput.value).toBe("3");
    });
  });

  test("Envía el formulario correctamente con datos del empleado actual", async () => {
    render(<FormExtraHour />);

    // Llenar el formulario
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/fecha/i), {
        target: { value: "2025-04-02" },
      });
      fireEvent.change(screen.getByLabelText(/hora de inicio/i), {
        target: { value: "08:00" },
      });
      fireEvent.change(screen.getByLabelText(/hora de fin/i), {
        target: { value: "11:00" },
      });
      fireEvent.change(screen.getByLabelText(/observaciones/i), {
        target: { value: "Trabajo adicional por proyecto urgente" },
      });
    });

    // Enviar el formulario
    await act(async () => {
      fireEvent.click(screen.getByText(/registrar horas extra/i));
    });

    // Verificar que se llamó al servicio de registro con los datos correctos
    await waitFor(() => {
      expect(addExtraHour).toHaveBeenCalledWith({
        id: 101,
        date: "2025-04-02",
        startTime: "08:00:00",
        endTime: "11:00:00",
        diurnal: 2,
        nocturnal: 1,
        diurnalHoliday: 0,
        nocturnalHoliday: 0,
        extraHours: 3,
        observations: "Trabajo adicional por proyecto urgente",
        approved: false,
      });
    });

    // Verificar que se reinicia el formulario después de enviar
    await waitFor(() => {
      expect(screen.getByLabelText(/fecha/i).value).toBe("");
      expect(screen.getByLabelText(/hora de inicio/i).value).toBe("");
      expect(screen.getByLabelText(/hora de fin/i).value).toBe("");
      expect(screen.getByLabelText(/observaciones/i).value).toBe("");
    });
  });

  test("Maneja correctamente al seleccionar otro empleado como superusuario", async () => {
    useAuth.mockReturnValue({
      getEmployeeIdFromToken: jest.fn().mockReturnValue("101"),
      getUserRole: jest.fn().mockReturnValue("superusuario"),
    });

    render(<FormExtraHour />);

    // Seleccionar un empleado diferente
    await act(async () => {
      fireEvent.click(screen.getByTestId("select-employee"));
    });

    // Llenar el formulario
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/fecha/i), {
        target: { value: "2025-04-02" },
      });
      fireEvent.change(screen.getByLabelText(/hora de inicio/i), {
        target: { value: "08:00" },
      });
      fireEvent.change(screen.getByLabelText(/hora de fin/i), {
        target: { value: "11:00" },
      });
    });

    // Enviar el formulario
    await act(async () => {
      fireEvent.click(screen.getByText(/registrar horas extra/i));
    });

    // Verificar que se usó el ID del empleado seleccionado
    await waitFor(() => {
      expect(addExtraHour).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 123, // ID del empleado seleccionado
        })
      );
    });
  });

  test("Muestra mensaje de error cuando falla el registro de horas", async () => {
    // Simular error en el servicio
    addExtraHour.mockRejectedValue({
      message: "Error al registrar horas extra",
      response: { data: { title: "Error de validación" } },
    });

    render(<FormExtraHour />);

    // Llenar y enviar el formulario
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/fecha/i), {
        target: { value: "2025-04-02" },
      });
      fireEvent.change(screen.getByLabelText(/hora de inicio/i), {
        target: { value: "08:00" },
      });
      fireEvent.change(screen.getByLabelText(/hora de fin/i), {
        target: { value: "11:00" },
      });
      fireEvent.click(screen.getByText(/registrar horas extra/i));
    });

    // Verificar que se muestra el mensaje de error
    await waitFor(() => {
      expect(screen.getByText(/error de validación/i)).toBeInTheDocument();
    });
  });

  test("Muestra mensaje de carga durante el proceso de registro", async () => {
    // Usar una promesa que no se resuelve inmediatamente
    addExtraHour.mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true }), 100);
      });
    });

    render(<FormExtraHour />);

    // Llenar y enviar el formulario
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/fecha/i), {
        target: { value: "2025-04-02" },
      });
      fireEvent.change(screen.getByLabelText(/hora de inicio/i), {
        target: { value: "08:00" },
      });
      fireEvent.change(screen.getByLabelText(/hora de fin/i), {
        target: { value: "11:00" },
      });
      fireEvent.click(screen.getByText(/registrar horas extra/i));
    });

    // Verificar que se muestra el estado de carga
    expect(screen.getByText(/enviando/i)).toBeInTheDocument();

    // Esperar a que termine la carga
    await waitFor(() => {
      expect(screen.queryByText(/enviando/i)).not.toBeInTheDocument();
    });
  });

  test("Muestra mensaje de carga mientras se obtiene la configuración", () => {
    useConfig.mockReturnValue({
      config: null,
      isLoading: true,
    });

    render(<FormExtraHour />);

    // Verificar que se muestra el mensaje de carga
    expect(screen.getByText(/cargando configuración/i)).toBeInTheDocument();
  });

  test("Calcula automáticamente cuando cambian los valores de fecha o tiempo", async () => {
    render(<FormExtraHour />);

    // Simular entradas de usuario secuenciales
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/fecha/i), {
        target: { value: "2025-04-02" },
      });
    });

    // No debería calcular aún (falta hora inicio y fin)
    expect(calculateExtraHour).not.toHaveBeenCalled();

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/hora de inicio/i), {
        target: { value: "08:00" },
      });
    });

    // No debería calcular aún (falta hora fin)
    expect(calculateExtraHour).not.toHaveBeenCalled();

    // Ahora completamos todos los datos necesarios
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/hora de fin/i), {
        target: { value: "11:00" },
      });
    });

    // Debería calcular automáticamente
    await waitFor(() => {
      expect(calculateExtraHour).toHaveBeenCalled();
    });
  });
});
