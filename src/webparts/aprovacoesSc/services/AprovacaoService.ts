import { HttpClient, IHttpClientOptions } from '@microsoft/sp-http';
import {
  ISolicitacao,
  IScDetalhe,
  IAprovacao,
  IAlcada,
  IUsuario,
  IObra,
  IObraConfig,
  IAprovacaoConfig,
  IAnexo,
  IItemApropriacao,
} from './interfaces/IAprovacaoModels';

export class AprovacaoService {
  constructor(
    private httpClient: HttpClient,
    private config: IAprovacaoConfig,
    private userEmail: string
  ) {}

  private getHeaders(): HeadersInit {
    return {
      'X-API-Key': this.config.apiKey,
      'X-User-Email': this.userEmail,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  private async fetchApi<T>(path: string, options?: IHttpClientOptions): Promise<T> {
    const url = `${this.config.workerUrl}${path}`;
    const response = await this.httpClient.fetch(url, HttpClient.configurations.v1, {
      headers: this.getHeaders(),
      ...options,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error((err as { error?: string }).error || `HTTP ${response.status}`);
    }
    return response.json() as Promise<T>;
  }

  // --- Aprovacoes ---

  async getPendentes(): Promise<{ results: ISolicitacao[] }> {
    return this.fetchApi(`/api/aprovacoes/pendentes?email=${encodeURIComponent(this.userEmail)}`);
  }

  async getTodas(): Promise<{ results: ISolicitacao[] }> {
    return this.fetchApi(`/api/aprovacoes/todas?email=${encodeURIComponent(this.userEmail)}`);
  }

  async getScDetail(scId: number): Promise<IScDetalhe> {
    return this.fetchApi(`/api/aprovacoes/sc/${scId}`);
  }

  async aprovar(scId: number, observacao?: string, itemNumber?: number): Promise<{ status: string; message: string }> {
    return this.fetchApi('/api/aprovacoes/aprovar', {
      method: 'POST',
      body: JSON.stringify({ sc_id: scId, email: this.userEmail, observacao, item_number: itemNumber }),
    });
  }

  async reprovar(scId: number, motivoReprovacao: string, observacao?: string, itemNumber?: number): Promise<{ status: string; message: string }> {
    return this.fetchApi('/api/aprovacoes/reprovar', {
      method: 'POST',
      body: JSON.stringify({ sc_id: scId, email: this.userEmail, motivo_reprovacao: motivoReprovacao, observacao, item_number: itemNumber }),
    });
  }

  async aprovarItem(scId: number, itemNumber: number, observacao?: string): Promise<{ status: string; message: string }> {
    return this.aprovar(scId, observacao, itemNumber);
  }

  async reprovarItem(scId: number, itemNumber: number, motivoReprovacao: string, observacao?: string): Promise<{ status: string; message: string }> {
    return this.reprovar(scId, motivoReprovacao, observacao, itemNumber);
  }

  async getAnexos(scId: number): Promise<IAnexo[]> {
    return this.fetchApi(`/api/aprovacoes/sc/${scId}/anexos`);
  }

  async downloadAnexo(scId: number, attachmentNumber: number): Promise<string> {
    const url = `${this.config.workerUrl}/api/aprovacoes/sc/${scId}/anexos/${attachmentNumber}`;
    const response = await this.httpClient.fetch(url, HttpClient.configurations.v1, {
      headers: {
        'X-API-Key': this.config.apiKey,
        'X-User-Email': this.userEmail,
      },
    });
    if (!response.ok) throw new Error(`Erro ao baixar anexo: HTTP ${response.status}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }

  async getItemApropriacoes(scId: number, itemNumber: number): Promise<{ apropriacoes: IItemApropriacao[] }> {
    return this.fetchApi(`/api/aprovacoes/sc/${scId}/item/${itemNumber}/apropriacoes`);
  }

  async getHistorico(page: number = 1): Promise<{ results: IAprovacao[]; total: number; page: number; totalPages: number }> {
    return this.fetchApi(`/api/aprovacoes/historico?email=${encodeURIComponent(this.userEmail)}&page=${page}`);
  }

  // --- Alcadas ---

  async getAlcadas(obraId?: number): Promise<{ results: IAlcada[] }> {
    const qs = obraId ? `?obra_id=${obraId}` : '';
    return this.fetchApi(`/api/alcadas${qs}`);
  }

  async upsertAlcada(alcada: Partial<IAlcada>): Promise<{ status: string }> {
    return this.fetchApi('/api/alcadas', {
      method: 'POST',
      body: JSON.stringify(alcada),
    });
  }

  async deleteAlcada(id: number): Promise<{ status: string }> {
    return this.fetchApi(`/api/alcadas/${id}`, { method: 'DELETE' });
  }

  // --- Obras ---

  async getObras(): Promise<{ results: IObra[] }> {
    return this.fetchApi('/api/obras');
  }

  async getObrasConfig(): Promise<{ results: IObraConfig[] }> {
    return this.fetchApi('/api/obras-config');
  }

  async upsertObraConfig(config: { obra_id: number; obra_nome: string; teams_webhook_url: string | null }): Promise<{ status: string }> {
    return this.fetchApi('/api/obras-config', {
      method: 'POST',
      body: JSON.stringify({ ...config, admin_email: this.userEmail }),
    });
  }

  // --- Usuarios ---

  async getUsuarios(): Promise<{ results: IUsuario[] }> {
    return this.fetchApi(`/api/usuarios?admin_email=${encodeURIComponent(this.userEmail)}`);
  }

  async upsertUsuario(usuario: Partial<IUsuario>): Promise<{ status: string }> {
    return this.fetchApi('/api/usuarios', {
      method: 'POST',
      body: JSON.stringify(usuario),
    });
  }

  async deleteUsuario(id: number): Promise<{ status: string }> {
    return this.fetchApi(`/api/usuarios/${id}`, { method: 'DELETE' });
  }
}
