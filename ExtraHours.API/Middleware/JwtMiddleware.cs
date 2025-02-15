using ExtraHours.API.Utils;
using System.Security.Claims;

namespace ExtraHours.API.Middleware
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;

        public JwtMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, JWTUtils jwtUtils)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            Console.WriteLine($"Token recibido: {token}");
            if (!string.IsNullOrEmpty(token))
            {
                try
                {
                    var principal = jwtUtils.ExtractClaims(token);
                    if (principal != null)
                    {
                        context.User = principal;

                        var roleClaim = principal.FindFirst("role")?.Value;
                        Console.WriteLine($"Usuario autenticado con rol: {roleClaim}");

                        if (string.IsNullOrEmpty(roleClaim))
                        {
                            Console.WriteLine("No se encontró el rol en las reclamaciones del token.");
                        }
                    }
                    else
                    {
                        Console.WriteLine("No se pudo extraer información del token JWT.");
                    }
                }
                catch (Exception ex)
                {
                    Console.Error.WriteLine($"Error al procesar el token: {ex.Message}");
                }
            }
            else
            {
                Console.WriteLine("No se recibió token en la petición.");
            }
            await _next(context);
        }
    }
}

