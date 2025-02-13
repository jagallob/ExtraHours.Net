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

        [HttpGet("id/{id}")]
        public async Task<IActionResult> GetExtraHoursById(long id)
        {
            var extraHours = await _extraHourService.FindExtraHoursByIdAsync(id);
            return Ok(extraHours ?? new List<ExtraHour>());
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
            if (extraHour == null)
                return BadRequest(new { error = "Datos de horas extra no pueden ser nulos" });

            var savedExtraHour = await _extraHourService.AddExtraHourAsync(extraHour);
            return Created("", savedExtraHour);
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

            extraHour.Approved = true;
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

            existingExtraHour.Diurnal = extraHourDetails.Diurnal;
            existingExtraHour.Nocturnal = extraHourDetails.Nocturnal;
            existingExtraHour.DiurnalHoliday = extraHourDetails.DiurnalHoliday;
            existingExtraHour.NocturnalHoliday = extraHourDetails.NocturnalHoliday;
            existingExtraHour.ExtraHours = extraHourDetails.Diurnal +
                                           extraHourDetails.Nocturnal +
                                           extraHourDetails.DiurnalHoliday +
                                           extraHourDetails.NocturnalHoliday;
            existingExtraHour.Date = extraHourDetails.Date;
            existingExtraHour.Observations = extraHourDetails.Observations;

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
