using ExtraHours.API.Model;

namespace ExtraHours.API.Repositories.Interfaces
{
    public interface IExtraHourRepository
    {
        Task<List<ExtraHour>> FindExtraHoursByIdAsync(long id);
        Task<List<ExtraHour>> FindByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<ExtraHour>> FindExtraHoursByIdAndDateRangeAsync(long employeeId, DateTime startDate, DateTime endDate);
        Task<ExtraHour?> FindByRegistryAsync(long registry);
        Task<bool> DeleteByRegistryAsync(long registry);
        Task<bool> ExistsByRegistryAsync(long registry);
        Task<ExtraHour> AddAsync(ExtraHour extraHour);
        Task UpdateAsync(ExtraHour extraHour);
        Task<List<ExtraHour>> FindAllAsync();
       
    }
}
