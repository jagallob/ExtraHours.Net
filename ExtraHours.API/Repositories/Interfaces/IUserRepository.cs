using ExtraHours.API.Model;

namespace ExtraHours.API.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> FindByEmailAsync(string username);
        Task<User> GetUserByEmailAsync(string email);
        Task SaveAsync(User user);
    }
}
