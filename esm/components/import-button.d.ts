import React from "react";
interface ImportButtonProps {
    variant: "text" | "outlined" | "contained";
    label: string;
    clickImportButton: () => any;
    onFileAdded: (e: React.ChangeEvent<HTMLInputElement>) => any;
    onRef: (el: HTMLInputElement) => any;
    chip?: boolean;
}
export declare function ImportButton(props: ImportButtonProps): React.JSX.Element;
export {};
