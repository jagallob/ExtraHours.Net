using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ExtraHours.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "extra_hours",
                columns: table => new
                {
                    Registry = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Id = table.Column<long>(type: "bigint", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    StartTime = table.Column<TimeSpan>(type: "interval", nullable: false),
                    EndTime = table.Column<TimeSpan>(type: "interval", nullable: false),
                    Diurnal = table.Column<double>(type: "double precision", nullable: false),
                    Nocturnal = table.Column<double>(type: "double precision", nullable: false),
                    DiurnalHoliday = table.Column<double>(type: "double precision", nullable: false),
                    NocturnalHoliday = table.Column<double>(type: "double precision", nullable: false),
                    ExtraHours = table.Column<double>(type: "double precision", nullable: false),
                    Observations = table.Column<string>(type: "text", nullable: true),
                    Approved = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_extra_hours", x => x.Registry);
                });

            migrationBuilder.CreateTable(
                name: "extra_hours_config",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    WeeklyExtraHoursLimit = table.Column<double>(type: "double precision", nullable: false),
                    DiurnalMultiplier = table.Column<double>(type: "double precision", nullable: false),
                    NocturnalMultiplier = table.Column<double>(type: "double precision", nullable: false),
                    DiurnalHolidayMultiplier = table.Column<double>(type: "double precision", nullable: false),
                    NocturnalHolidayMultiplier = table.Column<double>(type: "double precision", nullable: false),
                    DiurnalStart = table.Column<TimeSpan>(type: "interval", nullable: false),
                    DiurnalEnd = table.Column<TimeSpan>(type: "interval", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_extra_hours_config", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "managers",
                columns: table => new
                {
                    manager_id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    manager_name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_managers", x => x.manager_id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Email = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Password = table.Column<string>(type: "text", nullable: false),
                    Role = table.Column<string>(type: "text", nullable: false),
                    Username = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "employees",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Position = table.Column<string>(type: "text", nullable: true),
                    Salary = table.Column<double>(type: "double precision", nullable: true),
                    manager_id = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_employees", x => x.id);
                    table.ForeignKey(
                        name: "FK_employees_managers_manager_id",
                        column: x => x.manager_id,
                        principalTable: "managers",
                        principalColumn: "manager_id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.InsertData(
                table: "extra_hours_config",
                columns: new[] { "Id", "DiurnalEnd", "DiurnalHolidayMultiplier", "DiurnalMultiplier", "DiurnalStart", "NocturnalHolidayMultiplier", "NocturnalMultiplier", "WeeklyExtraHoursLimit" },
                values: new object[] { 1L, new TimeSpan(0, 22, 0, 0, 0), 2.0, 1.25, new TimeSpan(0, 6, 0, 0, 0), 2.5, 1.5, 12.0 });

            migrationBuilder.CreateIndex(
                name: "IX_employees_manager_id",
                table: "employees",
                column: "manager_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "employees");

            migrationBuilder.DropTable(
                name: "extra_hours");

            migrationBuilder.DropTable(
                name: "extra_hours_config");

            migrationBuilder.DropTable(
                name: "users");

            migrationBuilder.DropTable(
                name: "managers");
        }
    }
}
