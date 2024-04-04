// This file was generated by liblab | https://liblab.com/

import { z } from 'zod';
import { BaseService } from '../base-service';
import { HttpResponse } from '../../http';
import { RequestConfig } from '../../http/types';
import { Pet, petRequest, petResponse } from './models';

export class PetsService extends BaseService {
  async listPets(limit: number, requestConfig?: RequestConfig): Promise<HttpResponse<Pet[]>> {
    const path = '/pets';
    const options = {
      responseSchema: z.array(petResponse),
      queryParams: {
        limit,
      },
      retry: requestConfig?.retry,
    };

    return this.client.get(path, options);
  }

  async createPets(body: Pet, requestConfig?: RequestConfig): Promise<HttpResponse<undefined>> {
    const path = '/pets';
    const options = {
      responseSchema: z.undefined(),
      body: JSON.stringify(petRequest.parse(body)),
      retry: requestConfig?.retry,
    };

    return this.client.post(path, options);
  }

  async showPetById(petId: string, requestConfig?: RequestConfig): Promise<HttpResponse<Pet>> {
    const path = this.client.buildPath('/pets/{petId}', { petId });
    const options = {
      responseSchema: petResponse,
      retry: requestConfig?.retry,
    };

    return this.client.get(path, options);
  }
}
