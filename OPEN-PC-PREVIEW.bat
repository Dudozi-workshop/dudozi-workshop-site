@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required. Install Node.js LTS, then run this file again.
  pause
  exit /b 1
)
call npm run build
if errorlevel 1 (
  echo Build failed. See the error above.
  pause
  exit /b 1
)
start "Dudozi local preview" cmd /k "npm run preview:local"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:4173/"
echo Local preview opened in your browser. Close the server window to stop.
