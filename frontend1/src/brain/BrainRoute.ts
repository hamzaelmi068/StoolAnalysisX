import { AnalysisRequest, AnalyzeStoolData, CheckHealthData, GetHistoryData } from "./data-contracts";

export namespace Brain {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  export namespace check_health {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckHealthData;
  }

  /**
   * No description
   * @tags dbtn/module:stool_analysis, dbtn/hasAuth
   * @name analyze_stool
   * @summary Analyze Stool
   * @request POST:/routes/analyze-stool
   */
  export namespace analyze_stool {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = AnalysisRequest;
    export type RequestHeaders = {};
    export type ResponseBody = AnalyzeStoolData;
  }

  /**
   * No description
   * @tags dbtn/module:history, dbtn/hasAuth
   * @name get_history
   * @summary Get History
   * @request GET:/routes/history
   */
  export namespace get_history {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Start Date
       * Start date in ISO format
       */
      start_date?: string | null;
      /**
       * End Date
       * End date in ISO format
       */
      end_date?: string | null;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetHistoryData;
  }
}
