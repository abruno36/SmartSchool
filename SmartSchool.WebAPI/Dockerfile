FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build-env
WORKDIR /App

# Copy everything
COPY *.csproj ./
# Restore as distinct layers
RUN dotnet restore
# Build and publish a release
COPY . ./
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1
WORKDIR /App
COPY --from=build-env /App/out .
ENTRYPOINT ["dotnet", "SmartSchool.WebAPI.dll"]