import vscode from 'vscode';
import fs from 'fs';
import path from 'path';
import moment from 'moment';


/**
 * Retrieves configuration values for the extension.
 * @returns Object containing configuration values.
 */
function getConfiguration() {
    const config = vscode.workspace.getConfiguration('uniqueFileCreator');
    // Constants for default configuration values
    const DEFAULT_TIMESTAMP_FORMAT = 'YYYY-MM-DD-HH-mm-ss ';
    const DEFAULT_POSTFIX = '';
    const DEFAULT_EXTENSION = '.md';

    return {
        timestampFormat: config.get<string>('defaults.timestampPrefix', DEFAULT_TIMESTAMP_FORMAT),
        postFix: config.get<string>('defaults.postFix', DEFAULT_POSTFIX),
        fileExtension: config.get<string>('defaults.extension', DEFAULT_EXTENSION),
    };
}

function generateFileName(
    timestampFormat: string,
    userInputTitle: string | null,
    postFix: string,
    fileExtension: string,
    counter: number | null = null
): string {
    const timestamp = moment().format(timestampFormat);
    return `${timestamp}${userInputTitle ? userInputTitle : ""}${postFix}${counter ? `-${counter}` : ''}${fileExtension}`;
}

/**
 * Creates a new file in the workspace folder.
 * @param targetFileFolder Path to the workspace folder.
 * @param fileName Initial file name.
 * @returns Path to the created file.
 */
function createUniqueFile(
    timestampFormat: string,
    fileName: string | null,
    postFix: string,
    fileExtension: string,
    targetFileFolder: string
): string {
    let uniqueFileName = generateFileName(
        timestampFormat,
        fileName,
        postFix,
        fileExtension
    );

    let filePath = path.join(targetFileFolder, uniqueFileName);
    let counter = 1;

    // Ensure the file name is unique
    while (fs.existsSync(filePath)) {
        // generate new targetFileName with counter prefix
        const newFileName = generateFileName(
            timestampFormat,
            fileName,
            postFix,
            fileExtension,
            counter
        );
        filePath = path.join(targetFileFolder, newFileName);
        counter++;
    }

    // Create the file
    fs.writeFileSync(filePath, '');
    return targetFileFolder;
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


                // Get the workspace folder
                const workspaceFolders = vscode.workspace.workspaceFolders;
                if (!workspaceFolders || workspaceFolders.length === 0) {
                    vscode.window.showErrorMessage('No workspace folder is open.');
                    return;
                }

                const fileTargetPath = workspaceFolders[0].uri.fsPath;

                // Create the file
                const filePath = createUniqueFile(
                    timestampFormat,
                    userInputTitle,
                    postFix,
                    fileExtension,
                    fileTargetPath);

                // Open the file in the editor
                const document = await vscode.workspace.openTextDocument(filePath);
                await vscode.window.showTextDocument(document);

                vscode.window.showInformationMessage(`File created: ${filePath}`);
            } catch (error) {
                vscode.window.showErrorMessage(`Error creating file: ${error}`);
            }
        }
    );

    const createFileNoInputCommand = vscode.commands.registerCommand(
        'unique-file-creator-vscode-extension.createFileNoInput',
        async () => {
            try {
                // Get configuration values
                const { timestampFormat, postFix, fileExtension } = getConfiguration();

                // Get the workspace folder
                const workspaceFolders = vscode.workspace.workspaceFolders;
                if (!workspaceFolders || workspaceFolders.length === 0) {
                    vscode.window.showErrorMessage('No workspace folder is open.');
                    return;
                }

                const fileTargetPath = workspaceFolders[0].uri.fsPath;

                // Create the file
                const filePath = createUniqueFile(
                    timestampFormat,
                    null,
                    postFix,
                    fileExtension,
                    fileTargetPath);

                // Open the file in the editor
                const document = await vscode.workspace.openTextDocument(filePath);
                await vscode.window.showTextDocument(document);

                vscode.window.showInformationMessage(`File created: ${filePath}`);
            } catch (error) {
                vscode.window.showErrorMessage(`Error creating file: ${error}`);
            }
        }
    );

    context.subscriptions.push(createFileCommand, createFileNoInputCommand);
}

export function deactivate() { }
