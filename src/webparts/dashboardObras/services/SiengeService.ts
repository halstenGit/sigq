import { HttpClient } from '@microsoft/sp-http';
import {
  IWorkerConfig,
  IDashboardCache,
  IProcessingStatus,
} from './interfaces/ISiengeModels';

export { ITesteResultado, IDashboardCache } from './interfaces/ISiengeModels';

export class SiengeService {
  private httpClient: HttpClient;
  private config: IWorkerConfig;

  constructor(httpClient: HttpClient, config: IWorkerConfig) {
    this.httpClient = httpClient;
    this.config = config;
  }

  // Buscar dados pre-processados do Worker (cache)
  public async fetchDashboardCache(): Promise<IDashboardCache> {
    const url = `${this.config.workerUrl}/api/dashboard`;

    try {
      const response = await this.httpClient.get(
        url,
        HttpClient.configurations.v1,
        { headers: { 'Accept': 'application/json' } }
      );

      if (!response.ok) {
        return { status: 'error', message: `HTTP ${response.status}` };
      }

      return response.json();
    } catch (err) {
      return { status: 'error', message: (err as Error).message };
    }
  }

  // Buscar status do processamento
  public async fetchStatus(): Promise<IProcessingStatus> {
    const url = `${this.config.workerUrl}/api/status`;

    try {
      const response = await this.httpClient.get(
        url,
        HttpClient.configurations.v1,
        { headers: { 'Accept': 'application/json' } }
      );

      if (!response.ok) {
        return { status: 'error', message: `HTTP ${response.status}` };
      }

      return response.json();
    } catch (err) {
      return { status: 'error', message: (err as Error).message };
    }
  }

  // Disparar reprocessamento no Worker
  public async triggerRefresh(): Promise<{ status: string; message: string; totalObras?: number }> {
    const url = `${this.config.workerUrl}/api/refresh`;

    try {
      const response = await this.httpClient.get(
        url,
        HttpClient.configurations.v1,
        { headers: { 'Accept': 'application/json' } }
      );

      return response.json();
    } catch (err) {
      return { status: 'error', message: (err as Error).message };
    }
  }
}
