import { HttpRequest, HttpResponse, RequestHandler } from '../types';

export class AuthHandler implements RequestHandler {
  next?: RequestHandler;

  async handle<T>(request: HttpRequest<T>): Promise<HttpResponse<T>> {
    const requestWithAuth = this.addBasicAuthHeader(request);

    if (!this.next) {
      throw new Error(`No next handler set in ${AuthHandler.name}`);
    }

    return this.next?.handle(requestWithAuth);
  }

  private addBasicAuthHeader<T>(request: HttpRequest<T>): HttpRequest<T> {
    if (!request.auth) {
      return request;
    }

    const newRequest = { ...request };
    const { username, password } = request.auth;
    const encodedCredentials = btoa(`${username}:${password}`);
    if (!newRequest.headers) {
      newRequest.headers = {};
    }

    newRequest.headers['Authorization'] = `Basic ${encodedCredentials}`;

    return newRequest;
  }
}
