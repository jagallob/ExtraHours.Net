using ExtraHours.API.Model;
using System.Security.Claims;

namespace ExtraHours.API.Utils
{
    public interface IJWTUtils
    {
        string GenerateToken(User user);
        string GenerateRefreshToken(User user);
        ClaimsPrincipal ExtractClaims(string token);
        bool IsTokenValid(string token, User user);
    }
}
