import * as vscode  from 'vscode';
import WebSocket    from 'ws';
import EventEmitter from 'events';

export enum IEvent {
    Identify = 'OP_IDENTIFY',
    Heartbeat = 'OP_HEARTBEAT',
    Disconnect = 'OP_DISCONNECT',

    Error = 'OP_ERROR'
}

export interface IMessage {
    op: IEvent;
    data: object;
}

export interface IHandshake {
    player: {
        name: string;
    },
    game: {
        name: string;
    }
}

export interface IError {
    message: string;
}

export default class RobloxResolver {
    private readonly server: WebSocket.Server;

    private readonly event: EventEmitter;

    private readonly cache: Map<string, WebSocket> = new Map;

    constructor(host: string, port: string | number) {
        port = typeof port === 'string' ? parseInt(port) : port;

        this.server = new WebSocket.Server(
            {
                host,
                port
            }
        );

        this.event = new EventEmitter;

        this.server.on('connection', (socket) => {
            let identifier: string = '';

            socket.on('message', (buffer) => {
                const { op, data } = JSON.parse(
                    buffer.toString()
                ) as IMessage;

                switch (op) {
                    case IEvent.Identify: {
                        const { player, game } = data as IHandshake;

                        this.cache.set(player.name, socket);

                        this.event.emit(IEvent.Identify, { player, game });

                        identifier = player.name;

                        break;
                    }
                    case IEvent.Heartbeat: {
                        socket.send(
                            JSON.stringify(
                                {
                                    op: 'OP_HEARTBEAT_ACK',
                                    data: {}
                                }
                            )
                        );
                        
                        break;
                    }
                    case IEvent.Error: {
                        const { message } = data as IError;

                        console.log(`[${identifier}] ${message}`);

                        break;
                    }
                    default: {
                        vscode.window.showErrorMessage(`[RobloxResolver.ts] Couldn't resolve the following opcode: ${op}.`);

                        break;
                    }
                }
            });

            socket.on('close', () => {
                if (identifier) {
                    this.cache.delete(identifier);

                    this.event.emit(IEvent.Disconnect, identifier);
                }
            });
        });
    }

    on(op: IEvent.Identify, callback: (data: { player: IHandshake['player'], game: IHandshake['game'] }) => void): void;

    on(op: IEvent.Heartbeat, callback: () => void): void;

    on(op: IEvent.Disconnect, callback: (identifier: string) => void): void;

    public on(op: IEvent, callback: (data: any) => void) {
        const event = this.event;

        event.on(op, callback);
    }

    public resolve(identifier: string): WebSocket | undefined {
        return this.cache.get(identifier);
    }
}