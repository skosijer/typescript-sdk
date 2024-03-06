import { HttpClient } from '../http';

export class BaseService {
  constructor(
    protected readonly baseUrl: string,

    public client: HttpClient = new HttpClient(baseUrl),
  ) {}
}
