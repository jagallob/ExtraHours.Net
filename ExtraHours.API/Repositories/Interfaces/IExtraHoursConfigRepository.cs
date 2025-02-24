using ExtraHours.API.Model;

namespace ExtraHours.API.Repositories.Interfaces
{
    public interface IExtraHoursConfigRepository
    {
        Task<ExtraHoursConfig?> GetConfigAsync();
        Task<ExtraHoursConfig> UpdateConfigAsync(ExtraHoursConfig config);
    }
}
