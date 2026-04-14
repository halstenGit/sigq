import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import AprovacoesSC from './components/AprovacoesSC';
import { IAprovacoesSCProps } from './components/IAprovacoesSCProps';
import { AprovacaoService } from './services/AprovacaoService';

export interface IAprovacoesSCWebPartProps {
  workerUrl: string;
  apiKey: string;
}

export default class AprovacoesSCWebPart extends BaseClientSideWebPart<IAprovacoesSCWebPartProps> {

  private _service: AprovacaoService | undefined;

  protected onInit(): Promise<void> {
    return super.onInit().then(() => {
      if (this.properties.workerUrl && this.properties.apiKey) {
        this._service = new AprovacaoService(
          this.context.httpClient,
          {
            workerUrl: this.properties.workerUrl,
            apiKey: this.properties.apiKey,
          },
          this.context.pageContext.user.email
        );
      }
    });
  }

  public render(): void {
    // Recriar service se configuracao mudou
    if (this.properties.workerUrl && this.properties.apiKey) {
      this._service = new AprovacaoService(
        this.context.httpClient,
        {
          workerUrl: this.properties.workerUrl,
          apiKey: this.properties.apiKey,
        },
        this.context.pageContext.user.email
      );
    }

    const element: React.ReactElement<IAprovacoesSCProps> = React.createElement(
      AprovacoesSC,
      {
        service: this._service!,
        userEmail: this.context.pageContext.user.email,
        userName: this.context.pageContext.user.displayName,
        isConfigured: !!(this.properties.workerUrl && this.properties.apiKey),
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: 'Configuracoes do Sistema de Aprovacoes SC' },
          groups: [
            {
              groupName: 'Worker Cloudflare',
              groupFields: [
                PropertyPaneTextField('workerUrl', {
                  label: 'URL do Worker',
                  description: 'Ex: https://sienge-proxy.marcelo-sena.workers.dev',
                }),
                PropertyPaneTextField('apiKey', {
                  label: 'API Key',
                  description: 'Chave configurada no secret APROVACOES_API_KEY do Worker',
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
