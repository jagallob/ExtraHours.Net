using ExtraHours.API.Repositories.Interfaces;
using ExtraHours.API.Service.Interface;
using ExtraHours.API.Utils;

namespace ExtraHours.API.Service.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IJWTUtils _jwtUtils;

        public AuthService(IUserRepository userRepository, IJWTUtils jwtUtils)
        {
            _userRepository = userRepository;
            _jwtUtils = jwtUtils;
        }

        public async Task<(string token, string refreshToken)> LoginAsync(string email, string password)
        {
            // Buscar al usuario por correo electrónico
            var user = await _userRepository.GetUserByEmailAsync(email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Invalid credentials");
            }

            // Generar tokens JWT
            var token = _jwtUtils.GenerateToken(user);
            var refreshToken = _jwtUtils.GenerateRefreshToken(user);

            return (token, refreshToken);
        }
    }
}
