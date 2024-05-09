import * as vscode                      from 'vscode';

import RobloxResolver from '../resolvers/RobloxResolver';
import ClientProvider, { RobloxClient } from '../providers/ClientProvider';

export default class {
    private provider: ClientProvider;

    private resolver: RobloxResolver;

    constructor(provider: ClientProvider) {
        this.provider = provider;

        this.resolver = provider.resolver;
    }

    private Run(client: RobloxClient, source: string) {
        const socket = this.resolver.resolve(client.label);

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
    }

    public Single(client: RobloxClient) {
        const editor = vscode.window.activeTextEditor;

        if (!editor)
            return vscode.window.showErrorMessage('Couldn\'t find an active text editor.');

        const source = editor.document.getText();

        this.Run(client, source);
    }

    public Multiple() {
        const editor = vscode.window.activeTextEditor;

        if (!editor)
            return vscode.window.showErrorMessage('Couldn\'t find an active text editor.');

        const source = editor.document.getText();

        for (const client of this.provider.getChildrens())
            this.Run(client, source);
    }
}