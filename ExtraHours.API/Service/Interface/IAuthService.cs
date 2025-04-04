namespace ExtraHours.API.Service.Interface
{
    public interface IAuthService
    {
        Task<(string token, string refreshToken)> LoginAsync(string email, string password);
        Task ChangePasswordAsync(int userId, string currentPassword, string newPassword);
        Task ChangePasswordAdminAsync(long userId, string newPassword);
    }
}
