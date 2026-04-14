import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import {
  MessageBar, MessageBarType, Spinner, SpinnerSize, PrimaryButton, DefaultButton,
  TextField, Dropdown, IDropdownOption, DetailsList, DetailsListLayoutMode,
  SelectionMode, IColumn, IconButton, Dialog, DialogFooter, DialogType,
} from '@fluentui/react';
import type { AprovacaoService } from '../services/AprovacaoService';
import type { IUsuario, IObra } from '../services/interfaces/IAprovacaoModels';

interface IGestaoUsuariosTabProps {
  service: AprovacaoService;
  userEmail: string;
}

export const GestaoUsuariosTab: React.FC<IGestaoUsuariosTabProps> = ({ service }) => {
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [obras, setObras] = useState<IObra[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  // Form usuario
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | undefined>();
  const [formEmail, setFormEmail] = useState('');
  const [formNome, setFormNome] = useState('');
  const [formPerfil, setFormPerfil] = useState<'aprovador' | 'consulta' | 'admin'>('consulta');
  const [formObrasVisiveis, setFormObrasVisiveis] = useState<number[]>([]);
  const [todasObras, setTodasObras] = useState(false);

  // Confirmar exclusao
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState<IUsuario | null>(null);

  const carregar = useCallback(async (): Promise<void> => {
    setLoading(true);
    setErro('');
    setSucesso('');
    try {
      const [usrRes, obrasRes] = await Promise.all([
        service.getUsuarios(),
        service.getObras(),
      ]);
      setUsuarios(usrRes.results || []);
      setObras(obrasRes.results || []);
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

  const abrirFormNovo = (): void => {
    setEditingId(undefined);
    setFormEmail('');
    setFormNome('');
    setFormPerfil('consulta');
    setFormObrasVisiveis([]);
    setTodasObras(false);
    setShowForm(true);
  };

  const abrirFormEdicao = (usuario: IUsuario): void => {
    setEditingId(usuario.id);
    setFormEmail(usuario.email);
    setFormNome(usuario.nome);
    setFormPerfil(usuario.perfil);

    if (usuario.obras_visiveis) {
      try {
        const obrasIds = JSON.parse(usuario.obras_visiveis) as number[];
        setFormObrasVisiveis(obrasIds);
        setTodasObras(false);
      } catch {
        setFormObrasVisiveis([]);
        setTodasObras(true);
      }
    } else {
      setFormObrasVisiveis([]);
      setTodasObras(true);
    }

    setShowForm(true);
  };

  const salvarUsuario = async (): Promise<void> => {
    if (!formEmail.trim() || !formNome.trim()) {
      setErro('Email e Nome são obrigatórios');
      return;
    }

    try {
      const obrasVisiveisJson = todasObras || formObrasVisiveis.length === 0
        ? null
        : formObrasVisiveis;

      await service.upsertUsuario({
        id: editingId,
        email: formEmail.trim(),
        nome: formNome.trim(),
        perfil: formPerfil,
        obras_visiveis: obrasVisiveisJson ? JSON.stringify(obrasVisiveisJson) : null,
        ativo: 1,
      });

      setSucesso(editingId ? 'Usuário atualizado com sucesso!' : 'Usuário adicionado com sucesso!');
      setShowForm(false);
      await carregar();
    } catch (e) {
      setErro((e as Error).message);
    }
  };

  const confirmarExclusao = (usuario: IUsuario): void => {
    setUsuarioToDelete(usuario);
    setDeleteDialogOpen(true);
  };

  const excluirUsuario = async (): Promise<void> => {
    if (!usuarioToDelete) return;

    try {
      await service.deleteUsuario(usuarioToDelete.id);
      setSucesso('Usuário removido com sucesso!');
      setDeleteDialogOpen(false);
      setUsuarioToDelete(null);
      await carregar();
    } catch (e) {
      setErro((e as Error).message);
      setDeleteDialogOpen(false);
    }
  };

  if (loading && isAdmin === null) return <Spinner size={SpinnerSize.medium} label="Verificando permissões..." />;

  if (isAdmin === false) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>
        Apenas administradores podem acessar esta área.
      </div>
    );
  }

  const perfilOptions: IDropdownOption[] = [
    { key: 'consulta', text: 'Consulta (somente leitura)' },
    { key: 'aprovador', text: 'Aprovador' },
    { key: 'admin', text: 'Administrador' },
  ];

  const obrasOptions: IDropdownOption[] = obras.map(o => ({ key: o.id, text: o.nome }));

  const usuariosColumns: IColumn[] = [
    { key: 'nome', name: 'Nome', fieldName: 'nome', minWidth: 150 },
    { key: 'email', name: 'Email', fieldName: 'email', minWidth: 200 },
    {
      key: 'perfil', name: 'Perfil', minWidth: 120, maxWidth: 140,
      onRender: (item: IUsuario) => {
        const color = item.perfil === 'admin' ? '#d13438' : item.perfil === 'aprovador' ? '#107c10' : '#0078d4';
        return <span style={{ color, fontWeight: 600 }}>{item.perfil.toUpperCase()}</span>;
      },
    },
    {
      key: 'obras_visiveis', name: 'Obras Visíveis', minWidth: 100,
      onRender: (item: IUsuario) => {
        if (!item.obras_visiveis) return <span style={{ color: '#666' }}>Todas</span>;
        try {
          const obrasIds = JSON.parse(item.obras_visiveis) as number[];
          return <span>{obrasIds.length} obra(s)</span>;
        } catch {
          return <span style={{ color: '#666' }}>Todas</span>;
        }
      },
    },
    {
      key: 'acoes', name: 'Ações', minWidth: 100, maxWidth: 120,
      onRender: (item: IUsuario) => (
        <div style={{ display: 'flex', gap: 4 }}>
          <IconButton
            iconProps={{ iconName: 'Edit' }}
            title="Editar"
            onClick={() => abrirFormEdicao(item)}
            styles={{ root: { color: '#0078d4' } }}
          />
          <IconButton
            iconProps={{ iconName: 'Delete' }}
            title="Remover"
            onClick={() => confirmarExclusao(item)}
            styles={{ root: { color: '#d13438' } }}
          />
        </div>
      ),
    },
  ];

  return (
    <div style={{ marginTop: 10 }}>
      {erro && <MessageBar messageBarType={MessageBarType.error} onDismiss={() => setErro('')}>{erro}</MessageBar>}
      {sucesso && <MessageBar messageBarType={MessageBarType.success} onDismiss={() => setSucesso('')}>{sucesso}</MessageBar>}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0 }}>Gestão de Usuários</h3>
        <PrimaryButton text="Novo Usuário" iconProps={{ iconName: 'AddFriend' }} onClick={abrirFormNovo} />
      </div>

      {showForm && (
        <div style={{ padding: 16, background: '#f8f9fa', borderRadius: 8, marginBottom: 16 }}>
          <h4 style={{ marginTop: 0 }}>{editingId ? 'Editar Usuário' : 'Novo Usuário'}</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <TextField
              label="Email *"
              value={formEmail}
              onChange={(_, v) => setFormEmail(v || '')}
              placeholder="usuario@empresa.com"
              disabled={!!editingId}
            />
            <TextField
              label="Nome Completo *"
              value={formNome}
              onChange={(_, v) => setFormNome(v || '')}
              placeholder="João da Silva"
            />
            <Dropdown
              label="Perfil *"
              options={perfilOptions}
              selectedKey={formPerfil}
              onChange={(_, opt) => setFormPerfil(opt?.key as 'aprovador' | 'consulta' | 'admin')}
            />
          </div>

          <div style={{ marginTop: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 8 }}>
              <input
                type="checkbox"
                checked={todasObras}
                onChange={(e) => {
                  setTodasObras(e.target.checked);
                  if (e.target.checked) setFormObrasVisiveis([]);
                }}
              />
              <span>Acesso a todas as obras</span>
            </label>

            {!todasObras && (
              <Dropdown
                label="Obras Visíveis (deixe vazio para todas)"
                placeholder="Selecione as obras..."
                multiSelect
                options={obrasOptions}
                selectedKeys={formObrasVisiveis}
                onChange={(_, opt) => {
                  if (!opt) return;
                  const key = opt.key as number;
                  setFormObrasVisiveis(prev =>
                    opt.selected ? [...prev, key] : prev.filter(id => id !== key)
                  );
                }}
              />
            )}
          </div>

          <div style={{ marginTop: 16 }}>
            <p style={{ fontSize: 12, color: '#666', margin: '8px 0' }}>
              <strong>Perfis:</strong><br />
              • <strong>Consulta:</strong> Somente leitura, não pode aprovar/reprovar<br />
              • <strong>Aprovador:</strong> Pode aprovar/reprovar SCs das obras onde está cadastrado na alçada<br />
              • <strong>Admin:</strong> Acesso total, pode gerenciar alçadas e usuários
            </p>
          </div>

          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            <PrimaryButton text="Salvar" onClick={() => { void salvarUsuario(); }} />
            <DefaultButton text="Cancelar" onClick={() => setShowForm(false)} />
          </div>
        </div>
      )}

      {loading && <Spinner size={SpinnerSize.small} />}

      <DetailsList
        items={usuarios}
        columns={usuariosColumns}
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
        compact={true}
      />

      {/* Dialog de confirmação de exclusão */}
      <Dialog
        hidden={!deleteDialogOpen}
        onDismiss={() => setDeleteDialogOpen(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Confirmar Exclusão',
          subText: `Tem certeza que deseja remover o usuário "${usuarioToDelete?.nome}" (${usuarioToDelete?.email})?`,
        }}
      >
        <DialogFooter>
          <PrimaryButton
            text="Remover"
            onClick={() => { void excluirUsuario(); }}
            styles={{ root: { backgroundColor: '#d13438', borderColor: '#d13438' } }}
          />
          <DefaultButton text="Cancelar" onClick={() => setDeleteDialogOpen(false)} />
        </DialogFooter>
      </Dialog>
    </div>
  );
};
