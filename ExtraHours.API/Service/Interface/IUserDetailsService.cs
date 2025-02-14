using ExtraHours.API.Model;

namespace ExtraHours.API.Service.Interface
{
    public interface IUserDetailsService
    {
        Task<User?> LoadUserByUsernameAsync(string username);
    }
}
