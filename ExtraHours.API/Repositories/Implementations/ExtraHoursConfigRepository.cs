using ExtraHours.API.Data;
using ExtraHours.API.Model;
using ExtraHours.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ExtraHours.API.Repositories.Implementations
{
    public class ExtraHoursConfigRepository : IExtraHoursConfigRepository
    {
        private readonly AppDbContext _context;

        public ExtraHoursConfigRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ExtraHoursConfig?> GetConfigAsync()
        {
            return await _context.extraHoursConfigs.FirstOrDefaultAsync();
        }

        public async Task<ExtraHoursConfig> UpdateConfigAsync(ExtraHoursConfig config)
        {
            _context.extraHoursConfigs.Update(config);
            await _context.SaveChangesAsync();
            return config;
        }
    }
}
