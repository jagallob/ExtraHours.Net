namespace ExtraHours.API.Model
{
    public class ChangePasswordRequest
    {
        public required string CurrentPassword { get; set; }
        public required string NewPassword { get; set; }
    }

    public class ChangePasswordAdmin
    {
        public required long id { get; set; }
        public required string NewPassword { get; set; }
    }
}
