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
            return await _context.Managers.FindAsync(id) ?? throw new InvalidOperationException("Manager not found");
        }

        public async Task<List<Manager>> GetAllAsync()
        {
            return await _context.Managers.ToListAsync();
        }

        public async Task AddAsync(Manager manager)
        {
            await _context.Managers.AddAsync(manager);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Manager manager)
        {
            _context.Managers.Update(manager);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(long id)
        {
            var manager = await _context.Managers.FindAsync(id);
            if (manager != null)
            {
                _context.Managers.Remove(manager);
                await _context.SaveChangesAsync();
            }
        }
    }
}
