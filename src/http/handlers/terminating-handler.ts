import { HttpRequest, HttpResponse, RequestHandler } from '../types';
import { HttpError } from '../error';

export class TerminatingHandler implements RequestHandler {
  async handle<T>({ url, method, body, abortSignal, responseSchema }: HttpRequest<T>): Promise<HttpResponse<T>> {
    const response = await fetch(url, {
      method,
      body,
      signal: abortSignal,
    });

    if (!response.ok) {
      throw new HttpError(response);
    }

    const json = await response.json();

    const data = responseSchema ? responseSchema.parse(json) : json;
    return {
      data,
      metadata: {
        status: response.status,
        statusText: response.statusText,
        headers: this.getHeaders(response),
      },
    };
  }

  private getHeaders(response: Response): Record<string, string> {
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    return headers;
  }
}
