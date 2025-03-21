using ExtraHours.API.Model;

namespace ExtraHours.API.Service.Interface
{
    public interface IUserService
    {
        Task<User> GetUserByIdAsync(long userId);
        Task<User> GetUserByEmailAsync(string email);
        Task<User?> FindByEmailAsync(string email);
        Task<List<User>> GetAllAsync();
        Task SaveUserAsync(User user);
        Task UpdateUserAsync(User user);
        Task DeleteUserAsync(long userId);
        Task<bool> UserExistsAsync(long userId);
        Task<bool> EmailExistsAsync(string email);
    }
}
