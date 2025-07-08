import { Routes } from "@angular/router";
import { DetalhesLogsReportComponent } from "./components/detalhes-logs-report/detalhes-logs-report.component";
import { HomeLogsReportComponent } from "./components/home-logs-report/home-logs-report.component";

export const LOGS_REPORT_ROUTES: Routes = [
  { path: '', component: HomeLogsReportComponent, data: { title: 'Logs Report' } },
  { path: "detalhes/:id", component: DetalhesLogsReportComponent, data: {title: 'Detalhes'} },
]