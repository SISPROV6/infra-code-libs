import { InjectionToken } from "@angular/core";
import { ICustomConfigERPEnvironmentService } from "./models/icustom-configerp-environment-service";

// Token para o LibCustomEnvironmentService
export const LIB_CUSTOM_CONFIGERP_ENVIRONMENT_SERVICE = new InjectionToken<ICustomConfigERPEnvironmentService>(
  'LibCustomConfigERPEnvironmentService'
);
