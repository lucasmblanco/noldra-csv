import { unparse } from "papaparse";
import type { DataProvider } from "react-admin";

interface ReportItem {
    value: any;
    success: boolean;
    err?: any;
    response?: any;
  }
  
  interface Value {
    success: boolean;
    res: any;
    value: any;
    attributes?: any;
  }

const handleTags = async (dataProvider, res, data) => {
  async function* iterRequests() {
    for (let item of data) {
      console.log(item);
      try {
        const createdTag = await dataProvider.create("ProductGroupTag", {
          data: {
            ProductGroupId: res.data.id,
            TagId: item,
          },
        });
        yield { tag: createdTag, success: true };
      } catch (err) {
        yield { success: false, error: err };
      }
    }
  }
  return poolPromises(iterRequests(), 5).then((res) => res);
};

const handleProperties = async (dataProvider, res, data) => {
  async function* iterRequests() {
    for (let item of data) {
      console.log(item);
      try {
        const createdProperty = await dataProvider.create(
          "ProductGroupProperties",
          {
            data: {
              ProductGroupId: res.data.id,
              PropertiesId: item.id,
              Value: item.value,
              // borrar
              DateUpdate: new Date(),
            },
          }
        );
        yield { property: createdProperty, success: true };
      } catch (err) {
        yield { success: false, error: err };
      }
    }
  }
  return poolPromises(iterRequests(), 5).then((res) => res);
};

const handleData = async (dataProvider, resource, values, csvItems) => {
  async function* iterRequests() {
    for (let i = 0; i < values.length; i += 1) {
      console.log(values[i]);
      if (values[i].report.getErrorStatus()) {
        const itemData = Object.assign({}, csvItems?.[i], {
          "row validation": values[i].report.getDetails(),
          Status:
            "The upload was unsuccessful due to errors in specific fields. Please address the issues and try again",
        });
        yield {
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
        } = values[i];
        try {
          const res = await dataProvider.create(resource, {
            data: filteredValue,
          });

          const itemData = Object.assign({}, csvItems?.[i], {
            "row validation": values[i].report.getDetails(),
            Status: "The resource was added successfully",
          });

          const valueResult: Value = {
            success: true,
            res: res,
            value: itemData,
          };

          if (Tags.length > 0) {
            !valueResult.attributes && (valueResult.attributes = {});
            valueResult.attributes.Tag = await handleTags(
              dataProvider,
              res,
              Tags
            );
          }

          if (Properties.length > 0) {
            !valueResult.attributes && (valueResult.attributes = {});
            valueResult.attributes.Properties = await handleProperties(
              dataProvider,
              res,
              Properties
            );
          }
          yield valueResult;
        } catch (err) {
          const itemData = Object.assign({}, csvItems?.[i], {
            "row validation": values[i].report.getDetails(),
            Status: "There was a problem when adding the resource",
          });
          yield {
            success: false,
            res: err,
            value: itemData,
          };
        }
      }
    }
  }
  return poolPromises(iterRequests(), 50).then((res) => {
    console.log(res);
    res;
  });
};

async function poolPromises(iterPromises, poolSize) {
  console.log(iterPromises);
  return new Promise((resolve, reject) => {
    let promises: any[] = [];
    async function nextPromise() {
      let { value, done } = iterPromises.next();
      if (done) {
        resolve(await Promise.all(promises));
      } else {
        promises.push(value);
        value.then(nextPromise, reject);
      }
      return !done;
    }
    while (promises.length < poolSize && nextPromise()) {}
  });
}

export async function createInDataProviderFallbackWithPooling(
  dataProvider: DataProvider,
  resource: string,
  values: any[],
  csvItems?: any[]
): Promise<any> {
  const reportItems: ReportItem[] = [];
  let csvDataFinal: any = handleData(dataProvider, resource, values, csvItems);

  console.log(csvDataFinal);
  try {
    reportItems.push(...csvDataFinal);
    return [reportItems, unparse(csvDataFinal)];
  } catch (err) {
    console.error("Error parsing data:", err);
    return [reportItems, []];
  }
}

/* OLD APPROACH */
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
