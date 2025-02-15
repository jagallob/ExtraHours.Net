using ExtraHours.API.Data;
using ExtraHours.API.Model;
using ExtraHours.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ExtraHours.API.Repositories.Implementations
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Email == email)
                ?? throw new InvalidOperationException("User not found");
        }

        public async Task SaveAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        public async Task<User?> FindByEmailAsync(string email)
        {
            return await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => EF.Functions.Like(u.Email, email));
        }
    }
}
