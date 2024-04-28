import * as vscode  from 'vscode';
import * as ws      from 'ws';

import Dictionary   from './Dictionary';
import RobloxClient from './RobloxClient';

interface IMessage {
    op: string;
    data: object;
}

interface IHandshake {
    player: {
        name: string;
    },
    game: {
        name: string;
    }
}

export default class RobloxClientProvider implements vscode.TreeDataProvider<RobloxClient> {
    private clients: Dictionary<RobloxClient> = new Dictionary<RobloxClient>(
        (key, value) => 
            this.refresh()
    );

    private server: ws.Server;

    constructor(port: number) {
        this.server = new ws.Server({ port });

        this.server.on('connection', (socket) => {
            let identifier: string = '';

            socket.on('message', (data) => {
                const message = JSON.parse(
                    data.toString()
                ) as IMessage;

                switch (message.op) {
                    case 'OP_IDENTIFY': {
                        const { player, game } = message.data as IHandshake;

                        this.clients.set(
                            player.name,
                            
                            new RobloxClient(
                                player.name,
                                game.name,
                                socket
                            )
                        );

                        identifier = player.name;

                        vscode.window.showInformationMessage(`[RobloxClientProvider.ts] ${player.name} has connected.`);

                        break;
                    }
                    default: {
                        vscode.window.showErrorMessage(`[RobloxClientProvider.ts] Couldn't resolve the following opcode: ${message.op}.`);

                        break;
                    }
                }
            });

            socket.on('close', (code, reason) => {
                console.log(`[RobloxClientProvider.ts] ${identifier} has disconnected.`);

                console.log(`[RobloxClientProvider.ts] Code: ${code}`);

                console.log(`[RobloxClientProvider.ts] Reason: ${reason.toString()}`);

                if (identifier)
                    this.clients.delete(identifier);
            });
        });
    }

    getTreeItem(element: RobloxClient): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: RobloxClient | undefined): vscode.ProviderResult<RobloxClient[]> {
        return this.clients.values();
    }

    getAll(): RobloxClient[] {
        return this.clients.values();
    }

    findFirst(key: string): RobloxClient | undefined {
        return this.clients.get(key);
    }

    private _onDidChangeTreeData: vscode.EventEmitter<RobloxClient | undefined | null | void> = new vscode.EventEmitter<RobloxClient | undefined | null | void>();

    readonly onDidChangeTreeData: vscode.Event<RobloxClient | undefined | null | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
}