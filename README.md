# gmail-unread
Adds a dedicated Unread button to Gmail for instant access to unread messages.

## Description

"Gmail Unread Filter" is a lightweight Chrome extension that enhances your Gmail experience by adding a dedicated "Unread" button to the navigation sidebar. This allows for quick and easy access to all your unread emails with a single click, streamlining your workflow.

This project is open source and the code is available on GitHub: https://github.com/hhuangpanda/gmail-unread

## Privacy Policy
Please see the [Privacy Policy](PRIVACY_POLICY.md) for more information.

## Packaging for Publication

### Windows

To package the extension for the Chrome Web Store, run the `package.ps1` script from PowerShell.

1.  Open PowerShell in the project directory.
2.  Run the following command:
    ```powershell
    .\package.ps1
    ```

If you encounter an error about scripts being disabled on your system, you may need to change your execution policy for this single instance. You can do this by running:
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```
Then, re-run the packaging script.

### macOS / Linux

On macOS or Linux, use the `package.sh` script.

1.  Open your terminal in the project directory.
2.  First, make the script executable (you only need to do this once):
    ```sh
    chmod +x package.sh
    ```
3.  Now, run the script:
    ```sh
    ./package.sh
    ```

This will create a `gmail-unread.zip` file in the project root, which you can then upload to the Chrome Developer Dashboard.