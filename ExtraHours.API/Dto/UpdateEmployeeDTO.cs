namespace ExtraHours.API.Dto
{
    public class UpdateEmployeeDTO
    {
        public string? Name { get; set; }
        public string? Position { get; set; }
        public double? Salary { get; set; }
        public long? ManagerId { get; set; }
        public string? ManagerName { get; set; }
        public string? Role { get; set; }
    }
}
