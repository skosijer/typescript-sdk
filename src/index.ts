import { PetsService } from './services/pets';

export class TestSdk {
  constructor(
    baseUrl: string,
    public readonly pets: PetsService = new PetsService(baseUrl),
  ) {}
}
