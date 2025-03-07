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
            return await _context.users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.email == email)
                ?? throw new InvalidOperationException("User not found");
        }

        public async Task SaveAsync(User user)
        {
            _context.users.Add(user);
            await _context.SaveChangesAsync();
        }

        public async Task<User?> FindByEmailAsync(string email)
        {
            return await _context.users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => EF.Functions.Like(u.email, email));
        }

        public async Task<User> GetUserByIdAsync(int userId)
        {
            return await _context.users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.id == userId)
                ?? throw new InvalidOperationException("User not found");
        }

        public async Task UpdateUserAsync(User user)
        {
            var existingUser = await _context.users.FindAsync(user.id);

            if (existingUser == null)
            {
                throw new InvalidOperationException("User not found");
            }

            existingUser.passwordHash = user.passwordHash;

            _context.Entry(existingUser).State = EntityState.Modified;

            await _context.SaveChangesAsync();
        }

    }
}
