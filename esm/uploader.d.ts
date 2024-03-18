import { ErrorCallback, PrecommitCallback } from "./config.interface";
import { DataProvider } from "ra-core";
import type { ParseConfig } from "papaparse";
export declare function create(logging: boolean, disableCreateMany: boolean | undefined, dataProvider: DataProvider, resource: string, values: any[], preCommitCallback?: PrecommitCallback, postCommitCallback?: ErrorCallback, file?: File | null | undefined, parseConfig?: ParseConfig<any, undefined> | undefined, csvItems?: any[]): Promise<undefined>;
export declare function update(logging: boolean, disableUpdateMany: boolean | undefined, dataProvider: DataProvider, resource: string, values: any[], preCommitCallback?: PrecommitCallback, postCommitCallback?: ErrorCallback, file?: File | null | undefined): Promise<void>;
export declare function createInDataProvider(logging: boolean, disableCreateMany: boolean, dataProvider: DataProvider, resource: string, values: any[], csvItems: any[]): Promise<any>;
