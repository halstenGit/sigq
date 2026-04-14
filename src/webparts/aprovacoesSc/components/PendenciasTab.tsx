import * as React from 'react';
import { useState, useMemo } from 'react';
import { DetailsList, DetailsListLayoutMode, SelectionMode, IColumn, ComboBox, IComboBoxOption, TextField } from '@fluentui/react';
import type { ISolicitacao } from '../services/interfaces/IAprovacaoModels';

interface IPendenciasTabProps {
  solicitacoes: ISolicitacao[];
  onSelectSc: (scId: number) => void;
  loading: boolean;
}

const statusColors: Record<string, { bg: string; color: string }> = {
  'PENDENTE': { bg: '#fff3cd', color: '#856404' },
  'EM_APROVACAO': { bg: '#cce5ff', color: '#004085' },
  'APROVADO': { bg: '#d4edda', color: '#155724' },
  'REPROVADO': { bg: '#f8d7da', color: '#721c24' },
};

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

export const PendenciasTab: React.FC<IPendenciasTabProps> = ({ solicitacoes, onSelectSc, loading }) => {
  const [sortColumn, setSortColumn] = useState<string>('sc_id');
  const [sortDescending, setSortDescending] = useState(true);
  const [scFiltro, setScFiltro] = useState<string>('');
  const [obraFiltro, setObraFiltro] = useState<string>('');

  // Opções de obras únicas para o ComboBox
  const opcoesObra: IComboBoxOption[] = useMemo(() => {
    const seen: Record<string, boolean> = {};
    const obras = solicitacoes.map(s => s.obra_nome).filter(o => o && !seen[o] && (seen[o] = true)).sort();
    return [
      { key: '', text: 'Todas as obras' },
      ...obras.map(o => ({ key: o, text: o })),
    ];
  }, [solicitacoes]);

  // Itens filtrados e ordenados
  const items = useMemo(() => {
    let lista = solicitacoes;
    if (scFiltro.trim()) {
      lista = lista.filter(s => String(s.sc_id).includes(scFiltro.trim()));
    }
    if (obraFiltro) {
      lista = lista.filter(s => s.obra_nome === obraFiltro);
    }

    return [...lista].sort((a, b) => {
      let aVal: string | number = a[sortColumn as keyof ISolicitacao] as string | number;
      let bVal: string | number = b[sortColumn as keyof ISolicitacao] as string | number;
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDescending ? 1 : -1;
      if (aVal > bVal) return sortDescending ? -1 : 1;
      return 0;
    });
  }, [solicitacoes, scFiltro, obraFiltro, sortColumn, sortDescending]);

  const handleColumnClick = (columnKey: string): void => {
    const isDesc = sortColumn === columnKey ? !sortDescending : false;
    setSortColumn(columnKey);
    setSortDescending(isDesc);
  };

  const columns: IColumn[] = [
    {
      key: 'sc_id', name: 'SC #', fieldName: 'sc_id', minWidth: 60, maxWidth: 80,
      isSorted: sortColumn === 'sc_id', isSortedDescending: sortDescending,
      onColumnClick: () => handleColumnClick('sc_id'),
      onRender: (item: ISolicitacao) => (
        <a href="#" onClick={(e) => { e.preventDefault(); onSelectSc(item.sc_id); }}
          style={{ fontWeight: 600, color: '#0078d4' }}>
          {item.sc_id}
        </a>
      ),
    },
    {
      key: 'obra_nome', name: 'Obra', fieldName: 'obra_nome', minWidth: 150, maxWidth: 300,
      isSorted: sortColumn === 'obra_nome', isSortedDescending: sortDescending,
      onColumnClick: () => handleColumnClick('obra_nome'),
    },
    {
      key: 'solicitante', name: 'Solicitante', fieldName: 'solicitante', minWidth: 120, maxWidth: 200,
      isSorted: sortColumn === 'solicitante', isSortedDescending: sortDescending,
      onColumnClick: () => handleColumnClick('solicitante'),
    },
    {
      key: 'total_itens', name: 'Itens', fieldName: 'total_itens', minWidth: 50, maxWidth: 70,
      isSorted: sortColumn === 'total_itens', isSortedDescending: sortDescending,
      onColumnClick: () => handleColumnClick('total_itens'),
    },
    {
      key: 'nivel', name: 'Nivel', minWidth: 80, maxWidth: 100,
      onRender: (item: ISolicitacao) => <span>{item.nivel_atual}/{item.total_niveis}</span>,
    },
    {
      key: 'status', name: 'Status', minWidth: 100, maxWidth: 130,
      isSorted: sortColumn === 'status', isSortedDescending: sortDescending,
      onColumnClick: () => handleColumnClick('status'),
      onRender: (item: ISolicitacao) => {
        const sc = statusColors[item.status] || { bg: '#eee', color: '#333' };
        return (
          <span style={{ padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700, background: sc.bg, color: sc.color }}>
            {item.status.replace('_', ' ')}
          </span>
        );
      },
    },
    {
      key: 'data', name: 'Data', fieldName: 'data_solicitacao', minWidth: 90, maxWidth: 110,
      isSorted: sortColumn === 'data_solicitacao', isSortedDescending: sortDescending,
      onColumnClick: () => handleColumnClick('data_solicitacao'),
      onRender: (item: ISolicitacao) => formatDate(item.data_solicitacao),
    },
  ];

  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
        <TextField
          label="Nº SC"
          value={scFiltro}
          onChange={(_, v) => setScFiltro(v || '')}
          placeholder="Ex: 16325"
          styles={{ root: { width: 120 } }}
        />
        <ComboBox
          label="Obra"
          placeholder="Todas as obras"
          selectedKey={obraFiltro || null}
          options={opcoesObra}
          allowFreeform={true}
          autoComplete="on"
          onChange={(_, opt, __, val) => {
            if (opt !== undefined) {
              // opção selecionada da lista: usa a key ('' = todas)
              setObraFiltro(String(opt.key));
            } else if (val === '' || val === undefined) {
              // campo limpo
              setObraFiltro('');
            }
            // se val é texto parcial (usuário ainda digitando), não altera o filtro
          }}
          styles={{ root: { minWidth: 280 } }}
        />
        {(scFiltro || obraFiltro) && (
          <span style={{ fontSize: 12, color: '#666', paddingBottom: 4 }}>
            {items.length} SC{items.length !== 1 ? 's' : ''} encontrada{items.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {!loading && items.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>Nenhuma solicitacao encontrada.</div>
      ) : (
        <DetailsList
          items={items}
          columns={columns}
          layoutMode={DetailsListLayoutMode.justified}
          selectionMode={SelectionMode.none}
          isHeaderVisible={true}
        />
      )}
    </div>
  );
};
