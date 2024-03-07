import { z } from 'zod';
import { BaseService } from '../base-service';
import { HttpResponse } from '../../http';
import { Pet, pet } from './models';

export class PetsService extends BaseService {
  constructor(baseUrl: string) {
    super(baseUrl);
  }
  async listPets(limit: number): Promise<HttpResponse<Pet[]>> {
    const path = '/pets';
    const options = {
      responseSchema: z.array(pet),
      queryParams: {
        limit,
      },
    };

    return this.client.get(path, options);
  }

  async createPets(body: Pet): Promise<HttpResponse<void>> {
    const path = '/pets';
    const options = {
      responseSchema: z.undefined(),
      body: JSON.stringify(pet.parse(body)),
    };

    return this.client.post(path, options);
  }

  async showPetById(petId: string): Promise<HttpResponse<Pet>> {
    const path = this.client.buildPath('/pets/{petId}', { petId });
    const options = {
      responseSchema: pet,
    };

    return this.client.get(path, options);
  }
}
