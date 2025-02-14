using ExtraHours.API.Dto;
using ExtraHours.API.Model;

namespace ExtraHours.API.Service.Interface
{
    public interface IUsersManagementService
    {
        Task<ReqRes> RegisterAsync(ReqRes registrationRequest);
        Task<ReqRes> LoginAsync(ReqRes loginRequest);
        Task ChangePasswordAsync(ChangePasswordRequest request);
        Task<ReqRes> RefreshTokenAsync(ReqRes refreshTokenRequest);
        Task<ReqRes> GetAllUsersAsync();
        Task<ReqRes> GetUsersByIdAsync(long id);
        Task<ReqRes> DeleteUserAsync(long userId);
        Task<ReqRes> UpdateUserAsync(long userId, User updatedUser);
        Task<ReqRes> GetMyInfoAsync(string email);
    }
}
