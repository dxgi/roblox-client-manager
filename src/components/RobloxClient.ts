import * as vscode from 'vscode';
import * as ws     from 'ws';

export default class RobloxClient extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly game: string,
        public readonly socket: ws.WebSocket
    ) {
        super(label, vscode.TreeItemCollapsibleState.None);

        this.description = game;
    }

    sendAsync: (data: any) => Promise<void> = (data: any) => {
        return new Promise((resolve, reject) => {
            this.socket.send(data, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    };
}