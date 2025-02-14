namespace ExtraHours.API.Dto
{
    public class ChangePasswordRequest
    {
        public long Id { get; set; }
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
