import { InjectionToken } from "@angular/core";

import { ICustomEnvironmentService } from "./models/icustom-environment-service";
import { ICustomLoginService } from "./models/icustom-login-service";
import { ICustomStorageService } from "./models/icustom-storage-service";
import { ICustomMenuService } from "./models/icustom-menu-service";
import { IMenuConfig } from "./models/imenu-config";

// Token para o LibCustomEnvironmentService
export const LIB_CUSTOM_ENVIRONMENT_SERVICE = new InjectionToken<ICustomEnvironmentService>(
  'LibCustomEnvironmentService'
);

// Token para o LibCustomStorageService
export const LIB_CUSTOM_STORAGE_SERVICE = new InjectionToken<ICustomStorageService>(
  'LibCustomStorageService'
);

// Token para o LibCustomLoginService
export const LIB_CUSTOM_LOGIN_SERVICE = new InjectionToken<ICustomLoginService>(
  'LibCustomLoginService'
);

// Token para o LibCustomMenuService
export const LIB_CUSTOM_MENU_SERVICE = new InjectionToken<ICustomMenuService>(
  'LibCustomMenuService'
);

// Token para o LibMenuConfigService
export const LIB_MENU_CONFIG = new InjectionToken<IMenuConfig>(
  'LibMenuConfigService'
);

