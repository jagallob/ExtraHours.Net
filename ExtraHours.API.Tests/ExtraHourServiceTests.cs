using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ExtraHours.API.Model;
using ExtraHours.API.Service.Implementations;
using ExtraHours.API.Repositories.Interfaces;
using NSubstitute;
using Xunit;

namespace ExtraHours.API.Tests
{
    public class ExtraHourServiceTests
    {
        private readonly IExtraHourRepository _extraHourRepository;
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IManagerRepository _managerRepository;
        private readonly ExtraHourService _extraHourService;

        public ExtraHourServiceTests()
        {
            _extraHourRepository = Substitute.For<IExtraHourRepository>();
            _employeeRepository = Substitute.For<IEmployeeRepository>();
            _managerRepository = Substitute.For<IManagerRepository>();
            _extraHourService = new ExtraHourService(_extraHourRepository, _employeeRepository, _managerRepository);
        }

        /// <summary>
        /// Verifica que FindExtraHoursByIdAsync retorna la lista esperada.
        /// </summary>
        [Fact]
        public async Task FindExtraHoursByIdAsync_ReturnsList()
        {
            var expected = new List<ExtraHour> { new ExtraHour { registry = 1, id = 1 } };
            _extraHourRepository.FindExtraHoursByIdAsync(1).Returns(expected);
            var result = await _extraHourService.FindExtraHoursByIdAsync(1);
            Assert.Equal(expected, result);
        }

        /// <summary>
        /// Verifica que FindByDateRangeAsync retorna la lista esperada.
        /// </summary>
        [Fact]
        public async Task FindByDateRangeAsync_ReturnsList()
        {
            var expected = new List<ExtraHour> { new ExtraHour { registry = 2, id = 2 } };
            _extraHourRepository.FindByDateRangeAsync(Arg.Any<DateTime>(), Arg.Any<DateTime>()).Returns(expected);
            var result = await _extraHourService.FindByDateRangeAsync(DateTime.Now.AddDays(-1), DateTime.Now);
            Assert.Equal(expected, result);
        }

        /// <summary>
        /// Verifica que FindExtraHoursByIdAndDateRangeAsync retorna la lista esperada.
        /// </summary>
        [Fact]
        public async Task FindExtraHoursByIdAndDateRangeAsync_ReturnsList()
        {
            var expected = new List<ExtraHour> { new ExtraHour { registry = 3, id = 3 } };
            _extraHourRepository.FindExtraHoursByIdAndDateRangeAsync(3, Arg.Any<DateTime>(), Arg.Any<DateTime>()).Returns(expected);
            var result = await _extraHourService.FindExtraHoursByIdAndDateRangeAsync(3, DateTime.Now.AddDays(-2), DateTime.Now);
            Assert.Equal(expected, result);
        }

        /// <summary>
        /// Verifica que FindByRegistryAsync retorna el registro esperado.
        /// </summary>
        [Fact]
        public async Task FindByRegistryAsync_ReturnsExtraHour()
        {
            var extraHour = new ExtraHour { registry = 4, id = 4 };
            _extraHourRepository.FindByRegistryAsync(4).Returns(extraHour);
            var result = await _extraHourService.FindByRegistryAsync(4);
            Assert.Equal(extraHour, result);
        }

        /// <summary>
        /// Verifica que DeleteExtraHourByRegistryAsync retorna true si se elimina correctamente.
        /// </summary>
        [Fact]
        public async Task DeleteExtraHourByRegistryAsync_ReturnsTrue()
        {
            _extraHourRepository.DeleteByRegistryAsync(5).Returns(true);
            var result = await _extraHourService.DeleteExtraHourByRegistryAsync(5);
            Assert.True(result);
        }

        /// <summary>
        /// Verifica que AddExtraHourAsync retorna el registro agregado.
        /// </summary>
        [Fact]
        public async Task AddExtraHourAsync_ReturnsAdded()
        {
            var extraHour = new ExtraHour { registry = 6, id = 6 };
            _extraHourRepository.AddAsync(extraHour).Returns(extraHour);
            var result = await _extraHourService.AddExtraHourAsync(extraHour);
            Assert.Equal(extraHour, result);
        }

        /// <summary>
        /// Verifica que UpdateExtraHourAsync llama al repositorio.
        /// </summary>
        [Fact]
        public async Task UpdateExtraHourAsync_CallsRepository()
        {
            var extraHour = new ExtraHour { registry = 7, id = 7 };
            await _extraHourService.UpdateExtraHourAsync(extraHour);
            await _extraHourRepository.Received().UpdateAsync(extraHour);
        }

        /// <summary>
        /// Verifica que GetAllAsync retorna la lista de registros.
        /// </summary>
        [Fact]
        public async Task GetAllAsync_ReturnsList()
        {
            var expected = new List<ExtraHour> { new ExtraHour { registry = 8, id = 8 } };
            _extraHourRepository.FindAllAsync().Returns(expected);
            var result = await _extraHourService.GetAllAsync();
            Assert.Equal(expected, result);
        }

        /// <summary>
        /// Verifica que GetExtraHourWithApproverDetailsAsync retorna null si no existe el registro.
        /// </summary>
        [Fact]
        public async Task GetExtraHourWithApproverDetailsAsync_ReturnsNull_WhenNotFound()
        {
            _extraHourRepository.FindByRegistryAsync(9).Returns((ExtraHour)null);
            var result = await _extraHourService.GetExtraHourWithApproverDetailsAsync(9);
            Assert.Null(result);
        }

        /// <summary>
        /// Verifica que GetExtraHourWithApproverDetailsAsync retorna el registro con el manager si existe.
        /// </summary>
        [Fact]
        public async Task GetExtraHourWithApproverDetailsAsync_ReturnsWithManager()
        {
            var extraHour = new ExtraHour { registry = 10, id = 10, ApprovedByManagerId = 1 };
            var manager = new Manager { manager_id = 1 };
            _extraHourRepository.FindByRegistryAsync(10).Returns(extraHour);
            _managerRepository.GetByIdAsync(1).Returns(manager);
            var result = await _extraHourService.GetExtraHourWithApproverDetailsAsync(10);
            Assert.Equal(manager, result.ApprovedByManager);
        }
    }
}
