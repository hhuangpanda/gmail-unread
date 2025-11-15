# This script packages the necessary extension files into a zip archive for the Chrome Web Store.

# List of files to include in the package
$filesToPackage = @(
    "manifest.json",
    "content-script.js",
    "styles.css",
    "gmail-unread-icon-16x16.png",
    "gmail-unread-icon-48x48.png",
    "gmail-unread-icon-128x128.png"
)

# Check for the existence of the icon files, as they are optional for local development
# but required for a clean package.
$missingFiles = @()
foreach ($file in $filesToPackage) {
    if (-not (Test-Path $file)) {
        # The user may not have created the icons yet, so we'll just warn them.
        if ($file -like "*icon*") {
            Write-Host "Warning: Icon file not found: $file. It will be excluded from the package." -ForegroundColor Yellow
        } else {
            $missingFiles += $file
        }
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "Error: The following required files are missing:" -ForegroundColor Red
    $missingFiles | ForEach-Object { Write-Host "- $_" }
    exit 1
}

# Filter out the files that were not found
$existingFiles = $filesToPackage | Where-Object { Test-Path $_ }

$zipFileName = "gmail-unread.zip"

# Remove the old zip file if it exists
if (Test-Path $zipFileName) {
    Remove-Item $zipFileName
}

# Create the zip archive
Compress-Archive -Path $existingFiles -DestinationPath $zipFileName

Write-Host "Extension successfully packaged into $zipFileName" -ForegroundColor Green
