namespace ExtraHours.API.Service.Interface
{
    public interface IJWTTokenService
    {
        void InvalidateToken(string token);
        bool IsTokenInvalid(string token);
    }
}
