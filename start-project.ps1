# Afiya Zone - Quick Start Script
# This script starts both backend and frontend servers

Write-Host "================================================" -ForegroundColor Green
Write-Host "   🚀 Starting Afiya Zone E-commerce Project" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Get the script directory
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host ""
Write-Host "📂 Project Root: $projectRoot" -ForegroundColor Cyan
Write-Host ""

# Function to start backend server
Write-Host "🔧 Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\server'; Write-Host '🔴 BACKEND SERVER' -ForegroundColor Red; npm run dev"

Start-Sleep -Seconds 3

# Function to start frontend server
Write-Host "🎨 Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot'; Write-Host '🔵 FRONTEND SERVER' -ForegroundColor Blue; npm run dev"

Start-Sleep -Seconds 5

# Open test page
Write-Host ""
Write-Host "🧪 Opening test page..." -ForegroundColor Yellow
Start-Process "$projectRoot\test-api.html"

Start-Sleep -Seconds 2

# Open application
Write-Host "🌐 Opening application..." -ForegroundColor Yellow
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "   ✅ All servers started successfully!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Backend API:  http://localhost:5000/api" -ForegroundColor Cyan
Write-Host "📍 Frontend App: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📍 Test Page:    test-api.html" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  To stop servers, close the PowerShell windows or press Ctrl+C" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit this window..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
