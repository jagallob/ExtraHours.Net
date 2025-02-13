using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExtraHours.API.Model
{
    [Table("extra_hours_config")]
    public class ExtraHoursConfig
    {
        [Key]
        public long Id { get; set; } = 1;

        public double WeeklyExtraHoursLimit { get; set; } = 12;
        public double DiurnalMultiplier { get; set; } = 1.25;
        public double NocturnalMultiplier { get; set; } = 1.5;
        public double DiurnalHolidayMultiplier { get; set; } = 2;
        public double NocturnalHolidayMultiplier { get; set; } = 2.5;
        public TimeSpan DiurnalStart { get; set; } = new TimeSpan(6, 0, 0);
        public TimeSpan DiurnalEnd { get; set; } = new TimeSpan(22, 0, 0);
    }
}
