using ExtraHours.API.Model;

namespace ExtraHours.API.Repositories.Interfaces
{
    public interface IExtraHoursConfigRepository
    {
        Task<ExtraHoursConfig?> GetByIdAsync(long id);
        Task<ExtraHoursConfig> SaveAsync(ExtraHoursConfig config);
    }
}
