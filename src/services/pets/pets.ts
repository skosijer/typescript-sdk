import { z } from 'zod';
import { BaseService } from '../base-service';
import { HttpResponse } from '../../http';
import { RequestConfig } from '../../http/types';
import { Pet, pet } from './models';

export class PetsService extends BaseService {
  async listPets(limit: number, requestConfig?: RequestConfig): Promise<HttpResponse<Pet[]>> {
    const path = '/pets';
    const options = {
      responseSchema: z.array(pet),
      queryParams: {
        limit,
      },
      retry: requestConfig?.retry,
    };

    return this.client.get(path, options);
  }

  async createPets(body: Pet, requestConfig?: RequestConfig): Promise<HttpResponse<void>> {
    const path = '/pets';
    const options = {
      responseSchema: z.undefined(),
      body: JSON.stringify(pet.parse(body)),
      retry: requestConfig?.retry,
    };

    return this.client.post(path, options);
  }

  async showPetById(petId: string, requestConfig?: RequestConfig): Promise<HttpResponse<Pet>> {
    const path = this.client.buildPath('/pets/{petId}', { petId });
    const options = {
      responseSchema: pet,
      retry: requestConfig?.retry,
    };

    return this.client.get(path, options);
  }
}
