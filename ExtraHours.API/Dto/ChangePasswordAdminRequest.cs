namespace ExtraHours.API.Dto
{
    public class ChangePasswordAdminRequest
    {
        public required long id { get; set; }
        public required string NewPassword { get; set; }
    }
}
