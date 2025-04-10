import vscode from 'vscode';
import fs from 'fs';
import path from 'path';
import moment from 'moment';

// Constants for default configuration values
const DEFAULT_TIMESTAMP_FORMAT = 'YYYY-MM-DD-HH-mm-ss ';
const DEFAULT_POSTFIX = '';
const DEFAULT_EXTENSION = '.md';

/**
 * Generates a unique file name based on the provided parameters.
 * @param timestampFormat Format for the timestamp.
 * @param userInputTitle Title provided by the user.
 * @param postFix Postfix to append to the file name.
 * @param fileExtension File extension.
 * @param counter Optional counter for duplicate file names.
 * @returns Generated file name.
 */
function generateFileName(
    timestampFormat: string,
    userInputTitle: string | null,
    postFix: string,
    fileExtension: string,
    counter: number | null = null
): string {
    const timestamp = moment().format(timestampFormat);
    return `${timestamp}${userInputTitle ? userInputTitle : ""}${postFix}${counter ? counter : ''}${fileExtension}`;
}

/**
 * Retrieves configuration values for the extension.
 * @returns Object containing configuration values.
 */
function getConfiguration() {
    const config = vscode.workspace.getConfiguration('uniqueFileCreator');
    return {
        timestampFormat: config.get<string>('defaults.timestampPrefix', DEFAULT_TIMESTAMP_FORMAT),
        postFix: config.get<string>('defaults.postFix', DEFAULT_POSTFIX),
        fileExtension: config.get<string>('defaults.extension', DEFAULT_EXTENSION),
    };
}

/**
 * Creates a new file in the workspace folder.
 * @param workspacePath Path to the workspace folder.
 * @param fileName Initial file name.
 * @returns Path to the created file.
 */
function createUniqueFile(workspacePath: string, fileName: string): string {
    let filePath = path.join(workspacePath, fileName);
    let counter = 1;

    // Ensure the file name is unique
    while (fs.existsSync(filePath)) {
        fileName = generateFileName(
            DEFAULT_TIMESTAMP_FORMAT,
            fileName,
            DEFAULT_POSTFIX,
            DEFAULT_EXTENSION,
            counter
        );
        filePath = path.join(workspacePath, fileName);
        counter++;
    }

    // Create the file
    fs.writeFileSync(filePath, '');
    return filePath;
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "unique-file-creator-vscode-extension" is now active!');

    const createFileCommand = vscode.commands.registerCommand(
        'unique-file-creator-vscode-extension.createFile',
        async () => {
            try {
                // Get configuration values
                const { timestampFormat, postFix, fileExtension } = getConfiguration();

                // Prompt the user for a file title
                const userInputTitle = (await vscode.window.showInputBox({
                    prompt: 'Enter the title for the new file',
                    placeHolder: 'e.g., my-new-file',
                })) || null;

                const initialFileName = generateFileName(
                    timestampFormat,
                    userInputTitle,
                    postFix,
                    fileExtension
                );

                // Get the workspace folder
                const workspaceFolders = vscode.workspace.workspaceFolders;
                if (!workspaceFolders || workspaceFolders.length === 0) {
                    vscode.window.showErrorMessage('No workspace folder is open.');
                    return;
                }

                const workspacePath = workspaceFolders[0].uri.fsPath;

                // Create the file
                const filePath = createUniqueFile(workspacePath, initialFileName);

                // Open the file in the editor
                const document = await vscode.workspace.openTextDocument(filePath);
                await vscode.window.showTextDocument(document);

                vscode.window.showInformationMessage(`File created: ${filePath}`);
            } catch (error) {
                vscode.window.showErrorMessage(`Error creating file: ${error}`);
            }
        }
    );

    context.subscriptions.push(createFileCommand);
}

export function deactivate() { }
