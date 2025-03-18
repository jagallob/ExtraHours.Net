using ExtraHours.API.Model;

namespace ExtraHours.API.Service.Interface
{
    public interface IExtraHourService
    {
        Task<IEnumerable<ExtraHour>> FindExtraHoursByIdAsync(long id);
        Task<IEnumerable<ExtraHour>> FindByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<ExtraHour>> FindExtraHoursByIdAndDateRangeAsync(long employeeId, DateTime startDate, DateTime endDate);
        Task<ExtraHour> FindByRegistryAsync(long registry);
        Task<bool> DeleteExtraHourByRegistryAsync(long registry);
        Task<ExtraHour> AddExtraHourAsync(ExtraHour extraHour);
        Task UpdateExtraHourAsync(ExtraHour extraHour);
        Task<IEnumerable<ExtraHour>> GetAllAsync();
        Task<ExtraHour?> GetExtraHourWithApproverDetailsAsync(long registry);

    }
}
