import * as vscode from 'vscode';

import RobloxClient from './components/RobloxClient';
import RobloxClientProvider from './components/RobloxClientProvider';

const normalize = (source: string) => {
	return JSON.stringify(
		{
			op: 'OP_EXECUTE',
			data: {
				source
			}
		}
	);
};

export function activate(context: vscode.ExtensionContext) {
	const robloxClientProvider = new RobloxClientProvider(6969);

	vscode.window.registerTreeDataProvider('roblox-client-manager', robloxClientProvider);

	vscode.commands.registerCommand('roblox-client-manager.run', (client: RobloxClient) => {
		const editor = vscode.window.activeTextEditor;

		if (!editor)
			return vscode.window.showErrorMessage(`Couldn't find an active text editor.`);

		const text = editor.document.getText();

		client.sendAsync(
			normalize(
				text
			)
		);
	});

	vscode.commands.registerCommand('roblox-client-manager.runAll', () => {
		const editor = vscode.window.activeTextEditor;

		if (!editor)
			return vscode.window.showErrorMessage(`Couldn't find an active text editor.`);

		const text = editor.document.getText();

		const clients = robloxClientProvider.getAll();

		for (let i = 0; i < clients.length; i++) {
			const client = clients[i];

			client.sendAsync(
				normalize(
					text
				)
			);
		}
	});
}

export function deactivate() {}