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
        public async Task<User?> FindByEmailAsync(string email)
        {
            return await _context.users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => EF.Functions.Like(u.email, email));
        }
        public async Task<User> GetUserByIdAsync(long userId)
        {
            return await _context.users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.id == userId)
                ?? throw new InvalidOperationException("User not found");
        }
        public async Task<List<User>> GetAllAsync()
        {
            return await _context.users.AsNoTracking().ToListAsync();
        }


        public async Task SaveAsync(User user)
        {
            _context.users.Add(user);
            await _context.SaveChangesAsync();
        }


        public async Task UpdateUserAsync(User user)
        {
            var existingUser = await _context.users.FindAsync(user.id);

            if (existingUser == null)
            {
                throw new InvalidOperationException("User not found");
            }

            existingUser.email = user.email;
            existingUser.name = user.name;
            existingUser.passwordHash = user.passwordHash;
            existingUser.role = user.role;
            existingUser.username = user.username;

            _context.Entry(existingUser).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteUserAsync(long userId)
        {
            var user = await _context.users.FindAsync(userId);
            if (user == null)
            {
                throw new InvalidOperationException("User not found");
            }

            _context.users.Remove(user);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _context.users.AnyAsync(u => u.email == email);
        }

    }
}
