import * as vscode from 'vscode';

export interface IExecutable {
    mode: 'automatic' | 'manual' | 'specific';

    name: string;
    path: string;
}

export interface IConfiguration {
    mode: 'single' | 'multi';

    limit?: number;
}

export interface IConfig {
    executable: IExecutable;
    instance: IConfiguration;

    host: string;
    port: number;
}

export class ConfigResolver {
    private static get<T>(selection: string, defaultValue: T): T {
        return vscode.workspace.getConfiguration('roblox-client-manager').get<T>(selection, defaultValue);
    }

    public static resolve(): IConfig {
        const name = ConfigResolver.get<string>('executable.name', 'Krampus.exe');

        const path = ConfigResolver.get<string>('executable.path', '');

        const limit = ConfigResolver.get<number>('instance.limit', -1);

        const host = ConfigResolver.get<string>('host', 'localhost');

        const port = ConfigResolver.get<number>('port', 6969);
    
        return {
            executable: {
                mode: ConfigResolver.get<IExecutable['mode']>('executable.mode', 'manual'),
                name,
                path,
            },
            instance: {
                mode: ConfigResolver.get<IConfiguration['mode']>('instance.mode', 'single'),
                limit,
            },
            host,
            port
        };
    }
}