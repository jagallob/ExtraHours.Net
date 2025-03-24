using ExtraHours.API.Model;
<<<<<<< Updated upstream
<<<<<<< Updated upstream
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ExtraHours.API.Service.Interface;
using ExtraHours.API.Dto;
using System.Threading.Tasks;

namespace ExtraHours.API.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        //[Authorize(Roles = "manager, superusuario")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);
                return Ok(new UserDTO
                {
                    Id = user.id,
                    Email = user.email,
                    Name = user.name,
                    Username = user.username,
                    Role = user.role
                });
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { error = ex.Message });
            }
        }

        [HttpGet("email/{email}")]
        public async Task<IActionResult> GetUserByEmail(string email)
        {
            try
            {
                var user = await _userService.GetUserByEmailAsync(email);
                return Ok(new UserDTO
                {
                    Id = user.id,
                    Email = user.email,
                    Name = user.name,
                    Username = user.username,
                    Role = user.role
                });
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { error = ex.Message });
            }
        }

        [HttpPost]
        //[Authorize(Roles = "manager, superusuario")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDTO dto)
        {
            if (await _userService.EmailExistsAsync(dto.Email))
            {
                return BadRequest(new { error = "El email ya está registrado" });
            }

            var user = new User
            {
                email = dto.Email,
                name = dto.Name,
                passwordHash = dto.Password, // En producción, usar hash
                username = dto.Username,
                role = dto.Role
            };

            await _userService.SaveUserAsync(user);

            return CreatedAtAction(nameof(GetUserById), new { id = user.id }, new UserDTO
            {
                Id = user.id,
                Email = user.email,
                Name = user.name,
                Username = user.username,
                Role = user.role
            });
        }

        [HttpPut("{id}")]
        //[Authorize(Roles = "manager, superusuario")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDTO dto)
        {
            try
            {
                var existingUser = await _userService.GetUserByIdAsync(id);

                // Actualizar solo los campos proporcionados
                if (!string.IsNullOrEmpty(dto.Email))
                {
                    if (dto.Email != existingUser.email && await _userService.EmailExistsAsync(dto.Email))
                    {
                        return BadRequest(new { error = "El email ya está registrado" });
                    }
                    existingUser.email = dto.Email;
                }

                if (!string.IsNullOrEmpty(dto.Name))
                    existingUser.name = dto.Name;

                if (!string.IsNullOrEmpty(dto.Password))
                    existingUser.passwordHash = dto.Password; // En producción, usar hash

                if (!string.IsNullOrEmpty(dto.Username))
                    existingUser.username = dto.Username;

                if (!string.IsNullOrEmpty(dto.Role))
                    existingUser.role = dto.Role;

                await _userService.UpdateUserAsync(existingUser);

                return Ok(new UserDTO
                {
                    Id = existingUser.id,
                    Email = existingUser.email,
                    Name = existingUser.name,
                    Username = existingUser.username,
                    Role = existingUser.role
                });
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        //[Authorize(Roles = "superusuario")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                await _userService.DeleteUserAsync(id);
=======
=======
>>>>>>> Stashed changes
using ExtraHours.API.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ExtraHours.API.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public UserController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        // Obtener un usuario por ID
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUserById(long id)
        {
            try
            {
                var user = await _userRepository.GetUserByIdAsync(id);
                return Ok(user);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // Obtener un usuario por email
        [HttpGet("email/{email}")]
        public async Task<ActionResult<User>> GetUserByEmail(string email)
        {
            try
            {
                var user = await _userRepository.GetUserByEmailAsync(email);
                return Ok(user);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // Crear un usuario
        [HttpPost]
        public async Task<ActionResult> CreateUser([FromBody] User user)
        {
            await _userRepository.SaveAsync(user);
            return CreatedAtAction(nameof(GetUserById), new { id = user.id }, user);
        }

        // Actualizar la contraseña de un usuario
        [HttpPut("update-password/{id}")]
        public async Task<ActionResult> UpdateUserPassword(long id, [FromBody] User user)
        {
            if (id != user.id)
                return BadRequest(new { message = "ID mismatch" });

            try
            {
                await _userRepository.UpdateUserAsync(user);
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                return NotFound(new { error = ex.Message });
            }
        }
    }
}
=======
=======
>>>>>>> Stashed changes
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
