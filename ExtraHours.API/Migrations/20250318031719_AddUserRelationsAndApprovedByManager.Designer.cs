﻿// <auto-generated />
using System;
using ExtraHours.API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ExtraHours.API.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20250318031719_AddUserRelationsAndApprovedByManager")]
    partial class AddUserRelationsAndApprovedByManager
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("ExtraHours.API.Model.Employee", b =>
                {
                    b.Property<long>("id")
                        .HasColumnType("bigint")
                        .HasColumnName("id");

                    b.Property<long?>("managerId")
                        .HasColumnType("bigint")
                        .HasColumnName("manager_id");

                    b.Property<string>("name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<string>("position")
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<double?>("salary")
                        .HasColumnType("double precision");

                    b.HasKey("id");

                    b.HasIndex("managerId");

                    b.ToTable("employees");
                });

            modelBuilder.Entity("ExtraHours.API.Model.ExtraHour", b =>
                {
                    b.Property<int>("registry")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("registry"));

                    b.Property<long?>("ApprovedByManagerId")
                        .HasColumnType("bigint")
                        .HasColumnName("approved_by_manager_id");

                    b.Property<bool>("approved")
                        .HasColumnType("boolean");

                    b.Property<DateTime>("date")
                        .HasColumnType("timestamp with time zone");

                    b.Property<double>("diurnal")
                        .HasColumnType("double precision");

                    b.Property<double>("diurnalHoliday")
                        .HasColumnType("double precision");

                    b.Property<TimeSpan>("endTime")
                        .HasColumnType("interval");

                    b.Property<double>("extraHours")
                        .HasColumnType("double precision");

                    b.Property<long>("id")
                        .HasColumnType("bigint");

                    b.Property<double>("nocturnal")
                        .HasColumnType("double precision");

                    b.Property<double>("nocturnalHoliday")
                        .HasColumnType("double precision");

                    b.Property<string>("observations")
                        .HasColumnType("text");

                    b.Property<TimeSpan>("startTime")
                        .HasColumnType("interval");

                    b.HasKey("registry");

                    b.HasIndex("ApprovedByManagerId");

                    b.HasIndex("id");

                    b.ToTable("extra_hours");
                });

            modelBuilder.Entity("ExtraHours.API.Model.ExtraHoursConfig", b =>
                {
                    b.Property<long>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("id"));

                    b.Property<TimeSpan>("diurnalEnd")
                        .HasColumnType("time")
                        .HasColumnName("diurnalEnd");

                    b.Property<double>("diurnalHolidayMultiplier")
                        .HasColumnType("double precision")
                        .HasColumnName("diurnalHolidayMultiplier");

                    b.Property<double>("diurnalMultiplier")
                        .HasColumnType("double precision")
                        .HasColumnName("diurnalMultiplier");

                    b.Property<TimeSpan>("diurnalStart")
                        .HasColumnType("time")
                        .HasColumnName("diurnalStart");

                    b.Property<double>("nocturnalHolidayMultiplier")
                        .HasColumnType("double precision")
                        .HasColumnName("nocturnalHolidayMultiplier");

                    b.Property<double>("nocturnalMultiplier")
                        .HasColumnType("double precision")
                        .HasColumnName("nocturnalMultiplier");

                    b.Property<double>("weeklyExtraHoursLimit")
                        .HasColumnType("double precision")
                        .HasColumnName("weeklyExtraHoursLimit");

                    b.HasKey("id");

                    b.ToTable("extra_hours_config");

                    b.HasData(
                        new
                        {
                            id = 1L,
                            diurnalEnd = new TimeSpan(0, 0, 0, 0, 0),
                            diurnalHolidayMultiplier = 0.0,
                            diurnalMultiplier = 0.0,
                            diurnalStart = new TimeSpan(0, 0, 0, 0, 0),
                            nocturnalHolidayMultiplier = 0.0,
                            nocturnalMultiplier = 0.0,
                            weeklyExtraHoursLimit = 0.0
                        });
                });

            modelBuilder.Entity("ExtraHours.API.Model.Manager", b =>
                {
                    b.Property<long>("id")
                        .HasColumnType("bigint")
                        .HasColumnName("manager_id");

                    b.Property<string>("name")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("manager_name");

                    b.HasKey("id");

                    b.ToTable("managers");
                });

            modelBuilder.Entity("ExtraHours.API.Model.User", b =>
                {
                    b.Property<long>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("id"));

                    b.Property<string>("email")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("email");

                    b.Property<string>("name")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("name");

                    b.Property<string>("passwordHash")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("password");

                    b.Property<string>("role")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("role");

                    b.Property<string>("username")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("username");

                    b.HasKey("id");

                    b.ToTable("users");
                });

            modelBuilder.Entity("ExtraHours.API.Model.Employee", b =>
                {
                    b.HasOne("ExtraHours.API.Model.User", "User")
                        .WithMany()
                        .HasForeignKey("id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ExtraHours.API.Model.Manager", "manager")
                        .WithMany()
                        .HasForeignKey("managerId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.Navigation("User");

                    b.Navigation("manager");
                });

            modelBuilder.Entity("ExtraHours.API.Model.ExtraHour", b =>
                {
                    b.HasOne("ExtraHours.API.Model.Manager", "ApprovedByManager")
                        .WithMany()
                        .HasForeignKey("ApprovedByManagerId");

                    b.HasOne("ExtraHours.API.Model.Employee", "employee")
                        .WithMany()
                        .HasForeignKey("id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("ApprovedByManager");

                    b.Navigation("employee");
                });

            modelBuilder.Entity("ExtraHours.API.Model.Manager", b =>
                {
                    b.HasOne("ExtraHours.API.Model.User", "User")
                        .WithMany()
                        .HasForeignKey("id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });
#pragma warning restore 612, 618
        }
    }
}
