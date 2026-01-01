# Afiya Zone - Quick Setup Script for Windows
# Run this in PowerShell: .\setup.ps1

Write-Host "🌿 Welcome to Afiya Zone Setup!" -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from: https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install frontend dependencies!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend dependencies installed!" -ForegroundColor Green

Write-Host ""

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location server
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install backend dependencies!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend dependencies installed!" -ForegroundColor Green

Write-Host ""

# Check for .env file
if (-Not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found!" -ForegroundColor Yellow
    Write-Host "Creating .env from example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host ""
    Write-Host "❗ IMPORTANT: Edit server/.env file with your MongoDB Atlas credentials!" -ForegroundColor Red
    Write-Host "   1. Open server/.env" -ForegroundColor Yellow
    Write-Host "   2. Replace MONGODB_URI with your connection string" -ForegroundColor Yellow
    Write-Host "   3. Change JWT_SECRET to a secure random string" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📖 Read MONGODB_ATLAS_SETUP_AR.md for detailed instructions" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "✅ .env file exists" -ForegroundColor Green
}

Set-Location ..

Write-Host ""
Write-Host "🎉 Setup completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Configure your MongoDB Atlas connection in server/.env" -ForegroundColor White
Write-Host "  2. Run: cd server && node seedProducts.js" -ForegroundColor White
Write-Host "  3. Run: npm run start:all" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "  - MongoDB Setup: MONGODB_ATLAS_SETUP_AR.md" -ForegroundColor White
Write-Host "  - Deployment Guide: HOSTING_GUIDE_AR.md" -ForegroundColor White
Write-Host "  - Quick Start: README_AR.md" -ForegroundColor White
Write-Host ""
Write-Host "Happy coding! 🚀" -ForegroundColor Green
