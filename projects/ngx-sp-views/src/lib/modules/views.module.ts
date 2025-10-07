import { NgModule } from "@angular/core";

import { LibAuthenticationConfigComponent } from "../views/lib-authentication-config/components/lib-authentication-config.component";
import { LibConfigSenhaComponent } from "../views/lib-config-senha/lib-config-senha.component";
import { LibIntegracaoLdapComponent } from './../views/lib-integracao-ldap/components/lib-integracao-ldap.component';
import { LibIntegracoesExternasComponent } from './../views/lib-integracoes-externas/components/lib-integracoes-externas.component';
import { DetalhesLogApiComponent } from './../views/logs-api/components/detalhes-log-api/detalhes-log-api.component';
import { HomeLogApiComponent } from './../views/logs-api/components/home-log-api/home-log-api.component';
import { DetalhesLogDataAccessComponent } from './../views/logs-data-access/components/detalhes-log-data-access/detalhes-log-data-access.component';
import { HomeLogDataAccessComponent } from './../views/logs-data-access/components/home-log-data-access/home-log-data-access.component';
import { DetalhesLogEmailComponent } from './../views/logs-email/components/detalhes-log-email/detalhes-log-email.component';
import { HomeLogEmailComponent } from './../views/logs-email/components/home-log-email/home-log-email.component';
import { DetalhesLogsGeralComponent } from './../views/logs-geral/components/detalhes-logs-geral/detalhes-logs-geral.component';
import { LogsGeralComponent } from './../views/logs-geral/components/home-logs-geral/home-logs-geral.component';
import { DetalhesLogsReportComponent } from './../views/logs-report/components/detalhes-logs-report/detalhes-logs-report.component';
import { HomeLogsReportComponent } from './../views/logs-report/components/home-logs-report/home-logs-report.component';
import { DetalhesLogTimerComponent } from './../views/logs-timer/components/detalhes-log-timer/detalhes-log-timer.component';
import { HomeLogTimerComponent } from './../views/logs-timer/components/home-log-timer/home-log-timer.component';
import { DetalhesLogWSComponent } from './../views/logs-ws/components/detalhes-log-ws/detalhes-log-ws.component';
import { HomeLogsWSComponent } from './../views/logs-ws/components/home-log-ws/home-logs-ws.component';
import { LibMonitoramentoFilaComponent } from "../../public-api";

@NgModule({
  imports: [
    LibAuthenticationConfigComponent,
    LibConfigSenhaComponent,
    LibIntegracaoLdapComponent,
    LibIntegracoesExternasComponent,
    DetalhesLogApiComponent,
    HomeLogApiComponent,
    DetalhesLogDataAccessComponent,
    HomeLogDataAccessComponent,
    DetalhesLogEmailComponent,
    HomeLogEmailComponent,
    DetalhesLogsGeralComponent,
    LogsGeralComponent,
    DetalhesLogsReportComponent,
    HomeLogsReportComponent,
    DetalhesLogTimerComponent,
    HomeLogTimerComponent,
    DetalhesLogWSComponent,
    HomeLogsWSComponent,
    LibMonitoramentoFilaComponent
  ],
  exports: [
    LibAuthenticationConfigComponent,
    LibConfigSenhaComponent,
    LibIntegracaoLdapComponent,
    LibIntegracoesExternasComponent,
    DetalhesLogApiComponent,
    HomeLogApiComponent,
    DetalhesLogDataAccessComponent,
    HomeLogDataAccessComponent,
    DetalhesLogEmailComponent,
    HomeLogEmailComponent,
    DetalhesLogsGeralComponent,
    LogsGeralComponent,
    DetalhesLogsReportComponent,
    HomeLogsReportComponent,
    DetalhesLogTimerComponent,
    HomeLogTimerComponent,
    DetalhesLogWSComponent,
    HomeLogsWSComponent,
    LibMonitoramentoFilaComponent
  ]
})
export class LibViewsModule { }
