@echo off
echo.
echo  NL Job Hunter starting up
echo  ============================
echo.

REM Check Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo  ERROR: Docker is not running. Start Docker Desktop first.
    pause
    exit /b 1
)

REM Check .env exists
if not exist .env (
    echo  ERROR: .env file not found.
    echo  Copy .env.example to .env and fill in your tokens.
    pause
    exit /b 1
)

REM Create output dir if missing
if not exist output mkdir output

echo  Starting llama-server (Gemma 4 12B)...
start "llama-server" cmd /k llama-server --hf-repo unsloth/gemma-4-12b-it-GGUF --hf-file gemma-4-12b-it-Q4_K_M.gguf --mmproj "C:\Users\shirs\.cache\huggingface\hub\models--unsloth--gemma-4-12b-it-GGUF\blobs\2e269f906eb15169ee9ce880ea649bd6d42d4964c21f8ede10d0d0efc738bcbb" --jinja -ngl 99

echo  Starting containers...
docker compose up -d

if errorlevel 1 (
    echo.
    echo  ERROR: docker compose failed. Check logs above.
    pause
    exit /b 1
)

echo.
echo  Done! n8n is running at: http://localhost:5678
echo  llama-server is running in a separate window
echo.
echo  Next steps:
echo    1. Open http://localhost:5678 in your browser
echo    2. Go to Settings ^> Workflow ^> Import
echo    3. Import workflow.json
echo    4. Activate the workflow
echo.
echo  Excel output will appear in the 'output' folder next to this file.
echo.
pause