using System.Security.Claims;
using ExtraHours.API.Model;
using ExtraHours.API.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExtraHours.API.Controller
{
    [Route("api/extra-hour")]
    [ApiController]
    public class ExtraHourController : ControllerBase
    {
        private readonly IExtraHourService _extraHourService;
        private readonly IEmployeeService _employeeService;
        private readonly IExtraHourCalculationService _calculationService;

        public ExtraHourController(IExtraHourService extraHourService, IEmployeeService employeeService, IExtraHourCalculationService calculationService) 
        {
            _extraHourService = extraHourService;
            _employeeService = employeeService;
            _calculationService = calculationService;
        }

        [HttpPost("calculate")]
        public async Task<IActionResult> CalculateExtraHours([FromBody] ExtraHourCalculationRequest request)
        {
            if (request == null)
                return BadRequest(new { error = "Los datos de solicitud no pueden ser nulos" });

            try
            {
                var calculation = await _calculationService.DetermineExtraHourTypeAsync(
                    request.Date,
                    request.StartTime,
                    request.EndTime);

                return Ok(calculation);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al calcular horas extra: {ex.Message}");
                return StatusCode(500, new { error = "Error interno del servidor" });
            }
        }

        [HttpGet("manager/employees-extra-hours")]
        [Authorize(Roles = "manager")]
        public async Task<IActionResult> GetEmployeesExtraHoursByManager([FromQuery] string startDate = null, [FromQuery] string endDate = null)
        {

            var managerId = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            if (string.IsNullOrEmpty(managerId))
            {
                return Unauthorized(new { error = "No se pudo obtener el ID del manager logueado." });
            }

            long managerIdLong = long.Parse(managerId);

            var employees = await _employeeService.GetEmployeesByManagerIdAsync(managerIdLong);
            if (employees == null || !employees.Any())
            {
                return Ok(new List<object>());
            }

            var result = new List<object>();

            foreach (var employee in employees)
            {
                IEnumerable<ExtraHour> extraHours;

                // Si se proporcionan fechas, filtrar por rango de fechas
                if (!string.IsNullOrEmpty(startDate) && !string.IsNullOrEmpty(endDate) &&
                    DateTime.TryParse(startDate, out var start) && DateTime.TryParse(endDate, out var end))
                {
                    // Obtener horas extras dentro del rango de fechas para este empleado
                    extraHours = await _extraHourService.FindExtraHoursByIdAndDateRangeAsync(employee.id, start, end);
                }
                else
                {
                    // Si no hay fechas, obtener todas las horas extras de este empleado
                    extraHours = await _extraHourService.FindExtraHoursByIdAsync(employee.id);
                }

                if (extraHours != null && extraHours.Any())
                {
                    foreach (var extraHour in extraHours)
                    {
                        result.Add(new
                        {
                            id = employee.id,
                            name = employee.name,
                            position = employee.position,
                            salary = employee.salary,
                            manager = new { name = employee.manager?.manager_name ?? "Sin asignar" },
                            registry = extraHour.registry,
                            diurnal = extraHour.diurnal,
                            nocturnal = extraHour.nocturnal,
                            diurnalHoliday = extraHour.diurnalHoliday,
                            nocturnalHoliday = extraHour.nocturnalHoliday,
                            extrasHours = extraHour.extraHours,
                            date = extraHour.date.ToString("yyyy-MM-dd"),
                            startTime = extraHour.startTime,
                            endTime = extraHour.endTime,
                            approved = extraHour.approved,
                            approvedByManagerId = extraHour.ApprovedByManagerId,
                            approvedByManagerName = extraHour.ApprovedByManager?.manager_name ?? "No aprobado",
                            observations = extraHour.observations
                        });
                    }
                }
            }
            return Ok(result);

        }

        [HttpGet("id/{id}")]
        public async Task<IActionResult> GetExtraHoursById(long id)
        {
            var extraHours = await _extraHourService.FindExtraHoursByIdAsync(id);
            if (extraHours == null || !extraHours.Any())
                return Ok(new List<ExtraHour>());

            // Obtener la información del empleado
            var employee = await _employeeService.GetByIdAsync(id);
            if (employee == null)
                return NotFound(new { error = "Empleado no encontrado" });

            var result = new List<object>();

            foreach (var extraHour in extraHours)
            {
                result.Add(new
                {
                    id = employee.id,
                    name = employee.name,
                    position = employee.position,
                    salary = employee.salary,
                    manager = new { name = employee.manager?.manager_name ?? "Sin asignar" },
                    registry = extraHour.registry,
                    diurnal = extraHour.diurnal,
                    nocturnal = extraHour.nocturnal,
                    diurnalHoliday = extraHour.diurnalHoliday,
                    nocturnalHoliday = extraHour.nocturnalHoliday,
                    extraHours = extraHour.extraHours,
                    date = extraHour.date.ToString("yyyy-MM-dd"),
                    startTime = extraHour.startTime,
                    endTime = extraHour.endTime,
                    approved = extraHour.approved,
                    approvedByManagerId = extraHour.ApprovedByManagerId,
                    approvedByManagerName = extraHour.ApprovedByManager?.manager_name ?? "No aprobado",
                    observations = extraHour.observations
                });
            }

            return Ok(result);

        }


        [HttpGet("date-range-with-employee")]
        public async Task<IActionResult> GetExtraHoursByDateRangeWithEmployee(
            [FromQuery] string startDate,
            [FromQuery] string endDate)
        {
            if (string.IsNullOrEmpty(startDate) || string.IsNullOrEmpty(endDate))
                return BadRequest(new { error = "startDate y endDate son requeridos" });

            if (!DateTime.TryParse(startDate, out var start) || !DateTime.TryParse(endDate, out var end))
                return BadRequest(new { error = "Formato de fecha inválido" });

            var extraHours = await _extraHourService.FindByDateRangeAsync(start, end);
            if (extraHours == null || !extraHours.Any())
                return NotFound(new { error = "No se encontraron horas extra en el rango de fechas" });

            var result = new List<object>();

            foreach (var extraHour in extraHours)
            {
                var employee = await _employeeService.GetByIdAsync(extraHour.id); // Obtener el empleado por ID
                if (employee == null)
                    continue;

                result.Add(new
                {
                    id = employee.id,
                    name = employee.name,
                    position = employee.position,
                    salary = employee.salary,
                    manager = new { name = employee.manager?.manager_name ?? "Sin asignar" },
                    registry = extraHour.registry,
                    diurnal = extraHour.diurnal,
                    nocturnal = extraHour.nocturnal,
                    diurnalHoliday = extraHour.diurnalHoliday,
                    nocturnalHoliday = extraHour.nocturnalHoliday,
                    extraHours = extraHour.extraHours,
                    date = extraHour.date.ToString("yyyy-MM-dd"),
                    startTime = extraHour.startTime,
                    endTime = extraHour.endTime,
                    approved = extraHour.approved,
                    approvedByManagerId = extraHour.ApprovedByManagerId,
                    approvedByManagerName = extraHour.ApprovedByManager?.manager_name ?? "No aprobado",
                    observations = extraHour.observations
                });
            }

            return Ok(result);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateExtraHour([FromBody] ExtraHour extraHour, IEmailService emailService)
        {
            // Obtener ID del empleado desde el token
            var userId = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            var userRole = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { error = "No se pudo obtener el ID del usuario logueado." });
            }

            long currentUserId = long.Parse(userId);
            long employeeId;

            if (userRole?.ToLower() == "superusuario")
            {

                var targetEmployeeExists = await _employeeService.EmployeeExistsAsync(extraHour.id);
                if (!targetEmployeeExists)
                {
                    return BadRequest(new { error = "El empleado no existe" });
                }
                employeeId = extraHour.id;
            }
            else
            {
                employeeId = currentUserId;
                var employee = await _employeeService.GetByIdAsync(currentUserId);
                if (employee == null || employee.manager_id == null)
                {
                    return BadRequest(new { error = "El empleado no tiene un manager asignado" });
                }

                if (extraHour.id > 0 && currentUserId != extraHour.id)
                {
                    return Forbid();
                }

                extraHour.id = employeeId;
            }

            if (extraHour == null)
            {
                return BadRequest(new { error = "Datos de horas extra no pueden ser nulos" });
            }

            if (extraHour.startTime == TimeSpan.Zero)
                return BadRequest(new { error = "Formato de startTime inválido" });

            if (extraHour.endTime == TimeSpan.Zero)
                return BadRequest(new { error = "Formato de endTime inválido" });

            extraHour.approved = false;
            extraHour.ApprovedByManagerId = null;

            // Realizar el cálculo automático en el backend
            try
            {
                var calculation = await _calculationService.DetermineExtraHourTypeAsync(
                    extraHour.date,
                    extraHour.startTime,
                    extraHour.endTime);

                // Actualizar los valores calculados
                extraHour.diurnal = calculation.diurnal;
                extraHour.nocturnal = calculation.nocturnal;
                extraHour.diurnalHoliday = calculation.diurnalHoliday;
                extraHour.nocturnalHoliday = calculation.nocturnalHoliday;
                extraHour.extraHours = calculation.extraHours;

                var savedExtraHour = await _extraHourService.AddExtraHourAsync(extraHour);

                var employee = await _employeeService.GetByIdAsync(employeeId);

                // Enviar correo al manager si existe
                if (employee?.manager_id != null)
                {
                    var managerEmail = employee?.manager?.User?.email;

                    if (!string.IsNullOrEmpty(managerEmail))
                    {
                        var emailSubject = $"Nuevo Registro de Horas Extra - {employee.name}";
                        var emailBody = $@"
                <html>
                <body>
                    <h2>Registro de Horas Extra</h2>
                    <p><strong>Empleado:</strong> {employee.name}</p>
                    <p><strong>Fecha:</strong> {extraHour.date:yyyy-MM-dd}</p>
                    <p><strong>Hora de Inicio:</strong> {extraHour.startTime}</p>
                    <p><strong>Hora de Fin:</strong> {extraHour.endTime}</p>
                    <p><strong>Total Horas Extra:</strong> {extraHour.extraHours}</p>
                    <p><strong>Horas Diurnas:</strong> {extraHour.diurnal}</p>
                    <p><strong>Horas Nocturnas:</strong> {extraHour.nocturnal}</p>
                    <p><strong>Horas Diurnas Festivas:</strong> {extraHour.diurnalHoliday}</p>
                    <p><strong>Horas Nocturnas Festivas:</strong> {extraHour.nocturnalHoliday}</p>
                    <p><strong>Observaciones:</strong> {extraHour.observations}</p>
                    <br/>
                    <p>Por favor, revise y apruebe las horas extra registradas.</p>
                </body>
                </html>";

                        try
                        {
                            await emailService.SendEmailAsync(managerEmail, emailSubject, emailBody);
                            Console.WriteLine($"Correo enviado exitosamente a: {managerEmail}");
                        }
                        catch (Exception ex)
                        {
                            // Registrar el error pero no fallar la operación principal
                            Console.WriteLine($"Error enviando correo: {ex.Message}");
                        }
                    }
                }

                return Created("", savedExtraHour);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al guardar horas extra: {ex.Message}");
                return StatusCode(500, new { error = "Error interno del servidor" });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllExtraHours()
        {
            var extraHours = await _extraHourService.GetAllAsync();
            return Ok(extraHours);
        }

        [HttpPatch("{registry}/approve")]
        [Authorize(Roles = "manager, superusuario")]
        public async Task<IActionResult> ApproveExtraHour(long registry)
        {
            var extraHour = await _extraHourService.FindByRegistryAsync(registry);
            if (extraHour == null)
                return NotFound(new { error = "Registro de horas extra no encontrado" });

            // Obtener ID del manager desde el token
            var managerId = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            if (string.IsNullOrEmpty(managerId))
            {
                return Unauthorized(new { error = "No se pudo obtener el ID del manager logueado." });
            }

            long managerIdLong = long.Parse(managerId);

            extraHour.approved = true;
            extraHour.ApprovedByManagerId = managerIdLong;

            await _extraHourService.UpdateExtraHourAsync(extraHour);

            var updatedExtraHour = await _extraHourService.FindByRegistryAsync(registry);


            return Ok(extraHour);
        }

        [HttpPut("{registry}/update")]
        [Authorize(Roles = "manager, superusuario")]
        public async Task<IActionResult> UpdateExtraHour(long registry, [FromBody] ExtraHour extraHourDetails)
        {
            var existingExtraHour = await _extraHourService.FindByRegistryAsync(registry);
            if (existingExtraHour == null)
                return NotFound(new { error = "Registro de horas extra no encontrado" });

            existingExtraHour.diurnal = extraHourDetails.diurnal;
            existingExtraHour.nocturnal = extraHourDetails.nocturnal;
            existingExtraHour.diurnalHoliday = extraHourDetails.diurnalHoliday;
            existingExtraHour.nocturnalHoliday = extraHourDetails.nocturnalHoliday;
            existingExtraHour.extraHours = extraHourDetails.diurnal +
                                           extraHourDetails.nocturnal +
                                           extraHourDetails.diurnalHoliday +
                                           extraHourDetails.nocturnalHoliday;
            existingExtraHour.date = extraHourDetails.date;
            existingExtraHour.observations = extraHourDetails.observations;

            await _extraHourService.UpdateExtraHourAsync(existingExtraHour);
            return Ok(existingExtraHour);
        }

        [HttpDelete("{registry}/delete")]
        [Authorize(Roles = "manager, superusuario")]
        public async Task<IActionResult> DeleteExtraHour(long registry)
        {
            var deleted = await _extraHourService.DeleteExtraHourByRegistryAsync(registry);
            if (!deleted)
                return NotFound(new { error = "Registro de horas extra no encontrado" });

            return Ok(new { message = "Registro eliminado exitosamente" });
        }

        [HttpGet("all-employees-extra-hours")]
        [Authorize(Roles = "superusuario")]
        public async Task<IActionResult> GetAllEmployeesExtraHours([FromQuery] string startDate = null, [FromQuery] string endDate = null)
        {
            var result = new List<object>();
            var allEmployees = await _employeeService.GetAllAsync();

            foreach (var employee in allEmployees)
            {
                IEnumerable<ExtraHour> extraHours;

                if (!string.IsNullOrEmpty(startDate) && !string.IsNullOrEmpty(endDate) &&
           DateTime.TryParse(startDate, out var start) && DateTime.TryParse(endDate, out var end))
                {
                    extraHours = await _extraHourService.FindExtraHoursByIdAndDateRangeAsync(employee.id, start, end);
                }
                else
                {
                    extraHours = await _extraHourService.FindExtraHoursByIdAsync(employee.id);
                }

                if (extraHours != null && extraHours.Any())
                {
                    foreach (var extraHour in extraHours)
                    {
                        result.Add(new
                        {
                            id = employee.id,
                            name = employee.name,
                            position = employee.position,
                            salary = employee.salary,
                            manager = new { name = employee.manager?.manager_name ?? "Sin asignar" },
                            registry = extraHour.registry,
                            diurnal = extraHour.diurnal,
                            nocturnal = extraHour.nocturnal,
                            diurnalHoliday = extraHour.diurnalHoliday,
                            nocturnalHoliday = extraHour.nocturnalHoliday,
                            extrasHours = extraHour.extraHours,
                            date = extraHour.date.ToString("yyyy-MM-dd"),
                            startTime = extraHour.startTime,
                            endTime = extraHour.endTime,
                            approved = extraHour.approved,
                            approvedByManagerId = extraHour.ApprovedByManagerId,
                            approvedByManagerName = extraHour.ApprovedByManager?.manager_name ?? "No aprobado",
                            observations = extraHour.observations
                        });
                    }
                }
            }

            return Ok(result);

        }

      
    }

    public class ExtraHourCalculationRequest
    {
        public DateTime Date { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
    }
}
