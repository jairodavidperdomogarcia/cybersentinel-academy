# CyberSentinel Unified Deployment Builder
# This script builds all React modules and integrates them into the WEB_PLATFORM static artifact.

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting CyberSentinel Deployment Preparation..." -ForegroundColor Cyan

# Define paths
$root = "j:\CyberSentinel-AI-Academy"
$webPlatform = "$root\WEB_PLATFORM"
$modulesDir = "$webPlatform\modules"

# Ensure modules directory exists
if (!(Test-Path $modulesDir)) {
    New-Item -ItemType Directory -Path $modulesDir | Out-Null
    Write-Host "Created modules directory at $modulesDir" -ForegroundColor Green
}

# Function to build and copy module
function Build-Module {
    param (
        [string]$name,
        [string]$sourcePath,
        [string]$destPath
    )

    Write-Host "🏗️  Building module: $name..." -ForegroundColor Yellow
    
    if (Test-Path $sourcePath) {
        Push-Location $sourcePath
        try {
            # Check if node_modules exists, if not install (skip if already installed to save time)
            if (!(Test-Path "node_modules")) {
                Write-Host "Installing dependencies for $name..."
                npm install
            }
            
            # Build
            Write-Host "Running build for $name..."
            npm run build

            # Copy to destination
            if (Test-Path $destPath) {
                Remove-Item -Path $destPath -Recurse -Force
            }
            New-Item -ItemType Directory -Path $destPath | Out-Null
            Copy-Item -Path "build\*" -Destination $destPath -Recurse -Force
            
            Write-Host "✅ ${name} built and integrated successfully!" -ForegroundColor Green
        }
        catch {
            Write-Host "❌ Error building ${name}: $_" -ForegroundColor Red
        }
        finally {
            Pop-Location
        }
    } else {
        Write-Host "⚠️  Source path not found: $sourcePath" -ForegroundColor Red
    }
}

# Build Modules
Build-Module -name "Strategic Hub" -sourcePath "$root\CyberSentinel-Strategic-Hub" -destPath "$modulesDir\hub"
Build-Module -name "Global War Room" -sourcePath "$root\cybersentinel-global-war-room" -destPath "$modulesDir\war-room"
Build-Module -name "Specialized Dome" -sourcePath "$root\cybersentinel-specialized-dome" -destPath "$modulesDir\dome"

Write-Host "✨ Deployment Preparation Complete!" -ForegroundColor Cyan
Write-Host "👉 The 'WEB_PLATFORM' folder is now a self-contained artifact ready for global deployment." -ForegroundColor Cyan