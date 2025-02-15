namespace ExtraHours.API.Service.Interface
{
    public interface IAuthService
    {
        Task<(string token, string refreshToken)> LoginAsync(string email, string password);
    }
}
