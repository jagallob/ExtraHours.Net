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

        public async Task<ExtraHoursConfig?> GetByIdAsync(long id)
        {
            return await _context.ExtraHoursConfigs.FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<ExtraHoursConfig> SaveAsync(ExtraHoursConfig config)
        {
            _context.ExtraHoursConfigs.Update(config);
            await _context.SaveChangesAsync();
            return config;
        }
    }
}
