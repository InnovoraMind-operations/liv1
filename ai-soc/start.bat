@echo off
setlocal enabledelayedexpansion

title AI-SOC Launcher
echo ==================================================
echo  AI-SOC ^| Security Operations Center
echo  Startup Script
echo ==================================================
echo.

:: ---------------------------------------------------------------------------
:: Load POSTGRES_PASSWORD from backend\.env so docker-compose can read it
:: ---------------------------------------------------------------------------
set "POSTGRES_PASSWORD="
for /f "usebackq tokens=1,* delims==" %%A in ("backend\.env") do (
    if "%%A"=="POSTGRES_PASSWORD" set "POSTGRES_PASSWORD=%%B"
)

if "%POSTGRES_PASSWORD%"=="" (
    echo [ERROR] POSTGRES_PASSWORD not found in backend\.env
    echo         Open backend\.env and make sure POSTGRES_PASSWORD is set.
    pause
    exit /b 1
)

echo [OK] Loaded POSTGRES_PASSWORD from backend\.env

:: ---------------------------------------------------------------------------
:: Step 1 — Check Docker Desktop is running
:: ---------------------------------------------------------------------------
echo.
echo [1/4] Checking Docker Desktop...
docker info >nul 2>&1
if errorlevel 1 (
    echo [!] Docker Desktop is not running. Starting it now...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    echo     Waiting 30 seconds for Docker to boot...
    timeout /t 30 /nobreak >nul
    docker info >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] Docker still not ready. Please start Docker Desktop manually and re-run.
        pause
        exit /b 1
    )
)
echo [OK] Docker is running.

:: ---------------------------------------------------------------------------
:: Step 2 — Start Postgres via docker-compose
:: ---------------------------------------------------------------------------
echo.
echo [2/4] Starting Postgres (docker-compose)...
docker-compose up -d
if errorlevel 1 (
    echo [ERROR] docker-compose failed. Check the error above.
    pause
    exit /b 1
)
echo [OK] Postgres container is up.

:: ---------------------------------------------------------------------------
:: Step 3 — FastAPI Backend (new window)
::   - activates venv
::   - runs alembic migrations
::   - starts uvicorn
:: ---------------------------------------------------------------------------
echo.
echo [3/4] Starting FastAPI Backend on port 8000...
start "AI-SOC Backend" cmd /k "cd /d %~dp0backend && .venv\Scripts\activate && alembic upgrade head && uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

:: Give the backend a moment to bind before the frontend starts
timeout /t 3 /nobreak >nul

:: ---------------------------------------------------------------------------
:: Step 4 — Next.js Frontend (new window)
:: ---------------------------------------------------------------------------
echo.
echo [4/4] Starting Next.js Frontend on port 3000...
start "AI-SOC Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

:: ---------------------------------------------------------------------------
:: Summary
:: ---------------------------------------------------------------------------
echo.
echo ==================================================
echo  All services launched!
echo ==================================================
echo.
echo   Postgres DB   : localhost:5432
echo   Backend API   : http://localhost:8000
echo   Frontend      : http://localhost:3000
echo   API Docs      : http://localhost:8000/docs  (dev only)
echo.
echo   First time?   Go to http://localhost:3000/signup
echo                 to create your operator account.
echo.
echo   Close the Backend and Frontend windows to stop.
echo ==================================================
echo.
pause
