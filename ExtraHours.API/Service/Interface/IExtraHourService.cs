using ExtraHours.API.Model;

namespace ExtraHours.API.Service.Interface
{
    public interface IExtraHourService
    {
        Task<List<ExtraHour>> FindExtraHoursByIdAsync(long id);
        Task<List<ExtraHour>> FindByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<ExtraHour?> FindByRegistryAsync(long registry);
        Task<bool> DeleteExtraHourByRegistryAsync(long registry);
        Task<ExtraHour> AddExtraHourAsync(ExtraHour extraHour);
        Task UpdateExtraHourAsync(ExtraHour extraHour);
        Task<List<ExtraHour>> GetAllAsync();
        
    }
}
