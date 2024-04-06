import { ErrorCallback, PrecommitCallback } from "./config.interface";
import { SimpleLogger } from "./SimpleLogger";
import { DataProvider } from "ra-core";
import type { ParseConfig } from "papaparse";
import { unparse } from "papaparse";

interface Value {
  success: boolean;
  res: any;
  value: any;
  attributes?: any;
}

interface ReportItem {
  value: any;
  success: boolean;
  err?: any;
  response?: any;
}

const CHUNK_SIZE = 10;
const ATTRIB_CHUNK_SIZE = 5;

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

export const creationSummary = (values, attribute) => {
  const successful = values.filter((value) => value.success).length;

  if (successful === values.length) {
    return `${attribute} successful added`;
  } else if (successful === 0) {
    return `No ${attribute} created`;
  } else {
    return `Some ${attribute} failed`;
  }
};

async function createInDataProviderFallback(
  dataProvider: DataProvider,
  resource: string,
  values: any[],
  csvItems?: any[]
): Promise<any> {
  const reportItems: ReportItem[] = [];
  let csvDataFinal: (
    | Value
    | {
        value: any;
        success: boolean;
        err: string;
      }
  )[] = [];

  for (let i = 0; i < values.length; i += CHUNK_SIZE) {
    const chunkedValues = values.slice(i, i + CHUNK_SIZE);
    const chunkedCsvItems = csvItems?.slice(i, i + CHUNK_SIZE);
    const csvData = await Promise.all(
      chunkedValues.map(async (value, i) => {
        if (value.report.getErrorStatus()) {
          const itemData = Object.assign({}, chunkedCsvItems?.[i], {
            "row validation": value.report.getDetails(),
            Status:
              "The upload was unsuccessful due to errors in specific fields. Please address the issues and try again",
          });
          return {
            value: itemData,
            success: false,
            err: "The upload was unsuccessful due to errors in specific fields. Please address the issues and try again",
          };
        } else {
          const {
            Tags = [],
            Properties = [],
            report,
            ...filteredValue
          } = value;
          try {
            const res = await dataProvider.create(resource, {
              data: filteredValue,
            });

            const itemData = Object.assign({}, chunkedCsvItems?.[i], {
              "row validation": value.report.getDetails(),
              Status: "The resource was added successfully",
            });

            const valueResult: Value = {
              success: true,
              res: res,
              value: itemData,
            };

            if (Tags.length) {
              !valueResult.attributes && (valueResult.attributes = {});
              for (let i = 0; i < Tags.length; i += ATTRIB_CHUNK_SIZE) {
                const chunkedAttrib = Tags.slice(i, i + ATTRIB_CHUNK_SIZE);
                const tagsData = await Promise.all(
                  chunkedAttrib.map(async (id: string) => {
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
                      return { success: false, error: err };
                    }
                  })
                );
                valueResult.attributes.Tag = [
                  ...valueResult.attributes.Tag,
                  ...tagsData,
                ];
              }
              /* OLD APPROACH, DOESN'T HAVE ANY SAFEGUARD RELATED TO TAGS DATA LENGTH */
              // valueResult.attributes.Tag = await Promise.all(
              //   Tags.map(async (id: string) => {
              //     try {
              //       const createdTag = await dataProvider.create(
              //         "ProductGroupTag",
              //         {
              //           data: {
              //             ProductGroupId: res.data.id,
              //             TagId: id,
              //           },
              //         }
              //       );
              //       return { tag: createdTag, success: true };
              //     } catch (err) {
              //       return { success: false, error: err };
              //     }
              //   })
              // );
              /* ------------------------------------- */
              itemData["Tag status"] = creationSummary(
                valueResult.attributes.Tag,
                "tags"
              );
            }

            if (Properties.length) {
              !valueResult.attributes && (valueResult.attributes = {});
              for (let i = 0; i < Properties.length; i += ATTRIB_CHUNK_SIZE) {
                const chunkedAttrib = Properties.slice(
                  i,
                  i + ATTRIB_CHUNK_SIZE
                );
                const propertiesData = await Promise.all(
                  chunkedAttrib.map(
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
                        return { success: false, error: err };
                      }
                    }
                  )
                );
                valueResult.attributes.Properties = [
                  ...valueResult.attributes.Properties,
                  ...propertiesData,
                ];
              }
              /* OLD APPROACH, DOESN'T HAVE ANY SAFEGUARD RELATED TO PROPERTIES DATA LENGTH */
              // valueResult.attributes.Properties = await Promise.all(
              //   Properties.map(
              //     async (property: { id: string; value: string }) => {
              //       try {
              //         const createdProperty = await dataProvider.create(
              //           "ProductGroupProperties",
              //           {
              //             data: {
              //               ProductGroupId: res.data.id,
              //               PropertiesId: property.id,
              //               Value: property.value,
              //               // borrar
              //               DateUpdate: new Date(),
              //             },
              //           }
              //         );
              //         return { property: createdProperty, success: true };
              //       } catch (err) {
              //         return { success: false, error: err };
              //       }
              //     }
              //   )
              // );
              /* ------------------------------------- */
              itemData["Properties status"] = creationSummary(
                valueResult.attributes.Properties,
                "properties"
              );
            }
            return valueResult;
          } catch (err) {
            const itemData = Object.assign({}, chunkedCsvItems?.[i], {
              "row validation": value.report.getDetails(),
              Status: "There was a problem when adding the resource",
            });
            return {
              success: false,
              res: err,
              value: itemData,
            };
          }
        }
      })
    );
    csvDataFinal = [...csvDataFinal, ...csvData];
  }
  try {
    reportItems.push(...csvDataFinal);
    return [reportItems, unparse(csvDataFinal.map((data) => data.value))];
  } catch (err) {
    console.error("Error parsing data:", err);
    return [reportItems, []];
  }
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
