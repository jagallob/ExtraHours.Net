using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExtraHours.API.Model
{
    [Table("extra_hours_config")]
    public class ExtraHoursConfig
    {
        [Key]
        [Column("id")]
        public long id { get; set; }

        [Required]
        [Column("weeklyExtraHoursLimit")]
        public double weeklyExtraHoursLimit { get; set; }

        [Required]
        [Column("diurnalMultiplier")]
        public double diurnalMultiplier { get; set; }

        [Required]
        [Column("nocturnalMultiplier")]
        public double nocturnalMultiplier { get; set; }

        [Required]
        [Column("diurnalHolidayMultiplier")]
        public double diurnalHolidayMultiplier { get; set; }

        [Required]
        [Column("nocturnalHolidayMultiplier")]
        public double nocturnalHolidayMultiplier { get; set; }

        [Required]
        [Column("diurnalStart", TypeName = "time")]
        public TimeSpan diurnalStart { get; set; }

        [Required]
        [Column("diurnalEnd", TypeName = "time")]
        public TimeSpan diurnalEnd { get; set; }
    }
}
