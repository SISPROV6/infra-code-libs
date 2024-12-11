import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

interface SchemaOptions {
  action: 'install' | 'update';
}

export function ngAdd(options: SchemaOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const command = options.action === 'update' ? 'ng update' : 'npm install';

    // Instalar ngx-sp-infra primeiro
    context.addTask(
      new NodePackageInstallTask({
        packageName: '@sisprov6/ngx-sp-infra',
        packageManager: 'npm',
        workingDirectory: '',
        quiet: false
        
      })
    );

    // Instalar ngx-sp-auth
    context.addTask(
      new NodePackageInstallTask({
        packageName: '@sisprov6/ngx-sp-auth',
        packageManager: 'npm',
        workingDirectory: '',
        quiet: false
      })
    );

    context.logger.info('Installed ngx-sp-infra and ngx-sp-auth successfully.');
    return tree;
  };
}