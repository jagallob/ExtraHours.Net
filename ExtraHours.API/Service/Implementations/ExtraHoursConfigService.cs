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
            var config = await _configRepository.GetConfigAsync();
            if (config == null)
                throw new KeyNotFoundException("Configuración no encontrada");
            config.diurnalStart = TimeSpan.ParseExact(config.diurnalStart.ToString(@"hh\:mm"), @"hh\:mm", null);
            config.diurnalEnd = TimeSpan.ParseExact(config.diurnalEnd.ToString(@"hh\:mm"), @"hh\:mm", null);

            return config;
        }

        public async Task<ExtraHoursConfig> UpdateConfigAsync(ExtraHoursConfig config)
        {
            config.id = 1L; // Asegurarse de que solo existe un registro
            return await _configRepository.UpdateConfigAsync(config);
        }
    }
}
