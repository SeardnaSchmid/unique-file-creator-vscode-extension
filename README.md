# Unique File Creator VS Code Extension

## Overview
The Unique File Creator extension for Visual Studio Code allows you to quickly create new files in your workspace with a timestamp prefix. This is especially useful for organizing files chronologically or ensuring unique filenames.

## Features
- **Create New File Command**: Easily create a new file with a timestamp prefix.
- **Customizable Timestamp Format**: Configure the timestamp format (e.g., `YYYY-MM-DD-hh-mm-ss`) to suit your needs.
- **Seamless Integration**: Automatically opens the newly created file in the editor.

## Installation
1. Open the Extensions view in Visual Studio Code (`Ctrl+Shift+X` or `Cmd+Shift+X` on macOS).
2. Search for "Unique File Creator".
3. Click "Install" to add the extension to your editor.

Alternatively, you can install it from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/).

## Usage
1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
2. Type and select `Create New File`.
3. Enter a title for the new file when prompted.
4. The extension will create the file with a timestamp prefix and open it in the editor.

### Example
If you enter `my-new-file` as the title and the timestamp format is `YYYY-MM-DD-hh-mm-ss`, the file will be created as:
```
2025-04-10-12-30-45-my-new-file.txt
```

## Configuration
You can customize the timestamp format by modifying the extension settings (coming soon).

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a clear description of your changes.

## License
This extension is licensed under the [MIT License](LICENSE).

## Support
If you encounter any issues or have feature requests, please open an issue on the [GitHub repository](https://github.com/schmida/unique-file-creator-vscode-extension).