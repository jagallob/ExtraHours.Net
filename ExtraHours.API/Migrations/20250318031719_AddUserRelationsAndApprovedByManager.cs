using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ExtraHours.API.Migrations
{
    /// <inheritdoc />
    public partial class AddUserRelationsAndApprovedByManager : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<long>(
                name: "manager_id",
                table: "managers",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<long>(
                name: "approved_by_manager_id",
                table: "extra_hours",
                type: "bigint",
                nullable: true);

            migrationBuilder.AlterColumn<long>(
                name: "id",
                table: "employees",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.CreateIndex(
                name: "IX_extra_hours_approved_by_manager_id",
                table: "extra_hours",
                column: "approved_by_manager_id");

            migrationBuilder.AddForeignKey(
                name: "FK_employees_users_id",
                table: "employees",
                column: "id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_extra_hours_managers_approved_by_manager_id",
                table: "extra_hours",
                column: "approved_by_manager_id",
                principalTable: "managers",
                principalColumn: "manager_id");

            migrationBuilder.AddForeignKey(
                name: "FK_managers_users_manager_id",
                table: "managers",
                column: "manager_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_employees_users_id",
                table: "employees");

            migrationBuilder.DropForeignKey(
                name: "FK_extra_hours_managers_approved_by_manager_id",
                table: "extra_hours");

            migrationBuilder.DropForeignKey(
                name: "FK_managers_users_manager_id",
                table: "managers");

            migrationBuilder.DropIndex(
                name: "IX_extra_hours_approved_by_manager_id",
                table: "extra_hours");

            migrationBuilder.DropColumn(
                name: "approved_by_manager_id",
                table: "extra_hours");

            migrationBuilder.AlterColumn<long>(
                name: "manager_id",
                table: "managers",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<long>(
                name: "id",
                table: "employees",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);
        }
    }
}
