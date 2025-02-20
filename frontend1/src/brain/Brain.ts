import {
  AnalysisRequest,
  AnalyzeStoolData,
  AnalyzeStoolError,
  CheckHealthData,
  GetHistoryData,
  GetHistoryError,
  GetHistoryParams,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Brain<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   *
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  check_health = (params: RequestParams = {}) =>
    this.request<CheckHealthData, any>({
      path: `/_healthz`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:stool_analysis, dbtn/hasAuth
   * @name analyze_stool
   * @summary Analyze Stool
   * @request POST:/routes/analyze-stool
   */
  analyze_stool = (data: AnalysisRequest, params: RequestParams = {}) =>
    this.request<AnalyzeStoolData, AnalyzeStoolError>({
      path: `/routes/analyze-stool`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:history, dbtn/hasAuth
   * @name get_history
   * @summary Get History
   * @request GET:/routes/history
   */
  get_history = (query: GetHistoryParams, params: RequestParams = {}) =>
    this.request<GetHistoryData, GetHistoryError>({
      path: `/routes/history`,
      method: "GET",
      query: query,
      ...params,
    });
}
