import { SerializationStyle, serializePath, serializeQuery } from './serializer';
import { HttpMethod, HttpRequest, HttpResponse, Options, SdkConfig, AuthOptions } from './types';
import { RequestHandlerChain } from './handlers/handler-chain';
import { HookHandler } from './handlers/hook-handler';
import { ResponseHandler } from './handlers/response-handler';
import { CustomHook } from './hooks/custom-hook';
import { TerminatingHandler } from './handlers/terminating-handler';
import { RetryHandler } from './handlers/retry-handler';
import { HttpError } from './error';
import { Hook } from './hooks/hook';
import { AuthHandler } from './handlers/auth-handler';

export class HttpClient {
  private readonly requestHandlerChain = new RequestHandlerChain();

  constructor(
    private sdkConfig: SdkConfig,
    hook = new CustomHook(),
  ) {
    this.requestHandlerChain.addHandler(new ResponseHandler());
    this.requestHandlerChain.addHandler(new AuthHandler());
    this.requestHandlerChain.addHandler(new RetryHandler());
    this.requestHandlerChain.addHandler(new HookHandler(hook));
    this.requestHandlerChain.addHandler(new TerminatingHandler());
  }

  get<T>(url: string, options: Options<T>): Promise<HttpResponse<T>> {
    const request = this.constructRequest(url, 'GET', options);

    return this.performRequest(request);
  }

  async post<T>(url: string, options: Options<T>): Promise<HttpResponse<T>> {
    const request = this.constructRequest(url, 'POST', options);

    return this.performRequest(request);
  }

  async put<T>(url: string, options: Options<T>): Promise<HttpResponse<T>> {
    const request = this.constructRequest(url, 'PUT', options);

    return this.performRequest(request);
  }

  async patch<T>(url: string, options: Options<T>): Promise<HttpResponse<T>> {
    const request = this.constructRequest(url, 'PATCH', options);

    return this.performRequest(request);
  }

  async delete<T>(url: string, options: Options<T>): Promise<HttpResponse<T>> {
    const request = this.constructRequest(url, 'DELETE', options);

    return this.performRequest(request);
  }

  buildPath(
    pathPattern: string,
    pathArguments: Record<string, unknown>,
    style = SerializationStyle.SIMPLE,
    explode = false,
  ): string {
    return serializePath(pathPattern, pathArguments, style, explode);
  }

  setBaseUrl(url: string): void {
    this.sdkConfig.baseUrl = url;
  }

  setSdkConfig(sdkConfig: SdkConfig): void {
    this.sdkConfig = sdkConfig;
  }

  private async performRequest<T>(request: HttpRequest<T>): Promise<HttpResponse<T>> {
    return this.requestHandlerChain.callChain(request);
  }

  private constructRequest<T>(relativeUrl: string, method: HttpMethod, options: Options<T>): HttpRequest<T> {
    const url = this.constructUrl(relativeUrl, options);
    return {
      method,
      url,
      auth: this.sdkConfig.auth,
      ...options,
    };
  }

  private constructUrl<T>(url: string, options?: Options<T>): string {
    const queryParameters = serializeQuery(options?.queryParams);

    return `${this.sdkConfig.baseUrl}${url}${queryParameters}`;
  }
}
