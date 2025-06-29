using System.Threading.Tasks;
using ExtraHours.API.Service.Interface;
using ExtraHours.API.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NSubstitute;
using Xunit;

namespace ExtraHours.API.Tests
{
    public class EmailServiceTests
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;
        private readonly EmailService _emailService;

        public EmailServiceTests()
        {
            _configuration = Substitute.For<IConfiguration>();
            _logger = Substitute.For<ILogger<EmailService>>();
            _emailService = new EmailService(_configuration, _logger);
        }

        /// <summary>
        /// Verifica que no se envíe email si la configuración está incompleta.
        /// </summary>
        [Fact]
        public async Task SendEmailAsync_IncompleteConfig_LogsError()
        {
            // Arrange: configuración incompleta
            _configuration["Email:SmtpServer"].Returns((string?)null);
            // Act
            await _emailService.SendEmailAsync("test@correo.com", "Asunto", "Cuerpo");
            // Assert: verifica que se haya llamado a Log con LogLevel.Error
            _logger.Received().Log(
                LogLevel.Error,
                Arg.Any<EventId>(),
                Arg.Any<object>(),
                Arg.Any<Exception?>(),
                Arg.Any<Func<object, Exception?, string>>()
            );
        }

        /// <summary>
        /// Verifica que no se envíe email si el puerto no es válido.
        /// </summary>
        [Fact]
        public async Task SendEmailAsync_InvalidPort_LogsError()
        {
            // Arrange
            _configuration["Email:SmtpServer"].Returns("smtp.test.com");
            _configuration["Email:Port"].Returns("no-numero");
            _configuration["Email:Username"].Returns("user");
            _configuration["Email:Password"].Returns("pass");
            _configuration["Email:FromEmail"].Returns("from@test.com");
            // Act
            await _emailService.SendEmailAsync("test@correo.com", "Asunto", "Cuerpo");
            // Assert
            _logger.Received().Log(
                LogLevel.Error,
                Arg.Any<EventId>(),
                Arg.Any<object>(),
                Arg.Any<Exception?>(),
                Arg.Any<Func<object, Exception?, string>>()
            );
        }

        /// <summary>
        /// Verifica que se registre un error si ocurre una excepción al enviar el email.
        /// </summary>
        [Fact]
        public async Task SendEmailAsync_ExceptionThrown_LogsError()
        {
            // Arrange
            _configuration["Email:SmtpServer"].Returns("smtp.test.com");
            _configuration["Email:Port"].Returns("25");
            _configuration["Email:Username"].Returns("user");
            _configuration["Email:Password"].Returns("pass");
            _configuration["Email:FromEmail"].Returns("from@test.com");
            // Forzar excepción usando un correo inválido
            await _emailService.SendEmailAsync("correo-invalido", "Asunto", "Cuerpo");
            // Assert
            _logger.Received().Log(
                LogLevel.Error,
                Arg.Any<EventId>(),
                Arg.Any<object>(),
                Arg.Any<Exception?>(),
                Arg.Any<Func<object, Exception?, string>>()
            );
        }
    }
}
