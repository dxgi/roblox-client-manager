import * as vscode                      from 'vscode';

import RobloxResolver                   from './resolvers/RobloxResolver';
import ClientProvider, { RobloxClient } from './providers/ClientProvider';

export function activate(context: vscode.ExtensionContext) {
	const host = vscode.workspace.getConfiguration('roblox-client-manager').get('host', 'localhost');

	const port = vscode.workspace.getConfiguration('roblox-client-manager').get('port', '6969');

	const resolver = new RobloxResolver(host, port);

	const provider = new ClientProvider(resolver);

	const run = (client: RobloxClient, source: string) => {
		const socket = resolver.resolve(client.label);

		if (!socket)
			return vscode.window.showErrorMessage(`Couldn't resolve the client ${client.label}.`);

		socket.send(
			JSON.stringify(
				{
					op: 'OP_EXECUTE',
					data: {
						source
					}
				}
			)
		);
	};

	vscode.window.registerTreeDataProvider('roblox-client-manager', provider);

	vscode.commands.registerCommand('roblox-client-manager.run', (client: RobloxClient) => {
		const editor = vscode.window.activeTextEditor;

		if (!editor)
			return vscode.window.showErrorMessage('Couldn\'t find an active text editor.');

		const source = editor.document.getText();

		run(client, source);
	});

	vscode.commands.registerCommand('roblox-client-manager.runAll', () => {
		const editor = vscode.window.activeTextEditor;

		if (!editor)
			return vscode.window.showErrorMessage('Couldn\'t find an active text editor.');

		const source = editor.document.getText();

		for (const client of provider.getChildrens())
			run(client, source);
	});
}

export function deactivate() {}