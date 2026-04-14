// === Configuracao do Worker ===
export interface IWorkerConfig {
  workerUrl: string;
}

// === Resultado por obra (retornado pelo Worker) ===
export interface ITesteResultado {
  obra: string;
  totalItensSc: number;
  itensComOrcamento: number;
  itensSemOrcamento: number;
  percSemOrcamento: number;
  erro?: string;
}

// === Resposta do /api/dashboard ===
export interface IDashboardCache {
  status?: string;
  message?: string;
  lastUpdated?: string;
  resultados?: ITesteResultado[];
  totalObras?: number;
}

// === Resposta do /api/status ===
export interface IProcessingStatus {
  status: string;
  date?: string;
  completedDate?: string | null;
  totalObras?: number;
  processedObras?: number;
  pendingObras?: number;
  message?: string;
}
