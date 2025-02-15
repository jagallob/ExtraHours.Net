using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExtraHours.API.Model
{
    [Table("users")]
    public class User
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Required, EmailAddress]
        [Column("email")]
        public string Email { get; set; } = string.Empty;

        [Required]
        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Column("password")]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [Column("role")]
        public string Role { get; set; } = string.Empty;

        [Required]
        [Column("username")]
        public string Username { get; set; } = string.Empty;
    }
}
