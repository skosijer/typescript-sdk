import { HttpClient } from '../http';
import { SdkConfig } from '../http/types';

export class BaseService {
  constructor(
    sdkConfig: SdkConfig,
    public client: HttpClient = new HttpClient(sdkConfig),
  ) {}

  setBaseUrl(baseUrl: string): void {
    this.client.setBaseUrl(baseUrl);
  }

  setSdkConfig(sdkConfig: SdkConfig): void {
    this.client.setSdkConfig(sdkConfig);
  }
}
