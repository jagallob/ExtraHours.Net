using ExtraHours.API.Model;
using ExtraHours.API.Repositories.Interfaces;
using ExtraHours.API.Service.Interface;
using Microsoft.EntityFrameworkCore;

namespace ExtraHours.API.Service.Implementations
{
    public class ExtraHourService : IExtraHourService
    {
        private readonly IExtraHourRepository _extraHourRepository;

        public ExtraHourService(IExtraHourRepository extraHourRepository)
        {
            _extraHourRepository = extraHourRepository;
        }

        public async Task<List<ExtraHour>> FindExtraHoursByIdAsync(long id)
        {
            return await _extraHourRepository.FindExtraHoursByIdAsync(id);
        }

        public async Task<List<ExtraHour>> FindByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _extraHourRepository.FindByDateRangeAsync(startDate, endDate);
        }

        public async Task<ExtraHour?> FindByRegistryAsync(long registry)
        {
            return await _extraHourRepository.FindByRegistryAsync(registry);
        }

        public async Task<bool> DeleteExtraHourByRegistryAsync(long registry)
        {
            return await _extraHourRepository.DeleteByRegistryAsync(registry);
        }

        public async Task<ExtraHour> AddExtraHourAsync(ExtraHour extraHour)
        {
            return await _extraHourRepository.AddAsync(extraHour);
        }

        public async Task UpdateExtraHourAsync(ExtraHour extraHour)
        {
            await _extraHourRepository.UpdateAsync(extraHour);
        }

        public async Task<List<ExtraHour>> GetAllAsync()
        {
            return await _extraHourRepository.FindAllAsync();
        }
              
    }
}
