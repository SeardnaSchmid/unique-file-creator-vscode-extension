// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "unique-file-creator-vscode-extension" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('unique-file-creator-vscode-extension.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from unique-file-creator-vscode-extension!');
	});

	context.subscriptions.push(disposable);

	const createFileCommand = vscode.commands.registerCommand('unique-file-creator-vscode-extension.createFile', async () => {
        // Prompt the user for a file title
        const title = await vscode.window.showInputBox({
            prompt: 'Enter the title for the new file',
            placeHolder: 'e.g., my-new-file'
        });

        if (!title) {
            vscode.window.showErrorMessage('File creation cancelled. No title provided.');
            return;
        }

        // Generate a timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `${timestamp}-${title}.txt`;

        // Get the workspace folder
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            vscode.window.showErrorMessage('No workspace folder is open.');
            return;
        }

        const workspacePath = workspaceFolders[0].uri.fsPath;
        const filePath = path.join(workspacePath, fileName);

        // Create the file
        fs.writeFileSync(filePath, '');

        // Open the file in the editor
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);

        vscode.window.showInformationMessage(`File created: ${fileName}`);
    });

    context.subscriptions.push(createFileCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
