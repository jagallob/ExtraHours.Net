using ExtraHours.API.Model;

namespace ExtraHours.API.Service.Interface
{
    public interface IExtraHoursConfigService
    {
        Task<ExtraHoursConfig> GetConfigAsync();
        Task<ExtraHoursConfig> UpdateConfigAsync(ExtraHoursConfig config);
    }
}
