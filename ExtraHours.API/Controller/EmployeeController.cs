using ExtraHours.API.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ExtraHours.API.Service.Interface;
using ExtraHours.API.Dto;
using ExtraHours.API.Repositories.Interfaces;
using System.Threading.Tasks;
using ExtraHours.API.Repositories.Implementations;


namespace ExtraHours.API.Controllers
{
    [Route("api/employee")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;
        private readonly IUserRepository _userRepository;
        private readonly IManagerRepository _managerRepository;

        public EmployeeController(IEmployeeService employeeService, IUserRepository usersRepo, IManagerRepository managerRepository)
        {
            _employeeService = employeeService;
            _userRepository = usersRepo;
            _managerRepository = managerRepository;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEmployeeById(long id)
        {
            var employee = await _employeeService.GetByIdAsync(id);
            if (employee != null)
                return Ok(employee);
            return NotFound(new { error = "Empleado no encontrado" });
        }

        //[Authorize(Roles = "manager, empleado, superusuario")]
        [HttpGet]
        public async Task<IActionResult> GetAllEmployees()
        {
            var employees = await _employeeService.GetAllAsync();
            return Ok(employees);
        }

        [HttpPost]
        public async Task<IActionResult> AddEmployee([FromBody] EmployeeWithUserDTO dto)
        {
            if (dto.ManagerId == null)
                return BadRequest(new { error = "Manager ID es requerido" });

            var manager = await _managerRepository.GetByIdAsync(dto.ManagerId.Value);
            if (manager == null)
                return BadRequest(new { error = "Manager no encontrado con el ID proporcionado" });

            var employee = new Employee
            {
                id = dto.Id,
                name = dto.Name,
                position = dto.Position,
                salary = dto.Salary,
                manager = manager
            };

            await _employeeService.AddEmployeeAsync(employee);

            var user = new User
            {
                id = dto.Id,
                email = dto.Name.ToLower().Replace(" ", ".") + "@empresa.com",
                name = dto.Name,
                passwordHash = "password123", // En producción, encriptar
                role = dto.Role ?? "empleado",
                username = dto.Name.ToLower().Replace(" ", ".")
            };

            await _userRepository.SaveAsync(user);
            return Created("", new { message = "Empleado y usuario agregados exitosamente" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(long id, [FromBody] UpdateEmployeeDTO dto)
        {
            if (dto.ManagerId == null)
                return BadRequest(new { error = "Manager ID es requerido" });

            var updatedEmployee = await _employeeService.UpdateEmployeeAsync(id, dto);
            if (updatedEmployee == null)
                return NotFound(new { error = "Empleado no encontrado" });

            return Ok(new
            {
                message = "Empleado actualizado correctamente",
                manager_id = updatedEmployee.manager?.id,
                manager_name = updatedEmployee.manager?.name
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(long id)
        {
            await _employeeService.DeleteEmployeeAsync(id);
            return NoContent();
        }
    }
}
