using ExtraHours.API.Model;

namespace ExtraHours.API.Repositories.Interfaces
{
    public interface IManagerRepository
    {
        Task<Manager> GetByIdAsync(long id);
        Task<List<Manager>> GetAllAsync();
        Task AddAsync(Manager manager);
        Task UpdateAsync(Manager manager);
        Task DeleteAsync(long id);
    }
}
