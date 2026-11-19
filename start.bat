@echo off
title WatchHub Luxury Haute Horlogerie Portal - Aptech eProject
echo =====================================================================
echo           WATCHHUB - LUXURY HAUTE HORLOGERIE PORTAL
echo              Aptech Final eProject (Senior Edition)
echo =====================================================================
echo.
echo [1/2] Starting WatchHub Express API Backend on port 5000...
start "WatchHub Backend Server" cmd /k "node server/index.js"

echo [2/2] Starting WatchHub Luxury Vite Frontend on port 5173...
start "WatchHub Frontend Portal" cmd /k "npm run dev"

echo.
echo Application initiated successfully!
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:5000/api/health
echo.
echo Admin Login: admin@watchhub.luxury / admin123
echo Client Login: client@watchhub.luxury / user123
echo =====================================================================
pause
