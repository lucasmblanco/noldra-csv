"use strict";
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInDataProvider = exports.update = exports.create = void 0;
var SimpleLogger_1 = require("./SimpleLogger");
var papaparse_1 = require("papaparse");
var logger = new SimpleLogger_1.SimpleLogger("uploader", false);
function create(logging, disableCreateMany, dataProvider, resource, values, preCommitCallback, postCommitCallback, file, parseConfig, csvItems) {
    return __awaiter(this, void 0, void 0, function () {
        var parsedValues, _a, _b, reportItems, csvData, shouldReject;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!preCommitCallback) return [3 /*break*/, 2];
                    return [4 /*yield*/, preCommitCallback("create", values)];
                case 1:
                    _a = _c.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = values;
                    _c.label = 3;
                case 3:
                    parsedValues = _a;
                    return [4 /*yield*/, createInDataProvider(logging, !!disableCreateMany, dataProvider, resource, parsedValues, csvItems)];
                case 4:
                    _b = _c.sent(), reportItems = _b[0], csvData = _b[1];
                    if (postCommitCallback) {
                        postCommitCallback(reportItems, csvData);
                    }
                    shouldReject = !postCommitCallback && reportItems.some(function (r) { return !r.success; });
                    if (shouldReject) {
                        return [2 /*return*/, Promise.reject(reportItems.map(function (r) { return r.response; }))];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.create = create;
function update(logging, disableUpdateMany, dataProvider, resource, values, preCommitCallback, postCommitCallback, file) {
    return __awaiter(this, void 0, void 0, function () {
        var parsedValues, _a, _b, reportItems, csvData;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!preCommitCallback) return [3 /*break*/, 2];
                    return [4 /*yield*/, preCommitCallback("overwrite", values)];
                case 1:
                    _a = _c.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = values;
                    _c.label = 3;
                case 3:
                    parsedValues = _a;
                    return [4 /*yield*/, updateInDataProvider(logging, !!disableUpdateMany, dataProvider, resource, parsedValues)];
                case 4:
                    _b = _c.sent(), reportItems = _b[0], csvData = _b[1];
                    if (postCommitCallback) {
                        postCommitCallback(reportItems, csvData);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.update = update;
function createInDataProvider(logging, disableCreateMany, dataProvider, resource, values, csvItems) {
    return __awaiter(this, void 0, void 0, function () {
        var reportItems, items, response, error_1, providerMethodNotFoundErrors, shouldTryFallback, apiError, result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger.setEnabled(logging);
                    logger.log("createInDataProvider", { dataProvider: dataProvider, resource: resource, values: values });
                    reportItems = [];
                    if (!disableCreateMany) return [3 /*break*/, 2];
                    return [4 /*yield*/, createInDataProviderFallback(dataProvider, resource, values)];
                case 1:
                    items = _a.sent();
                    reportItems.push.apply(reportItems, items);
                    return [2 /*return*/, items];
                case 2:
                    _a.trys.push([2, 4, , 9]);
                    return [4 /*yield*/, dataProvider.createMany(resource, { data: values })];
                case 3:
                    response = _a.sent();
                    reportItems.push({
                        value: null,
                        success: true,
                        response: response,
                    });
                    return [3 /*break*/, 9];
                case 4:
                    error_1 = _a.sent();
                    providerMethodNotFoundErrors = ["Unknown dataProvider", "createMany"];
                    shouldTryFallback = doesErrorContainString(error_1, providerMethodNotFoundErrors);
                    apiError = !shouldTryFallback;
                    if (apiError) {
                        reportItems.push({
                            value: null,
                            err: error_1,
                            success: false,
                            response: null,
                        });
                    }
                    if (!shouldTryFallback) return [3 /*break*/, 8];
                    logger.log("createInDataProvider", "createMany not found on data provider (you may need to implement it see: https://github.com/benwinding/react-admin-import-csv#reducing-requests): using fallback instead");
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, createInDataProviderFallback(dataProvider, resource, values, csvItems)];
                case 6:
                    result = _a.sent();
                    return [2 /*return*/, result];
                case 7:
                    error_2 = _a.sent();
                    logger.error("createInDataProvider", error_2);
                    return [3 /*break*/, 8];
                case 8: return [3 /*break*/, 9];
                case 9: return [2 /*return*/, reportItems];
            }
        });
    });
}
exports.createInDataProvider = createInDataProvider;
function createInDataProviderFallback(dataProvider, resource, values, csvItems) {
    return __awaiter(this, void 0, void 0, function () {
        var reportItems, csvData;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    reportItems = [];
                    return [4 /*yield*/, Promise.all(values.map(function (value, i) {
                            if (value.errors) {
                                var originalEntry = Object.assign({}, csvItems === null || csvItems === void 0 ? void 0 : csvItems[i], {
                                    Status: value.errors,
                                });
                                return {
                                    value: originalEntry,
                                    success: false,
                                    err: "Some fields contain errors.",
                                };
                            }
                            else {
                                var _a = value.Tags, Tags_1 = _a === void 0 ? [] : _a, _b = value.Properties, Properties_1 = _b === void 0 ? [] : _b, filteredValue = __rest(value, ["Tags", "Properties"]);
                                return dataProvider
                                    .create(resource, { data: filteredValue })
                                    .then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                                    var originalEntry, valueResult, _a, _b;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0:
                                                originalEntry = Object.assign({}, csvItems === null || csvItems === void 0 ? void 0 : csvItems[i], {
                                                    Status: ["The resource was added successfully."],
                                                });
                                                valueResult = {
                                                    success: true,
                                                    res: res,
                                                    value: originalEntry,
                                                };
                                                if (!(Tags_1.length > 0)) return [3 /*break*/, 2];
                                                !valueResult.attributes && (valueResult.attributes = {});
                                                _a = valueResult.attributes;
                                                return [4 /*yield*/, Promise.all(Tags_1.map(function (id) {
                                                        dataProvider
                                                            .create("ProductGroupTag", {
                                                            data: {
                                                                ProductGroupId: res.data.id,
                                                                TagId: id,
                                                            },
                                                        })
                                                            .then(function (res) {
                                                            return {
                                                                res: res,
                                                                success: true,
                                                            };
                                                        })
                                                            .catch(function (err) {
                                                            return {
                                                                res: err,
                                                                success: false,
                                                            };
                                                        });
                                                    }))];
                                            case 1:
                                                _a.Tag = _c.sent();
                                                _c.label = 2;
                                            case 2:
                                                if (!(Properties_1.length > 0)) return [3 /*break*/, 4];
                                                !valueResult.attributes && (valueResult.attributes = {});
                                                _b = valueResult.attributes;
                                                return [4 /*yield*/, Promise.all(Properties_1.map(function (property) {
                                                        dataProvider
                                                            .create("ProductGroupProperties", {
                                                            data: {
                                                                ProductGroupId: res.data.id,
                                                                PropertiesId: property.id,
                                                                Value: property.value,
                                                                // borrar
                                                                DateUpdate: new Date(),
                                                            },
                                                        })
                                                            .then(function (res) {
                                                            return {
                                                                res: res,
                                                                success: true,
                                                            };
                                                        })
                                                            .catch(function (err) {
                                                            return {
                                                                res: err,
                                                                success: false,
                                                            };
                                                        });
                                                    }))];
                                            case 3:
                                                _b.Properties = _c.sent();
                                                _c.label = 4;
                                            case 4: return [2 /*return*/, valueResult];
                                        }
                                    });
                                }); })
                                    .catch(function (err) {
                                    var originalEntry = Object.assign({}, csvItems === null || csvItems === void 0 ? void 0 : csvItems[i], {
                                        Status: ["There was a problem when adding the resource."],
                                    });
                                    return {
                                        success: false,
                                        res: err,
                                        value: {
                                            Status: originalEntry,
                                        },
                                    };
                                });
                            }
                        })).then(function (res) {
                            reportItems.push.apply(reportItems, res);
                            return (0, papaparse_1.unparse)(res.map(function (res) { return res.value; }));
                        })];
                case 1:
                    csvData = _a.sent();
                    return [2 /*return*/, [reportItems, csvData]];
            }
        });
    });
}
function updateInDataProvider(logging, disableUpdateMany, dataProvider, resource, values) {
    return __awaiter(this, void 0, void 0, function () {
        var ids, items, reportItems, response, error_3, providerMethodNotFoundErrors, shouldTryFallback, apiError, items, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ids = values.map(function (v) { return v.id; });
                    logger.setEnabled(logging);
                    logger.log("updateInDataProvider", {
                        dataProvider: dataProvider,
                        resource: resource,
                        values: values,
                        logging: logging,
                        ids: ids,
                    });
                    if (!disableUpdateMany) return [3 /*break*/, 2];
                    return [4 /*yield*/, updateInDataProviderFallback(dataProvider, resource, values)];
                case 1:
                    items = _a.sent();
                    return [2 /*return*/, items];
                case 2:
                    reportItems = [];
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 10]);
                    return [4 /*yield*/, dataProvider.updateManyArray(resource, {
                            ids: ids,
                            data: values,
                        })];
                case 4:
                    response = _a.sent();
                    reportItems.push({
                        value: null,
                        success: true,
                        response: response,
                    });
                    return [3 /*break*/, 10];
                case 5:
                    error_3 = _a.sent();
                    providerMethodNotFoundErrors = ["Unknown dataProvider", "updateMany"];
                    shouldTryFallback = doesErrorContainString(error_3, providerMethodNotFoundErrors);
                    apiError = !shouldTryFallback;
                    if (apiError) {
                        reportItems.push({
                            value: null,
                            err: error_3,
                            success: false,
                            response: null,
                        });
                    }
                    if (!shouldTryFallback) return [3 /*break*/, 9];
                    logger.log("updateInDataProvider", "updateManyArray not found on data provider (you may need to implement it see: https://github.com/benwinding/react-admin-import-csv#reducing-requests): using fallback instead");
                    _a.label = 6;
                case 6:
                    _a.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, updateInDataProviderFallback(dataProvider, resource, values)];
                case 7:
                    items = _a.sent();
                    reportItems.push.apply(reportItems, items);
                    return [3 /*break*/, 9];
                case 8:
                    error_4 = _a.sent();
                    logger.error("updateInDataProvider", error_4);
                    return [3 /*break*/, 9];
                case 9: return [3 /*break*/, 10];
                case 10: return [2 /*return*/, reportItems];
            }
        });
    });
}
function updateInDataProviderFallback(dataProvider, resource, values) {
    return __awaiter(this, void 0, void 0, function () {
        var reportItems;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    reportItems = [];
                    return [4 /*yield*/, Promise.all(values.map(function (value) {
                            return dataProvider
                                .update(resource, {
                                id: value.id,
                                data: value,
                                previousData: null,
                            })
                                .then(function (res) {
                                return reportItems.push({ value: value, success: true, response: res });
                            })
                                .catch(function (err) { return reportItems.push({ value: value, success: false, err: err }); });
                        }))];
                case 1:
                    _a.sent();
                    return [2 /*return*/, reportItems];
            }
        });
    });
}
function doesErrorContainString(error, stringsToCheck) {
    var errorString = (!!error && typeof error === "object" && (error === null || error === void 0 ? void 0 : error.toString())) || "";
    var shouldTryFallback = stringsToCheck.some(function (stringToCheck) {
        return errorString.includes(stringToCheck);
    });
    return shouldTryFallback;
}
//# sourceMappingURL=uploader.js.map