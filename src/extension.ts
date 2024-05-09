import * as vscode                      from 'vscode';

import RobloxResolver                   from './resolvers/RobloxResolver';
import ClientProvider, { RobloxClient } from './providers/ClientProvider';
import CommandProvider from './providers/CommandProvider';

export function activate(context: vscode.ExtensionContext) {
	const host = vscode.workspace.getConfiguration('roblox-client-manager').get('host', 'localhost');

	const port = vscode.workspace.getConfiguration('roblox-client-manager').get('port', '6969');

	const resolver = new RobloxResolver(host, port);

	const provider = new ClientProvider(resolver);

	const commands = new CommandProvider(provider);

	vscode.window.registerTreeDataProvider('roblox-client-manager', provider);

	vscode.commands.registerCommand('roblox-client-manager.run', commands.Single);

	vscode.commands.registerCommand('roblox-client-manager.runAll', commands.Multiple);
}

export function deactivate() {}