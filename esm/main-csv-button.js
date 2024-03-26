var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import React from "react";
import { useRefresh, useDataProvider, useResourceContext, } from "react-admin";
import { SimpleLogger } from "./SimpleLogger";
import { GetCSVItems, GetIdsColliding, } from "./import-controller";
import { create, update } from "./uploader";
import { translateWrapper } from "./translateWrapper";
import { ImportCsvDialogStrategy } from "./components/import-csv-dialog-strategy";
import { ImportCsvDialogEachItem } from "./components/import-csv-dialog-each-item";
import { ImportButton } from "./components/import-button";
export var MainCsvImport = function (props) {
    var refresh = useRefresh();
    var translate = translateWrapper();
    var dataProvider = useDataProvider();
    var resource = props.resource || useResourceContext();
    var _a = props, parseConfig = _a.parseConfig, preCommitCallback = _a.preCommitCallback, postCommitCallback = _a.postCommitCallback, validateRow = _a.validateRow, transformRows = _a.transformRows, disableCreateMany = _a.disableCreateMany, disableUpdateMany = _a.disableUpdateMany, disableGetMany = _a.disableGetMany, disableImportNew = _a.disableImportNew, disableImportOverwrite = _a.disableImportOverwrite;
    var disableNew = !!disableImportNew;
    var disableOverwrite = !!disableImportOverwrite;
    var logging = !!props.logging;
    var variant = props.variant, label = props.label, resourceName = props.resourceName;
    var logger = new SimpleLogger("import-csv-button", true);
    logger.setEnabled(logging);
    if (!resource) {
        throw new Error(translate("csv.buttonMain.emptyResource"));
    }
    if (!label) {
        label = translate("csv.buttonMain.label", { numb: 99 });
    }
    if (!variant) {
        variant = "text";
    }
    if (!resourceName) {
        resourceName = resource;
    }
    var _b = React.useState(false), open = _b[0], setOpen = _b[1];
    var _c = React.useState(false), openAskDecide = _c[0], setOpenAskDecide = _c[1];
    var _d = React.useState([]), values = _d[0], setValues = _d[1];
    var _e = React.useState([]), idsConflicting = _e[0], setIdsConflicting = _e[1];
    var _f = React.useState(false), isLoading = _f[0], setIsLoading = _f[1];
    var _g = React.useState(null), currentValue = _g[0], setCurrentValue = _g[1];
    var _h = React.useState(), file = _h[0], setFile = _h[1];
    var fileName = (file && file.name) + "";
    React.useEffect(function () {
        var mounted = true;
        if (!file) {
            setOpen(false);
            return;
        }
        setOpen(true);
        function processCSV() {
            return __awaiter(this, void 0, void 0, function () {
                function idNotInNumbersOrStrings(item) {
                    var matchesIdString = collidingIdsStringsSet.has(item.id + "");
                    var matchesIdNumber = collidingIdsNumbersSet.has(+item.id);
                    return !(matchesIdNumber || matchesIdString);
                }
                var _a, csvRows, ogData, csvItems, _b, csvNew, _c, collidingIds, hasCollidingIds, collidingIdsStringsSet, collidingIdsNumbersSet, collidingIdsAsNumbers, allCollidingIdsAreNumbers, csvItemsNotColliding;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            // Is valid csv
                            if (!file) {
                                throw new Error("File not processed from input field");
                            }
                            logger.log("Parsing CSV file");
                            return [4 /*yield*/, GetCSVItems(logging, translate, file, parseConfig)];
                        case 1:
                            _a = _d.sent(), csvRows = _a[0], ogData = _a[1];
                            if (!transformRows) return [3 /*break*/, 3];
                            return [4 /*yield*/, transformRows(csvRows)];
                        case 2:
                            _b = _d.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            _b = csvRows;
                            _d.label = 4;
                        case 4:
                            csvItems = _b;
                            if (!validateRow) return [3 /*break*/, 6];
                            return [4 /*yield*/, Promise.all(csvItems.map(validateRow))];
                        case 5:
                            _c = _d.sent();
                            return [3 /*break*/, 7];
                        case 6:
                            _c = csvItems;
                            _d.label = 7;
                        case 7:
                            csvNew = _c;
                            mounted && setValues(csvNew);
                            // Does CSV pass user validation
                            logger.log("Validating CSV file");
                            // const csvItemsWithValidation = await CheckCSVValidation(
                            //   logging,
                            //   translate,
                            //   csvItems,
                            //   validateRow
                            // );
                            setValues(csvNew);
                            // Are there any import overwrites?
                            logger.log("Checking rows to import");
                            return [4 /*yield*/, GetIdsColliding(logging, translate, dataProvider, csvNew, resourceName, disableGetMany)];
                        case 8:
                            collidingIds = _d.sent();
                            mounted && setIdsConflicting(collidingIds);
                            hasCollidingIds = !!collidingIds.length;
                            logger.log("Has colliding ids?", { hasCollidingIds: hasCollidingIds, collidingIds: collidingIds });
                            if (!hasCollidingIds) {
                                return [2 /*return*/, [csvNew, hasCollidingIds, ogData]];
                            }
                            collidingIdsStringsSet = new Set(collidingIds.map(function (id) { return id + ""; }));
                            collidingIdsNumbersSet = new Set();
                            collidingIdsAsNumbers = collidingIds.map(function (id) {
                                return parseFloat(id + "");
                            });
                            allCollidingIdsAreNumbers = collidingIdsAsNumbers.every(function (id) {
                                return isFinite(id);
                            });
                            if (allCollidingIdsAreNumbers) {
                                collidingIdsAsNumbers.map(function (id) { return collidingIdsNumbersSet.add(id); });
                            }
                            csvItemsNotColliding = csvItems.filter(idNotInNumbersOrStrings);
                            logger.log("Importing items which arent colliding", {
                                csvItemsNotColliding: csvItemsNotColliding,
                            });
                            // const csvNewCheckErrors = csvNew.map((item: any) => {
                            //   if (!item.report.getErrorStatus()) {
                            //     console.log('validado correctamente');
                            //     item.report.setDetails("The row was successfully validated");
                            //   }
                            //   return item;
                            // })
                            return [2 /*return*/, [csvNew, hasCollidingIds, csvItems]];
                    }
                });
            });
        }
        processCSV()
            .then(function (_a) {
            var csvNew = _a[0], hasCollidingIds = _a[1], ogData = _a[2];
            return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, createRows(csvNew, ogData)];
                        case 1:
                            _b.sent();
                            mounted && !hasCollidingIds && handleClose();
                            return [2 /*return*/];
                    }
                });
            });
        })
            .catch(function (error) {
            mounted && resetVars();
            logger.error(error);
        });
        return function () {
            mounted = false;
        };
    }, [file]);
    var refInput;
    function resetVars() {
        setOpen(false);
        setOpenAskDecide(false);
        setValues([]);
        setIdsConflicting([]);
        setIsLoading(false);
        setFile(null);
    }
    function createRows(vals, csvItems) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, create(logging, disableCreateMany, dataProvider, resourceName, vals, preCommitCallback, postCommitCallback, file, parseConfig, csvItems)];
            });
        });
    }
    function updateRows(vals) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, update(logging, disableUpdateMany, dataProvider, resourceName, vals, preCommitCallback, postCommitCallback)];
            });
        });
    }
    function clickImportButton() {
        resetVars();
        refInput.value = "";
        refInput.click();
    }
    var onFileAdded = function (e) {
        var file = e.target.files && e.target.files[0];
        setFile(file);
    };
    // const notify = useNotify();
    var handleClose = function () {
        logger.log("handleClose", { file: file });
        resetVars();
        // notify(translate("csv.dialogImport.alertClose", { fname: fileName }), {
        //   type: "info",
        // });
        refresh();
    };
    var handleReplace = function () { return __awaiter(void 0, void 0, void 0, function () {
        var collidingIdsSet_1, valuesColliding, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger.log("handleReplace");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    setIsLoading(true);
                    return [4 /*yield*/, new Promise(function (res) { return setTimeout(res, 1000); })];
                case 2:
                    _a.sent();
                    collidingIdsSet_1 = new Set(idsConflicting.map(function (id) { return id; }));
                    valuesColliding = values.filter(function (item) {
                        return collidingIdsSet_1.has(item.id);
                    });
                    return [4 /*yield*/, updateRows(valuesColliding)];
                case 3:
                    _a.sent();
                    handleClose();
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    setIsLoading(false);
                    logger.error("handleReplace", error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleSkip = function () {
        logger.log("handleSkip");
        handleClose();
    };
    var handleAskDecide = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            logger.log("handleAskDecide");
            setOpen(false);
            nextConflicting();
            setOpenAskDecide(true);
            return [2 /*return*/];
        });
    }); };
    var nextConflicting = function () {
        var currentId = Array.isArray(idsConflicting) && idsConflicting.pop();
        setIdsConflicting(idsConflicting);
        var foundValue = Array.isArray(values) && values.filter(function (v) { return v.id === currentId; }).pop();
        logger.log("nextConflicting", { foundValue: foundValue, currentId: currentId });
        var isLast = !foundValue;
        if (!isLast) {
            setCurrentValue(foundValue);
        }
        return foundValue && __assign({}, foundValue);
    };
    var handleAskDecideReplace = function () { return __awaiter(void 0, void 0, void 0, function () {
        var val;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger.log("handleAskDecideReplace");
                    return [4 /*yield*/, updateRows([currentValue])];
                case 1:
                    _a.sent();
                    val = nextConflicting();
                    if (!val) {
                        return [2 /*return*/, handleClose()];
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var handleAskDecideAddAsNew = function () { return __awaiter(void 0, void 0, void 0, function () {
        var localCopy, val;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger.log("handleAskDecideAddAsNew");
                    localCopy = Object.assign({}, currentValue);
                    delete localCopy.id;
                    return [4 /*yield*/, createRows([localCopy])];
                case 1:
                    _a.sent();
                    val = nextConflicting();
                    if (!val) {
                        return [2 /*return*/, handleClose()];
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var handleAskDecideSkip = function () { return __awaiter(void 0, void 0, void 0, function () {
        var val;
        return __generator(this, function (_a) {
            logger.log("handleAskDecideSkip");
            val = nextConflicting();
            if (!val) {
                return [2 /*return*/, handleClose()];
            }
            return [2 /*return*/];
        });
    }); };
    var handleAskDecideSkipAll = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            logger.log("handleAskDecideSkipAll");
            handleClose();
            return [2 /*return*/];
        });
    }); };
    return (React.createElement(React.Fragment, null,
        React.createElement(ImportButton, { variant: variant, label: label, clickImportButton: clickImportButton, onFileAdded: onFileAdded, onRef: function (ref) { return (refInput = ref); } }),
        React.createElement(ImportCsvDialogStrategy, { disableImportOverwrite: disableOverwrite, resourceName: resourceName, fileName: fileName, count: values && values.length, handleClose: handleClose, handleReplace: handleReplace, handleSkip: handleSkip, handleAskDecide: handleAskDecide, open: open, isLoading: isLoading, idsConflicting: idsConflicting }),
        React.createElement(ImportCsvDialogEachItem, { disableImportNew: disableNew, disableImportOverwrite: disableOverwrite, currentValue: currentValue, resourceName: resourceName, values: values, fileName: fileName, openAskDecide: openAskDecide, handleClose: handleClose, handleAskDecideReplace: handleAskDecideReplace, handleAskDecideAddAsNew: handleAskDecideAddAsNew, handleAskDecideSkip: handleAskDecideSkip, handleAskDecideSkipAll: handleAskDecideSkipAll, isLoading: isLoading, idsConflicting: idsConflicting })));
};
//# sourceMappingURL=main-csv-button.js.map