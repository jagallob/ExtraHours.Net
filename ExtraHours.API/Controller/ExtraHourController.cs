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

        public ExtraHourController(IExtraHourService extraHourService, IEmployeeService employeeService) 
        {
            _extraHourService = extraHourService;
            _employeeService = employeeService;
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
                            manager = new { name = employee.manager?.name ?? "Sin asignar" },
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
                    manager = new { name = employee.manager?.name ?? "Sin asignar" },
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
                    observations = extraHour.observations
                });
            }

            return Ok(result);

        }

        [HttpGet("date-range")]
        public async Task<IActionResult> GetExtraHoursByDateRange([FromQuery] string starDate, [FromQuery] string endDate )
        {
            if (string.IsNullOrEmpty(starDate) || string.IsNullOrEmpty(endDate))
                return BadRequest(new { error = "startDate y endDate son requeridos" });

            if (!DateTime.TryParse(starDate, out var start) || !DateTime.TryParse(endDate, out var end))
                return BadRequest(new { error = "Formato de fecha inválido" });

            var extraHours = await _extraHourService.FindByDateRangeAsync(start, end);
            if (extraHours == null || !extraHours.Any())
                return NotFound(new { error = "No se encontraron horas extra en el rango de fechas" });

            return Ok(extraHours);
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

            return Ok(extraHours);
        }

        [HttpPost]
        public async Task<IActionResult> CreateExtraHour([FromBody] ExtraHour extraHour)
        {

            // Obtener ID del empleado desde el token
            var userId = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { error = "No se pudo obtener el ID del usuario logueado." });
            }

            long employeeId = long.Parse(userId);

            // Asignar el ID del empleado automáticamente
            extraHour.id = employeeId;

            if (extraHour == null)
            {
                return BadRequest(new { error = "Datos de horas extra no pueden ser nulos" });
            }


            if (extraHour == null)
                return BadRequest(new { error = "Datos de horas extra no pueden ser nulos" });

            if (extraHour.startTime == TimeSpan.Zero)
                return BadRequest(new { error = "Formato de startTime inválido" });

            if (extraHour.endTime == TimeSpan.Zero)
                return BadRequest(new { error = "Formato de endTime inválido" });

            Console.WriteLine($"Recibido: {System.Text.Json.JsonSerializer.Serialize(extraHour)}");


            try
            {
                var savedExtraHour = await _extraHourService.AddExtraHourAsync(extraHour);
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
        public async Task<IActionResult> ApproveExtraHour(long registry)
        {
            var extraHour = await _extraHourService.FindByRegistryAsync(registry);
            if (extraHour == null)
                return NotFound(new { error = "Registro de horas extra no encontrado" });

            extraHour.approved = true;
            await _extraHourService.UpdateExtraHourAsync(extraHour);
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
    }
}
