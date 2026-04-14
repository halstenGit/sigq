export interface ISolicitacao {
  id: number;
  sc_id: number;
  obra_id: number;
  obra_nome: string;
  total_itens: number;
  solicitante: string;
  data_solicitacao: string;
  status: 'PENDENTE' | 'EM_APROVACAO' | 'APROVADO' | 'REPROVADO' | 'DELETADA';
  nivel_atual: number;
  total_niveis: number;
  sienge_synced: number;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
}

export interface IItemSC {
  id: number;
  sc_id: number;
  item_number: number;
  produto_id: number;
  produto_descricao: string;
  quantidade: number;
  unidade: string;
  apropriacao: string;
  apropriacao_descricao: string | null;
  apropriacao_status: 'exato' | 'parcial' | 'produto_diferente' | 'sem_orcamento';
  preco_orcado: number | null;
  observacoes: string;
  status_item: 'PENDENTE' | 'APROVADO' | 'REPROVADO';
  wbs_code: string | null;
  orcamento_quantidade: number | null;
  orcamento_preco_unitario: number | null;
  orcamento_valor_total: number | null;
  saldo_quantidade: number | null;
  saldo_valor: number | null;
  orcamento_unidade: string | null;
  detalhe: string | null;
  marca: string | null;
  qtd_apropriacoes: number;
  auto_aprovavel: number | null; // 1 = todas apropriacoes com saldo suficiente; 0 = revisao manual
}

export interface IAprovacao {
  id: number;
  sc_id: number;
  item_number: number | null;
  nivel: number;
  aprovador_email: string;
  aprovador_nome: string;
  acao: 'APROVADO' | 'REPROVADO';
  observacao: string;
  motivo_reprovacao: string;
  data_acao: string;
  obra_nome?: string;
}

export interface IAlcada {
  id: number;
  obra_id: number;
  obra_nome: string;
  nivel: number;
  cargo: string;
  aprovador_email: string;
  aprovador_nome: string;
  ativo: number;
}

export interface IUsuario {
  id: number;
  email: string;
  nome: string;
  perfil: 'aprovador' | 'consulta' | 'admin';
  obras_visiveis: string | null;
  ativo: number;
}

export interface IObra {
  id: number;
  nome: string;
}

export interface IObraConfig {
  obra_id: number;
  obra_nome: string;
  teams_webhook_url: string | null;
}

export interface IScDetalhe {
  solicitacao: ISolicitacao;
  itens: IItemSC[];
  aprovacoes: IAprovacao[];
  cadeia: IAlcada[];
}

export interface IAprovacaoConfig {
  workerUrl: string;
  apiKey: string;
}

export interface IAnexo {
  number: number;
  name: string;
  description?: string | null;
  mimeType?: string | null;
  size?: number | null;
}

export interface IItemApropriacao {
  id: number;
  sc_id: number;
  item_number: number;
  apropriacao: string;
  wbs_code: string | null;
  percentual: number; // % da quantidade total (ex: 4.76)
  quantidade_apropriada: number | null; // Quantidade neste WBS
  orcamento_quantidade: number | null;
  orcamento_preco_unitario: number | null;
  orcamento_valor_total: number | null;
  saldo_quantidade: number | null;
  saldo_valor: number | null;
  orcamento_unidade: string | null;
  wbs_descricao: string | null;
  saldo_orcamento_quantidade: number | null; // real-time de orcamento_wbs
  saldo_quantidade_rt: number | null;        // real-time de orcamento_wbs
  saldo_valor_rt: number | null;             // real-time de orcamento_wbs
  saldo_unidade_rt: string | null;           // real-time de orcamento_wbs
  created_at: string;
}
