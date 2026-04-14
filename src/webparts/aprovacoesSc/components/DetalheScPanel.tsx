import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import {
  Panel, PanelType, Spinner, SpinnerSize, MessageBar, MessageBarType,
  PrimaryButton, DefaultButton, TextField, DetailsList, DetailsListLayoutMode,
  SelectionMode, IColumn, Separator, Selection, IObjectWithKey,
} from '@fluentui/react';
import type { AprovacaoService } from '../services/AprovacaoService';
import type { IScDetalhe, IItemSC, IAnexo, IItemApropriacao } from '../services/interfaces/IAprovacaoModels';

interface IDetalheScPanelProps {
  scId: number;
  service: AprovacaoService;
  userEmail: string;
  isOpen: boolean;
  onDismiss: () => void;
  onAcaoRealizada: () => void;
}

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  // Se tiver timestamp (YYYY-MM-DD HH:MM:SS ou YYYY-MM-DDTHH:MM:SS)
  const dateOnly = dateStr.split(' ')[0].split('T')[0];
  const [year, month, day] = dateOnly.split('-');
  return `${day}/${month}/${year}`;
};

const pad2 = (n: number): string => n < 10 ? '0' + n : '' + n;

const formatDateTime = (dateStr: string): string => {
  if (!dateStr) return '';
  // D1 armazena em UTC. Converte para BRT (UTC-3)
  const utcStr = dateStr.indexOf('T') >= 0 ? dateStr : dateStr.replace(' ', 'T') + 'Z';
  const date = new Date(utcStr);
  if (isNaN(date.getTime())) return dateStr;
  const brt = new Date(date.getTime() - 3 * 60 * 60 * 1000);
  return `${pad2(brt.getUTCDate())}/${pad2(brt.getUTCMonth() + 1)}/${brt.getUTCFullYear()} ${pad2(brt.getUTCHours())}:${pad2(brt.getUTCMinutes())}`;
};

export const DetalheScPanel: React.FC<IDetalheScPanelProps> = ({
  scId, service, userEmail, isOpen, onDismiss, onAcaoRealizada,
}) => {
  const [detalhe, setDetalhe] = useState<IScDetalhe | null>(null);
  const [loading, setLoading] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState('');
  const [acao, setAcao] = useState<'aprovar' | 'reprovar' | null>(null);
  const [observacao, setObservacao] = useState('');
  const [motivo, setMotivo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [anexos, setAnexos] = useState<IAnexo[]>([]);
  const [loadingAnexos, setLoadingAnexos] = useState(false);
  const [baixandoAnexo, setBaixandoAnexo] = useState<number | null>(null);
  const [itensSelecionados, setItensSelecionados] = useState<IItemSC[]>([]);
  const [itensExpandidos, setItensExpandidos] = useState<Set<number>>(new Set());
  const [apropriacoesCache, setApropriacoesCache] = useState<Map<number, any[]>>(new Map());
  const [loadingApropriacoes, setLoadingApropriacoes] = useState<Set<number>>(new Set());

  // Selection API para checkboxes
  const selection = useMemo(
    () =>
      new Selection({
        onSelectionChanged: () => {
          setItensSelecionados(selection.getSelection() as IItemSC[]);
        },
      }),
    []
  );

  // silent=true: atualiza dados em background sem esconder o conteudo existente
  const carregarDetalhes = (silent = false): void => {
    if (silent) {
      setAtualizando(true);
    } else {
      setLoading(true);
    }
    setErro('');
    service.getScDetail(scId)
      .then(d => { setDetalhe(d); setLoading(false); setAtualizando(false); })
      .catch(e => { setErro((e as Error).message); setLoading(false); setAtualizando(false); });

    if (!silent) {
      setLoadingAnexos(true);
      service.getAnexos(scId)
        .then(data => { setAnexos(Array.isArray(data) ? data : []); setLoadingAnexos(false); })
        .catch(() => { setAnexos([]); setLoadingAnexos(false); });
    }
  };

  const carregarApropriacoes = async (itemNumber: number): Promise<void> => {
    if (apropriacoesCache.has(itemNumber)) return; // Já carregado

    setLoadingApropriacoes(prev => new Set(prev).add(itemNumber));
    try {
      const result = await service.getItemApropriacoes(scId, itemNumber);
      setApropriacoesCache(prev => new Map(prev).set(itemNumber, result.apropriacoes || []));
    } catch (e) {
      console.error('Erro ao carregar apropriações:', e);
    } finally {
      setLoadingApropriacoes(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemNumber);
        return newSet;
      });
    }
  };

  const toggleItemExpandido = async (itemNumber: number): Promise<void> => {
    const isExpanded = itensExpandidos.has(itemNumber);

    if (isExpanded) {
      // Recolher
      setItensExpandidos(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemNumber);
        return newSet;
      });
    } else {
      // Expandir e carregar apropriações se necessário
      setItensExpandidos(prev => new Set(prev).add(itemNumber));
      await carregarApropriacoes(itemNumber);
    }
  };

  useEffect(() => {
    if (!isOpen || !scId) {
      selection.setAllSelected(false);
      return;
    }
    carregarDetalhes();
    selection.setAllSelected(false);
  }, [isOpen, scId, service]); // eslint-disable-line react-hooks/exhaustive-deps

  const podeAprovar = (): boolean => {
    if (!detalhe || detalhe.solicitacao.status !== 'EM_APROVACAO') return false;

    // Verificar se é aprovador do nível atual
    const ehAprovadorAtual = detalhe.cadeia.some(
      c => c.nivel === detalhe.solicitacao.nivel_atual && c.aprovador_email === userEmail.toLowerCase()
    );

    if (!ehAprovadorAtual) return false;

    // Se for nível 1, pode aprovar direto
    if (detalhe.solicitacao.nivel_atual === 1) return true;

    // Se for nível > 1, verificar se o nível anterior foi aprovado
    const nivelAnterior = detalhe.solicitacao.nivel_atual - 1;
    const nivelAnteriorAprovado = detalhe.aprovacoes.some(
      a => a.nivel === nivelAnterior && a.acao === 'APROVADO'
    );

    return nivelAnteriorAprovado;
  };

  const executarAcao = async (): Promise<void> => {
    if (!detalhe) return;
    setEnviando(true);
    setMensagem('');
    setErro('');
    try {
      if (acao === 'aprovar') {
        const res = await service.aprovar(scId, observacao || undefined);
        setMensagem(res.message);
      } else if (acao === 'reprovar') {
        if (!motivo.trim()) {
          setErro('Motivo da reprovacao e obrigatorio');
          setEnviando(false);
          return;
        }
        const res = await service.reprovar(scId, motivo, observacao || undefined);
        setMensagem(res.message);
      }
      setTimeout(() => onAcaoRealizada(), 1500);
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setEnviando(false);
    }
  };

  const handleAprovarItem = async (itemNumber: number): Promise<void> => {
    if (!detalhe || !confirm(`Aprovar item #${itemNumber}?`)) return;
    setEnviando(true);
    setMensagem('');
    setErro('');
    try {
      const res = await service.aprovarItem(scId, itemNumber);
      setMensagem(res.message || `Item #${itemNumber} aprovado!`);
      // Atualizar local imediatamente para nao sumir os botoes dos itens restantes
      setDetalhe(prev => {
        if (!prev) return prev;
        return { ...prev, itens: prev.itens.map(i => i.item_number === itemNumber ? { ...i, status_item: 'APROVADO' } : i) };
      });
      // Recarregar em background para sincronizar com o estado real
      setTimeout(() => { carregarDetalhes(true); }, 1000);
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setEnviando(false);
    }
  };

  const handleReprovarItem = async (itemNumber: number): Promise<void> => {
    const motivoItem = prompt(`Motivo da reprovação do item #${itemNumber}:`);
    if (!motivoItem || !motivoItem.trim()) {
      setErro('Motivo é obrigatório');
      return;
    }
    setEnviando(true);
    setMensagem('');
    setErro('');
    try {
      const res = await service.reprovarItem(scId, itemNumber, motivoItem.trim());
      setMensagem(res.message || `Item #${itemNumber} reprovado!`);
      // Atualizar local imediatamente para nao sumir os botoes dos itens restantes
      setDetalhe(prev => {
        if (!prev) return prev;
        return { ...prev, itens: prev.itens.map(i => i.item_number === itemNumber ? { ...i, status_item: 'REPROVADO' } : i) };
      });
      // Recarregar em background para sincronizar com o estado real
      setTimeout(() => { carregarDetalhes(true); }, 1000);
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setEnviando(false);
    }
  };

  const handleAprovarSelecionados = async (): Promise<void> => {
    if (itensSelecionados.length === 0) {
      setErro('Nenhum item selecionado');
      return;
    }
    if (!confirm(`Aprovar ${itensSelecionados.length} item(ns) selecionado(s)?`)) return;

    setEnviando(true);
    setMensagem('');
    setErro('');
    const erros: string[] = [];

    for (const item of itensSelecionados) {
      try {
        await service.aprovarItem(scId, item.item_number);
        // Atualizar local
        setDetalhe(prev => {
          if (!prev) return prev;
          return { ...prev, itens: prev.itens.map(i => i.item_number === item.item_number ? { ...i, status_item: 'APROVADO' } : i) };
        });
      } catch (e) {
        erros.push(`Item #${item.item_number}: ${(e as Error).message}`);
      }
    }

    if (erros.length > 0) {
      setErro(`Erros ao aprovar itens:\n${erros.join('\n')}`);
    } else {
      setMensagem(`${itensSelecionados.length} item(ns) aprovado(s) com sucesso!`);
    }

    selection.setAllSelected(false);
    setTimeout(() => { carregarDetalhes(true); }, 1000);
    setEnviando(false);
  };

  const handleReprovarSelecionados = async (): Promise<void> => {
    if (itensSelecionados.length === 0) {
      setErro('Nenhum item selecionado');
      return;
    }

    const motivoLote = prompt(`Motivo da reprovação dos ${itensSelecionados.length} itens selecionados:`);
    if (!motivoLote || !motivoLote.trim()) {
      setErro('Motivo é obrigatório');
      return;
    }

    setEnviando(true);
    setMensagem('');
    setErro('');
    const erros: string[] = [];

    for (const item of itensSelecionados) {
      try {
        await service.reprovarItem(scId, item.item_number, motivoLote.trim());
        // Atualizar local
        setDetalhe(prev => {
          if (!prev) return prev;
          return { ...prev, itens: prev.itens.map(i => i.item_number === item.item_number ? { ...i, status_item: 'REPROVADO' } : i) };
        });
      } catch (e) {
        erros.push(`Item #${item.item_number}: ${(e as Error).message}`);
      }
    }

    if (erros.length > 0) {
      setErro(`Erros ao reprovar itens:\n${erros.join('\n')}`);
    } else {
      setMensagem(`${itensSelecionados.length} item(ns) reprovado(s) com sucesso!`);
    }

    selection.setAllSelected(false);
    setTimeout(() => { carregarDetalhes(true); }, 1000);
    setEnviando(false);
  };

  const handleAbrirAnexo = async (num: number): Promise<void> => {
    setBaixandoAnexo(num);
    try {
      const blobUrl = await service.downloadAnexo(scId, num);
      window.open(blobUrl, '_blank');
      // Libera a URL após a aba abrir
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    } catch (e) {
      setErro(`Erro ao abrir anexo: ${(e as Error).message}`);
    } finally {
      setBaixandoAnexo(null);
    }
  };

  const temAlertaQtd = (item: IItemSC): boolean => {
    if (item.saldo_quantidade == null) return false;
    // Saldo já negativo (orçamento esgotado antes desta SC)
    if (item.saldo_quantidade < 0) return true;
    // Tolerância de 0.2% para diferenças mínimas de arredondamento
    const tolerancia = Math.abs(item.saldo_quantidade) * 0.002; // 0.2%
    const diferenca = item.quantidade - item.saldo_quantidade;
    // Alerta apenas se a quantidade solicitada supera o saldo + tolerância
    return diferenca > tolerancia;
  };

  const temAlertaValor = (item: IItemSC): boolean => {
    if (item.saldo_valor == null) return false;
    return item.saldo_valor < 0;
  };

  const temAlertaUnidade = (item: IItemSC): boolean => {
    // Só alerta se houver match exato no orçamento atual (não usar dados antigos do cache)
    if (item.apropriacao_status !== 'exato') return false;
    if (!item.orcamento_unidade || !item.unidade) return false;
    return item.unidade.trim().toLowerCase() !== item.orcamento_unidade.trim().toLowerCase();
  };

  const temApropriacaoIncorreta = (item: IItemSC): boolean => {
    return item.apropriacao_status === 'parcial' || item.apropriacao_status === 'produto_diferente';
  };

  const itensComAlerta = detalhe ? detalhe.itens.filter(temAlertaQtd) : [];
  const itensComAlertaUnidade = detalhe ? detalhe.itens.filter(temAlertaUnidade) : [];
  const itensComApropriacaoIncorreta = detalhe ? detalhe.itens.filter(temApropriacaoIncorreta) : [];

  const ehAprovadorNivelAtual = detalhe ? detalhe.cadeia.some(
    c => c.nivel === detalhe.solicitacao.nivel_atual && c.aprovador_email === userEmail.toLowerCase()
  ) : false;

  const itensColumns: IColumn[] = [
    { key: 'item_number', name: '#', fieldName: 'item_number', minWidth: 30, maxWidth: 40 },
    {
      key: 'produto_descricao', name: 'Insumo', minWidth: 180, isMultiline: true,
      onRender: (item: IItemSC) => (
        <div style={{ paddingTop: 4, paddingBottom: 4 }}>
          <div style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{item.produto_descricao}</div>
          {item.detalhe && <div style={{ fontSize: 11, color: '#555', whiteSpace: 'normal', wordBreak: 'break-word' }}>{item.detalhe}</div>}
          {item.observacoes && <div style={{ fontSize: 11, color: '#666', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>Obs: {item.observacoes}</div>}
        </div>
      ),
    },
    {
      key: 'quantidade', name: 'Qtde SC', minWidth: 60, maxWidth: 70,
      onRender: (item: IItemSC) => (
        <span style={{ fontWeight: temAlertaQtd(item) ? 700 : 400, color: temAlertaQtd(item) ? '#dc3545' : undefined }}>
          {item.quantidade}
        </span>
      ),
    },
    {
      key: 'unidade', name: 'Un SC', minWidth: 50, maxWidth: 60,
      onRender: (item: IItemSC) => (
        <span style={{ fontWeight: temAlertaUnidade(item) ? 700 : 400, color: temAlertaUnidade(item) ? '#e65c00' : undefined }}
          title={temAlertaUnidade(item) ? `Unidade do orçamento: ${item.orcamento_unidade}` : undefined}>
          {item.unidade}{temAlertaUnidade(item) && ' ⚠️'}
        </span>
      ),
    },
    {
      key: 'apropriacao', name: 'Apropriacao', minWidth: 220, isMultiline: true,
      onRender: (item: IItemSC) => {
        const status = item.apropriacao_status || 'exato';
        const temAlertaParcial = status === 'parcial';
        const temAlertaProduto = status === 'produto_diferente';
        const semOrcamento = status === 'sem_orcamento';
        const temAlerta = temAlertaParcial || temAlertaProduto;
        const isExpanded = itensExpandidos.has(item.item_number);
        const apropriacoes = apropriacoesCache.get(item.item_number) || [];
        const isLoading = loadingApropriacoes.has(item.item_number);
        const temMultiplas = item.qtd_apropriacoes > 1;

        let mensagemAlerta = '';
        let tituloAlerta = '';
        if (temAlertaParcial) {
          mensagemAlerta = 'Código WBS incompleto ou incorreto';
          tituloAlerta = '⚠️ Apropriação incorreta: código WBS incompleto ou diferente do orçamento';
        } else if (temAlertaProduto) {
          mensagemAlerta = 'Produto não cadastrado neste WBS do orçamento';
          tituloAlerta = '⚠️ Produto diferente: este produto não existe no WBS informado do orçamento';
        }

        return (
          <div style={{ paddingTop: 4, paddingBottom: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                fontFamily: 'monospace',
                fontSize: 12,
                fontWeight: 600,
                color: temAlerta ? '#dc3545' : undefined,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                flex: 1,
              }}>
                {item.apropriacao || '-'}
                {temAlerta && (
                  <span
                    title={tituloAlerta}
                    style={{ fontSize: 14, color: '#dc3545' }}
                  >
                    ⚠️
                  </span>
                )}
                {semOrcamento && !item.apropriacao_descricao && (
                  <span
                    title="ℹ️ Sem orçamento: insumo não encontrado no orçamento da obra"
                    style={{ fontSize: 14, color: '#888' }}
                  >
                    ℹ️
                  </span>
                )}
              </div>
              <button
                onClick={() => toggleItemExpandido(item.item_number)}
                style={{
                  border: '1px solid #0078d4',
                  background: isExpanded ? '#0078d4' : 'white',
                  color: isExpanded ? 'white' : '#0078d4',
                  borderRadius: 4,
                  padding: '2px 8px',
                  fontSize: 10,
                  cursor: 'pointer',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
                title={isExpanded ? 'Recolher apropriações' : 'Ver todas as apropriações'}
              >
                {isLoading ? '...' : isExpanded ? '▼' : '►'}
                {temMultiplas && <span>({item.qtd_apropriacoes})</span>}
              </button>
            </div>
            {!temMultiplas && (semOrcamento || temAlerta) && item.apropriacao_descricao && (
              <div style={{ fontSize: 11, color: semOrcamento ? '#888' : '#dc3545', whiteSpace: 'normal', wordBreak: 'break-word', marginTop: 2 }}>
                {item.apropriacao_descricao}
              </div>
            )}
            {temAlerta && (
              <div style={{ fontSize: 10, color: '#dc3545', marginTop: 2, fontWeight: 600 }}>
                {mensagemAlerta}
              </div>
            )}
            {isExpanded && apropriacoes.length > 0 && (
              <div style={{ marginTop: 8, padding: 8, background: '#f8f9fa', borderRadius: 4, fontSize: 11 }}>
                <div style={{ fontWeight: 700, marginBottom: 6, color: '#0078d4' }}>
                  {apropriacoes.length} Apropriação(ões):
                </div>
                {apropriacoes.map((apr: IItemApropriacao, idx: number) => (
                  <div key={idx} style={{
                    padding: '6px 8px',
                    background: 'white',
                    borderLeft: '3px solid #0078d4',
                    marginBottom: 4,
                    borderRadius: 2,
                  }}>
                    {apr.wbs_descricao && (
                      <div style={{ fontWeight: 600, fontSize: 11, marginBottom: 4, whiteSpace: 'normal', wordBreak: 'break-word' }}>
                        {apr.wbs_descricao}
                      </div>
                    )}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', fontSize: 10 }}>
                      <span>
                        <strong>WBS:</strong> <span style={{ fontFamily: 'monospace' }}>{apr.wbs_code}</span>
                      </span>
                      <span>
                        <strong>%:</strong> {apr.percentual.toFixed(2)}%
                      </span>
                      <span>
                        <strong>Qtde SC:</strong> {apr.quantidade_apropriada != null ? apr.quantidade_apropriada.toFixed(3) : '-'} {apr.orcamento_unidade || item.unidade}
                      </span>
                    </div>
                    {(apr.saldo_orcamento_quantidade != null || apr.orcamento_quantidade != null) && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 10, marginTop: 4 }}>
                        <div style={{ color: '#0078d4', fontWeight: 600 }}>
                          📊 Orç Total: {(apr.saldo_orcamento_quantidade ?? apr.orcamento_quantidade)?.toFixed(3)} {apr.saldo_unidade_rt || apr.orcamento_unidade}
                        </div>
                        {(() => {
                          const saldo = apr.saldo_quantidade_rt ?? null;
                          if (saldo == null) return null;
                          const unidade = apr.saldo_unidade_rt || apr.orcamento_unidade;
                          return (
                            <div style={{ color: saldo > 0 ? '#28a745' : '#dc3545', fontWeight: 600 }}>
                              {saldo > 0 ? '✓ Saldo Disponível' : '⚠️ Sem Saldo'}: {saldo.toFixed(3)} {unidade}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'orc_qtd', name: 'Qtde Orç', minWidth: 70, maxWidth: 85,
      onRender: (item: IItemSC) => item.orcamento_quantidade != null ? item.orcamento_quantidade.toFixed(2) : '-',
    },
    {
      key: 'saldo_qtd', name: 'Saldo Qtde', minWidth: 80, maxWidth: 95,
      onRender: (item: IItemSC) => {
        if (item.saldo_quantidade == null) return <span>-</span>;
        const alerta = temAlertaQtd(item);
        const color = alerta ? '#dc3545' : '#28a745';
        return (
          <span style={{ color, fontWeight: 600 }}>
            {alerta && <span title="Quantidade solicitada ultrapassa o saldo orçado">⚠️ </span>}
            {item.saldo_quantidade.toFixed(2)}
          </span>
        );
      },
    },
    {
      key: 'auto_aprovavel', name: 'Auto-Aprov.', minWidth: 90, maxWidth: 110,
      onRender: (item: IItemSC) => {
        if (item.qtd_apropriacoes === 0 || item.auto_aprovavel == null) return <span style={{ color: '#999' }}>-</span>;
        if (item.auto_aprovavel === 1) {
          return (
            <span style={{ color: '#28a745', fontWeight: 600, fontSize: 11 }}
              title="Todas as apropriacoes possuem saldo suficiente">
              ✓ Auto
            </span>
          );
        }
        return (
          <span style={{ color: '#e65c00', fontWeight: 600, fontSize: 11 }}
            title="Saldo insuficiente ou sem orcamento em alguma apropriacao">
            ⚠ Manual
          </span>
        );
      },
    },
    {
      key: 'status_item', name: 'Status', minWidth: 80, maxWidth: 95,
      onRender: (item: IItemSC) => (
        <span style={{
          padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600,
          background: item.status_item === 'APROVADO' ? '#d4edda' : item.status_item === 'REPROVADO' ? '#f8d7da' : '#fff3cd',
          color: item.status_item === 'APROVADO' ? '#155724' : item.status_item === 'REPROVADO' ? '#721c24' : '#856404',
        }}>
          {item.status_item}
        </span>
      ),
    },
    {
      key: 'acoes', name: 'Ações', minWidth: 150, maxWidth: 180,
      onRender: (item: IItemSC) => {
        if (!detalhe || item.status_item !== 'PENDENTE') return null;
        if (detalhe.solicitacao.status !== 'EM_APROVACAO') return null;
        if (!ehAprovadorNivelAtual) return null;

        return (
          <div style={{ display: 'flex', gap: 4 }}>
            <DefaultButton
              text="Aprovar"
              iconProps={{ iconName: 'CheckMark' }}
              styles={{ root: { minWidth: 70, height: 24, fontSize: 11 } }}
              disabled={enviando}
              onClick={() => { void handleAprovarItem(item.item_number); }}
            />
            <DefaultButton
              text="Reprovar"
              iconProps={{ iconName: 'Cancel' }}
              styles={{ root: { minWidth: 75, height: 24, fontSize: 11 } }}
              disabled={enviando}
              onClick={() => { void handleReprovarItem(item.item_number); }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <Panel
      isOpen={isOpen}
      onDismiss={onDismiss}
      type={PanelType.large}
      headerText={`SC #${scId}`}
      closeButtonAriaLabel="Fechar"
    >
      {!loading && (
        <div style={{ marginBottom: 12, padding: '8px 16px', background: '#f3f2f1', borderRadius: 4, display: 'flex', gap: 8, alignItems: 'center' }}>
          <DefaultButton
            text="🔄 Atualizar"
            onClick={() => carregarDetalhes(true)}
            disabled={atualizando}
            styles={{ root: { height: 28, minWidth: 100 } }}
            title="Recarregar dados atualizados do servidor"
          />
          {atualizando && <Spinner size={SpinnerSize.small} label="Atualizando..." />}
          <span style={{ fontSize: 11, color: '#666', marginLeft: 8 }}>
            Clique para atualizar após reprocessamento
          </span>
        </div>
      )}
      {loading && <Spinner size={SpinnerSize.medium} label="Carregando detalhes..." />}
      {erro && <MessageBar messageBarType={MessageBarType.error}>{erro}</MessageBar>}
      {mensagem && <MessageBar messageBarType={MessageBarType.success}>{mensagem}</MessageBar>}

      {/* Alerta de SC deletada */}
      {detalhe && detalhe.solicitacao.status === 'DELETADA' && (
        <MessageBar messageBarType={MessageBarType.severeWarning}>
          <strong>⚠️ Esta SC foi DELETADA no Sienge</strong><br />
          Não é possível aprovar ou reprovar. Esta SC foi excluída do sistema.
        </MessageBar>
      )}

      {detalhe && !loading && (
        <>
          {/* Info da SC */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20, padding: 16, background: '#f8f9fa', borderRadius: 8 }}>
            <div><strong>Obra:</strong> {detalhe.solicitacao.obra_nome}</div>
            <div><strong>Solicitante:</strong> {detalhe.solicitacao.solicitante}</div>
            <div><strong>Data:</strong> {formatDate(detalhe.solicitacao.data_solicitacao)}</div>
            <div><strong>Status:</strong> {detalhe.solicitacao.status.replace('_', ' ')}</div>
            <div><strong>Nivel:</strong> {detalhe.solicitacao.nivel_atual} de {detalhe.solicitacao.total_niveis}</div>
            <div><strong>Itens:</strong> {detalhe.solicitacao.total_itens}</div>
            {detalhe.solicitacao.observacoes && (
              <div style={{ gridColumn: '1 / -1', marginTop: 4 }}>
                <strong>Observacao:</strong> <span style={{ color: '#444' }}>{detalhe.solicitacao.observacoes}</span>
              </div>
            )}
          </div>

          {/* Cadeia de aprovacao */}
          <Separator>Cadeia de Aprovacao</Separator>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {detalhe.cadeia.map((c, i) => {
              const aprovacaoRecord = detalhe.aprovacoes.find(a => a.nivel === c.nivel && a.acao === 'APROVADO');
              const reprovacaoRecord = detalhe.aprovacoes.find(a => a.nivel === c.nivel && a.acao === 'REPROVADO');
              const aprovado = !!aprovacaoRecord;
              const reprovado = !!reprovacaoRecord;
              const atual = c.nivel === detalhe.solicitacao.nivel_atual && detalhe.solicitacao.status === 'EM_APROVACAO';
              let bg = '#e9ecef'; let color = '#666'; let border = '2px solid transparent';
              if (aprovado) { bg = '#d4edda'; color = '#155724'; }
              if (reprovado) { bg = '#f8d7da'; color = '#721c24'; }
              if (atual) { border = '2px solid #0078d4'; }

              return (
                <div key={i} style={{ padding: '8px 14px', borderRadius: 8, background: bg, color, border, fontSize: 13, textAlign: 'center', minWidth: 120 }}>
                  <div style={{ fontWeight: 700 }}>Nivel {c.nivel}</div>
                  <div>{c.cargo}</div>
                  <div style={{ fontSize: 11 }}>{c.aprovador_nome}</div>
                  {aprovado && <div style={{ fontSize: 11, marginTop: 4 }}>APROVADO</div>}
                  {aprovado && aprovacaoRecord.data_acao && (
                    <div style={{ fontSize: 10, marginTop: 2, opacity: 0.85 }}>{formatDateTime(aprovacaoRecord.data_acao)}</div>
                  )}
                  {reprovado && <div style={{ fontSize: 11, marginTop: 4 }}>REPROVADO</div>}
                  {reprovado && reprovacaoRecord.data_acao && (
                    <div style={{ fontSize: 10, marginTop: 2, opacity: 0.85 }}>{formatDateTime(reprovacaoRecord.data_acao)}</div>
                  )}
                  {atual && !aprovado && !reprovado && <div style={{ fontSize: 11, marginTop: 4, color: '#0078d4' }}>AGUARDANDO</div>}
                </div>
              );
            })}
          </div>

          {/* Itens */}
          <Separator>Itens da SC</Separator>

          {itensComAlerta.length > 0 && (
            <MessageBar messageBarType={MessageBarType.severeWarning} isMultiline={true} styles={{ root: { marginBottom: 6 } }}>
              <strong>Atenção — Saldo insuficiente:</strong> {itensComAlerta.length === 1
                ? `O item "${itensComAlerta[0].produto_descricao}" possui quantidade solicitada que ultrapassa o saldo orçado.`
                : `${itensComAlerta.length} itens possuem quantidade solicitada que ultrapassa o saldo orçado.`
              }
            </MessageBar>
          )}

          {itensComAlertaUnidade.length > 0 && (
            <MessageBar messageBarType={MessageBarType.warning} isMultiline={true} styles={{ root: { marginBottom: 10 } }}>
              <strong>Atenção — Unidade divergente:</strong>{' '}
              {itensComAlertaUnidade.map(i => (
                `"${i.produto_descricao}" solicitado em ${i.unidade} mas orçado em ${i.orcamento_unidade}`
              )).join('; ')}.
            </MessageBar>
          )}

          {itensComApropriacaoIncorreta.length > 0 && (
            <MessageBar messageBarType={MessageBarType.error} isMultiline={true} styles={{ root: { marginBottom: 10 } }}>
              <strong>⚠️ Apropriação Incorreta:</strong>{' '}
              {itensComApropriacaoIncorreta.length === 1
                ? `O item "${itensComApropriacaoIncorreta[0].produto_descricao}" possui código WBS incompleto ou diferente do orçamento. Verifique a apropriação antes de aprovar.`
                : `${itensComApropriacaoIncorreta.length} itens possuem código WBS incompleto ou diferente do orçamento. Verifique as apropriações antes de aprovar.`
              }
            </MessageBar>
          )}

          {/* Botões de ação em massa */}
          {ehAprovadorNivelAtual && detalhe.solicitacao.status === 'EM_APROVACAO' && detalhe.itens.some(i => i.status_item === 'PENDENTE') && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#666' }}>
                {itensSelecionados.length > 0 ? `${itensSelecionados.length} item(ns) selecionado(s)` : 'Selecione itens para ação em massa'}
              </span>
              <PrimaryButton
                text="Aprovar Selecionados"
                iconProps={{ iconName: 'CheckMark' }}
                disabled={enviando || itensSelecionados.length === 0}
                onClick={() => { void handleAprovarSelecionados(); }}
                styles={{ root: { minWidth: 150 } }}
              />
              <DefaultButton
                text="Reprovar Selecionados"
                iconProps={{ iconName: 'Cancel' }}
                disabled={enviando || itensSelecionados.length === 0}
                onClick={() => { void handleReprovarSelecionados(); }}
                styles={{ root: { minWidth: 150, borderColor: '#dc3545', color: '#dc3545' } }}
              />
            </div>
          )}

          <DetailsList
            items={detalhe.itens}
            columns={itensColumns}
            layoutMode={DetailsListLayoutMode.justified}
            selectionMode={ehAprovadorNivelAtual && detalhe.solicitacao.status === 'EM_APROVACAO' && detalhe.itens.some(i => i.status_item === 'PENDENTE') ? SelectionMode.multiple : SelectionMode.none}
            selection={selection as any}
            compact={true}
            getKey={(item: IItemSC) => String(item.item_number)}
            selectionPreservedOnEmptyClick={true}
          />

          {/* Historico */}
          {detalhe.aprovacoes.length > 0 && (
            <>
              <Separator>Historico de Aprovacoes</Separator>
              {detalhe.aprovacoes.map((a, i) => (
                <div key={i} style={{ padding: 8, borderBottom: '1px solid #eee', fontSize: 13 }}>
                  <strong>{a.acao}</strong> por {a.aprovador_nome} (Nivel {a.nivel}) em {formatDateTime(a.data_acao)}
                  {a.observacao && <div style={{ color: '#666' }}>Obs: {a.observacao}</div>}
                  {a.motivo_reprovacao && <div style={{ color: '#dc3545' }}>Motivo: {a.motivo_reprovacao}</div>}
                </div>
              ))}
            </>
          )}

          {/* Anexos */}
          <Separator>Anexos</Separator>
          {loadingAnexos && <Spinner size={SpinnerSize.small} label="Carregando anexos..." />}
          {!loadingAnexos && anexos.length === 0 && (
            <div style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>Nenhum anexo encontrado.</div>
          )}
          {!loadingAnexos && anexos.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
              {anexos.map(a => (
                <div key={a.number} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px', background: '#f8f9fa', borderRadius: 6 }}>
                  <span style={{ fontSize: 18 }}>📎</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13 }}>{a.name}</div>
                    {a.description && <div style={{ fontSize: 11, color: '#666' }}>{a.description}</div>}
                  </div>
                  {a.size != null && (
                    <span style={{ fontSize: 11, color: '#888' }}>
                      {a.size < 1024 ? `${a.size} B` : a.size < 1048576 ? `${(a.size / 1024).toFixed(1)} KB` : `${(a.size / 1048576).toFixed(1)} MB`}
                    </span>
                  )}
                  <DefaultButton
                    text={a.number !== null && baixandoAnexo === a.number ? 'Abrindo...' : 'Abrir'}
                    iconProps={{ iconName: a.number !== null && baixandoAnexo === a.number ? 'Sync' : 'OpenFile' }}
                    disabled={a.number === null || (baixandoAnexo !== null && baixandoAnexo !== a.number)}
                    styles={{ root: { minWidth: 80, height: 28, fontSize: 12 } }}
                    onClick={() => { if (a.number !== null) void handleAbrirAnexo(a.number); }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Acoes */}
          {podeAprovar() && !acao && detalhe.solicitacao.status !== 'DELETADA' && (
            <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              <PrimaryButton text="Aprovar" iconProps={{ iconName: 'Accept' }} onClick={() => setAcao('aprovar')} />
              <DefaultButton text="Reprovar" iconProps={{ iconName: 'Cancel' }} onClick={() => setAcao('reprovar')}
                styles={{ root: { borderColor: '#dc3545', color: '#dc3545' } }} />
            </div>
          )}

          {acao && (
            <div style={{ marginTop: 20, padding: 16, background: acao === 'aprovar' ? '#d4edda' : '#f8d7da', borderRadius: 8 }}>
              <h4 style={{ margin: '0 0 10px' }}>{acao === 'aprovar' ? 'Confirmar Aprovacao' : 'Confirmar Reprovacao'}</h4>
              {acao === 'reprovar' && (
                <TextField label="Motivo da reprovacao *" multiline rows={3} value={motivo}
                  onChange={(_, v) => setMotivo(v || '')} required />
              )}
              <TextField label="Observacao (opcional)" multiline rows={2} value={observacao}
                onChange={(_, v) => setObservacao(v || '')} />
              <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
                <PrimaryButton text={enviando ? 'Enviando...' : 'Confirmar'} disabled={enviando} onClick={() => { void executarAcao(); }} />
                <DefaultButton text="Cancelar" onClick={() => { setAcao(null); setMotivo(''); setObservacao(''); }} />
              </div>
            </div>
          )}
        </>
      )}
    </Panel>
  );
};
