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
                name: "extra_hours_config",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    weeklyExtraHoursLimit = table.Column<double>(type: "double precision", nullable: false),
                    diurnalMultiplier = table.Column<double>(type: "double precision", nullable: false),
                    nocturnalMultiplier = table.Column<double>(type: "double precision", nullable: false),
                    diurnalHolidayMultiplier = table.Column<double>(type: "double precision", nullable: false),
                    nocturnalHolidayMultiplier = table.Column<double>(type: "double precision", nullable: false),
                    diurnalStart = table.Column<TimeSpan>(type: "time", nullable: false),
                    diurnalEnd = table.Column<TimeSpan>(type: "time", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_extra_hours_config", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    email = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    password = table.Column<string>(type: "text", nullable: false),
                    role = table.Column<string>(type: "text", nullable: false),
                    username = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "managers",
                columns: table => new
                {
                    manager_id = table.Column<long>(type: "bigint", nullable: false),
                    manager_name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_managers", x => x.manager_id);
                    table.ForeignKey(
                        name: "FK_managers_users_manager_id",
                        column: x => x.manager_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "employees",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    position = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    salary = table.Column<double>(type: "double precision", nullable: true),
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
                    table.ForeignKey(
                        name: "FK_employees_users_id",
                        column: x => x.id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "extra_hours",
                columns: table => new
                {
                    registry = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id = table.Column<long>(type: "bigint", nullable: false),
                    date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    startTime = table.Column<TimeSpan>(type: "interval", nullable: false),
                    endTime = table.Column<TimeSpan>(type: "interval", nullable: false),
                    diurnal = table.Column<double>(type: "double precision", nullable: false),
                    nocturnal = table.Column<double>(type: "double precision", nullable: false),
                    diurnalHoliday = table.Column<double>(type: "double precision", nullable: false),
                    nocturnalHoliday = table.Column<double>(type: "double precision", nullable: false),
                    extraHours = table.Column<double>(type: "double precision", nullable: false),
                    observations = table.Column<string>(type: "text", nullable: true),
                    approved = table.Column<bool>(type: "boolean", nullable: false),
                    approved_by_manager_id = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_extra_hours", x => x.registry);
                    table.ForeignKey(
                        name: "FK_extra_hours_employees_id",
                        column: x => x.id,
                        principalTable: "employees",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_extra_hours_managers_approved_by_manager_id",
                        column: x => x.approved_by_manager_id,
                        principalTable: "managers",
                        principalColumn: "manager_id");
                });

            migrationBuilder.InsertData(
                table: "extra_hours_config",
                columns: new[] { "id", "diurnalEnd", "diurnalHolidayMultiplier", "diurnalMultiplier", "diurnalStart", "nocturnalHolidayMultiplier", "nocturnalMultiplier", "weeklyExtraHoursLimit" },
                values: new object[] { 1L, new TimeSpan(0, 0, 0, 0, 0), 0.0, 0.0, new TimeSpan(0, 0, 0, 0, 0), 0.0, 0.0, 0.0 });

            migrationBuilder.CreateIndex(
                name: "IX_employees_manager_id",
                table: "employees",
                column: "manager_id");

            migrationBuilder.CreateIndex(
                name: "IX_extra_hours_approved_by_manager_id",
                table: "extra_hours",
                column: "approved_by_manager_id");

            migrationBuilder.CreateIndex(
                name: "IX_extra_hours_id",
                table: "extra_hours",
                column: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "extra_hours");

            migrationBuilder.DropTable(
                name: "extra_hours_config");

            migrationBuilder.DropTable(
                name: "employees");

            migrationBuilder.DropTable(
                name: "managers");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
