import { Routes } from "@angular/router";
import { DetalhesLogApiComponent } from "./components/detalhes-log-api/detalhes-log-api.component";
import { HomeLogApiComponent } from "./components/home-log-api/home-log-api.component";

export const LOGS_API_ROUTES: Routes = [
  { path: '', component: HomeLogApiComponent, data: { title: 'Logs API' } },
  { path: "detalhes/:id", component: DetalhesLogApiComponent, data: {title: 'Detalhes'} },
]