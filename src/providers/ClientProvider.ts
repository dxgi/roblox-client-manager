import * as vscode  from 'vscode';

import RobloxResolver, { IEvent } from '../resolvers/RobloxResolver';

export class RobloxClient extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly game: string,
    ) {
        super(label, vscode.TreeItemCollapsibleState.None);

        this.description = game;
    }
}

export default class ClientProvider implements vscode.TreeDataProvider<RobloxClient> {
    private resolver: RobloxResolver;

    private cache: Map<string, RobloxClient> = new Map;

    constructor(resolver: RobloxResolver) {
        this.resolver = resolver;

        resolver.on(IEvent.Identify, ({ player, game }) => {
            const client = new RobloxClient(player.name, game.name);

            this.cache.set(player.name, client);

            this.refresh();
        });

        resolver.on(IEvent.Disconnect, (playerName) => {
            if (!this.cache.has(playerName))
                return;
            
            this.cache.delete(playerName);

            this.refresh();
        });
    }

    getTreeItem(element: RobloxClient): vscode.TreeItem {
        return element;
    }

    getChildren(element?: RobloxClient | undefined): vscode.ProviderResult<RobloxClient[]> {
        return Array.from(
            this.cache.values()
        );
    }

    getChildrens(): RobloxClient[] {
        return Array.from(
            this.cache.values()
        );
    }
    
    findFirstChild(key: string): RobloxClient | undefined { 
        return this.cache.get(key);
    }

    private _onDidChangeTreeData: vscode.EventEmitter<RobloxClient | undefined | null | void> = new vscode.EventEmitter<RobloxClient | undefined | null | void>();

    readonly onDidChangeTreeData: vscode.Event<RobloxClient | undefined | null | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
}