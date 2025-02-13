using ExtraHours.API.Model;
using ExtraHours.API.Repositories.Interfaces;
using ExtraHours.API.Service.Interface;

namespace ExtraHours.API.Service.Implementations
{
    public class ExtraHoursConfigService : IExtraHoursConfigService
    {
        private readonly IExtraHoursConfigRepository _configRepository;

        public ExtraHoursConfigService(IExtraHoursConfigRepository configRepository)
        {
            _configRepository = configRepository;
        }

        public async Task<ExtraHoursConfig> GetConfigAsync()
        {
            var config = await _configRepository.GetByIdAsync(1L);
            if (config == null)
                throw new KeyNotFoundException("Configuración no encontrada");

            return config;
        }

        public async Task<ExtraHoursConfig> UpdateConfigAsync(ExtraHoursConfig config)
        {
            config.Id = 1L; // Asegurarse de que solo existe un registro
            return await _configRepository.SaveAsync(config);
        }
    }
}
