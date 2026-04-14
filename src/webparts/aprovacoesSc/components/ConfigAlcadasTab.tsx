import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import {
  MessageBar, MessageBarType, Spinner, SpinnerSize, PrimaryButton, DefaultButton,
  TextField, ComboBox, IComboBoxOption, Dropdown, IDropdownOption, DetailsList, DetailsListLayoutMode,
  SelectionMode, IColumn, IconButton, Separator,
} from '@fluentui/react';
import type { AprovacaoService } from '../services/AprovacaoService';
import type { IAlcada, IObra, IUsuario, IObraConfig } from '../services/interfaces/IAprovacaoModels';

interface IConfigAlcadasTabProps {
  service: AprovacaoService;
  userEmail: string;
}

export const ConfigAlcadasTab: React.FC<IConfigAlcadasTabProps> = ({ service }) => {
  const [alcadas, setAlcadas] = useState<IAlcada[]>([]);
  const [obras, setObras] = useState<IObra[]>([]);
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [obrasConfig, setObrasConfig] = useState<IObraConfig[]>([]);
  const [webhookEdits, setWebhookEdits] = useState<Record<number, string>>({});
  const [salvandoWebhook, setSalvandoWebhook] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  // Form alcada
  const [showForm, setShowForm] = useState(false);
  const [formObraId, setFormObraId] = useState<number | undefined>();
  const [formObraNome, setFormObraNome] = useState('');
  const [formNivel, setFormNivel] = useState('');
  const [formCargo, setFormCargo] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formNome, setFormNome] = useState('');

  const carregar = useCallback(async (): Promise<void> => {
    setLoading(true);
    setErro('');
    try {
      const [alcRes, obrasRes, usrRes, configRes] = await Promise.all([
        service.getAlcadas(),
        service.getObras(),
        service.getUsuarios().catch(() => ({ results: [] as IUsuario[] })),
        service.getObrasConfig().catch(() => ({ results: [] as IObraConfig[] })),
      ]);
      setAlcadas(alcRes.results || []);
      setObras(obrasRes.results || []);
      setUsuarios(usrRes.results || []);
      const cfg = configRes.results || [];
      setObrasConfig(cfg);
      // Inicializa os campos de edição com os valores salvos
      const edits: Record<number, string> = {};
      cfg.forEach(c => { edits[c.obra_id] = c.teams_webhook_url || ''; });
      setWebhookEdits(edits);
      setIsAdmin(true);
    } catch (e) {
      const msg = (e as Error).message;
      if (msg.includes('administrador') || msg.includes('403')) {
        setIsAdmin(false);
      } else {
        setErro(msg);
      }
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const salvarAlcada = async (): Promise<void> => {
    if (!formObraId || !formNivel || !formCargo || !formEmail || !formNome) {
      setErro('Preencha todos os campos');
      return;
    }
    try {
      await service.upsertAlcada({
        obra_id: formObraId,
        obra_nome: formObraNome,
        nivel: parseInt(formNivel, 10),
        cargo: formCargo,
        aprovador_email: formEmail,
        aprovador_nome: formNome,
      });
      setShowForm(false);
      setFormObraId(undefined); setFormObraNome(''); setFormNivel(''); setFormCargo(''); setFormEmail(''); setFormNome('');
      await carregar();
    } catch (e) {
      setErro((e as Error).message);
    }
  };

  const excluirAlcada = async (id: number): Promise<void> => {
    try {
      await service.deleteAlcada(id);
      await carregar();
    } catch (e) {
      setErro((e as Error).message);
    }
  };

  const salvarWebhook = async (obraId: number, obraNome: string): Promise<void> => {
    setSalvandoWebhook(prev => ({ ...prev, [obraId]: true }));
    try {
      const url = webhookEdits[obraId] || null;
      await service.upsertObraConfig({ obra_id: obraId, obra_nome: obraNome, teams_webhook_url: url || null });
      setObrasConfig(prev => {
        const existe = prev.find(c => c.obra_id === obraId);
        if (existe) return prev.map(c => c.obra_id === obraId ? { ...c, teams_webhook_url: url } : c);
        return [...prev, { obra_id: obraId, obra_nome: obraNome, teams_webhook_url: url }];
      });
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setSalvandoWebhook(prev => ({ ...prev, [obraId]: false }));
    }
  };

  const copiarAlcada = (alcada: IAlcada): void => {
    setFormObraId(alcada.obra_id);
    setFormObraNome(alcada.obra_nome);
    setFormNivel(String(alcada.nivel));
    setFormCargo(alcada.cargo);
    setFormNome('');
    setFormEmail('');
    setShowForm(true);
  };

  if (loading && isAdmin === null) return <Spinner size={SpinnerSize.medium} label="Verificando permissoes..." />;

  if (isAdmin === false) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>
        Apenas administradores podem acessar esta area.
      </div>
    );
  }

  const obrasOptions: IComboBoxOption[] = obras.map(o => ({ key: o.id, text: o.nome }));

  // Obras únicas que têm alçadas cadastradas (para seção de webhooks)
  const obrasComAlcada: { id: number; nome: string }[] = [];
  const seenObras: Record<number, boolean> = {};
  alcadas.forEach(a => {
    if (!seenObras[a.obra_id]) {
      seenObras[a.obra_id] = true;
      obrasComAlcada.push({ id: a.obra_id, nome: a.obra_nome });
    }
  });

  const alcadasColumns: IColumn[] = [
    { key: 'obra_nome', name: 'Obra', fieldName: 'obra_nome', minWidth: 200 },
    { key: 'nivel', name: 'Nivel', fieldName: 'nivel', minWidth: 50, maxWidth: 60 },
    { key: 'cargo', name: 'Cargo', fieldName: 'cargo', minWidth: 120 },
    { key: 'aprovador_nome', name: 'Aprovador', fieldName: 'aprovador_nome', minWidth: 150 },
    { key: 'aprovador_email', name: 'Email', fieldName: 'aprovador_email', minWidth: 200 },
    {
      key: 'acoes', name: '', minWidth: 80, maxWidth: 80,
      onRender: (item: IAlcada) => (
        <div style={{ display: 'flex', gap: 2 }}>
          <IconButton iconProps={{ iconName: 'Copy' }} title="Copiar para novo aprovador"
            onClick={() => copiarAlcada(item)}
            styles={{ root: { color: '#0078d4' } }} />
          <IconButton iconProps={{ iconName: 'Delete' }} title="Remover"
            onClick={() => { void excluirAlcada(item.id); }}
            styles={{ root: { color: '#dc3545' } }} />
        </div>
      ),
    },
  ];

  const usuariosColumns: IColumn[] = [
    { key: 'nome', name: 'Nome', fieldName: 'nome', minWidth: 150 },
    { key: 'email', name: 'Email', fieldName: 'email', minWidth: 200 },
    { key: 'perfil', name: 'Perfil', fieldName: 'perfil', minWidth: 80, maxWidth: 100 },
  ];

  return (
    <div style={{ marginTop: 10 }}>
      {erro && <MessageBar messageBarType={MessageBarType.error} onDismiss={() => setErro('')}>{erro}</MessageBar>}

      {/* Alcadas */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <h3 style={{ margin: 0 }}>Alcadas por Obra</h3>
        <PrimaryButton text="Nova Alcada" iconProps={{ iconName: 'Add' }} onClick={() => {
          setFormObraId(undefined); setFormObraNome(''); setFormNivel(''); setFormCargo(''); setFormNome(''); setFormEmail('');
          setShowForm(true);
        }} />
      </div>

      {showForm && (
        <div style={{ padding: 16, background: '#f8f9fa', borderRadius: 8, marginBottom: 16 }}>
          {formNome === '' && formEmail === '' && formObraId !== undefined && (
            <MessageBar messageBarType={MessageBarType.info} styles={{ root: { marginBottom: 10 } }}>
              Obra, nível e cargo copiados. Preencha apenas o nome e e-mail do novo aprovador.
            </MessageBar>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <ComboBox label="Obra" options={obrasOptions} selectedKey={formObraId ?? null}
              allowFreeform={true} autoComplete="on"
              onChange={(_, opt, __, val) => {
                if (opt) {
                  setFormObraId(opt.key as number);
                  setFormObraNome(opt.text);
                } else if (val !== undefined) {
                  setFormObraId(undefined);
                  setFormObraNome(val);
                }
              }}
              placeholder="Digite ou selecione a obra" />
            <Dropdown label="Nivel" selectedKey={formNivel || null}
              options={[{ key: '1', text: 'Nível 1' }, { key: '2', text: 'Nível 2' }, { key: '3', text: 'Nível 3' }] as IDropdownOption[]}
              onChange={(_, opt) => setFormNivel(opt?.key as string || '')}
              placeholder="Selecione o nível" />
            <TextField label="Cargo" value={formCargo} onChange={(_, v) => setFormCargo(v || '')} placeholder="Ex: Coordenador" />
            <TextField label="Nome do Aprovador" value={formNome} onChange={(_, v) => setFormNome(v || '')} />
            <TextField label="Email do Aprovador" value={formEmail} onChange={(_, v) => setFormEmail(v || '')} />
          </div>
          <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
            <PrimaryButton text="Salvar" onClick={() => { void salvarAlcada(); }} />
            <DefaultButton text="Cancelar" onClick={() => setShowForm(false)} />
          </div>
        </div>
      )}

      <DetailsList
        items={alcadas}
        columns={alcadasColumns}
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
      />

      {/* Notificacoes Teams por Obra */}
      <Separator />
      <h3 style={{ margin: '0 0 4px 0' }}>Notificacoes Teams por Obra</h3>
      <p style={{ fontSize: 12, color: '#666', marginTop: 0, marginBottom: 12 }}>
        Cole a URL do Incoming Webhook do canal do Teams de cada obra. Deixe em branco para desativar.
      </p>
      {obrasComAlcada.length === 0 && (
        <div style={{ color: '#888', fontSize: 13 }}>Nenhuma obra com alcadas configuradas.</div>
      )}
      {obrasComAlcada.map(obra => {
        const cfg = obrasConfig.find(c => c.obra_id === obra.id);
        const temWebhook = cfg && cfg.teams_webhook_url;
        return (
          <div key={obra.id} style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 10 }}>
            <div style={{ flex: 1 }}>
              <TextField
                label={obra.nome}
                value={webhookEdits[obra.id] || ''}
                onChange={(_, v) => setWebhookEdits(prev => ({ ...prev, [obra.id]: v || '' }))}
                placeholder="https://outlook.office.com/webhook/..."
                styles={{ root: { width: '100%' } }}
              />
            </div>
            <PrimaryButton
              text={salvandoWebhook[obra.id] ? 'Salvando...' : 'Salvar'}
              disabled={!!salvandoWebhook[obra.id]}
              onClick={() => { void salvarWebhook(obra.id, obra.nome); }}
              styles={{ root: { minWidth: 80, marginBottom: 2 } }}
            />
            {temWebhook && (
              <span style={{ fontSize: 11, color: '#28a745', paddingBottom: 6 }}>✓ Ativo</span>
            )}
          </div>
        );
      })}

      {/* Usuarios */}
      <Separator />
      <h3>Usuarios</h3>
      <DetailsList
        items={usuarios}
        columns={usuariosColumns}
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
      />
    </div>
  );
};
