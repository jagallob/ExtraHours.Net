using ExtraHours.API.Service.Interface;
using Microsoft.AspNetCore.Mvc;

namespace ExtraHours.API.Controller
{
    [Route("api/logout")]
    [ApiController]
    public class LogoutController : ControllerBase
    {
        private readonly IJWTTokenService _jwtTokenService;

        public LogoutController(IJWTTokenService jwtTokenService)
        {
            _jwtTokenService = jwtTokenService;
        }

        [HttpPost]
        public IActionResult Logout([FromHeader(Name = "Authorization")] string token)
        {
            try
            {
                // Extraer el token JWT de la cabecera Authorization
                if (string.IsNullOrEmpty(token) || !token.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                    return BadRequest(new { error = "Token inválido" });

                string jwtToken = token.Substring(7); // Quitar el prefijo "Bearer "

                // Invalidar el token JWT
                _jwtTokenService.InvalidateToken(jwtToken);

                return Ok(new { message = "Logout successful" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = "Logout failed", details = ex.Message });

            }

        }
    }
}
