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
        private readonly IUserService _userService;

        public EmployeeController(IEmployeeService employeeService, IUserRepository usersRepo, IManagerRepository managerRepository, IUserService userService)
        {
            _employeeService = employeeService;
            _userRepository = usersRepo;
            _managerRepository = managerRepository;
            _userService = userService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEmployeeById(long id)
        {
            try
            {
                var employee = await _employeeService.GetByIdAsync(id);

                return Ok(new
                {
                    id = employee.id,
                    name = employee.name,
                    position = employee.position,
                    salary = employee.salary,
                    role = await GetUserRoleById(employee.id),
                    manager = new
                    {
                        id = employee.manager?.manager_id,
                        name = employee.manager?.manager_name
                    }
                });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { error = "Empleado no encontrado" });
            }
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

            try
            {
                // Verificar si el manager existe
                var manager = await _managerRepository.GetByIdAsync(dto.ManagerId.Value);
                if (manager == null)
                    return BadRequest(new { error = "Manager no encontrado con el ID proporcionado" });

                // Verificar si ya existe un usuario con el mismo id
                if (await _userService.UserExistsAsync((int)dto.Id))
                    return BadRequest(new { error = "Ya existe un usuario con ese ID" });

                // Generar contraseña cifrada
                string plainPassword = dto.Password ?? "pasword123";
                string hashedPassword = BCrypt.Net.BCrypt.HashPassword(plainPassword);

                // Crear usuario correspondiente
                var user = new User
                {
                    id = (int)dto.Id,
                    email = dto.Email ?? (dto.Name.ToLower().Replace(" ", ".") + "@empresa.com"),
                    name = dto.Name,
                    passwordHash = hashedPassword,
                    role = dto.Role,
                    username = dto.Username ?? dto.Name.ToLower().Replace(" ", ".")
                };
                await _userRepository.SaveAsync(user);

                // Si el rol es "manager", necesitamos crear también un registro en la tabla manager
                if (dto.Role?.ToLower() == "manager")
                {
                    var newManager = new Manager
                    {
                        manager_id = dto.Id,
                        manager_name = dto.Name
                    };
                    await _managerRepository.AddAsync(newManager);
                }

                // Crear registro de empleado
                var employee = new Employee
                {
                    id = dto.Id,
                    name = dto.Name,
                    position = dto.Position,
                    salary = dto.Salary,
                    manager_id = dto.ManagerId,
                };
                await _employeeService.AddEmployeeAsync(employee);


                return Created("", new
                {
                    message = "Empleado y usuario agregados exitosamente",
                    role = dto.Role
                });
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Error completo: {ex}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Error interno: {ex.InnerException.Message}");
                    return BadRequest(new
                    {
                        error = $"Error al agregar empleado: {ex.Message}",
                        innerError = ex.InnerException.Message
                    });
                }
                return BadRequest(new { error = $"Error al agregar empleado: {ex.Message}" });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(long id, [FromBody] UpdateEmployeeDTO dto)
        {
            try
            {
                var existingEmployee = await _employeeService.GetByIdAsync(id);

                // Verificar si el usuario existe
                var user = await _userService.GetUserByIdAsync(id);
                string currentRole = user?.role;

                // Si no se proporciona ManagerId, usamos el actual del empleado
                if (dto.ManagerId == null)
                {
                    dto.ManagerId = existingEmployee.manager_id;
                }
                else
                {
                    // Verificar si el nuevo manager existe
                    var newManager = await _managerRepository.GetByIdAsync(dto.ManagerId.Value);
                    if (newManager == null)
                        return BadRequest(new { error = "Manager no encontrado con el ID proporcionado" });

                    // Actualizar explícitamente el manager_id
                    existingEmployee.manager_id = dto.ManagerId.Value;
                }

                // Actualizar el empleado
                var updatedEmployee = await _employeeService.UpdateEmployeeAsync(id, dto);

                // Si el rol cambió, actualizar el usuario
                if (dto.Role?.ToLower() == "manager")
                {
                    var existingManager = await _managerRepository.GetByIdAsync(id);
                    if (existingManager == null)
                    {
                        var newManager = new Manager
                        {
                            manager_id = id,
                            manager_name = dto.Name
                        };
                        await _managerRepository.AddAsync(newManager);
                    }
                    else if (existingManager.manager_name != dto.Name)
                    {
                        // Actualizar el nombre del manager si cambió
                        existingManager.manager_name = dto.Name;
                        await _managerRepository.UpdateAsync(existingManager);
                    }
                }

                return Ok(new
                {
                    message = "Empleado actualizado correctamente",
                    manager_id = updatedEmployee.manager?.manager_id,
                    manager_name = updatedEmployee.manager?.manager_name,
                    role = currentRole
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { error = ex.Message });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { error = $"Error al actualizar empleado: {ex.Message}" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(long id)
        {
            try
            {
                Console.WriteLine($"Intentando eliminar empleado con ID: {id}");

                // Obtener el rol del usuario antes de eliminar
                string role = await GetUserRoleById(id);
                Console.WriteLine($"Rol del usuario: {role}");

                // Verificar si el empleado existe antes de intentar eliminarlo
                var employeeExists = await _employeeService.EmployeeExistsAsync(id);

                if (employeeExists)
                {
                    try
                    {
                        // Eliminar el empleado
                        Console.WriteLine("Eliminando empleado...");
                        await _employeeService.DeleteEmployeeAsync(id);
                        Console.WriteLine("Empleado eliminado exitosamente de la tabla employees");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error al eliminar empleado: {ex.Message}");
                        // Continuamos con la eliminación del usuario incluso si el empleado no existe
                    }
                }
                else
                {
                    Console.WriteLine("El empleado no existe en la tabla employees, continuando con la eliminación del usuario");
                }

                try
                {
                    // Si era manager, eliminar de la tabla managers
                    if (role?.ToLower() == "manager")
                    {
                        Console.WriteLine("Eliminando registro de manager...");
                        await _managerRepository.DeleteAsync(id);
                        Console.WriteLine("Manager eliminado exitosamente");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error al eliminar registro de manager: {ex.Message}");
                    // Continuamos con la eliminación del usuario incluso si el manager no existe
                }

                try
                {
                    // Eliminar el usuario asociado
                    Console.WriteLine("Eliminando usuario asociado...");
                    await _userService.DeleteUserAsync((int)id);
                    Console.WriteLine("Usuario asociado eliminado exitosamente");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error al eliminar usuario asociado: {ex.Message}");
                    return BadRequest(new { error = $"Error al eliminar usuario asociado: {ex.Message}" });
                }

                Console.WriteLine("Proceso de eliminación completado exitosamente");
                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error general al eliminar empleado: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
                    Console.WriteLine($"Stack trace: {ex.StackTrace}");
                }
                return BadRequest(new { error = $"Error al eliminar empleado: {ex.Message}" });
            }
        }

        // Método auxiliar para obtener el rol del usuario
        private async Task<string> GetUserRoleById(long id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync((int)id);
                return user?.role;
            }
            catch
            {
                return "empleado"; // Valor por defecto
            }
        }
    }
}