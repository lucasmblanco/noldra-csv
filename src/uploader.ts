import { ErrorCallback, PrecommitCallback } from "./config.interface";
import { SimpleLogger } from "./SimpleLogger";
import { DataProvider } from "ra-core";
import type { ParseConfig } from "papaparse";
import { unparse } from "papaparse";
import { report } from "process";

let logger = new SimpleLogger("uploader", false);

export async function create(
  logging: boolean,
  disableCreateMany: boolean | undefined,
  dataProvider: DataProvider,
  resource: string,
  values: any[],
  preCommitCallback?: PrecommitCallback,
  postCommitCallback?: ErrorCallback,
  file?: File | null | undefined,
  parseConfig?: ParseConfig<any, undefined> | undefined,
  csvItems?: any[]
) {
  const parsedValues = preCommitCallback
    ? await preCommitCallback("create", values)
    : values;
  const [reportItems, csvData] = await createInDataProvider(
    logging,
    !!disableCreateMany,
    dataProvider,
    resource,
    parsedValues,
    csvItems as any[]
  );
  if (postCommitCallback) {
    postCommitCallback(reportItems, csvData);
  }
  const shouldReject =
    !postCommitCallback && reportItems.some((r) => !r.success);
  if (shouldReject) {
    return Promise.reject(reportItems.map((r) => r.response));
  }
}

export async function update(
  logging: boolean,
  disableUpdateMany: boolean | undefined,
  dataProvider: DataProvider,
  resource: string,
  values: any[],
  preCommitCallback?: PrecommitCallback,
  postCommitCallback?: ErrorCallback,
  file?: File | null | undefined
) {
  const parsedValues = preCommitCallback
    ? await preCommitCallback("overwrite", values)
    : values;
  const [reportItems, csvData] = await updateInDataProvider(
    logging,
    !!disableUpdateMany,
    dataProvider,
    resource,
    parsedValues
  );
  if (postCommitCallback) {
    postCommitCallback(reportItems, csvData);
  }
}

interface ReportItem {
  value: any;
  success: boolean;
  err?: any;
  response?: any;
}

export async function createInDataProvider(
  logging: boolean,
  disableCreateMany: boolean,
  dataProvider: DataProvider,
  resource: string,
  values: any[],
  csvItems: any[]
): Promise<any> {
  logger.setEnabled(logging);
  logger.log("createInDataProvider", { dataProvider, resource, values });
  const reportItems: ReportItem[] = [];
  if (disableCreateMany) {
    const items = await createInDataProviderFallback(
      dataProvider,
      resource,
      values
    );
    reportItems.push(...items);
    return items;
  }
  try {
    const response = await dataProvider.createMany(resource, { data: values });
    reportItems.push({
      value: null,
      success: true,
      response: response,
    });
  } catch (error) {
    const providerMethodNotFoundErrors = ["Unknown dataProvider", "createMany"];
    const shouldTryFallback = doesErrorContainString(
      error,
      providerMethodNotFoundErrors
    );
    const apiError = !shouldTryFallback;
    if (apiError) {
      reportItems.push({
        value: null,
        err: error,
        success: false,
        response: null,
      });
    }
    if (shouldTryFallback) {
      logger.log(
        "createInDataProvider",
        "createMany not found on data provider (you may need to implement it see: https://github.com/benwinding/react-admin-import-csv#reducing-requests): using fallback instead"
      );
      try {
        // const items = await createInDataProviderFallback(
        //   dataProvider,
        //   resource,
        //   values
        // );
        // reportItems.push(...items);
        const result = await createInDataProviderFallback(
          dataProvider,
          resource,
          values,
          csvItems
        );
        return result;
      } catch (error) {
        logger.error("createInDataProvider", error);
      }
    }
  }
  return reportItems;
}

interface Value {
  success: boolean;
  res: any;
  value: any;
  attributes?: { Tag?: any[]; Properties?: any[] };
}

async function createInDataProviderFallback(
  dataProvider: DataProvider,
  resource: string,
  values: any[],
  csvItems?: any[]
): Promise<any> {
  const reportItems: ReportItem[] = [];
  const csvData = await Promise.all(
    values.map((value, i) => {
      if (value.errors) {
        const originalEntry = Object.assign({}, csvItems?.[i], {
          Status: value.errors,
        });
        return {
          value: originalEntry,
          success: false,
          err: "Some fields contain errors.",
        };
      } else {
        const { Tags = [], Properties = [], ...filteredValue } = value;
        return dataProvider
          .create(resource, { data: filteredValue })
          .then(async (res) => {
            const originalEntry = Object.assign({}, csvItems?.[i], {
              Status: ["The resource was added successfully."],
            });
            const valueResult: Value = {
              success: true,
              res: res,
              value: originalEntry,
            };
            if (Tags.length > 0) {
              !valueResult.attributes && (valueResult.attributes = {});
              valueResult.attributes.Tag = await Promise.all(
                Tags.map(async (id: string) => {
                  try {
                    const createdTag = await dataProvider.create(
                      "ProductGroupTag",
                      {
                        data: {
                          ProductGroupId: res.data.id,
                          TagId: id,
                        },
                      }
                    );
                    return { tag: createdTag, success: true };
                  } catch (err) {
                    return { success: false };
                  }
                })
              );
            }
            if (Properties.length > 0) {
              !valueResult.attributes && (valueResult.attributes = {});
              valueResult.attributes.Properties = await Promise.all(
                Properties.map(
                  async (property: { id: string; value: string }) => {
                    try {
                      const createdProperty = await dataProvider.create(
                        "ProductGroupProperties",
                        {
                          data: {
                            ProductGroupId: res.data.id,
                            PropertiesId: property.id,
                            Value: property.value,
                            // borrar
                            DateUpdate: new Date(),
                          },
                        }
                      );
                      return { property: createdProperty, success: true };
                    } catch (err) {
                      console.error("Error creating property:", err);
                      return { success: false };
                    }
                  }
                )
              );
            }
            return valueResult;
          })
          .catch((err) => {
            const originalEntry = Object.assign({}, csvItems?.[i], {
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
    })
  ).then((res) => {
    reportItems.push(...res);
    return unparse(res.map((res) => res.value));
  });
  return [reportItems, csvData];
}

async function updateInDataProvider(
  logging: boolean,
  disableUpdateMany: boolean,
  dataProvider: DataProvider,
  resource: string,
  values: any[]
) {
  const ids = values.map((v) => v.id);
  logger.setEnabled(logging);
  logger.log("updateInDataProvider", {
    dataProvider,
    resource,
    values,
    logging,
    ids,
  });
  if (disableUpdateMany) {
    const items = await updateInDataProviderFallback(
      dataProvider,
      resource,
      values
    );
    return items;
  }
  const reportItems: ReportItem[] = [];
  try {
    const response = await dataProvider.updateManyArray(resource, {
      ids: ids,
      data: values,
    });
    reportItems.push({
      value: null,
      success: true,
      response: response,
    });
  } catch (error) {
    const providerMethodNotFoundErrors = ["Unknown dataProvider", "updateMany"];
    const shouldTryFallback = doesErrorContainString(
      error,
      providerMethodNotFoundErrors
    );
    const apiError = !shouldTryFallback;
    if (apiError) {
      reportItems.push({
        value: null,
        err: error,
        success: false,
        response: null,
      });
    }
    if (shouldTryFallback) {
      logger.log(
        "updateInDataProvider",
        "updateManyArray not found on data provider (you may need to implement it see: https://github.com/benwinding/react-admin-import-csv#reducing-requests): using fallback instead"
      );
      try {
        const items = await updateInDataProviderFallback(
          dataProvider,
          resource,
          values
        );
        reportItems.push(...items);
      } catch (error) {
        logger.error("updateInDataProvider", error);
      }
    }
  }
  return reportItems;
}

async function updateInDataProviderFallback(
  dataProvider: DataProvider,
  resource: string,
  values: any[]
): Promise<ReportItem[]> {
  const reportItems: ReportItem[] = [];
  await Promise.all(
    values.map((value) =>
      dataProvider
        .update(resource, {
          id: value.id,
          data: value,
          previousData: null as any,
        })
        .then((res) =>
          reportItems.push({ value: value, success: true, response: res })
        )
        .catch((err) => reportItems.push({ value: value, success: false, err }))
    )
  );
  return reportItems;
}

function doesErrorContainString(error: any, stringsToCheck: string[]): boolean {
  const errorString =
    (!!error && typeof error === "object" && error?.toString()) || "";
  const shouldTryFallback = stringsToCheck.some((stringToCheck) =>
    errorString.includes(stringToCheck)
  );
  return shouldTryFallback;
}
