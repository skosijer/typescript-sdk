import { HttpRequest, HttpResponse, RequestHandler } from '../types';
import { Hook } from '../hooks/hook';
import { HttpError } from '../error';

export class HookHandler implements RequestHandler {
  next?: RequestHandler;

  constructor(private readonly hook: Hook) {}

  async handle<T>(request: HttpRequest<T>): Promise<HttpResponse<T>> {
    if (!this.next) {
      throw new Error('No next handler set in hook handler.');
    }

    const nextRequest = { ...this.hook.beforeRequest(request), responseSchema: request.responseSchema };

    try {
      const response = await this.next.handle(nextRequest);

      return this.hook.afterResponse(request, response);
    } catch (error) {
      if (error instanceof HttpError) {
        throw this.hook.onError(request, error);
      }

      throw error;
    }
  }
}
