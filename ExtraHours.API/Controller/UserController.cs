using ExtraHours.API.Model;
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
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllAsync();
            return Ok(users.Select(user => new UserDTO
            {
                Id = user.id,
                Email = user.email,
                Name = user.name,
                Username = user.username,
                Role = user.role
            }));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(long id)
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
        public async Task<IActionResult> UpdateUser(long id, [FromBody] UpdateUserDTO dto)
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
        public async Task<IActionResult> DeleteUser(long id)
        {
            try
            {
                await _userService.DeleteUserAsync(id);
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { error = ex.Message });
            }
        }
    }
}