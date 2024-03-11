import { HttpMetadata } from './types';

export class HttpError extends Error {
  public readonly error: string;
  public readonly metadata: HttpMetadata;

  constructor(response: Response) {
    super(response.statusText);
    this.error = response.statusText;
    this.metadata = {
      status: response.status,
      statusText: response.statusText,
      headers: {},
    };
    response.headers.forEach((value, key) => {
      this.metadata.headers[key] = value;
    });
  }
}
