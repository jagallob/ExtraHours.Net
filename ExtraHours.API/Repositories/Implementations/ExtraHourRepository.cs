using ExtraHours.API.Data;
using ExtraHours.API.Model;
using Microsoft.EntityFrameworkCore;

namespace ExtraHours.API.Repositories.Implementations
{
    public class ExtraHourRepository
    {
        private readonly AppDbContext _context;
        public ExtraHourRepository(AppDbContext context) 
        {
            _context = context;
        }

        public async Task<List<ExtraHour>> FindExtraHoursByIdAsync(long id)
        {
            return await _context.ExtraHours.Where(e => e.Id == id).ToListAsync();
        }

        public async Task<List<ExtraHour>> FindByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _context.ExtraHours
                .Where(e => e.Date >= startDate && e.Date <= endDate)
                .ToListAsync();
        }

        public async Task<ExtraHour?> FindByRegistryAsync(long registry)
        {
            return await _context.ExtraHours.FirstOrDefaultAsync(e => e.Registry == registry);
        }

        public async Task<bool> DeleteByRegistryAsync(long registry)
        {
            var extraHour = await _context.ExtraHours.FirstOrDefaultAsync(e => e.Registry == registry);
            if (extraHour == null)
                return false;

            _context.ExtraHours.Remove(extraHour);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsByRegistryAsync(long registry)
        {
            return await _context.ExtraHours.AnyAsync(e => e.Registry == registry);
        }

        public async Task<ExtraHour> AddAsync(ExtraHour extraHour)
        {
            await _context.ExtraHours.AddAsync(extraHour);
            await _context.SaveChangesAsync();
            return extraHour;
        }

        public async Task UpdateAsync(ExtraHour extraHour)
        {
            _context.ExtraHours.Update(extraHour);
            await _context.SaveChangesAsync();
        }
    }
}
