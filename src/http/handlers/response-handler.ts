import { HttpRequest, HttpResponse, RequestHandler } from '../types';
import { HttpError } from '../error';

export class ResponseHandler implements RequestHandler {
  next?: RequestHandler;

  async handle<T>(request: HttpRequest<T>): Promise<HttpResponse<T>> {
    const response = await this.next!.handle(request);

    if (this.isErrorResponse(response)) {
      throw new HttpError(response.metadata);
    }

    const validatedResponse = this.validateResponse(request, response);

    return validatedResponse;
  }

  private isErrorResponse(response: HttpResponse<unknown>): boolean {
    return response.metadata.status >= 400;
  }

  private async validateResponse<T>(request: HttpRequest<T>, response: HttpResponse<T>): Promise<HttpResponse<T>> {
    if (
      !request.responseSchema ||
      response.metadata.status === 204 ||
      response.metadata.headers['content-length'] === '0'
    ) {
      return response;
    }

    const decodedBody = new TextDecoder().decode(response.body);

    const json = JSON.parse(decodedBody);

    return {
      ...response,
      data: request.responseSchema.parse(json),
    };
  }
}
