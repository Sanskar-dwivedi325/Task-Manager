@echo off
setlocal

set "MAVEN_VERSION=3.9.11"
set "BASE_DIR=%~dp0"
set "MAVEN_HOME=%BASE_DIR%.mvn\local-maven\apache-maven-%MAVEN_VERSION%"
set "MAVEN_BIN=%MAVEN_HOME%\bin\mvn.cmd"
set "MAVEN_ZIP=%BASE_DIR%.mvn\local-maven\apache-maven-%MAVEN_VERSION%-bin.zip"
set "MAVEN_URL=https://archive.apache.org/dist/maven/maven-3/%MAVEN_VERSION%/binaries/apache-maven-%MAVEN_VERSION%-bin.zip"

if exist "%MAVEN_BIN%" goto run_maven

echo Maven %MAVEN_VERSION% was not found locally. Downloading it for this project...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ErrorActionPreference='Stop';" ^
  "New-Item -ItemType Directory -Force -Path '%BASE_DIR%.mvn\local-maven' | Out-Null;" ^
  "Invoke-WebRequest -Uri '%MAVEN_URL%' -OutFile '%MAVEN_ZIP%';" ^
  "Expand-Archive -LiteralPath '%MAVEN_ZIP%' -DestinationPath '%BASE_DIR%.mvn\local-maven' -Force;" ^
  "Remove-Item -LiteralPath '%MAVEN_ZIP%' -Force"

if errorlevel 1 (
  echo Failed to download Maven. Install Maven manually or check your internet connection.
  exit /b 1
)

:run_maven
call "%MAVEN_BIN%" %*
