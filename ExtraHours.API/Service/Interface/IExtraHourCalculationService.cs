using ExtraHours.API.Model;

namespace ExtraHours.API.Service.Interface
{
    public interface IExtraHourCalculationService
    {
        Task<ExtraHourCalculation> DetermineExtraHourTypeAsync(DateTime date, TimeSpan startTime, TimeSpan endTime);
    }
}
