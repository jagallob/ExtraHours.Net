using ExtraHours.API.Data;
using ExtraHours.API.Model;
using ExtraHours.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ExtraHours.API.Repositories.Implementations
{
    public class UsersRepository : IUsersRepository
    {
        private readonly AppDbContext _context;

        public UsersRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User?> FindByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> FindByIdAsync(long id)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
        }

        public Task SaveAsync(User user)
        {
            throw new NotImplementedException();
        }
    }
}
