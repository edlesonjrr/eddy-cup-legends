@echo off
title Eddy Cup Legends - Servidor Local
cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js nao foi encontrado. Instale o Node.js e tente novamente.
  pause
  exit /b 1
)

start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 2; Start-Process 'http://127.0.0.1:5173/'"
npm run dev -- --host 127.0.0.1

