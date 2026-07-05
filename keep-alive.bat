@echo off
title A9 Global - Keep Alive
echo === A9 Global Server Launcher ===
echo.
echo This window must stay open to keep servers running.
echo Minimize it, but DO NOT CLOSE it.
echo.
echo [1/2] Starting Backend...
start "A9-Backend" cmd /k "cd /d C:\Users\Dell\.openclaw-autoclaw\workspace\a9global-v2\backend ^& title A9-Backend ^& node server.js"
echo       Backend launched on port 5000

echo [2/2] Starting Frontend...
start "A9-Frontend" cmd /k "cd /d C:\Users\Dell\.openclaw-autoclaw\workspace\a9global-v2\frontend ^& title A9-Frontend ^& npx next dev -p 3000"
echo       Frontend launching on port 3000...

echo.
echo ============================================
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo ============================================
echo.
echo DO NOT CLOSE THE A9-BACKEND OR A9-FRONTEND WINDOWS.
echo To stop: close all three windows.
echo.
pause
