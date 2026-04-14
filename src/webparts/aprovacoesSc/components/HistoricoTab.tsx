import * as React from 'react';
import { useState, useEffect } from 'react';
import { DetailsList, DetailsListLayoutMode, SelectionMode, IColumn, Spinner, SpinnerSize, IconButton } from '@fluentui/react';
import type { AprovacaoService } from '../services/AprovacaoService';
import type { IAprovacao } from '../services/interfaces/IAprovacaoModels';

interface IHistoricoTabProps {
  service: AprovacaoService;
}

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

export const HistoricoTab: React.FC<IHistoricoTabProps> = ({ service }) => {
  const [historico, setHistorico] = useState<IAprovacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const carregar = async (p: number): Promise<void> => {
    setLoading(true);
    try {
      const res = await service.getHistorico(p);
      setHistorico(res.results || []);
      setPage(res.page);
      setTotalPages(res.totalPages);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void carregar(1);
  }, [service]); // eslint-disable-line react-hooks/exhaustive-deps

  const columns: IColumn[] = [
    { key: 'sc_id', name: 'SC #', fieldName: 'sc_id', minWidth: 60, maxWidth: 80 },
    { key: 'obra_nome', name: 'Obra', fieldName: 'obra_nome', minWidth: 150 },
    { key: 'nivel', name: 'Nivel', fieldName: 'nivel', minWidth: 50, maxWidth: 60 },
    {
      key: 'acao', name: 'Acao', minWidth: 90, maxWidth: 110,
      onRender: (item: IAprovacao) => (
        <span style={{
          padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600,
          background: item.acao === 'APROVADO' ? '#d4edda' : '#f8d7da',
          color: item.acao === 'APROVADO' ? '#155724' : '#721c24',
        }}>
          {item.acao}
        </span>
      ),
    },
    { key: 'aprovador_nome', name: 'Aprovador', fieldName: 'aprovador_nome', minWidth: 120 },
    {
      key: 'data_acao', name: 'Data', minWidth: 130,
      onRender: (item: IAprovacao) => formatDateTime(item.data_acao),
    },
    { key: 'observacao', name: 'Observacao', fieldName: 'observacao', minWidth: 150 },
  ];

  if (loading) return <Spinner size={SpinnerSize.medium} label="Carregando historico..." />;

  return (
    <div style={{ marginTop: 10 }}>
      <DetailsList
        items={historico}
        columns={columns}
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
      />
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 10 }}>
          <IconButton iconProps={{ iconName: 'ChevronLeft' }} disabled={page <= 1}
            onClick={() => { void carregar(page - 1); }} />
          <span>Pagina {page} de {totalPages}</span>
          <IconButton iconProps={{ iconName: 'ChevronRight' }} disabled={page >= totalPages}
            onClick={() => { void carregar(page + 1); }} />
        </div>
      )}
    </div>
  );
};
