import { Environment } from './http/environment';
import { SdkConfig } from './http/types';
import { PetsService } from './services/pets';

export class TestSdk {
  constructor(
    sdkConfig: SdkConfig,
    public readonly pets: PetsService = new PetsService(sdkConfig),
  ) {}

  setBaseUrl(baseUrl: string): void {
    this.pets.setBaseUrl(baseUrl);
  }

  setEnvironment(environment: Environment): void {
    this.setBaseUrl(environment);
  }

  setSdkConfig(sdkConfig: SdkConfig): void {
    this.pets.setSdkConfig(sdkConfig);
  }
}

// c029837e0e474b76bc487506e8799df5e3335891efe4fb02bda7a1441840310c
