using ExtraHours.API.Model;

namespace ExtraHours.API.Repositories.Interfaces
{
    public interface IUsersRepository
    {
        Task<User?> FindByEmailAsync(string email);
        Task<User?> FindByIdAsync(long id);
        Task SaveAsync(User user);
    }
}
