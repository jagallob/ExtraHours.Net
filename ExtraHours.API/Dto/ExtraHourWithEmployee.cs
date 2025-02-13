using ExtraHours.API.Model;

namespace ExtraHours.API.Dto
{
    public class ExtraHourWithEmployee
    {
        public ExtraHour ExtraHour { get; set; }
        public Employee Employee { get; set; }

        public ExtraHourWithEmployee(ExtraHour extraHour, Employee employee)
        {
            ExtraHour = extraHour;
            Employee = employee;
        }
    }
}
