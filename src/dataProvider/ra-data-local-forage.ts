/* eslint-disable eqeqeq */
import fakeRestProvider from "ra-data-fakerest";

import {
  CreateParams,
  DataProvider,
  GetListParams,
  GetOneParams,
  GetManyParams,
  GetManyReferenceParams,
  Identifier,
  DeleteParams,
  RaRecord,
  UpdateParams,
  UpdateManyParams,
  DeleteManyParams,
} from "ra-core";
import pullAt from "lodash/pullAt";
import localforage from "localforage";

const raDataLocalForage = async(
  params?: LocalForageDataProviderParams
): Promise<any> => {
  const {
    defaultData = {},
    localForageKey = "ra-data-local-forage",
    loggingEnabled = false,
    localForageUpdateDelay = 10, // milliseconds
  } = params || {};

  const localForageData = await localforage.getItem(localForageKey);
  const data = localForageData ? localForageData : defaultData;

  // change data by executing callback, then persist in localForage
  const updateLocalForage = (callback: {
    (): void;
    (): void;
    (): void;
    (): void;
    (): void;
    (): void;
  }) => {
    // modify localForage after the next tick
    setTimeout(() => {
      callback();
      localforage.setItem(localForageKey, data);
    }, localForageUpdateDelay);
  };

  const baseDataProvider = fakeRestProvider(
    data,
    loggingEnabled
  ) as DataProvider;

  return {
    // read methods are just proxies to FakeRest
    getList: <RecordType extends RaRecord = any>(
      resource: string,
      params: GetListParams
    ) => {
      return baseDataProvider.getList<RecordType>(resource, params).catch((error) => {
        if (error.code === 1) {
          // undefined collection error: hide the error and return an empty list instead
          return { data: [], total: 0 };
        } else {
          throw error;
        }
      });
    },
    getOne: <RecordType extends RaRecord = any>(
      resource: string,
      params: GetOneParams<any>
    ) => baseDataProvider.getOne<RecordType>(resource, params),
    getMany: <RecordType extends RaRecord = any>(
      resource: string,
      params: GetManyParams
    ) => baseDataProvider.getMany<RecordType>(resource, params),
    getManyReference: <RecordType extends RaRecord = any>(
      resource: string,
      params: GetManyReferenceParams
    ) =>
      baseDataProvider
        .getManyReference<RecordType>(resource, params)
        .catch((error) => {
          if (error.code === 1) {
            // undefined collection error: hide the error and return an empty list instead
            return { data: [], total: 0 };
          } else {
            throw error;
          }
        }),

    // update methods need to persist changes in localForage
    update: <RecordType extends RaRecord = any>(
      resource: string,
      params: UpdateParams<any>
    ) => {
      updateLocalForage(() => {
        const index = data[resource].findIndex(
          (record: { id: any }) => record.id == params.id
        );
        data[resource][index] = {
          ...data[resource][index],
          ...params.data,
        };
      });
      return baseDataProvider.update<RecordType>(resource, params);
    },
    updateMany: (resource: string, params: UpdateManyParams<any>) => {
      updateLocalForage(() => {
        params.ids.forEach((id: Identifier) => {
          const index = data[resource].findIndex(
            (record: { id: Identifier }) => record.id == id
          );
          data[resource][index] = {
            ...data[resource][index],
            ...params.data,
          };
        });
      });
      return baseDataProvider.updateMany(resource, params);
    },
    create: <RecordType extends RaRecord = any>(
      resource: string,
      params: CreateParams<any>
    ) => {
      // we need to call the fakerest provider first to get the generated id
      return baseDataProvider
        .create<RecordType>(resource, params)
        .then((response) => {
          updateLocalForage(() => {
            if (!data.hasOwnProperty(resource)) {
              data[resource] = [];
            }
            data[resource].push(response.data);
          });
          return response;
        });
    },
    delete: <RecordType extends RaRecord = any>(
      resource: string,
      params: DeleteParams<RecordType>
    ) => {
      updateLocalForage(() => {
        const index = data[resource].findIndex(
          (record: { id: any }) => record.id == params.id
        );
        pullAt(data[resource], [index]);
      });
      return baseDataProvider.delete<RecordType>(resource, params);
    },
    deleteMany: (resource: string, params: DeleteManyParams<any>) => {
      updateLocalForage(() => {
        const indexes = params.ids.map((id: any) =>
          data[resource].findIndex((record: any) => record.id == id)
        );
        pullAt(data[resource], indexes);
      });
      return baseDataProvider.deleteMany(resource, params);
    },
  };
};

export interface LocalForageDataProviderParams {
  defaultData?: any;
  localForageKey?: string;
  loggingEnabled?: boolean;
  localForageUpdateDelay?: number;
}

export default raDataLocalForage;
