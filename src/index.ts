import { PetsService } from './services/pets';

export class TestSdk {
  constructor(
    baseUrl: string,
    public readonly pets: PetsService = new PetsService(baseUrl),
  ) {}
}

// c029837e0e474b76bc487506e8799df5e3335891efe4fb02bda7a1441840310c
