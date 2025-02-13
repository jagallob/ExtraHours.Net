namespace ExtraHours.API.Dto
{
    public class EmployeeWithUserDTO
    {
        public long Id { get; set; }
        public string? Name { get; set; }
        public string? Position { get; set; }
        public double? Salary { get; set; }
        public long? ManagerId { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? Role { get; set; }
        public string? Username { get; set; }
    }
}
