using ExtraHours.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using ExtraHours.API.Data;
using ExtraHours.API.Model;

namespace ExtraHours.API.Repositories.Implementations
{
    public class ManagerRepository : IManagerRepository
    {
        private readonly AppDbContext _context;

        public ManagerRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Manager?> GetByIdAsync(long id)
        {
            return await _context.managers
       .Where(m => m.manager_id == id)
       .FirstOrDefaultAsync();
        }

        public async Task<List<Manager>> GetAllAsync()
        {
            return await _context.managers.ToListAsync();
        }

        public async Task AddAsync(Manager manager)
        {
            await _context.managers.AddAsync(manager);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Manager manager)
        {
            _context.managers.Update(manager);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(long manager_id)
        {
            var manager = await _context.managers.FindAsync(manager_id);
            if (manager != null)
            {
                _context.managers.Remove(manager);
                await _context.SaveChangesAsync();
            }
        }
    }
}
