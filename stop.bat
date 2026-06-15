@echo off
echo Stopping NL Job Hunter...

docker compose down

echo Stopping llama-server...
taskkill /FI "WINDOWTITLE eq llama-server*" /T /F >nul 2>&1

echo Done.
pause