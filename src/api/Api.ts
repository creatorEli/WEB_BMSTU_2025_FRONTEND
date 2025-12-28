/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export enum RoleRole {
  /** 0 */
  Historian = 0,
  /** 1 */
  Moderator = 1,
}

export interface DsArmy {
  ArmyID?: number;
  /** для фильтрации */
  ClassArmy?: string;
  DescriptionArmy?: string;
  ImageArmyUrl?: string;
  /** Пустыня Максимальная */
  MaxDesertSpeed?: number;
  /** Лес Максимальная */
  MaxForestSpeed?: number;
  /** Горы Максимальная */
  MaxMountSpeed?: number;
  /** Равнина Максимальная */
  MaxPlainSpeed?: number;
  /** Река Максимальная */
  MaxRiverSpeed?: number;
  /** Пустыня минимальная */
  MinDesertSpeed?: number;
  /** Лес минимальная */
  MinForestSpeed?: number;
  /** Горы минимальная */
  MinMountSpeed?: number;
  /** скорости для каждого типа местности: */
  MinPlainSpeed?: number;
  /** Река минимальная */
  MinRiverSpeed?: number;
  NameArmy?: string;
  /** status: удален/действует */
  StatusArmy?: string;
}

export interface DsHistorian {
  historianUUID?: string;
  id?: number;
  login?: string;
  /** HisIsModerator bool      `gorm:"type:boolean;default:false" json:"is_moderator"` */
  role?: RoleRole;
}

export interface DsTravelTime {
  /** "Desert", "Plain", "Mount", "Forest", "River" */
  ChosenBiomTT?: string;
  DistanceTT?: number;
  ResultChronical?: number;
  ResultMaxTT?: number;
  ResultMinTT?: number;
  /** 5 статусов: черновик, удален, сформирован, завершен, отклонен */
  StatusTT?: string;
  creatorID_TT?: number;
  creatorTT?: DsHistorian;
  dateCreateTT?: string;
  dateFinishTT?: string;
  dateUpdateTT?: string;
  moderatorID_TT?: number;
  moderatorTT?: DsHistorian;
  ttID?: number;
}

export interface HandlerArmyResSw {
  army?: DsArmy;
}

export interface HandlerHisSw {
  historian?: DsHistorian;
}

export interface HandlerIdDraftCountArmies {
  countArmies?: number;
  ttid?: number;
}

export interface HandlerMesHisLPMSw {
  historian?: DsHistorian;
  message?: HandlerLoginResp;
}

export interface HandlerPaginationn {
  limit?: number;
  page?: number;
  /** @format int64 */
  total?: number;
  /** @format int64 */
  totalPages?: number;
}

export interface HandlerResArmies {
  armies?: DsArmy[];
  pagination?: HandlerPaginationn;
  /** @format int64 */
  queryTimeMs?: number;
  queryWithIndex?: boolean;
}

export interface HandlerResDraftSw {
  message?: string;
  travel_time?: DsTravelTime;
}

export interface HandlerTTplusMessage {
  message?: string;
  travel_time?: DsTravelTime;
}

export interface HandlerUpdaterTT {
  chosenBiomTT?: string;
  distanceTT?: number;
}

export interface HandlerUploadResponse {
  file_name?: string;
  file_size?: number;
  file_url?: string;
  message?: string;
  success?: boolean;
}

export interface HandlerLoginResp {
  access_token?: string;
  expires_in?: number;
  token_type?: string;
}

export interface HandlerMessage {
  message?: string;
}

export interface HandlerResultsStr {
  chosenBiomTT?: string;
  creatorLogin?: string;
  dateCreateTT?: string;
  dateFinishTT?: string;
  dateUpdateTT?: string;
  distanceTT?: number;
  moderatorLogin?: string;
  resultChronical?: number;
  resultMaxTT?: number;
  resultMinTT?: number;
  /** 5 статусов: черновик, удален, сформирован, завершен, отклонен */
  statusTT?: string;
  ttID?: number;
}

export interface HandlerTtToresultsStrPlusArmies {
  list_armies?: DsArmy[];
  time_travel?: HandlerResultsStr;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
          method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Travel Times API
 * @version 1.0
 * @license AS IS (NO WARRANTY)
 * @contact Мефодьев Илья <creatoreli8@gmail.com> (https://t.me/Thir5tyF0r1ife)
 *
 * Система расчёта дневного перехода армии
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  armies = {
    /**
     * @description Получить список армий, включая фильтрацию (param "class") и поисковый запрос (param "searchNameArmy") а также пагинацию (param "page") и число записей на страцие (param "limit")
     *
     * @tags Requests
     * @name ArmiesList
     * @summary Получить список армий
     * @request GET:/armies
     */
    armiesList: (
      query?: {
        /** фильтрация */
        class?: string;
        /** поиск армии */
        searchNameArmy?: string;
        /** страница */
        page?: string;
        /** число записей на страницу */
        limit?: string;
        /** число записей на страницу */
        withIndexation?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<HandlerResArmies, any>({
        path: `/armies`,
        method: "GET",
        query: query,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  army = {
    /**
     * @description Создать одну армию
     *
     * @tags Requests
     * @name ArmyCreate
     * @summary Создать армию
     * @request POST:/army
     */
    armyCreate: (army: DsArmy, params: RequestParams = {}) =>
      this.request<HandlerArmyResSw, any>({
        path: `/army`,
        method: "POST",
        body: army,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Добавить армию в расчёт, зная её идентификатор и при необходимости создавая новый черновик
     *
     * @tags Requests
     * @name AddToTravelCreate
     * @summary Добавить армию в расчёт
     * @request POST:/army/add_to_travel
     * @secure
     */
    addToTravelCreate: (
      data: {
        /** ID добавляемой армии */
        ArmyID: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<HandlerResDraftSw, any>({
        path: `/army/add_to_travel`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.UrlEncoded,
        format: "json",
        ...params,
      }),

    /**
     * @description Получить одну армию по её id
     *
     * @tags Requests
     * @name ArmyDetail
     * @summary Получить одну армию
     * @request GET:/army/{id}
     */
    armyDetail: (id: number, params: RequestParams = {}) =>
      this.request<DsArmy, any>({
        path: `/army/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Изменить одну армию, зная её идентификатор и изменяя существующие поля
     *
     * @tags Requests
     * @name ArmyUpdate
     * @summary Изменить армию
     * @request PUT:/army/{id}
     */
    armyUpdate: (id: number, army: DsArmy, params: RequestParams = {}) =>
      this.request<HandlerArmyResSw, any>({
        path: `/army/${id}`,
        method: "PUT",
        body: army,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удалить одну армию, зная её идентификатор и изменяя статус (запрещено удалять запись из БД)
     *
     * @tags Requests
     * @name ArmyDelete
     * @summary Удалить армию
     * @request DELETE:/army/{id}
     */
    armyDelete: (id: number, params: RequestParams = {}) =>
      this.request<HandlerMessage, any>({
        path: `/army/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description Добавить или Обновить изображение армии зная её идентификатор
     *
     * @tags Requests
     * @name UploadImageCreate
     * @summary Добавить или Обновить изображение армии
     * @request POST:/army/{id}/upload_image
     */
    uploadImageCreate: (
      id: string,
      data: {
        /** ID армии к которой добавляется изображение */
        ArmyID: number;
        /**
         * Изображение армии
         * @format binary
         */
        image_army: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<HandlerUploadResponse, any>({
        path: `/army/${id}/upload_image`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),
  };
  historian = {
    /**
     * @description Получить информацию об историке (для его личного кабинета), уже авторизованном
     *
     * @tags Requests
     * @name HistorianList
     * @summary Получить информацию об историке
     * @request GET:/historian
     * @secure
     */
    historianList: (params: RequestParams = {}) =>
      this.request<HandlerHisSw, any>({
        path: `/historian`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновить информацию об историке по его логину
     *
     * @tags Requests
     * @name HistorianUpdate
     * @summary Обновить информацию об историке
     * @request PUT:/historian
     * @secure
     */
    historianUpdate: (
      data: {
        /** логин историка */
        loginHistorian: string;
        /** пароль историка */
        passwordHistorian: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<HandlerHisSw, any>({
        path: `/historian`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.UrlEncoded,
        format: "json",
        ...params,
      }),

    /**
     * @description Аутентификация историка по его логину и паролю
     *
     * @tags Requests
     * @name AuthCreate
     * @summary Аутентификация историка
     * @request POST:/historian/auth
     */
    authCreate: (
      data: {
        /** логин историка */
        loginHistorian: string;
        /** пароль историка */
        passwordHistorian: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<HandlerMesHisLPMSw, any>({
        path: `/historian/auth`,
        method: "POST",
        body: data,
        type: ContentType.UrlEncoded,
        format: "json",
        ...params,
      }),

    /**
     * @description Деавторизация историка (завершение текущей сессии)
     *
     * @tags Requests
     * @name ExitCreate
     * @summary Деавторизация историка
     * @request POST:/historian/exit
     * @secure
     */
    exitCreate: (params: RequestParams = {}) =>
      this.request<HandlerMessage, any>({
        path: `/historian/exit`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Регистрация историка по его логину и паролю
     *
     * @tags Requests
     * @name PostHistorian
     * @summary Регистрация историка
     * @request POST:/historian/reg
     */
    postHistorian: (
      data: {
        /** логин историка */
        loginHistorian: string;
        /** пароль историка */
        passwordHistorian: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<HandlerMesHisLPMSw, any>({
        path: `/historian/reg`,
        method: "POST",
        body: data,
        type: ContentType.UrlEncoded,
        format: "json",
        ...params,
      }),
  };
  travelTime = {
    /**
     * @description Получить id черновика и количество армий в нём (id вычисляется для текущего пользователя)
     *
     * @tags Requests
     * @name TravelTimeList
     * @summary Получить id черновика и количество армий в нём
     * @request GET:/travel_time
     * @secure
     */
    travelTimeList: (params: RequestParams = {}) =>
      this.request<HandlerIdDraftCountArmies, any>({
        path: `/travel_time`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Удалить армию из расчёта по id расчёта и id армии
     *
     * @tags Requests
     * @name DeleteArmyDelete
     * @summary Удалить армию из расчёта
     * @request DELETE:/travel_time/delete_army
     * @secure
     */
    deleteArmyDelete: (
      query: {
        /** id расчёта */
        TTid: number;
        /** id армии */
        ArmyID: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<HandlerMessage, any>({
        path: `/travel_time/delete_army`,
        method: "DELETE",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновить летописные сведения (поле M:M) - измерение пройденного за день расстояния по летописи
     *
     * @tags Requests
     * @name UpdateArmyUpdate
     * @summary Обновить летописные сведения
     * @request PUT:/travel_time/update_army
     * @secure
     */
    updateArmyUpdate: (
      query: {
        /** id расчёта */
        TTid: number;
        /** id армии */
        ArmyID: number;
        /** пройденное расстояние за день по летописи */
        newKmPerDayChronical: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<HandlerMessage, any>({
        path: `/travel_time/update_army`,
        method: "PUT",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Получить расчёт по его id
     *
     * @tags Requests
     * @name TravelTimeDetail
     * @summary Получить расчёт
     * @request GET:/travel_time/{ttid}
     * @secure
     */
    travelTimeDetail: (ttid: number, params: RequestParams = {}) =>
      this.request<HandlerTtToresultsStrPlusArmies, any>({
        path: `/travel_time/${ttid}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновить расчёт по его id
     *
     * @tags Requests
     * @name TravelTimeUpdate
     * @summary Обновить расчёт
     * @request PUT:/travel_time/{ttid}
     * @secure
     */
    travelTimeUpdate: (
      ttid: number,
      TimeToAdd: HandlerUpdaterTT,
      params: RequestParams = {},
    ) =>
      this.request<DsTravelTime, any>({
        path: `/travel_time/${ttid}`,
        method: "PUT",
        body: TimeToAdd,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удалить расчёт по его id
     *
     * @tags Requests
     * @name TravelTimeDelete
     * @summary Удалить расчёт
     * @request DELETE:/travel_time/{ttid}
     * @secure
     */
    travelTimeDelete: (ttid: number, params: RequestParams = {}) =>
      this.request<HandlerMessage, any>({
        path: `/travel_time/${ttid}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Сформировать расчёт по его id, происходит проверка на обязательные поля
     *
     * @tags Requests
     * @name FormUpdate
     * @summary Сформировать расчёт
     * @request PUT:/travel_time/{ttid}/form
     * @secure
     */
    formUpdate: (ttid: number, params: RequestParams = {}) =>
      this.request<DsTravelTime, any>({
        path: `/travel_time/${ttid}/form`,
        method: "PUT",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Завершить/отклонить расчёт по его id, происходит расчёт и оценка времени, требуемого на переход заданной дистанции
     *
     * @tags Requests
     * @name ModerateUpdate
     * @summary Завершить/отклонить расчёт
     * @request PUT:/travel_time/{ttid}/moderate
     */
    moderateUpdate: (
      ttid: string,
      data: {
        /** id расчёта */
        ttid: number;
        /** Выбор действия (завершить или отклонить) */
        statusTT: "завершен" | "отклонен";
      },
      params: RequestParams = {},
    ) =>
      this.request<HandlerTTplusMessage, any>({
        path: `/travel_time/${ttid}/moderate`,
        method: "PUT",
        body: data,
        type: ContentType.UrlEncoded,
        format: "json",
        ...params,
      }),
  };
  travelTimes = {
    /**
     * @description Получить список Расчётов, включая фильтрацию по диапазону дат и статусу
     *
     * @tags Requests
     * @name TravelTimesList
     * @summary Получить список Расчётов
     * @request GET:/travel_times
     * @secure
     */
    travelTimesList: (
      query?: {
        /**
         * фильтр даты начала
         * @format date
         */
        dateFromTT?: string;
        /**
         * фильтр даты окончания
         * @format date
         */
        dateToTT?: string;
        /** статус расчёта */
        statusTT?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<DsTravelTime[], any>({
        path: `/travel_times`,
        method: "GET",
        query: query,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
