using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ExtraHours.API.Model
{
    [Table("managers")]
    public class Manager
    {
        [Key]
        [Column("manager_id")]
        public long Id { get; set; }

        [Required]
        [Column("manager_name")]
        public string Name { get; set; } = string.Empty;
    }
}
