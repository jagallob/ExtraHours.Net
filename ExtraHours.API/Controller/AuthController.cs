using Microsoft.AspNetCore.Mvc;
using ExtraHours.API.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;


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
    }

    public class UserLoginRequest
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}

