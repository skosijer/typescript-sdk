import { HttpRequest, HttpResponse, RequestHandler } from '../types';
import { HttpError } from '../error';
import { Hook } from '../hooks/hook';

export class HookHandler implements RequestHandler {
  next?: RequestHandler;

  constructor(private readonly hook: Hook) {}

  async handle<T>(request: HttpRequest<T>): Promise<HttpResponse<T>> {
    if (!this.next) {
      throw new Error('No next handler set in hook handler.');
    }

    const nextRequest = { ...this.hook.beforeRequest(request), responseSchema: request.responseSchema };

    const response = await this.next.handle(nextRequest);

    if (response.metadata.status < 400) {
      return this.hook.afterResponse(request, response);
    }

    const error = this.hook.onError(request, response);

    throw new HttpError(error.metadata, error.error);
  }
}
