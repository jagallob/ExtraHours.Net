using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExtraHours.API.Model
{
    [Table("employees")]
    public class Employee
    {
        [Key]
        [Column("id")]
        public long id { get; set; }

        [ForeignKey("id")]
        public User? User { get; set; }

        [Required]
        [MaxLength(100)]
        public string name { get; set; } = string.Empty;

        [MaxLength(50)]
        public string? position { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "El salario debe ser un valor positivo.")]
        public double? salary { get; set; }

        [Column("manager_id")]
        public long? manager_id { get; set; }

        [ForeignKey("manager_id")]
        public Manager? manager { get; set; }

    }
}
