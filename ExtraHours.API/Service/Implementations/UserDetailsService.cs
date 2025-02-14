using ExtraHours.API.Model;
using ExtraHours.API.Repositories.Interfaces;
using ExtraHours.API.Service.Interface;

namespace ExtraHours.API.Service.Implementations
{
    public class UserDetailsService : IUserDetailsService
    {
        private readonly IUsersRepository _usersRepository;

        public UserDetailsService(IUsersRepository usersRepository)
        {
            _usersRepository = usersRepository;
        }

        public async Task<User?> LoadUserByUsernameAsync(string username)
        {
            return await _usersRepository.FindByEmailAsync(username);
        }
    }
}
