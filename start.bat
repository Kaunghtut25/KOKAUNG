@echo off
cd /d C:\Users\Dell\.openclaw-autoclaw\workspace\a9global-v2\backend

echo === A9 Global Startup ===
echo.

echo [1/3] Killing old processes...
taskkill /f /im node.exe >nul 2>&1
echo       Done.

echo [2/3] Starting backend...
start "A9-API" cmd /c "node server.js"
echo       Backend starting on port 5000...

echo [3/3] Starting frontend...
cd /d C:\Users\Dell\.openclaw-autoclaw\workspace\a9global-v2\frontend
start "A9-Frontend" cmd /c "npx next dev -p 3000"
echo       Frontend starting on port 3000...

echo.
echo ============================================
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:3000
echo   Admin:    admin@a9global.com / admin123
echo ============================================
echo.
echo After both windows show "ready", run:
echo   cd backend ^& node seed.js
echo.
pause
