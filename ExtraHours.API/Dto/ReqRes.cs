using ExtraHours.API.Model;

namespace ExtraHours.API.Dto
{
    public class ReqRes
    {
        public int StatusCode { get; set; }
        public string? Error { get; set; }
        public string? Message { get; set; }
        public string? Token { get; set; }
        public string? RefreshToken { get; set; }
        public string? ExpirationTime { get; set; }
        public string? Name { get; set; }
        public string? Role { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public long? Id { get; set; }
        public User? OurUsers { get; set; }
        public List<User>? OurUsersList { get; set; }
    }
}
