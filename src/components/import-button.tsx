import React, { useEffect } from "react";
import { Button as RAButton } from "react-admin";
import Chip from "@mui/material/Chip";
import { Tooltip } from "@mui/material";
import GetAppIcon from "@mui/icons-material/GetApp";
import { translateWrapper } from "../translateWrapper";

interface ImportButtonProps {
  variant: "text" | "outlined" | "contained";
  label: string;
  clickImportButton: () => any;
  onFileAdded: (e: React.ChangeEvent<HTMLInputElement>) => any;
  onRef: (el: HTMLInputElement) => any;
  chip?: boolean;
}

export function ImportButton(props: ImportButtonProps) {
  const { variant, label, clickImportButton, onFileAdded, onRef, chip } = props;
  const translate = translateWrapper();
  return (
    <Tooltip title={translate("csv.buttonMain.tooltip")}>
      <div>
        {chip ? (
          <Chip
            variant="outlined"
            size="small"
            color="primary"
            label={label}
            onClick={clickImportButton}
            icon={
              <GetAppIcon
                style={{ transform: "rotate(180deg)", fontSize: "20" }}
              />
            }
          />
        ) : (
          <RAButton
            color="primary"
            component="span"
            variant={variant}
            label={label}
            onClick={clickImportButton}
          >
            <GetAppIcon
              style={{ transform: "rotate(180deg)", fontSize: "20" }}
            />
          </RAButton>
        )}
        <input
          ref={onRef}
          type="file"
          style={{ display: "none" }}
          onChange={onFileAdded}
          accept=".csv,.tsv"
        />
      </div>
    </Tooltip>
  );
}
