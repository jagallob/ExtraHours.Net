using ExtraHours.API.Model;
using Microsoft.AspNetCore.Mvc;
using ExtraHours.API.Service.Interface;
using Microsoft.AspNetCore.Authorization;

namespace ExtraHours.API.Controller
{
    [Route("api/config")]
    [ApiController]
    public class ExtraHoursConfigController : ControllerBase
    {
        private readonly IExtraHoursConfigService _configService;

        public ExtraHoursConfigController(IExtraHoursConfigService configService)
        {
            _configService = configService;
        }

        [HttpGet]
        public async Task<IActionResult> GetConfig()
        {
            var config = await _configService.GetConfigAsync();
            if (config == null)
            {
                return NotFound(new { error = "Configuración no encontrada" });
            }
            return Ok(config);
        }

        [HttpPut]
        [Authorize(Roles = "superusuario")]
        public async Task<IActionResult> UpdateConfig([FromBody] ExtraHoursConfig config)
        {
            if (config == null)
                return BadRequest(new { error = "Datos de configuración no pueden ser nulos" });

            var updatedConfig = await _configService.UpdateConfigAsync(config);
            return Ok(updatedConfig);

        }
    }
}
