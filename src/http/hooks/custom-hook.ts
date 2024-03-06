import { Hook } from './hook';
import { HttpRequest, HttpResponse } from '../types';
import { HttpError } from '../error';

export class CustomHook implements Hook {
  beforeRequest(request: HttpRequest<any>): HttpRequest<any> {
    return request;
  }

  afterResponse(request: HttpRequest<any>, response: HttpResponse<any>): HttpResponse<any> {
    return response;
  }

  onError(request: HttpRequest<any>, error: HttpError): HttpError {
    return error;
  }
}
