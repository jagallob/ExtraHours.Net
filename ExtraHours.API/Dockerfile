# Backend Dockerfile for .NET 8 API - Compatible con Render y Docker Desktop
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
# Exponer puerto 80 para Docker Desktop (tu configuración actual)
EXPOSE 80
# También exponer puerto dinámico para Render (si existe)
EXPOSE $PORT

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["ExtraHours.API/ExtraHours.API.csproj", "ExtraHours.API/"]
RUN dotnet restore "ExtraHours.API/ExtraHours.API.csproj"
COPY . .
WORKDIR "/src/ExtraHours.API"
RUN dotnet publish "ExtraHours.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .

# Configuración inteligente de puertos:
# - Si PORT existe (Render), úsalo  
# - Si no existe (Docker Desktop), usa puerto 80 (tu configuración actual)
ENV ASPNETCORE_URLS=http://+:${PORT:-80}

ENTRYPOINT ["dotnet", "ExtraHours.API.dll"]