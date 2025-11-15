#!/bin/bash

# This script packages the necessary extension files into a zip archive for the Chrome Web Store.

# List of files to include in the package
files_to_package=(
    "manifest.json"
    "content-script.js"
    "styles.css"
    "gmail-unread-icon-16x16.png"
    "gmail-unread-icon-48x48.png"
    "gmail-unread-icon-128x128.png"
)

# Check for the existence of files
for file in "${files_to_package[@]}"; do
    if [ ! -f "$file" ]; then
        # The user may not have created the icons yet, so we'll just warn them.
        if [[ "$file" == *"icon"* ]]; then
            echo "Warning: Icon file not found: $file. It will be excluded from the package."
        else
            echo "Error: Required file not found: $file"
            exit 1
        fi
    fi
done

zip_file_name="gmail-unread.zip"

# Remove the old zip file if it exists
if [ -f "$zip_file_name" ]; then
    rm "$zip_file_name"
fi

# Create a temporary list of existing files to zip
existing_files=()
for file in "${files_to_package[@]}"; do
    if [ -f "$file" ]; then
        existing_files+=("$file")
    fi
done

# Create the zip archive, -q for quiet mode
zip -q "$zip_file_name" "${existing_files[@]}"

echo "Extension successfully packaged into $zip_file_name"
