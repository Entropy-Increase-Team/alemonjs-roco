export declare function readRuntimeStore<T>(key: string, fileName: string, defaultValue: T): Promise<T>;
export declare function writeRuntimeStore<T>(key: string, fileName: string, value: T): Promise<void>;
