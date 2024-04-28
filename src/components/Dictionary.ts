export default class Dictionary<T> {
    private items: { [key: string]: T } = {};

    private onChange: (key: string, value?: T) => void;

    constructor(onChange: (key: string, value?: T) => void) {
        this.onChange = onChange;
    }
    
    public get(key: string): T | undefined {
        return this.items[key];
    }

    public set(key: string, value: T): void {
        this.items[key] = value;

        this.onChange(key, value);
    }

    public delete(key: string): void {
        delete this.items[key];

        this.onChange(key, undefined);
    }

    public has(key: string): boolean {
        return key in this.items;
    }

    public keys(): string[] {
        return Object.keys(this.items);
    }

    public values(): T[] {
        return Object.values(this.items);
    }

    public entries(): [string, T][] {
        return Object.entries(this.items);
    }

    public clear(): void {
        this.items = {};
    }
}