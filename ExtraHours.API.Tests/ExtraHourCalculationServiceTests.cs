using ExtraHours.API.Model;
using ExtraHours.API.Service.Interface;
using ExtraHours.API.Service.Implementations;
using NSubstitute;
using NSubstitute.ExceptionExtensions;

namespace ExtraHours.API.Tests
{
    public class ExtraHourCalculationServiceTests
    {
        private readonly IExtraHourCalculationService _extraHourCalculationService;
        private readonly IExtraHoursConfigService _configService;

        public ExtraHourCalculationServiceTests()
        {
            _configService = Substitute.For<IExtraHoursConfigService>();
            _extraHourCalculationService = new ExtraHourCalculationService(_configService);
        }

        private ExtraHoursConfig GetDefaultConfig()
        {
            return new ExtraHoursConfig
            {
                id = 1,
                weeklyExtraHoursLimit = 48.0,
                diurnalMultiplier = 1.25,
                nocturnalMultiplier = 1.75,
                diurnalHolidayMultiplier = 2.0,
                nocturnalHolidayMultiplier = 2.5,
                diurnalStart = new TimeSpan(6, 0, 0), // 6:00 AM
                diurnalEnd = new TimeSpan(22, 0, 0)   // 10:00 PM
            };
        }

        [Fact]
        public async Task DetermineExtraHourTypeAsync_DiurnalHours_WorkingDay()
        {
            // Arrange
            var config = GetDefaultConfig();
            _configService.GetConfigAsync().Returns(Task.FromResult(config));

            var date = new DateTime(2025, 6, 13); // Viernes (día laboral)
            var startTime = new TimeSpan(8, 0, 0); // 8:00 AM
            var endTime = new TimeSpan(12, 0, 0);   // 12:00 PM

            // Act
            var result = await _extraHourCalculationService.DetermineExtraHourTypeAsync(date, startTime, endTime);

            // Assert
            Assert.Equal(4.0, result.diurnal);
            Assert.Equal(0.0, result.nocturnal);
            Assert.Equal(0.0, result.diurnalHoliday);
            Assert.Equal(0.0, result.nocturnalHoliday);
            Assert.Equal(4.0, result.extraHours);
        }

        [Fact]
        public async Task DetermineExtraHourTypeAsync_NocturnalHours_WorkingDay()
        {
            // Arrange
            var config = GetDefaultConfig();
            _configService.GetConfigAsync().Returns(Task.FromResult(config));

            var date = new DateTime(2025, 6, 13); // Viernes (día laboral)
            var startTime = new TimeSpan(23, 0, 0); // 11:00 PM
            var endTime = new TimeSpan(2, 0, 0);    // 2:00 AM (día siguiente)

            // Act
            // Primer tramo: 23:00 a 23:59:59 del primer día
            var result1 = await _extraHourCalculationService.DetermineExtraHourTypeAsync(date, startTime, new TimeSpan(23, 59, 59));
            // Segundo tramo: 00:00 a 2:00 del día siguiente
            var result2 = await _extraHourCalculationService.DetermineExtraHourTypeAsync(date.AddDays(1), new TimeSpan(0, 0, 0), endTime);

            // Sumar resultados
            var diurnal = result1.diurnal + result2.diurnal;
            var nocturnal = result1.nocturnal + result2.nocturnal;
            var diurnalHoliday = result1.diurnalHoliday + result2.diurnalHoliday;
            var nocturnalHoliday = result1.nocturnalHoliday + result2.nocturnalHoliday;
            var extraHours = result1.extraHours + result2.extraHours;

            // Assert
            Assert.Equal(0.0, diurnal);
            Assert.Equal(3.0, nocturnal, 1); // 1 hora + 2 horas
            Assert.Equal(0.0, diurnalHoliday);
            Assert.Equal(0.0, nocturnalHoliday);
            Assert.Equal(3.0, extraHours, 1);
        }

        [Fact]
        public async Task DetermineExtraHourTypeAsync_DiurnalHours_Sunday()
        {
            // Arrange
            var config = GetDefaultConfig();
            _configService.GetConfigAsync().Returns(Task.FromResult(config));

            var date = new DateTime(2025, 6, 15); // Domingo (festivo)
            var startTime = new TimeSpan(8, 0, 0); // 8:00 AM
            var endTime = new TimeSpan(12, 0, 0);   // 12:00 PM

            // Act
            var result = await _extraHourCalculationService.DetermineExtraHourTypeAsync(date, startTime, endTime);

            // Assert
            Assert.Equal(0.0, result.diurnal);
            Assert.Equal(0.0, result.nocturnal);
            Assert.Equal(4.0, result.diurnalHoliday);
            Assert.Equal(0.0, result.nocturnalHoliday);
            Assert.Equal(4.0, result.extraHours);
        }

        [Fact]
        public async Task DetermineExtraHourTypeAsync_NocturnalHours_Sunday()
        {
            // Arrange
            var config = GetDefaultConfig();
            _configService.GetConfigAsync().Returns(Task.FromResult(config));

            var date = new DateTime(2025, 6, 15); // Domingo (festivo)
            var startTime = new TimeSpan(23, 0, 0); // 11:00 PM
            var endTime = new TimeSpan(2, 0, 0);    // 2:00 AM (día siguiente)

            // Act
            // Primer tramo: 23:00 a 23:59:59 del domingo (festivo)
            var result1 = await _extraHourCalculationService.DetermineExtraHourTypeAsync(date, startTime, new TimeSpan(23, 59, 59));
            // Segundo tramo: 00:00 a 2:00 del lunes (no festivo)
            var result2 = await _extraHourCalculationService.DetermineExtraHourTypeAsync(date.AddDays(1), new TimeSpan(0, 0, 0), endTime);

            // Assert
            // Domingo: 1 hora nocturnalHoliday, Lunes: 2 horas nocturnal (no festivo)
            Assert.Equal(0.0, result1.diurnal);
            Assert.Equal(0.0, result1.nocturnal);
            Assert.Equal(0.0, result1.diurnalHoliday);
            Assert.Equal(1.0, result1.nocturnalHoliday, 1);
            Assert.Equal(1.0, result1.extraHours, 1);

            Assert.Equal(0.0, result2.diurnal);
            Assert.Equal(2.0, result2.nocturnal, 1);
            Assert.Equal(0.0, result2.diurnalHoliday);
            Assert.Equal(0.0, result2.nocturnalHoliday);
            Assert.Equal(2.0, result2.extraHours, 1);
        }

        [Fact]
        public async Task DetermineExtraHourTypeAsync_MixedHours_DiurnalToNocturnal()
        {
            // Arrange
            var config = GetDefaultConfig();
            _configService.GetConfigAsync().Returns(Task.FromResult(config));

            var date = new DateTime(2025, 6, 13); // Viernes (día laboral)
            var startTime = new TimeSpan(20, 0, 0); // 8:00 PM
            var endTime = new TimeSpan(2, 0, 0);    // 2:00 AM (día siguiente)

            // Act
            // Primer tramo: 20:00 a 23:59:59 del primer día
            var result1 = await _extraHourCalculationService.DetermineExtraHourTypeAsync(date, startTime, new TimeSpan(23, 59, 59));
            // Segundo tramo: 00:00 a 2:00 del día siguiente
            var result2 = await _extraHourCalculationService.DetermineExtraHourTypeAsync(date.AddDays(1), new TimeSpan(0, 0, 0), endTime);

            // Sumar resultados
            var diurnal = result1.diurnal + result2.diurnal;
            var nocturnal = result1.nocturnal + result2.nocturnal;
            var diurnalHoliday = result1.diurnalHoliday + result2.diurnalHoliday;
            var nocturnalHoliday = result1.nocturnalHoliday + result2.nocturnalHoliday;
            var extraHours = result1.extraHours + result2.extraHours;

            // Assert
            Assert.Equal(2.0, diurnal, 1); // 20:00-22:00
            Assert.Equal(4.0, nocturnal, 1); // 22:00-2:00
            Assert.Equal(0.0, diurnalHoliday);
            Assert.Equal(0.0, nocturnalHoliday);
            Assert.Equal(6.0, extraHours, 1);
        }

        [Fact]
        public async Task DetermineExtraHourTypeAsync_MixedHours_NocturnalToDiurnal()
        {
            // Arrange
            var config = GetDefaultConfig();
            _configService.GetConfigAsync().Returns(Task.FromResult(config));

            var date = new DateTime(2025, 6, 13); // Viernes (día laboral)
            var startTime = new TimeSpan(4, 0, 0); // 4:00 AM
            var endTime = new TimeSpan(8, 0, 0);   // 8:00 AM

            // Act
            var result = await _extraHourCalculationService.DetermineExtraHourTypeAsync(date, startTime, endTime);

            // Assert
            Assert.Equal(2.0, result.diurnal); // 6:00 AM - 8:00 AM
            Assert.Equal(2.0, result.nocturnal); // 4:00 AM - 6:00 AM
            Assert.Equal(0.0, result.diurnalHoliday);
            Assert.Equal(0.0, result.nocturnalHoliday);
            Assert.Equal(4.0, result.extraHours);
        }

        [Fact]
        public async Task DetermineExtraHourTypeAsync_ThrowsException_WhenConfigIsNull()
        {
            // Arrange
            _configService.GetConfigAsync().Returns(Task.FromResult<ExtraHoursConfig>(null));

            var date = new DateTime(2025, 6, 13);
            var startTime = new TimeSpan(8, 0, 0);
            var endTime = new TimeSpan(12, 0, 0);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<InvalidOperationException>(
                () => _extraHourCalculationService.DetermineExtraHourTypeAsync(date, startTime, endTime)
            );

            Assert.Equal("La configuración aún no está completamente cargada.", exception.Message);
        }

        [Fact]
        public async Task DetermineExtraHourTypeAsync_ThrowsException_WhenEndTimeBeforeStartTime()
        {
            // Arrange
            var config = GetDefaultConfig();
            _configService.GetConfigAsync().Returns(Task.FromResult(config));

            var date = new DateTime(2025, 6, 13);
            var startTime = new TimeSpan(12, 0, 0); // 12:00 PM
            var endTime = new TimeSpan(8, 0, 0);    // 8:00 AM (antes que start)

            // Act & Assert
            var exception = await Assert.ThrowsAsync<InvalidOperationException>(
                () => _extraHourCalculationService.DetermineExtraHourTypeAsync(date, startTime, endTime)
            );

            Assert.Equal("La hora de fin debe ser posterior a la hora de inicio.", exception.Message);
        }

        [Fact]
        public async Task DetermineExtraHourTypeAsync_ConfigServiceThrowsException()
        {
            // Arrange
            _configService.GetConfigAsync().Throws(new Exception("Error al obtener configuración"));

            var date = new DateTime(2025, 6, 13);
            var startTime = new TimeSpan(8, 0, 0);
            var endTime = new TimeSpan(12, 0, 0);

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(
                () => _extraHourCalculationService.DetermineExtraHourTypeAsync(date, startTime, endTime)
            );
        }

        [Fact]
        public async Task DetermineExtraHourTypeAsync_ColombianFixedHoliday_NewYear()
        {
            // Arrange
            var config = GetDefaultConfig();
            _configService.GetConfigAsync().Returns(Task.FromResult(config));

            var date = new DateTime(2025, 1, 1); // Año Nuevo (festivo fijo)
            var startTime = new TimeSpan(8, 0, 0); // 8:00 AM
            var endTime = new TimeSpan(12, 0, 0);   // 12:00 PM

            // Act
            var result = await _extraHourCalculationService.DetermineExtraHourTypeAsync(date, startTime, endTime);

            // Assert
            Assert.Equal(0.0, result.diurnal);
            Assert.Equal(0.0, result.nocturnal);
            Assert.Equal(4.0, result.diurnalHoliday);
            Assert.Equal(0.0, result.nocturnalHoliday);
            Assert.Equal(4.0, result.extraHours);
        }

        [Fact]
        public async Task DetermineExtraHourTypeAsync_ColombianFixedHoliday_Christmas()
        {
            // Arrange
            var config = GetDefaultConfig();
            _configService.GetConfigAsync().Returns(Task.FromResult(config));

            var date = new DateTime(2025, 12, 25); // Navidad (festivo fijo)
            var startTime = new TimeSpan(23, 0, 0); // 11:00 PM
            var endTime = new TimeSpan(2, 0, 0);    // 2:00 AM (día siguiente)

            // Act
            // Primer tramo: 23:00 a 23:59:59 del 25 (festivo)
            var result1 = await _extraHourCalculationService.DetermineExtraHourTypeAsync(date, startTime, new TimeSpan(23, 59, 59));
            // Segundo tramo: 00:00 a 2:00 del 26 (no festivo)
            var result2 = await _extraHourCalculationService.DetermineExtraHourTypeAsync(date.AddDays(1), new TimeSpan(0, 0, 0), endTime);

            // Assert
            // Navidad: 1 hora nocturnalHoliday, 26 dic: 2 horas nocturnal (no festivo)
            Assert.Equal(0.0, result1.diurnal);
            Assert.Equal(0.0, result1.nocturnal);
            Assert.Equal(0.0, result1.diurnalHoliday);
            Assert.Equal(1.0, result1.nocturnalHoliday, 1);
            Assert.Equal(1.0, result1.extraHours, 1);

            Assert.Equal(0.0, result2.diurnal);
            Assert.Equal(2.0, result2.nocturnal, 1);
            Assert.Equal(0.0, result2.diurnalHoliday);
            Assert.Equal(0.0, result2.nocturnalHoliday);
            Assert.Equal(2.0, result2.extraHours, 1);
        }

        [Fact]
        public async Task DetermineExtraHourTypeAsync_FractionalHours()
        {
            // Arrange
            var config = GetDefaultConfig();
            _configService.GetConfigAsync().Returns(Task.FromResult(config));

            var date = new DateTime(2025, 6, 13); // Viernes (día laboral)
            var startTime = new TimeSpan(8, 30, 0); // 8:30 AM
            var endTime = new TimeSpan(11, 15, 0);   // 11:15 AM

            // Act
            var result = await _extraHourCalculationService.DetermineExtraHourTypeAsync(date, startTime, endTime);

            // Assert
            Assert.Equal(2.75, result.diurnal); // 2 horas y 45 minutos
            Assert.Equal(0.0, result.nocturnal);
            Assert.Equal(0.0, result.diurnalHoliday);
            Assert.Equal(0.0, result.nocturnalHoliday);
            Assert.Equal(2.75, result.extraHours);
        }

        [Fact]
        public async Task DetermineExtraHourTypeAsync_EdgeCase_StartAtDiurnalEnd()
        {
            // Arrange
            var config = GetDefaultConfig();
            _configService.GetConfigAsync().Returns(Task.FromResult(config));

            var date = new DateTime(2025, 6, 13); // Viernes (día laboral)
            var startTime = new TimeSpan(22, 0, 0); // 10:00 PM (exactamente al final del periodo diurno)
            var endTime = new TimeSpan(23, 0, 0);   // 11:00 PM

            // Act
            var result = await _extraHourCalculationService.DetermineExtraHourTypeAsync(date, startTime, endTime);

            // Assert
            Assert.Equal(0.0, result.diurnal);
            Assert.Equal(1.0, result.nocturnal);
            Assert.Equal(0.0, result.diurnalHoliday);
            Assert.Equal(0.0, result.nocturnalHoliday);
            Assert.Equal(1.0, result.extraHours);
        }

        [Fact]
        public async Task DetermineExtraHourTypeAsync_EdgeCase_StartAtDiurnalStart()
        {
            // Arrange
            var config = GetDefaultConfig();
            _configService.GetConfigAsync().Returns(Task.FromResult(config));

            var date = new DateTime(2025, 6, 13); // Viernes (día laboral)
            var startTime = new TimeSpan(6, 0, 0); // 6:00 AM (exactamente al inicio del periodo diurno)
            var endTime = new TimeSpan(7, 0, 0);   // 7:00 AM

            // Act
            var result = await _extraHourCalculationService.DetermineExtraHourTypeAsync(date, startTime, endTime);

            // Assert
            Assert.Equal(1.0, result.diurnal);
            Assert.Equal(0.0, result.nocturnal);
            Assert.Equal(0.0, result.diurnalHoliday);
            Assert.Equal(0.0, result.nocturnalHoliday);
            Assert.Equal(1.0, result.extraHours);
        }
    }
}