using ExtraHours.API.Dto;
using ExtraHours.API.Repositories.Interfaces;
using ExtraHours.API.Utils;
using ExtraHours.API.Service.Interface;
using ExtraHours.API.Model;


namespace ExtraHours.API.Service.Implementations
{
    public class UsersManagementService : IUsersManagementService
    {
        private readonly IUsersRepository _usersRepository;
        private readonly JWTUtils _jwtUtils;

        public UsersManagementService(IUsersRepository usersRepository, JWTUtils jwtUtils)
        {
            _usersRepository = usersRepository;
            _jwtUtils = jwtUtils;
        }

        // ...

        public bool VerifyCurrentPassword(long id, string currentPassword)
        {
            var user = _usersRepository.FindByIdAsync(id).Result;
            if (user == null)
                throw new ArgumentException("Usuario no encontrado");

            return BCrypt.Net.BCrypt.Verify(currentPassword, user.Password); // Cambiar esta línea para usar el espacio de nombres correcto
        }

        // Refrescar token
        public async Task<ReqRes> RefreshTokenAsync(ReqRes refreshTokenRequest)
        {
            var response = new ReqRes();
            try
            {
                if (string.IsNullOrEmpty(refreshTokenRequest.Token))
                {
                    response.StatusCode = 400;
                    response.Message = "Token de refresco no proporcionado";
                    return response;
                }

                var email = _jwtUtils.ExtractClaims(refreshTokenRequest.Token).Identity?.Name;
                if (string.IsNullOrEmpty(email))
                {
                    response.StatusCode = 400;
                    response.Message = "Email no encontrado en el token";
                    return response;
                }

                var user = await _usersRepository.FindByEmailAsync(email);

                if (user == null || !_jwtUtils.IsTokenValid(refreshTokenRequest.Token, user))
                {
                    response.StatusCode = 401;
                    response.Message = "Token de refresco inválido";
                    return response;
                }
                var jwt = _jwtUtils.GenerateToken(user);
                response.StatusCode = 200;
                response.Token = jwt;
                response.RefreshToken = refreshTokenRequest.Token;
                response.ExpirationTime = "24Hrs";
                response.Message = "Token refrescado exitosamente";
            }
            catch (Exception ex)
            {
                response.StatusCode = 500;
                response.Message = $"Error al refrescar el token: {ex.Message}";
            }
            return response;
        }

        public Task<ReqRes> RegisterAsync(ReqRes registrationRequest)
        {
            throw new NotImplementedException();
        }

        public Task<ReqRes> LoginAsync(ReqRes loginRequest)
        {
            throw new NotImplementedException();
        }

        public Task ChangePasswordAsync(ChangePasswordRequest request)
        {
            throw new NotImplementedException();
        }

        public Task<ReqRes> GetAllUsersAsync()
        {
            throw new NotImplementedException();
        }

        public Task<ReqRes> GetUsersByIdAsync(long id)
        {
            throw new NotImplementedException();
        }

        public Task<ReqRes> DeleteUserAsync(long userId)
        {
            throw new NotImplementedException();
        }

        public Task<ReqRes> UpdateUserAsync(long userId, User updatedUser)
        {
            throw new NotImplementedException();
        }

        public Task<ReqRes> GetMyInfoAsync(string email)
        {
            throw new NotImplementedException();
        }
    }
}
