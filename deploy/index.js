import inquirer from 'inquirer';
import chalk from 'chalk';
import { execSync } from 'child_process';
import fs from 'fs';


const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

// #region ATUALIZAR VERSÃO DO PROJETO

const handleTag = () => {
  let tag = "";

  if (currentBranch.includes('test')) tag = '-test';
  else if (currentBranch.includes('next')) tag = '-next';
  else tag = '';

  return tag;
}

function updateVersion(projeto, suffix) {
  // Lê e inicializa o package.json
  let packageJson = JSON.parse(fs.readFileSync(`../projects/${projeto}/package.json`, 'utf8'));
  
  // Remove, atualiza e readiciona o sufixo à versão + Atualiza a versão sem criar uma nova tag do Git
  const versionHasTag = packageJson.version.includes('-');
  
  if (versionHasTag) execSync(`cd ../projects/${projeto} && npm version ${suffix} --no-git-tag-version`, { stdio: 'inherit' }); // Primeira atualização de versão pois ela apenas remove a tag
  execSync(`cd ../projects/${projeto} && npm version ${suffix} --no-git-tag-version`, { stdio: 'inherit' });
  
  packageJson = JSON.parse(fs.readFileSync(`../projects/${projeto}/package.json`, 'utf8'));

  const tag = handleTag();
  const newVersion = `${packageJson.version}${tag}`;
  packageJson.version = newVersion;

  // Escreve a nova versão no package.json
  fs.writeFileSync(`../projects/${projeto}/package.json`, JSON.stringify(packageJson, null, 2) + '\n');

  console.log(chalk.green(`✅ Nova versão: ${packageJson.version}\n`));
}

// #endregion ATUALIZAR VERSÃO DO PROJETO

// #region COMMIT DE TAGS

function removeExistingTag(version, repo, formattedTag) {
  try {
    execSync(`git tag -d ${formattedTag}-v${version}`, { stdio: 'inherit' });
    execSync(`git push --delete ${repo} ${formattedTag}-v${version}`, { stdio: 'inherit' });
    
    console.log(chalk.green(`\n✔ Tag '${formattedTag}-v${version}' removida com sucesso!`));
  }
  catch (error) {
    if (!error.message.includes('Command failed')) {
      throw new Error(`\n❌ Erro ao tentar remover a tag do repositório remoto: ${error.message}`);
    }
    console.log(chalk.yellow(`\nTag '${formattedTag}-v${version}' não existe no repositório remoto, prosseguindo com a criação da nova tag...`));
  }
}

function createAndPushTag(version, repo, formattedTag) {
  try {
    execSync(`git tag ${formattedTag}-v${version}`, { stdio: 'inherit' });
    execSync(`git push ${repo} ${formattedTag}-v${version}`, { stdio: 'inherit' });
    
    console.log(chalk.green(`\n✅ Tag '${formattedTag}-v${version}' criada e commitada com sucesso!`));
  }
  catch (error) {
    throw new Error(`\n❌ Erro ao criar ou enviar a tag: ${error.message}`);
  }
}

function commitTag(projeto, repo) {
  const packageJson = JSON.parse(fs.readFileSync(`../projects/${projeto}/package.json`, 'utf8'));

  if (!packageJson.version) {
    console.log(chalk.red("\n❌ A versão no package.json está inválida ou não foi encontrada."));
    throw new Error("❌ A versão no package.json está inválida ou não foi encontrada.");
  }
  
  try {
    let formattedTag = projeto == 'ngx-sp-infra' ? 'infra' : 'auth';

    removeExistingTag(packageJson.version, repo, formattedTag);
    createAndPushTag(packageJson.version, repo, formattedTag);
    
    console.log(chalk.green("\n✅ Tag de versão commitada e enviada com sucesso!"));
  }
  catch (error) {
    console.log(chalk.red("\n❌ Erro no processo de commit da tag:", error.message));
    throw new Error(`❌ Erro no processo de commit da tag: ${error.message}`);
  }
}

// #endregion COMMIT DE TAGS

// #region COMMIT E PUSH DOS ARQUIVOS

function commitFiles(repo, projeto, mensagemCommit) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(`../projects/${projeto}/package.json`, 'utf8'));
    
    execSync('git add .', { stdio: 'inherit' });
    execSync(`git commit --allow-empty -m "${projeto} | v${packageJson.version} | Commit automático" -m "${mensagemCommit}"`, { stdio: 'inherit' });
    execSync(`git push ${repo} ${currentBranch}`, { stdio: 'inherit' });
    
    console.log(chalk.green('✅ Commit e push realizados com sucesso!\n'));
  }
  catch (error) {
    console.error(chalk.red('❌ Erro ao realizar commit:', error.message));
    return;
  }
}

// #endregion COMMIT E PUSH DOS ARQUIVOS

async function main() {
  console.log(chalk.blue('\n🚀 Processo de Deploy da Lib Angular 🚀\n'));

  try {
    await inquirer.prompt([
      {
        message: 'Qual projeto você irá publicar?',
        type: 'list',
        choices: ['ngx-sp-infra', 'ngx-sp-auth', 'Cancelar'],
        name: 'projeto'
      }
    ]).then(async answers => {
      // Valida se deve cancelar a execução ou não...
      if (answers.projeto === 'Cancelar') throw new Error();

      // Caso contrário, segue o fluxo...
      const respostas = await inquirer.prompt([
        {
          message: 'Qual versão deve ser incrementada?',
          type: 'list',
          choices: ['patch', 'minor', 'major'],
          name: 'versao'
        },
        {
          message: 'Você confirma a atualização da versão?',
          type: 'confirm',
          default: true,
          name: 'confirmaVersao'
        },
        {
          message: 'Deseja rodar testes unitários antes da publicação?',
          type: 'confirm',
          default: true,
          name: 'executaTestes'
        },
        {
          message: 'Para quais repos o commit deve ser feito?',
          type: 'list',
          choices: ['github', 'azure'],
          name: 'repo'
        },
        {
          message: 'Deseja adicionar uma mensagem adicional ao commit?',
          type: 'input',
          name: 'mensagemCommit'
        }
      ]);

      // Atualiza versão
      try {
        console.log(chalk.yellow('\n🔄 Atualizando versão...'));
        updateVersion(answers.projeto, respostas.versao);
      }
      catch (error) {
        console.error(chalk.red('❌ Erro ao atualizar versão:', error.message));
        return;
      }
    
      // Rodar testes
      if (respostas.executaTestes) {
        try {
          console.log(chalk.yellow('\n🧪 Executando testes unitários...'));
          execSync('ng test --watch=false --browsers=ChromeHeadless', { stdio: 'inherit' });
          console.log(chalk.green('✅ Testes passaram com sucesso!\n'));
        }
        catch (error) {
          console.error(chalk.red('❌ Testes falharam. Deploy abortado.'));
          return;
        }
      }
      
      // Commit e push da tag
      console.log(chalk.yellow('\n📤 Realizando commit das tags de versão...'));
      commitTag(answers.projeto, respostas.repo);
      
      // Commit e push
      console.log(chalk.yellow('\n📦 Commitando alterações...'));
      commitFiles(respostas.repo, answers.projeto, respostas.mensagemCommit);
    })

    console.log(chalk.blue('\n🚀 Deploy acionado no pipeline! Acompanhe pelo GitHub Actions/Azure Pipelines.\n'));
  }
  catch (error) {
    console.log(chalk.red('\n❌ Processo cancelado pelo usuário.'));
  }
}

main();