import { type ExposeCallContext, type ExposeValueSchema } from 'alemonjs';
import { type WeGameContext } from '../model/wegameAccount';
export declare function currentUser(context: ExposeCallContext): WeGameContext;
export declare const emptyInput: {
    readonly type: "object";
    readonly properties: {};
    readonly additionalProperties: false;
};
export declare const keywordInput: {
    readonly type: "object";
    readonly properties: {
        readonly keyword: {
            readonly type: "string";
            readonly minLength: 1;
            readonly maxLength: 100;
        };
    };
    readonly required: readonly ["keyword"];
    readonly additionalProperties: false;
};
export declare function action<Input, Output>(description: string, inputSchema: ExposeValueSchema, outputSchema: ExposeValueSchema, handler: (input: Input, user: WeGameContext, context: ExposeCallContext) => Promise<Output> | Output, effect?: 'read' | 'write'): import("alemonjs").ExposeActionMeta<Input, Output>;
export declare function query<Input>(description: string, inputSchema: ExposeValueSchema, handler: (input: Input, user: WeGameContext) => Promise<string> | string, effect?: 'read' | 'write'): import("alemonjs").ExposeActionMeta<Input, {
    status: "success";
    text: string;
}>;
export declare function dataQuery<Input, Output>(description: string, inputSchema: ExposeValueSchema, dataSchema: ExposeValueSchema, handler: (input: Input, user: WeGameContext, context: ExposeCallContext) => Promise<Output> | Output, effect?: 'read' | 'write'): import("alemonjs").ExposeActionMeta<Input, {
    status: "success";
    data: Awaited<Output>;
}>;
export declare function object(properties: Record<string, ExposeValueSchema>, required?: string[]): ExposeValueSchema;
export declare const text: {
    readonly type: "string";
    readonly minLength: 1;
    readonly maxLength: 2000;
};
export declare const page: {
    readonly type: "integer";
    readonly minimum: 1;
    readonly maximum: 50;
};
export declare function uid(value: string): string;
export declare const stringSchema: {
    readonly type: "string";
};
export declare const numberSchema: {
    readonly type: "number";
};
export declare const booleanSchema: {
    readonly type: "boolean";
};
export declare function array(items: ExposeValueSchema): ExposeValueSchema;
export declare function record(properties: Record<string, ExposeValueSchema>): ExposeValueSchema;
export declare function strings(...keys: string[]): Record<string, ExposeValueSchema>;
