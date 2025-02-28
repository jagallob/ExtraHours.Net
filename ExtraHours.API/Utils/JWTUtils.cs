using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using ExtraHours.API.Model;

namespace ExtraHours.API.Utils
{
    public class JWTUtils : IJWTUtils
    {
        private readonly SymmetricSecurityKey _key;
        private const long ACCESS_TOKEN_EXPIRATION = 3600000; // 1 hora
        private const long REFRESH_TOKEN_EXPIRATION = 604800000; // 7 días

        public JWTUtils()
        {
            var secretString = "843567893696976453275974432697R634976R738467TR678T34865R6834R8763T478378637664538745673865783678548735687R3";
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretString));
        }

        public string GenerateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.email.Trim()),
                new Claim("role", user.role),
                new Claim("id", user.id
                .ToString())
            };
            return CreateToken(claims, ACCESS_TOKEN_EXPIRATION);
        }

        public string GenerateRefreshToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.email.Trim()),
                new Claim("id", user.id.ToString())
            };
            return CreateToken(claims, REFRESH_TOKEN_EXPIRATION);
        }

        private string CreateToken(IEnumerable<Claim> claims, long expiration)
        {
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMilliseconds(expiration),
                Issuer = "ExtraHoursAPI",
                Audience = "ExtraHoursClient",
                SigningCredentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256Signature)
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public ClaimsPrincipal ExtractClaims(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = _key,
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero
            };
            return tokenHandler.ValidateToken(token, validationParameters, out _);
        }

        public bool IsTokenValid(string token, User user)
        {
            try
            {
                var principal = ExtractClaims(token);
                var username = principal.Identity?.Name;
                var userId = principal.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
                return username == user.email && userId == user.id.ToString();
            }
            catch
            {
                return false;
            }
        }
    }
}
