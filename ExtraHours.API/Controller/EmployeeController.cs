using ExtraHours.API.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ExtraHours.API.Service.Interface;
using ExtraHours.API.Dto;
using ExtraHours.API.Repositories.Interfaces;
using System.Threading.Tasks;




namespace ExtraHours.API.Controllers
{
    [Route("api/employee")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;
        private readonly IUsersRepository _usersRepo;
        private readonly IManagerRepository _managerRepository;

        public EmployeeController(IEmployeeService employeeService, IUsersRepository usersRepo, IManagerRepository managerRepository)
        {
            _employeeService = employeeService;
            _usersRepo = usersRepo;
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

        [Authorize(Roles = "manager, empleado, superusuario")]
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
                Id = dto.Id,
                Name = dto.Name,
                Position = dto.Position,
                Salary = dto.Salary,
                Manager = manager
            };

            await _employeeService.AddEmployeeAsync(employee);

            var user = new Users
            {
                Id = dto.Id,
                Email = dto.Name.ToLower().Replace(" ", ".") + "@empresa.com",
                Name = dto.Name,
                Password = "password123", // En producción, encriptar
                Role = dto.Role ?? "empleado",
                Username = dto.Name.ToLower().Replace(" ", ".")
            };

            await _usersRepo.SaveAsync(user);
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
                manager_id = updatedEmployee.Manager.Id,
                manager_name = updatedEmployee.Manager.Name
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
