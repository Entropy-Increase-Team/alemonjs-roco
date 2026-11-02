import { type WeGameContext } from '@src/model/wegameAccount';
export declare function parseBindUidArgs(rawArgs: string): string;
export declare function bindRocomUid(context: WeGameContext, uid: string): Promise<string>;
export declare function getBoundUid(context: WeGameContext): Promise<string>;
export declare function hasBindUidRecord(context: WeGameContext): Promise<boolean>;
