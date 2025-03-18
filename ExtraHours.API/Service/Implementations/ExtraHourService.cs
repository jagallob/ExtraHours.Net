using ExtraHours.API.Model;
using ExtraHours.API.Repositories.Interfaces;
using ExtraHours.API.Service.Interface;
using Microsoft.EntityFrameworkCore;

namespace ExtraHours.API.Service.Implementations
{
    public class ExtraHourService : IExtraHourService
    {
        private readonly IExtraHourRepository _extraHourRepository;
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IManagerRepository _managerRepository;

        public ExtraHourService(IExtraHourRepository extraHourRepository, IEmployeeRepository employeeRepository, IManagerRepository managerRepository)
        {
            _extraHourRepository = extraHourRepository;
            _employeeRepository = employeeRepository;
            _managerRepository = managerRepository;
        }

        public async Task<IEnumerable<ExtraHour>> FindExtraHoursByIdAsync(long id)
        {
            return await _extraHourRepository.FindExtraHoursByIdAsync(id);
        }

        public async Task<IEnumerable<ExtraHour>> FindByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _extraHourRepository.FindByDateRangeAsync(startDate, endDate);
        }

        public async Task<IEnumerable<ExtraHour>> FindExtraHoursByIdAndDateRangeAsync(long employeeId, DateTime startDate, DateTime endDate)
        {
            return await _extraHourRepository.FindExtraHoursByIdAndDateRangeAsync(employeeId, startDate, endDate);
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

        public async Task<IEnumerable<ExtraHour>> GetAllAsync()
        {
            return await _extraHourRepository.FindAllAsync();
        }

        public async Task<ExtraHour?> GetExtraHourWithApproverDetailsAsync(long registry)
        {
            var extraHour = await _extraHourRepository.FindByRegistryAsync(registry);
            if (extraHour == null)
            {
                return null;
            }

            if (extraHour.ApprovedByManagerId.HasValue)
            {
                try
                {
                    // Obtener el manager directamente del repositorio de managers
                    var manager = await _managerRepository.GetByIdAsync(extraHour.ApprovedByManagerId.Value);
                    extraHour.ApprovedByManager = manager;
                }
                catch (InvalidOperationException)
                {
                    // Si no se encuentra el manager, dejar ApprovedByManager como nulo
                    extraHour.ApprovedByManager = null;
                }
            }

            return extraHour;
        }
    }
}