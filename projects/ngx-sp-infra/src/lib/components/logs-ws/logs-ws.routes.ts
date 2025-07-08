import { Routes } from "@angular/router";
import { DetalhesLogWSComponent } from "./components/detalhes-log-ws/detalhes-log-ws.component";
import { HomeLogsWSComponent } from "./components/home-log-ws/home-logs-ws.component";

export const LOGS_WS_ROUTES: Routes = [
  { path: '', component: HomeLogsWSComponent, data: { title: 'Logs WS' } },
  { path: "detalhes/:id", component: DetalhesLogWSComponent, data: {title: 'Detalhes'} },
]