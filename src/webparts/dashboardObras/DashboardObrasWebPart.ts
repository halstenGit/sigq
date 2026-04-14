import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import DashboardObras from './components/DashboardObras';
import { IDashboardObrasProps } from './components/IDashboardObrasProps';
import { SiengeService } from './services/SiengeService';

export interface IDashboardObrasWebPartProps {
  workerUrl: string;
}

export default class DashboardObrasWebPart extends BaseClientSideWebPart<IDashboardObrasWebPartProps> {

  private _siengeService: SiengeService | undefined;

  protected onInit(): Promise<void> {
    return super.onInit().then(() => {
      if (this.properties.workerUrl) {
        this._siengeService = new SiengeService(
          this.context.httpClient,
          { workerUrl: this.properties.workerUrl }
        );
      }
    });
  }

  public render(): void {
    const element: React.ReactElement<IDashboardObrasProps> = React.createElement(
      DashboardObras,
      {
        siengeService: this._siengeService!,
        isConfigured: !!this.properties.workerUrl,
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
          header: {
            description: 'Configuracoes do Dashboard SC vs Orcamento'
          },
          groups: [
            {
              groupName: 'Worker Cloudflare',
              groupFields: [
                PropertyPaneTextField('workerUrl', {
                  label: 'URL do Worker',
                  description: 'Ex: https://sienge-proxy.marcelo-sena.workers.dev',
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
