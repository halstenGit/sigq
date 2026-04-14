import { AprovacaoService } from '../services/AprovacaoService';

export interface IAprovacoesSCProps {
  service: AprovacaoService;
  userEmail: string;
  userName: string;
  isConfigured: boolean;
}
