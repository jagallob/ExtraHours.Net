using Microsoft.EntityFrameworkCore;
using ExtraHours.API.Model;    

namespace ExtraHours.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Employee> Employees { get; set; }
        public DbSet<ExtraHour> ExtraHours { get; set; }
        public DbSet<ExtraHoursConfig> ExtraHoursConfigs { get; set; }
        public DbSet<Manager> Managers { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Employee>()
                .HasOne(e => e.Manager)
                .WithMany()
                .HasForeignKey(e => e.ManagerId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<ExtraHoursConfig>().HasData(new ExtraHoursConfig { Id = 1 });

            base.OnModelCreating(modelBuilder);
        }

    }
}
