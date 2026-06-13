import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VisualizationStep } from '../../shared/models/visualization-step.model';
import { environment } from '../../../environments/environment';

export interface AlgorithmResponse {
  steps: VisualizationStep[];
  totalSteps: number;
  algorithmType: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  runBubbleSort(array: number[]): Observable<AlgorithmResponse> {
    return this.http.post<AlgorithmResponse>(`${this.apiUrl}/array/bubble-sort`, { array, algorithmType: 'BUBBLE_SORT' });
  }
}
