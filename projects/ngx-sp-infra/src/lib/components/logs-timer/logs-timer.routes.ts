import { Routes } from "@angular/router";
import { DetalhesLogTimerComponent } from "./components/detalhes-log-timer/detalhes-log-timer.component";
import { HomeLogTimerComponent } from "./components/home-log-timer/home-log-timer.component";

export const LOGS_TIMER_ROUTES: Routes = [
  { path: '', component: HomeLogTimerComponent, data: { title: 'Logs Timer' } },
  { path: "detalhes/:id", component: DetalhesLogTimerComponent, data: {title: 'Detalhes'} },
]