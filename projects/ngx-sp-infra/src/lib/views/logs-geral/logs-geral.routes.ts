import { Routes } from "@angular/router";
import { DetalhesLogsGeralComponent } from "./components/detalhes-logs-geral/detalhes-logs-geral.component";
import { LogsGeralComponent } from "./components/home-logs-geral/home-logs-geral.component";

export const LOGS_GERAL_ROUTES: Routes = [
  { path: '', component: LogsGeralComponent, data: { title: 'Logs Geral' } },
  { path: "detalhes/:id", component: DetalhesLogsGeralComponent, data: {title: 'Detalhes'} },
]