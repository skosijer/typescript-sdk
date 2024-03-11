import { HttpRequest, HttpResponse, RequestHandler, RetryOptions } from '../types';
import { HttpError } from '../error';

export class RetryHandler implements RequestHandler {
  next?: RequestHandler;

  async handle<T>(request: HttpRequest<T>): Promise<HttpResponse<T>> {
    const retry = this.getRetry(request);

    if (!retry) {
      return this.next!.handle(request);
    }

    for (let attempt = 0; attempt <= retry.attempts; attempt++) {
      try {
        return await this.tryRequest(request, retry.delayMs, attempt);
      } catch (error: any) {
        if (!this.shouldRetry(error) || attempt === retry.attempts) {
          throw error;
        }
      }
    }

    throw new Error('Error retrying request.');
  }

  private shouldRetry(error: Error): boolean {
    return error instanceof HttpError && (error.metadata.status >= 500 || error.metadata.status === 408);
  }

  private getRetry<T>({ retry }: HttpRequest<T>): RetryOptions | undefined {
    // add default retry if request doesn't have explicit retry options
    return (
      retry ?? {
        attempts: 3,
        delayMs: 150,
      }
    );
  }

  private async tryRequest<T>(request: HttpRequest<T>, delayMs: number, attempt: number): Promise<HttpResponse<T>> {
    if (!this.next) {
      throw new Error('No next handler set in retry handler.');
    }

    // we don't want delay on first attempt
    if (attempt === 0) {
      return await this.next.handle(request);
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.next!.handle(request));
      }, delayMs);
    });
  }
}
