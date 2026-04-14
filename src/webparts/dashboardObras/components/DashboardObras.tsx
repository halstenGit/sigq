import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import styles from './DashboardObras.module.scss';
import type { IDashboardObrasProps } from './IDashboardObrasProps';
import { ITesteResultado } from '../services/SiengeService';
import { IProcessingStatus } from '../services/interfaces/ISiengeModels';
import { Spinner, SpinnerSize, MessageBar, MessageBarType } from '@fluentui/react';

const DashboardObras: React.FC<IDashboardObrasProps> = (props) => {
  const [resultados, setResultados] = useState<ITesteResultado[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [erro, setErro] = useState<string>('');
  const [progresso, setProgresso] = useState<string>('');
  const [executado, setExecutado] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [processingStatus, setProcessingStatus] = useState<IProcessingStatus | null>(null);

  const carregarDadosCache = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setProgresso('Buscando dados do cache...');

      const cache = await props.siengeService.fetchDashboardCache();

      if (cache.resultados && cache.resultados.length > 0) {
        setResultados(cache.resultados);
        setExecutado(true);
        if (cache.lastUpdated) {
          const d = new Date(cache.lastUpdated);
          setLastUpdated(
            d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
          );
        }
      }
    } catch {
      // Cache nao disponivel
    } finally {
      setLoading(false);
      setProgresso('');
    }
  }, [props.siengeService]);

  const verificarStatus = useCallback(async (): Promise<void> => {
    try {
      const status = await props.siengeService.fetchStatus();
      setProcessingStatus(status);

      // Se completou, recarrega os dados
      if (status.status === 'complete' && status.completedDate) {
        void carregarDadosCache();
        setProcessingStatus(null);
      }
    } catch {
      // Ignora erros de status
    }
  }, [props.siengeService, carregarDadosCache]);

  // Auto-load: buscar dados do cache ao montar
  useEffect(() => {
    if (!props.isConfigured) return;
    void carregarDadosCache();
  }, [props.isConfigured, carregarDadosCache]);

  // Polling: verifica status a cada 30s quando ha processamento ativo
  useEffect(() => {
    if (!props.isConfigured || !processingStatus || processingStatus.status !== 'processing') return;

    const interval = setInterval(() => {
      void verificarStatus();
    }, 30000);

    return (): void => { clearInterval(interval); };
  }, [props.isConfigured, processingStatus, verificarStatus]);

  const solicitarAtualizacao = async (): Promise<void> => {
    try {
      setLoading(true);
      setErro('');
      setProgresso('Solicitando atualizacao ao Worker...');

      const result = await props.siengeService.triggerRefresh();

      if (result.status === 'started') {
        setProgresso('');
        setProcessingStatus({
          status: 'processing',
          totalObras: result.totalObras,
          processedObras: 0,
          pendingObras: result.totalObras,
        });
      } else {
        setErro(result.message || 'Erro ao solicitar atualizacao');
      }
    } catch (error) {
      setErro(`Erro: ${(error as Error).message}`);
    } finally {
      setLoading(false);
      setProgresso('');
    }
  };

  // Totais
  const totalItens = resultados.reduce((s, r) => s + r.totalItensSc, 0);
  const totalSem = resultados.reduce((s, r) => s + r.itensSemOrcamento, 0);
  const totalCom = resultados.reduce((s, r) => s + r.itensComOrcamento, 0);
  const percGeralSem = totalItens > 0 ? Math.round((totalSem / totalItens) * 100) : 0;

  if (!props.isConfigured) {
    return (
      <div className={styles.dashboardObras}>
        <MessageBar messageBarType={MessageBarType.warning}>
          Configure a URL do Worker nas propriedades do webpart (icone de engrenagem).
        </MessageBar>
      </div>
    );
  }

  return (
    <div className={styles.dashboardObras}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2 style={{ margin: 0 }}>Analise SC vs Orcamento</h2>
          {lastUpdated && (
            <span style={{ fontSize: 12, color: '#666' }}>
              Atualizado: {lastUpdated}
            </span>
          )}
        </div>
        <button onClick={solicitarAtualizacao} className={styles.btnAtualizar} disabled={loading || (processingStatus !== null && processingStatus.status === 'processing')}>
          {loading ? 'Processando...' : 'Atualizar Dados'}
        </button>
      </div>

      {/* Status de processamento */}
      {processingStatus && processingStatus.status === 'processing' && (
        <MessageBar messageBarType={MessageBarType.info} style={{ marginBottom: 20 }}>
          Processamento em andamento: {processingStatus.processedObras || 0} de {processingStatus.totalObras || '?'} obras.
          Os dados serao atualizados automaticamente quando terminar.
        </MessageBar>
      )}

      {/* Progresso */}
      {loading && (
        <div style={{ marginBottom: 20 }}>
          <Spinner size={SpinnerSize.medium} label={progresso} />
        </div>
      )}

      {/* Erro */}
      {erro && (
        <MessageBar messageBarType={MessageBarType.error} style={{ marginBottom: 20 }}>
          {erro}
        </MessageBar>
      )}

      {/* Resultado geral */}
      {executado && !loading && (
        <>
          <div className={styles.indicadores}>
            <div className={styles.cardIndicador}>
              <div className={styles.conteudo}>
                <span className={styles.valor}>{resultados.length}</span>
                <span className={styles.label}>Obras com SCs</span>
              </div>
            </div>
            <div className={styles.cardIndicador}>
              <div className={styles.conteudo}>
                <span className={styles.valor}>{totalItens}</span>
                <span className={styles.label}>Insumos Unicos</span>
              </div>
            </div>
            <div className={`${styles.cardIndicador} ${styles.sucesso}`}>
              <div className={styles.conteudo}>
                <span className={styles.valor}>{totalCom}</span>
                <span className={styles.label}>Com Orcamento ({totalItens > 0 ? 100 - percGeralSem : 0}%)</span>
              </div>
            </div>
            <div className={`${styles.cardIndicador} ${styles.atencao}`}>
              <div className={styles.conteudo}>
                <span className={styles.valor}>{totalSem}</span>
                <span className={styles.label}>Sem Orcamento ({percGeralSem}%)</span>
              </div>
            </div>
          </div>

          {/* Tabela por obra */}
          <div className={styles.listaObras}>
            <h3>Detalhamento por Obra</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <thead>
                <tr style={{ background: '#0078d4', color: 'white', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px' }}>Obra</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Total Insumos</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Com Orcamento</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Sem Orcamento</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>% Sem</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {resultados.map((r, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #eee', background: idx % 2 === 0 ? '#fff' : '#f8f9fa' }}>
                    <td style={{ padding: '10px 16px', fontSize: 13 }}>{r.obra}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center', fontWeight: 600 }}>{r.totalItensSc}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center', color: '#28a745', fontWeight: 600 }}>{r.itensComOrcamento}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center', color: '#dc3545', fontWeight: 600 }}>{r.itensSemOrcamento}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 700,
                        background: r.percSemOrcamento > 50 ? '#ffe0e0' : r.percSemOrcamento > 20 ? '#fff3cd' : '#d4edda',
                        color: r.percSemOrcamento > 50 ? '#dc3545' : r.percSemOrcamento > 20 ? '#856404' : '#28a745',
                      }}>
                        {r.percSemOrcamento}%
                      </span>
                    </td>
                    <td style={{ padding: '10px 16px', fontSize: 12 }}>
                      {r.erro
                        ? <span style={{ color: '#dc3545' }}>{r.erro}</span>
                        : <span style={{ color: '#28a745' }}>OK</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: '#e9ecef', fontWeight: 700 }}>
                  <td style={{ padding: '12px 16px' }}>TOTAL</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>{totalItens}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', color: '#28a745' }}>{totalCom}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', color: '#dc3545' }}>{totalSem}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 700,
                      background: '#ffe0e0',
                      color: '#dc3545',
                    }}>
                      {percGeralSem}%
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }} />
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}

      {/* Mensagem inicial */}
      {!executado && !loading && (
        <div style={{ textAlign: 'center', padding: 60, color: '#666' }}>
          <p style={{ fontSize: 18, marginBottom: 10 }}>Nenhum dado disponivel ainda.</p>
          <p style={{ fontSize: 14, marginBottom: 20 }}>Os dados sao atualizados automaticamente pelo Worker (cron diario).</p>
          <p style={{ fontSize: 14 }}>Ou clique em &quot;Atualizar Dados&quot; para solicitar um reprocessamento.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardObras;
