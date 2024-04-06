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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.creationSummary = exports.createInDataProvider = exports.update = exports.create = void 0;
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
var creationSummary = function (values, attribute) {
    var successful = values.filter(function (value) { return value.success; }).length;
    if (successful === values.length) {
        return "".concat(attribute, " successful added");
    }
    else if (successful === 0) {
        return "No ".concat(attribute, " created");
    }
    else {
        return "Some ".concat(attribute, " failed");
    }
};
exports.creationSummary = creationSummary;
var handleTags = function (dataProvider, res, data) { return __awaiter(void 0, void 0, void 0, function () {
    function iterRequests() {
        return __asyncGenerator(this, arguments, function iterRequests_1() {
            var _i, data_1, item, createdTag, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _i = 0, data_1 = data;
                        _a.label = 1;
                    case 1:
                        if (!(_i < data_1.length)) return [3 /*break*/, 10];
                        item = data_1[_i];
                        console.log(item);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 6, , 9]);
                        return [4 /*yield*/, __await(dataProvider.create("ProductGroupTag", {
                                data: {
                                    ProductGroupId: res.data.id,
                                    TagId: item,
                                },
                            }))];
                    case 3:
                        createdTag = _a.sent();
                        return [4 /*yield*/, __await({ tag: createdTag, success: true })];
                    case 4: return [4 /*yield*/, _a.sent()];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 6:
                        err_1 = _a.sent();
                        return [4 /*yield*/, __await({ success: false, error: err_1 })];
                    case 7: return [4 /*yield*/, _a.sent()];
                    case 8:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 9:
                        _i++;
                        return [3 /*break*/, 1];
                    case 10: return [2 /*return*/];
                }
            });
        });
    }
    return __generator(this, function (_a) {
        return [2 /*return*/, poolPromises(iterRequests(), 5).then(function (res) { return res; })];
    });
}); };
var handleProperties = function (dataProvider, res, data) { return __awaiter(void 0, void 0, void 0, function () {
    function iterRequests() {
        return __asyncGenerator(this, arguments, function iterRequests_2() {
            var _i, data_2, item, createdProperty, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _i = 0, data_2 = data;
                        _a.label = 1;
                    case 1:
                        if (!(_i < data_2.length)) return [3 /*break*/, 10];
                        item = data_2[_i];
                        console.log(item);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 6, , 9]);
                        return [4 /*yield*/, __await(dataProvider.create("ProductGroupProperties", {
                                data: {
                                    ProductGroupId: res.data.id,
                                    PropertiesId: item.id,
                                    Value: item.value,
                                    // borrar
                                    DateUpdate: new Date(),
                                },
                            }))];
                    case 3:
                        createdProperty = _a.sent();
                        return [4 /*yield*/, __await({ property: createdProperty, success: true })];
                    case 4: return [4 /*yield*/, _a.sent()];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 6:
                        err_2 = _a.sent();
                        return [4 /*yield*/, __await({ success: false, error: err_2 })];
                    case 7: return [4 /*yield*/, _a.sent()];
                    case 8:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 9:
                        _i++;
                        return [3 /*break*/, 1];
                    case 10: return [2 /*return*/];
                }
            });
        });
    }
    return __generator(this, function (_a) {
        return [2 /*return*/, poolPromises(iterRequests(), 5).then(function (res) { return res; })];
    });
}); };
var handleData = function (dataProvider, resource, values, csvItems) { return __awaiter(void 0, void 0, void 0, function () {
    function iterRequests() {
        return __asyncGenerator(this, arguments, function iterRequests_3() {
            var i, itemData, _a, _b, Tags, _c, Properties, report, filteredValue, res, itemData, valueResult, _d, _e, err_3, itemData;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        i = 0;
                        _f.label = 1;
                    case 1:
                        if (!(i < values.length)) return [3 /*break*/, 17];
                        console.log(values[i]);
                        if (!values[i].report.getErrorStatus()) return [3 /*break*/, 4];
                        itemData = Object.assign({}, csvItems === null || csvItems === void 0 ? void 0 : csvItems[i], {
                            "row validation": values[i].report.getDetails(),
                            Status: "The upload was unsuccessful due to errors in specific fields. Please address the issues and try again",
                        });
                        return [4 /*yield*/, __await({
                                value: itemData,
                                success: false,
                                err: "The upload was unsuccessful due to errors in specific fields. Please address the issues and try again",
                            })];
                    case 2: return [4 /*yield*/, _f.sent()];
                    case 3:
                        _f.sent();
                        return [3 /*break*/, 16];
                    case 4:
                        _a = values[i], _b = _a.Tags, Tags = _b === void 0 ? [] : _b, _c = _a.Properties, Properties = _c === void 0 ? [] : _c, report = _a.report, filteredValue = __rest(_a, ["Tags", "Properties", "report"]);
                        _f.label = 5;
                    case 5:
                        _f.trys.push([5, 13, , 16]);
                        return [4 /*yield*/, __await(dataProvider.create(resource, {
                                data: filteredValue,
                            }))];
                    case 6:
                        res = _f.sent();
                        itemData = Object.assign({}, csvItems === null || csvItems === void 0 ? void 0 : csvItems[i], {
                            "row validation": values[i].report.getDetails(),
                            Status: "The resource was added successfully",
                        });
                        valueResult = {
                            success: true,
                            res: res,
                            value: itemData,
                        };
                        if (!(Tags.length > 0)) return [3 /*break*/, 8];
                        !valueResult.attributes && (valueResult.attributes = {});
                        _d = valueResult.attributes;
                        return [4 /*yield*/, __await(handleTags(dataProvider, res, Tags))];
                    case 7:
                        _d.Tag = _f.sent();
                        _f.label = 8;
                    case 8:
                        if (!(Properties.length > 0)) return [3 /*break*/, 10];
                        !valueResult.attributes && (valueResult.attributes = {});
                        _e = valueResult.attributes;
                        return [4 /*yield*/, __await(handleProperties(dataProvider, res, Properties))];
                    case 9:
                        _e.Properties = _f.sent();
                        _f.label = 10;
                    case 10: return [4 /*yield*/, __await(valueResult)];
                    case 11: return [4 /*yield*/, _f.sent()];
                    case 12:
                        _f.sent();
                        return [3 /*break*/, 16];
                    case 13:
                        err_3 = _f.sent();
                        itemData = Object.assign({}, csvItems === null || csvItems === void 0 ? void 0 : csvItems[i], {
                            "row validation": values[i].report.getDetails(),
                            Status: "There was a problem when adding the resource",
                        });
                        return [4 /*yield*/, __await({
                                success: false,
                                res: err_3,
                                value: itemData,
                            })];
                    case 14: return [4 /*yield*/, _f.sent()];
                    case 15:
                        _f.sent();
                        return [3 /*break*/, 16];
                    case 16:
                        i += 1;
                        return [3 /*break*/, 1];
                    case 17: return [2 /*return*/];
                }
            });
        });
    }
    return __generator(this, function (_a) {
        return [2 /*return*/, poolPromises(iterRequests(), 50).then(function (res) {
                console.log(res);
                res;
            })];
    });
}); };
var CHUNK_SIZE = 10;
function poolPromises(iterPromises, poolSize) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log(iterPromises);
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var promises = [];
                    function nextPromise() {
                        return __awaiter(this, void 0, void 0, function () {
                            var _a, value, done, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _a = iterPromises.next(), value = _a.value, done = _a.done;
                                        if (!done) return [3 /*break*/, 2];
                                        _b = resolve;
                                        return [4 /*yield*/, Promise.all(promises)];
                                    case 1:
                                        _b.apply(void 0, [_c.sent()]);
                                        return [3 /*break*/, 3];
                                    case 2:
                                        promises.push(value);
                                        value.then(nextPromise, reject);
                                        _c.label = 3;
                                    case 3: return [2 /*return*/, !done];
                                }
                            });
                        });
                    }
                    while (promises.length < poolSize && nextPromise()) { }
                })];
        });
    });
}
function createInDataProviderFallback(dataProvider, resource, values, csvItems) {
    return __awaiter(this, void 0, void 0, function () {
        var reportItems, csvDataFinal, _loop_1, i;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    reportItems = [];
                    csvDataFinal = [];
                    _loop_1 = function (i) {
                        var chunkedValues, chunkedCsvItems, csvData;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    chunkedValues = values.slice(i, i + CHUNK_SIZE);
                                    chunkedCsvItems = csvItems === null || csvItems === void 0 ? void 0 : csvItems.slice(i, i + CHUNK_SIZE);
                                    return [4 /*yield*/, Promise.all(chunkedValues.map(function (value, i) { return __awaiter(_this, void 0, void 0, function () {
                                            var itemData, _a, Tags, _b, Properties, report, filteredValue, res_1, itemData, valueResult, _c, _d, err_4, itemData;
                                            var _this = this;
                                            return __generator(this, function (_e) {
                                                switch (_e.label) {
                                                    case 0:
                                                        if (!value.report.getErrorStatus()) return [3 /*break*/, 1];
                                                        itemData = Object.assign({}, chunkedCsvItems === null || chunkedCsvItems === void 0 ? void 0 : chunkedCsvItems[i], {
                                                            "row validation": value.report.getDetails(),
                                                            Status: "The upload was unsuccessful due to errors in specific fields. Please address the issues and try again",
                                                        });
                                                        return [2 /*return*/, {
                                                                value: itemData,
                                                                success: false,
                                                                err: "The upload was unsuccessful due to errors in specific fields. Please address the issues and try again",
                                                            }];
                                                    case 1:
                                                        _a = value.Tags, Tags = _a === void 0 ? [] : _a, _b = value.Properties, Properties = _b === void 0 ? [] : _b, report = value.report, filteredValue = __rest(value, ["Tags", "Properties", "report"]);
                                                        _e.label = 2;
                                                    case 2:
                                                        _e.trys.push([2, 8, , 9]);
                                                        return [4 /*yield*/, dataProvider.create(resource, {
                                                                data: filteredValue,
                                                            })];
                                                    case 3:
                                                        res_1 = _e.sent();
                                                        itemData = Object.assign({}, chunkedCsvItems === null || chunkedCsvItems === void 0 ? void 0 : chunkedCsvItems[i], {
                                                            "row validation": value.report.getDetails(),
                                                            Status: "The resource was added successfully",
                                                        });
                                                        valueResult = {
                                                            success: true,
                                                            res: res_1,
                                                            value: itemData,
                                                        };
                                                        if (!(Tags.length > 0)) return [3 /*break*/, 5];
                                                        !valueResult.attributes && (valueResult.attributes = {});
                                                        _c = valueResult.attributes;
                                                        return [4 /*yield*/, Promise.all(Tags.map(function (id) { return __awaiter(_this, void 0, void 0, function () {
                                                                var createdTag, err_5;
                                                                return __generator(this, function (_a) {
                                                                    switch (_a.label) {
                                                                        case 0:
                                                                            _a.trys.push([0, 2, , 3]);
                                                                            return [4 /*yield*/, dataProvider.create("ProductGroupTag", {
                                                                                    data: {
                                                                                        ProductGroupId: res_1.data.id,
                                                                                        TagId: id,
                                                                                    },
                                                                                })];
                                                                        case 1:
                                                                            createdTag = _a.sent();
                                                                            return [2 /*return*/, { tag: createdTag, success: true }];
                                                                        case 2:
                                                                            err_5 = _a.sent();
                                                                            return [2 /*return*/, { success: false, error: err_5 }];
                                                                        case 3: return [2 /*return*/];
                                                                    }
                                                                });
                                                            }); }))];
                                                    case 4:
                                                        _c.Tag = _e.sent();
                                                        itemData["Tag status"] = (0, exports.creationSummary)(valueResult.attributes.Tag, "tags");
                                                        _e.label = 5;
                                                    case 5:
                                                        if (!(Properties.length > 0)) return [3 /*break*/, 7];
                                                        !valueResult.attributes && (valueResult.attributes = {});
                                                        _d = valueResult.attributes;
                                                        return [4 /*yield*/, Promise.all(Properties.map(function (property) { return __awaiter(_this, void 0, void 0, function () {
                                                                var createdProperty, err_6;
                                                                return __generator(this, function (_a) {
                                                                    switch (_a.label) {
                                                                        case 0:
                                                                            _a.trys.push([0, 2, , 3]);
                                                                            return [4 /*yield*/, dataProvider.create("ProductGroupProperties", {
                                                                                    data: {
                                                                                        ProductGroupId: res_1.data.id,
                                                                                        PropertiesId: property.id,
                                                                                        Value: property.value,
                                                                                        // borrar
                                                                                        DateUpdate: new Date(),
                                                                                    },
                                                                                })];
                                                                        case 1:
                                                                            createdProperty = _a.sent();
                                                                            return [2 /*return*/, { property: createdProperty, success: true }];
                                                                        case 2:
                                                                            err_6 = _a.sent();
                                                                            return [2 /*return*/, { success: false, error: err_6 }];
                                                                        case 3: return [2 /*return*/];
                                                                    }
                                                                });
                                                            }); }))];
                                                    case 6:
                                                        _d.Properties = _e.sent();
                                                        itemData["Properties status"] = (0, exports.creationSummary)(valueResult.attributes.Properties, "properties");
                                                        _e.label = 7;
                                                    case 7: return [2 /*return*/, valueResult];
                                                    case 8:
                                                        err_4 = _e.sent();
                                                        itemData = Object.assign({}, chunkedCsvItems === null || chunkedCsvItems === void 0 ? void 0 : chunkedCsvItems[i], {
                                                            "row validation": value.report.getDetails(),
                                                            Status: "There was a problem when adding the resource",
                                                        });
                                                        return [2 /*return*/, {
                                                                success: false,
                                                                res: err_4,
                                                                value: itemData,
                                                            }];
                                                    case 9: return [2 /*return*/];
                                                }
                                            });
                                        }); }))];
                                case 1:
                                    csvData = _b.sent();
                                    csvDataFinal = __spreadArray(__spreadArray([], csvDataFinal, true), csvData, true);
                                    return [2 /*return*/];
                            }
                        });
                    };
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < values.length)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1(i)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i += CHUNK_SIZE;
                    return [3 /*break*/, 1];
                case 4:
                    try {
                        reportItems.push.apply(reportItems, csvDataFinal);
                        return [2 /*return*/, [reportItems, (0, papaparse_1.unparse)(csvDataFinal.map(function (data) { return data.value; }))]];
                    }
                    catch (err) {
                        console.error("Error parsing data:", err);
                        return [2 /*return*/, [reportItems, []]];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function createInDataProviderFallbackWithPooling(dataProvider, resource, values, csvItems) {
    return __awaiter(this, void 0, void 0, function () {
        var reportItems, csvDataFinal;
        return __generator(this, function (_a) {
            reportItems = [];
            csvDataFinal = handleData(dataProvider, resource, values, csvItems);
            console.log(csvDataFinal);
            try {
                reportItems.push.apply(reportItems, csvDataFinal);
                return [2 /*return*/, [reportItems, (0, papaparse_1.unparse)(csvDataFinal)]];
            }
            catch (err) {
                console.error("Error parsing data:", err);
                return [2 /*return*/, [reportItems, []]];
            }
            return [2 /*return*/];
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
// ULTIMO ANDANDO
// async function createInDataProviderFallback(
//   dataProvider: DataProvider,
//   resource: string,
//   values: any[],
//   csvItems?: any[]
// ): Promise<any> {
//   const reportItems: ReportItem[] = [];
//   const csvData = await Promise.all(
//     values.map((value, i) => {
//       if (value.report.getErrorStatus()) {
//         const processedData = Object.assign({}, csvItems?.[i], {
//           'Validation Status': value.report.getDetails(),
//           Status: "The upload was unsuccessful due to errors in specific fields. Please address the issues and try again"
//         });
//         return {
//           value: processedData,
//           success: false,
//           err: "The upload was unsuccessful due to errors in specific fields. Please address the issues and try again",
//         };
//       } else {
//         const { Tags = [], Properties = [], report, ...filteredValue } = value;
//         return dataProvider
//           .create(resource, { data: filteredValue })
//           .then(async (res) => {
//             const processedData = Object.assign({}, csvItems?.[i], {
//               'Validation Status': value.report.getDetails(),
//               Status: "The resource was added successfully",
//             });
//             const valueResult: Value = {
//               success: true,
//               res: res,
//               value: processedData,
//             };
//             if (Tags.length > 0) {
//               !valueResult.attributes && (valueResult.attributes = {});
//               valueResult.attributes.Tag = await Promise.all(
//                 Tags.map(async (id: string) => {
//                   try {
//                     const createdTag = await dataProvider.create(
//                       "ProductGroupTag",
//                       {
//                         data: {
//                           ProductGroupId: res.data.id,
//                           TagId: id,
//                         },
//                       }
//                     );
//                     return { tag: createdTag, success: true };
//                   } catch (err) {
//                     return { success: false, error: err };
//                   }
//                 })
//               );
//             }
//             if (Properties.length > 0) {
//               !valueResult.attributes && (valueResult.attributes = {});
//               valueResult.attributes.Properties = await Promise.all(
//                 Properties.map(
//                   async (property: { id: string; value: string }) => {
//                     try {
//                       const createdProperty = await dataProvider.create(
//                         "ProductGroupProperties",
//                         {
//                           data: {
//                             ProductGroupId: res.data.id,
//                             PropertiesId: property.id,
//                             Value: property.value,
//                             // borrar
//                             DateUpdate: new Date(),
//                           },
//                         }
//                       );
//                       return { property: createdProperty, success: true };
//                     } catch (err) {
//                       return { success: false, error: err };
//                     }
//                   }
//                 )
//               );
//             }
//             return valueResult;
//           })
//           .catch((err) => {
//             const processedData = Object.assign({}, csvItems?.[i], {
//               'Validation Status': value.report.getDetails(),
//               Status: "There was a problem when adding the resource",
//             });
//             return {
//               success: false,
//               res: err,
//               value: processedData,
//             };
//           });
//       }
//     })
//   ).then((res) => {
//     reportItems.push(...res);
//     return unparse(res.map((data) => data.value));
//   });
//   return [reportItems, csvData];
// }
//# sourceMappingURL=uploader.js.map