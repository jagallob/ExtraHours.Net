using ExtraHours.API.Model;

namespace ExtraHours.API.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> FindByEmailAsync(string username);
        Task<User> GetUserByEmailAsync(string email);
        Task<User> GetUserByIdAsync(long userId);
        Task<List<User>> GetAllAsync();
        Task SaveAsync(User user);
        Task UpdateUserAsync(User user);
        Task DeleteUserAsync(long userId);
        Task<bool> EmailExistsAsync(string email);
    }
}
