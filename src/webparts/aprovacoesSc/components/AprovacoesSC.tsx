import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Pivot, PivotItem, MessageBar, MessageBarType, Spinner, SpinnerSize } from '@fluentui/react';
import styles from './AprovacoesSC.module.scss';
import type { IAprovacoesSCProps } from './IAprovacoesSCProps';
import type { ISolicitacao } from '../services/interfaces/IAprovacaoModels';
import { PendenciasTab } from './PendenciasTab';
import { HistoricoTab } from './HistoricoTab';
import { ConfigAlcadasTab } from './ConfigAlcadasTab';
import { GestaoUsuariosTab } from './GestaoUsuariosTab';
import { DetalheScPanel } from './DetalheScPanel';

const AprovacoesSC: React.FC<IAprovacoesSCProps> = (props) => {
  const [pendentes, setPendentes] = useState<ISolicitacao[]>([]);
  const [todas, setTodas] = useState<ISolicitacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [selectedSc, setSelectedSc] = useState<number | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const carregarDados = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setErro('');
      const [pend, all] = await Promise.all([
        props.service.getPendentes(),
        props.service.getTodas(),
      ]);
      setPendentes(pend.results || []);
      setTodas(all.results || []);
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [props.service]);

  useEffect(() => {
    if (!props.isConfigured) return;
    void carregarDados();
  }, [props.isConfigured, carregarDados]);

  const abrirDetalhe = (scId: number): void => {
    setSelectedSc(scId);
    setPanelOpen(true);
  };

  const fecharPanel = (): void => {
    setPanelOpen(false);
    setSelectedSc(null);
  };

  const onAcaoRealizada = (): void => {
    fecharPanel();
    void carregarDados();
  };

  if (!props.isConfigured) {
    return (
      <div className={styles.aprovacoesSc}>
        <MessageBar messageBarType={MessageBarType.warning}>
          Configure a URL do Worker e API Key nas propriedades do webpart (icone de engrenagem).
        </MessageBar>
      </div>
    );
  }

  return (
    <div className={styles.aprovacoesSc}>
      <div className={styles.header}>
        <h2>Aprovacoes de Solicitacoes de Compra</h2>
        <span className={styles.userInfo}>{props.userName} ({props.userEmail})</span>
      </div>

      {erro && (
        <MessageBar messageBarType={MessageBarType.error} onDismiss={() => setErro('')}>
          {erro}
        </MessageBar>
      )}

      {loading && <Spinner size={SpinnerSize.medium} label="Carregando..." />}

      <Pivot>
        <PivotItem headerText={`Pendencias (${pendentes.length})`} itemIcon="Clock">
          <PendenciasTab
            solicitacoes={pendentes}
            onSelectSc={abrirDetalhe}
            loading={loading}
          />
        </PivotItem>
        <PivotItem headerText={`Todas SCs (${todas.length})`} itemIcon="BulletedList">
          <PendenciasTab
            solicitacoes={todas}
            onSelectSc={abrirDetalhe}
            loading={loading}
          />
        </PivotItem>
        <PivotItem headerText="Historico" itemIcon="History">
          <HistoricoTab service={props.service} />
        </PivotItem>
        <PivotItem headerText="Configuracoes" itemIcon="Settings">
          <ConfigAlcadasTab service={props.service} userEmail={props.userEmail} />
        </PivotItem>
        <PivotItem headerText="Usuarios" itemIcon="People">
          <GestaoUsuariosTab service={props.service} userEmail={props.userEmail} />
        </PivotItem>
      </Pivot>

      {panelOpen && selectedSc && (
        <DetalheScPanel
          scId={selectedSc}
          service={props.service}
          userEmail={props.userEmail}
          isOpen={panelOpen}
          onDismiss={fecharPanel}
          onAcaoRealizada={onAcaoRealizada}
        />
      )}
    </div>
  );
};

export default AprovacoesSC;
