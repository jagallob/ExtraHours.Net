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

        public async Task<Manager> GetByIdAsync(long id)
        {
            return await _context.managers.FindAsync(id) ?? throw new InvalidOperationException("Manager not found");
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

        public async Task DeleteAsync(long id)
        {
            var manager = await _context.managers.FindAsync(id);
            if (manager != null)
            {
                _context.managers.Remove(manager);
                await _context.SaveChangesAsync();
            }
        }
    }
}
