import { Routes } from "@angular/router";
import { DetalhesLogEmailComponent } from "./components/detalhes-log-email/detalhes-log-email.component";
import { HomeLogEmailComponent } from "./components/home-log-email/home-log-email.component";

export const LOGS_EMAIL_ROUTES: Routes = [
  { path: "", component: HomeLogEmailComponent, data: { title: "Logs Email" } },
  { path: "detalhes/:id", component: DetalhesLogEmailComponent, data: { title: "Detalhes" } },
]