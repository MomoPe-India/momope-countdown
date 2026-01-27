@echo off
echo ==========================================
echo      MomoPe Server Fix & Start Script
echo ==========================================
echo.
echo 1. Stopping any lingering Node.js processes...
taskkill /F /IM node.exe >nul 2>&1
echo    Done.
echo.

echo 2. Deleting corrupted node_modules (this may take a moment)...
rmdir /s /q node_modules
if exist node_modules (
    echo    WARNING: Could not delete node_modules. Please restart your computer.
    pause
    exit
) else (
    echo    Done.
)
echo.

echo 3. Deleting package-lock.json...
del package-lock.json >nul 2>&1
echo    Done.
echo.

echo 4. Cleaning npm cache...
call npm cache clean --force >nul 2>&1
echo    Done.
echo.

echo 5. Installing dependencies (Fresh Install)...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo    ERROR: npm install failed. Please check the error message above.
    pause
    exit
)
echo    Done.
echo.

echo 6. Starting Development Server...
echo    Opening localhost:3000...
start chrome "http://localhost:3000"
call npm run dev
pause
