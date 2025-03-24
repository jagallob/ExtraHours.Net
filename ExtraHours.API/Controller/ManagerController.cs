using ExtraHours.API.Model;
using ExtraHours.API.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ExtraHours.API.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManagerController : ControllerBase
    {
        private readonly IManagerRepository _managerRepository;

        public ManagerController(IManagerRepository managerRepository)
        {
            _managerRepository = managerRepository;
        }

        // Obtener todos los managers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Manager>>> GetAllManagers()
        {
            var managers = await _managerRepository.GetAllAsync();
            return Ok(managers);
        }

        // Obtener un manager por ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Manager>> GetManagerById(long id)
        {
            try
            {
                var manager = await _managerRepository.GetByIdAsync(id);
                return Ok(manager);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // Agregar un nuevo manager
        [HttpPost]
        public async Task<ActionResult> CreateManager([FromBody] Manager manager)
        {
            await _managerRepository.AddAsync(manager);
            return CreatedAtAction(nameof(GetManagerById), new { id = manager.manager_id }, manager);
        }

        // Actualizar un manager
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateManager(long id, [FromBody] Manager manager)
        {
            if (id != manager.manager_id)
                return BadRequest(new { message = "ID mismatch" });

            try
            {
                await _managerRepository.UpdateAsync(manager);
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // Eliminar un manager
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteManager(long id)
        {
            try
            {
                await _managerRepository.DeleteAsync(id);
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
