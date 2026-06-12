import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { VisualizationStep } from '../../../../shared/models/visualization-step.model';
import { CustomPointer } from '../../../../shared/models/custom-pointer.model';

export interface LinkedListOperationRequest {
  array: number[];
  index?: number;
  value?: number;
  baseAddress?: string;
  selectedType?: string;
  listType: string;
}

export interface AlgorithmResponse {
  steps: VisualizationStep[];
  totalSteps: number;
  algorithmType: string;
}

@Injectable({ providedIn: 'root' })
export class LinkedListApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  async executeOperation(operation: string, request: LinkedListOperationRequest): Promise<AlgorithmResponse> {
    const endpoint = this.getEndpoint(operation);
    return firstValueFrom(
      this.http.post<AlgorithmResponse>(`${this.baseUrl}${endpoint}`, request),
    );
  }

  private getEndpoint(operation: string): string {
    const endpoints: Record<string, string> = {
      'access': '/data-structures/linked-list/access',
      'update': '/data-structures/linked-list/update',
      'insert-head': '/data-structures/linked-list/insert-head',
      'insert-tail': '/data-structures/linked-list/insert-tail',
      'insert-position': '/data-structures/linked-list/insert-position',
      'delete-head': '/data-structures/linked-list/delete-head',
      'delete-tail': '/data-structures/linked-list/delete-tail',
      'delete-position': '/data-structures/linked-list/delete-position',
      'search': '/data-structures/linked-list/search',
      'traverse': '/data-structures/linked-list/traverse',
    };
    return endpoints[operation] || '';
  }
}
