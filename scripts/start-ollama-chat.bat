@echo off
REM ============================================================
REM  Master A9 - local Ollama chat backend (ollama-gate + tunnel)
REM  Run this on the PC that hosts Ollama (this PC).
REM  It starts:
REM    1) ollama-gate.js  (token-gated proxy, port 11555)
REM    2) cloudflared     (quick tunnel -> public URL)
REM  After the tunnel URL appears, update OLLAMA_BASE_URL on Vercel.
REM  Prereq: cloudflared installed (winget install Cloudflare.cloudflared)
REM ============================================================
setlocal

set "GATE_DIR=%~dp0"
set "GATE_PORT=11555"

REM ---- 1. Read the gate secret ----
REM The secret is stored next to this script in ollama-gate-secret.txt (one line).
set "SECRET_FILE=%GATE_DIR%ollama-gate-secret.txt"
if not exist "%SECRET_FILE%" (
  echo ERROR: %SECRET_FILE% not found. Create it with a random secret, e.g.:
  echo   node -e "console.log(require('crypto').randomBytes(24).toString('base64url'))" ^> ollama-gate-secret.txt
  exit /b 1
)
set /p GATE_SECRET=<"%SECRET_FILE%"
if "%GATE_SECRET%"=="" (
  echo ERROR: secret file is empty.
  exit /b 1
)

REM ---- 2. Start ollama-gate.js in a new window ----
start "ollama-gate" cmd /k "set OLLAMA_GATE_SECRET=%GATE_SECRET% && node \"%GATE_DIR%ollama-gate.js\" %GATE_PORT%"

REM ---- 3. Start cloudflared quick tunnel in a new window ----
REM http2 + IPv4 required on this network (QUIC/7844 is blocked).
start "cloudflared-tunnel" cmd /k "\"C:\Program Files (x86)\cloudflared\cloudflared.exe\" tunnel --url http://localhost:%GATE_PORT% --no-autoupdate --protocol http2 --edge-ip-version 4"

echo.
echo Both windows should now be open. Look in the cloudflared-tunnel window for:
echo   "Your quick Tunnel has been created! Visit it at https://...trycloudflare.com"
echo.
echo Then update Vercel env OLLAMA_BASE_URL to that URL + /v1 and redeploy:
echo   npx vercel env add OLLAMA_BASE_URL production  (value: https://xxx.trycloudflare.com/v1)
echo   npx vercel --prod
echo.
endlocal
