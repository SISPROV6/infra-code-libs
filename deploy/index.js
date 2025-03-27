import chalk from 'chalk';
import { execSync } from 'child_process';
import fs from 'fs';
import inquirer from 'inquirer';


const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
let respostaProjeto = "";
let respostaVersao = "";
let respostaIsExecutaTestes = true;
let respostaRemoteRepo = "";
let respostaMensagemOpcional = "";


// #region ATUALIZAR VERSÃO DO PROJETO

const handleTag = () => {
  let tag = "";

  if (currentBranch.includes('test')) tag = '-test';
  else if (currentBranch.includes('next')) tag = '-next';
  else tag = '';

  return tag;
}

function updateVersion() {
  try {
    // Lê e inicializa o package.json
    let packageJson = JSON.parse(fs.readFileSync(`../projects/${respostaProjeto}/package.json`, 'utf8'));
    
    // Remove, atualiza e readiciona o sufixo à versão + Atualiza a versão sem criar uma nova tag do Git
    const versionHasTag = packageJson.version.includes('-');
    
    if (versionHasTag) execSync(`cd ../projects/${respostaProjeto} && npm version ${respostaVersao} --no-git-tag-version`, { stdio: 'inherit' }); // Primeira atualização de versão pois ela apenas remove a tag
    execSync(`cd ../projects/${respostaProjeto} && npm version ${respostaVersao} --no-git-tag-version`, { stdio: 'inherit' });
    
    packageJson = JSON.parse(fs.readFileSync(`../projects/${respostaProjeto}/package.json`, 'utf8'));

    const tag = handleTag();
    const newVersion = `${packageJson.version}${tag}`;
    packageJson.version = newVersion;

    // Escreve a nova versão no package.json
    fs.writeFileSync(`../projects/${respostaProjeto}/package.json`, JSON.stringify(packageJson, null, 2) + '\n');

    console.log(chalk.green(`✅ Nova versão: ${packageJson.version}\n`));
  }
  catch (error) {
    console.error(chalk.red('\n❌ Erro ao atualizar versão:', error.message));
    throw new Error("\n❌ Erro ao atualizar versão:', error.message");
  }
}

// #endregion ATUALIZAR VERSÃO DO PROJETO

// #region EXECUTA TESTES UNITÁRIOS

function executarTestes() {
  if (respostaIsExecutaTestes) {
    console.log(chalk.yellow('\n🧪 2. Executando testes unitários...'));
    
    try {
      execSync('ng test --watch=false --browsers=ChromeHeadless', { stdio: 'inherit' });
      console.log(chalk.green('\n✅ Todos os testes passaram com sucesso!\n'));
    }
    catch (error) {
      console.log(chalk.red('\n❌ Testes falharam. Deploy abortado.\nRecomenda-se executar os testes manualmente e corrigir problemas antes de realizar um deploy novamente.'));
      throw new Error(`\n❌ Testes falharam. Deploy abortado.\nRecomenda-se executar os testes manualmente e corrigir problemas antes de realizar um deploy novamente.`);
    }
  }
}

// #endregion EXECUTA TESTES UNITÁRIOS

// #region COMMIT DE TAGS

function removeExistingTag(version, formattedTag) {
  try {
    execSync(`git tag -d ${formattedTag}-v${version}`, { stdio: 'inherit' });
    execSync(`git push --delete ${respostaRemoteRepo} ${formattedTag}-v${version}`, { stdio: 'inherit' });
    
    console.log(chalk.green(`\n✔ Tag '${formattedTag}-v${version}' removida com sucesso!`));
  }
  catch (error) {
    if (!error.message.includes('Command failed')) {
      throw new Error(`\n❌ Erro ao tentar remover a tag do repositório remoto: ${error.message}`);
    }
    console.log(chalk.yellow(`Tag '${formattedTag}-v${version}' não existe no repositório remoto, prosseguindo com a criação da nova tag...`));
  }
}

function createAndPushTag(version, formattedTag) {
  try {
    execSync(`git tag ${formattedTag}-v${version}`, { stdio: 'inherit' });
    execSync(`git push ${respostaRemoteRepo} ${formattedTag}-v${version}`, { stdio: 'inherit' });
    
    console.log(chalk.green(`\n✅ Tag '${formattedTag}-v${version}' criada e commitada com sucesso!`));
  }
  catch (error) {
    throw new Error(`\n❌ Erro ao criar ou enviar a tag: ${error.message}`);
  }
}

function commitTag() {
  const packageJson = JSON.parse(fs.readFileSync(`../projects/${respostaProjeto}/package.json`, 'utf8'));

  if (!packageJson.version) {
    console.log(chalk.red("\n❌ A versão no package.json está inválida ou não foi encontrada."));
    throw new Error("❌ A versão no package.json está inválida ou não foi encontrada.");
  }
  
  try {
    let formattedTag = respostaProjeto == 'ngx-sp-infra' ? 'infra' : 'auth';

    removeExistingTag(packageJson.version, formattedTag);
    createAndPushTag(packageJson.version, formattedTag);
  }
  catch (error) {
    console.log(chalk.red("\n❌ Erro no processo de commit da tag:", error.message));
    throw new Error(`❌ Erro no processo de commit da tag: ${error.message}`);
  }
}

// #endregion COMMIT DE TAGS

// #region COMMIT E PUSH DOS ARQUIVOS

function commitFiles() {
  try {
    const packageJson = JSON.parse(fs.readFileSync(`../projects/${respostaProjeto}/package.json`, 'utf8'));

    execSync('cd ../ && git add .', { stdio: 'inherit' });
    execSync(`cd ../ && git commit --allow-empty -m "${respostaProjeto} | v${packageJson.version} | Commit automático" -m "${respostaMensagemOpcional}"`, { stdio: 'inherit' });
    execSync(`cd ../ && git push ${respostaRemoteRepo} ${currentBranch}`, { stdio: 'inherit' });
    
    console.log(chalk.green('\n✅ Commit e push realizados com sucesso!\n'));
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
      if (answers.projeto === 'Cancelar') throw new Error("\n❌ Processo cancelado pelo usuário.");

      const respostas = await inquirer.prompt([
        {
          message: 'Qual versão deve ser incrementada?',
          type: 'list',
          choices: ['patch', 'minor', 'major'],
          name: 'versao'
        },
        {
          message: 'Deseja rodar testes unitários antes da publicação?',
          type: 'confirm',
          default: true,
          name: 'executaTestes'
        },
        {
          message: 'Para qual repo os commits devem ser feitos? (github = "https://github.com/SISPROV6/infra-code-libs", azure = "https://SisproERP@dev.azure.com/SisproERP/PeD/_git/infra-code-libs")',
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


      respostaProjeto = answers.projeto;
      respostaVersao = respostas.versao;
      respostaIsExecutaTestes = respostas.executaTestes;
      respostaRemoteRepo = respostas.repo;
      respostaMensagemOpcional = respostas.mensagemCommit;

      console.log(`\n\nRevise os dados informados:
  - Projeto a ser publicado: ${chalk.blueBright(respostaProjeto)}
  - Versão a ser incrementada: ${chalk.blueBright(respostaVersao)}
  - Nome do repositório remoto: ${chalk.blueBright(respostaRemoteRepo)}
  - Executar testes automatizados? ${chalk.blueBright(respostaIsExecutaTestes ? 'Sim' : 'Não')}
  - Mensagem opcional de commit: ${chalk.italic.blueBright(respostaMensagemOpcional == '' ? 'Nenhuma' : `"${respostaMensagemOpcional}"`)}\n`);
      
      await inquirer.prompt([ {
          message: 'Você confirma estas informações?',
          type: 'confirm',
          default: true,
          name: 'confirmaDeploy'
        }
      ]).then(confirma => {
        if (!confirma.confirmaDeploy) throw new Error("\n❌ Processo cancelado pelo usuário.");
        
        execSync(`cls`, { stdio: 'inherit' });
        console.log(chalk.yellow('🎲 Iniciando processo...\n'));

        // Atualiza versão do projeto com ou sem tags
        console.log(chalk.yellow('\n🔄 1. Atualizando versão...'));
        updateVersion();
      
        // Rodar testes unitários
        executarTestes();
        
        // Commit e push da tag de versão
        console.log(chalk.yellow(`\n📤 ${respostaIsExecutaTestes ? '3.' : '2.'} Realizando commit das tags de versão...\n`));
        commitTag();
        
        // Commit e push dos arquivos
        console.log(chalk.yellow(`\n📦 ${respostaIsExecutaTestes ? '4.' : '3.'} Commitando alterações...`));
        commitFiles();
      });
    })
    .catch(error => {
      if (error.message.includes('User force closed the prompt')) throw new Error("\n❌ Processo cancelado pelo usuário.");
      else throw error.message;
    })

    console.log(chalk.blue('\n\n🚀 Deploy acionado no pipeline! Acompanhe pelo GitHub Actions/Azure Pipelines.\n'));
  }
  catch (error) {
    console.log(chalk.red(error.message));
  }
}

main();