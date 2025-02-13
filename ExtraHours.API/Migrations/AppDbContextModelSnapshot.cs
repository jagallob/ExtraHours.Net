﻿// <auto-generated />
using System;
using ExtraHours.API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ExtraHours.API.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("ExtraHours.API.Model.Employee", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<long?>("ManagerId")
                        .HasColumnType("bigint")
                        .HasColumnName("manager_id");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Position")
                        .HasColumnType("text");

                    b.Property<double?>("Salary")
                        .HasColumnType("double precision");

                    b.HasKey("Id");

                    b.HasIndex("ManagerId");

                    b.ToTable("employees");
                });

            modelBuilder.Entity("ExtraHours.API.Model.ExtraHour", b =>
                {
                    b.Property<int>("Registry")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Registry"));

                    b.Property<bool>("Approved")
                        .HasColumnType("boolean");

                    b.Property<DateTime>("Date")
                        .HasColumnType("timestamp with time zone");

                    b.Property<double>("Diurnal")
                        .HasColumnType("double precision");

                    b.Property<double>("DiurnalHoliday")
                        .HasColumnType("double precision");

                    b.Property<TimeSpan>("EndTime")
                        .HasColumnType("interval");

                    b.Property<double>("ExtraHours")
                        .HasColumnType("double precision");

                    b.Property<long>("Id")
                        .HasColumnType("bigint");

                    b.Property<double>("Nocturnal")
                        .HasColumnType("double precision");

                    b.Property<double>("NocturnalHoliday")
                        .HasColumnType("double precision");

                    b.Property<string>("Observations")
                        .HasColumnType("text");

                    b.Property<TimeSpan>("StartTime")
                        .HasColumnType("interval");

                    b.HasKey("Registry");

                    b.ToTable("extra_hours");
                });

            modelBuilder.Entity("ExtraHours.API.Model.ExtraHoursConfig", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<TimeSpan>("DiurnalEnd")
                        .HasColumnType("interval");

                    b.Property<double>("DiurnalHolidayMultiplier")
                        .HasColumnType("double precision");

                    b.Property<double>("DiurnalMultiplier")
                        .HasColumnType("double precision");

                    b.Property<TimeSpan>("DiurnalStart")
                        .HasColumnType("interval");

                    b.Property<double>("NocturnalHolidayMultiplier")
                        .HasColumnType("double precision");

                    b.Property<double>("NocturnalMultiplier")
                        .HasColumnType("double precision");

                    b.Property<double>("WeeklyExtraHoursLimit")
                        .HasColumnType("double precision");

                    b.HasKey("Id");

                    b.ToTable("extra_hours_config");

                    b.HasData(
                        new
                        {
                            Id = 1L,
                            DiurnalEnd = new TimeSpan(0, 22, 0, 0, 0),
                            DiurnalHolidayMultiplier = 2.0,
                            DiurnalMultiplier = 1.25,
                            DiurnalStart = new TimeSpan(0, 6, 0, 0, 0),
                            NocturnalHolidayMultiplier = 2.5,
                            NocturnalMultiplier = 1.5,
                            WeeklyExtraHoursLimit = 12.0
                        });
                });

            modelBuilder.Entity("ExtraHours.API.Model.Manager", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasColumnName("manager_id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("manager_name");

                    b.HasKey("Id");

                    b.ToTable("managers");
                });

            modelBuilder.Entity("ExtraHours.API.Model.User", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("users");
                });

            modelBuilder.Entity("ExtraHours.API.Model.Employee", b =>
                {
                    b.HasOne("ExtraHours.API.Model.Manager", "Manager")
                        .WithMany()
                        .HasForeignKey("ManagerId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.Navigation("Manager");
                });
#pragma warning restore 612, 618
        }
    }
}
