import { ParseConfig } from "papaparse";
export interface ImportConfig {
    logging?: boolean;
    disableCreateMany?: boolean;
    disableUpdateMany?: boolean;
    disableGetMany?: boolean;
    disableImportNew?: boolean;
    disableImportOverwrite?: boolean;
    preCommitCallback?: PrecommitCallback;
    postCommitCallback?: ErrorCallback;
    transformRows?: (csvRows: any[]) => Promise<any[]>;
    validateRow?: ValidateRowFunction;
    parseConfig?: ParseConfig;
}
export interface Report {
    errorStatus: boolean;
    details: string[];
    getErrorStatus(): boolean;
    getDetails(): string[];
    setErrorStatus(status: boolean): void;
    setDetails(detail: string): void;
}
export type PrecommitCallback = (action: "create" | "overwrite", values: any[]) => Promise<any[]>;
export type ValidateRowFunction = (csvRowItem: any, index?: any, allItems?: any[]) => Promise<any>;
export type ErrorCallback = (error: any, file?: any) => void;
