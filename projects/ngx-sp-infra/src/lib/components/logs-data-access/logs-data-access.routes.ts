import { Routes } from "@angular/router";
import { DetalhesLogDataAccessComponent } from "./components/detalhes-log-data-access/detalhes-log-data-access.component";
import { HomeLogDataAccessComponent } from "./components/home-log-data-access/home-log-data-access.component";

export const LOGS_DATA_ACCESS_ROUTES: Routes = [
  { path: '', component: HomeLogDataAccessComponent, data: { title: 'Logs DataAccess' } },
  { path: "detalhes/:id", component: DetalhesLogDataAccessComponent, data: {title: 'Detalhes'} },
]