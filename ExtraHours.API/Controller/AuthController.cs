using Microsoft.AspNetCore.Mvc;
using ExtraHours.API.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using ExtraHours.API.Dto;
using ExtraHours.API.Model;
using ExtraHours.API.Service.Implementations;


namespace ExtraHours.API.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginRequest request)
        {
            try
            {
                // Llamar al servicio para autenticar al usuario
                var (token, refreshToken) = await _authService.LoginAsync(request.Email, request.Password);

                // Devolver los tokens al frontend
                return Ok(new { token, refreshToken });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        [HttpPut("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            try
            {
                // Usar el tipo de claim que tienes en tu token
                var userIdClaim = User.FindFirst("id")?.Value;

                if (userIdClaim == null)
                {
                    return BadRequest(new { message = "No se pudo identificar al usuario" });
                }

                int userId = int.Parse(userIdClaim);

                await _authService.ChangePasswordAsync(userId, request.CurrentPassword, request.NewPassword);
                return Ok("Contraseña actualizada correctamente");
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        public class UserLoginRequest
        {
            public required string Email { get; set; }
            public required string Password { get; set; }
        }


        [HttpPut("change-password-admin")]
        [Authorize(Roles = "superusuario")] 
        public async Task<IActionResult> ChangePasswordAdmin([FromBody] ChangePasswordAdminRequest request)
        {
            try
            {
                // Verificar que el ID del usuario sea válido
                if (request.id <= 0)
                {
                    return BadRequest(new { message = "ID de usuario inválido" });
                }

                await _authService.ChangePasswordAdminAsync(request.id, request.NewPassword);

                return Ok("Contraseña actualizada correctamente");
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}

