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
        public long manager_id { get; set; }

        [ForeignKey("manager_id")]
        public User? User { get; set; }

        [Required]
        [Column("manager_name")]
        public string manager_name { get; set; } = string.Empty;
    }
}
