@echo off
start "Notes Backend" cmd /k "cd notes-backend && run.bat"
timeout /t 2 >nul
start "Notes Frontend" cmd /k "cd notes-frontend && run.bat"