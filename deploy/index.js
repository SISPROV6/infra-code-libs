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
let respostaPatchNotes = "";

let version = "";
let tag = "";


// #region BUILD DO PROJETO

function buildProject() {
  try {
    execSync(`ng build ${respostaProjeto} --configuration production`, { stdio: 'inherit' });
  }
  catch (error) {
    console.error(chalk.red('\n❌ Erro ao realizar o build. Corrija e tente novamente:' + error.message));
    throw new Error("\n❌ Erro ao realizar o build. Corrija e tente novamente:" + error.message);
  }
}

// #endregion BUILD DO PROJETO

// #region ATUALIZAR VERSÃO DO PROJETO

function updateVersion() {
  try {
    // Lê o package.json
    const pkgPath = `../projects/${respostaProjeto}/package.json`;
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

    // bump via npm version
    execSync(`npm version ${respostaVersao} --no-git-tag-version`, {
      cwd: `../projects/${respostaProjeto}`,
      stdio: 'inherit'
    });

    // Reabre o JSON já atualizado
    const updated = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    console.log(chalk.green(`✅ Nova versão: ${updated.version}`));

    version = updated.version;
  }
  catch (error) {
    console.error(chalk.red('\n❌ Erro ao atualizar versão:' + error.message));
    throw new Error("\n❌ Erro ao atualizar versão:' + error.message");
  }
}

// #endregion ATUALIZAR VERSÃO DO PROJETO

// #region EXECUTA TESTES UNITÁRIOS

function executarTestes() {
  if (respostaIsExecutaTestes) {
    try {
      execSync(`ng test ${respostaProjeto} --watch=false --code-coverage --browsers=ChromeHeadless`, { stdio: 'inherit' });
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
    console.log(chalk.yellow(`\nTag '${formattedTag}-v${version}' não existe no repositório remoto, prosseguindo com a criação da nova tag...`));
  }
}

function createAndPushTag(version, formattedTag) {
  try {
    execSync(`git tag ${formattedTag}-v${version}`, { stdio: 'inherit' });
    execSync(`git push ${respostaRemoteRepo} ${formattedTag}-v${version}`, { stdio: 'inherit' });
    
    tag = `${formattedTag}-v${version}`;
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
    let formattedTag = respostaProjeto.split('-')[2];

    removeExistingTag(packageJson.version, formattedTag);
    createAndPushTag(packageJson.version, formattedTag);
  }
  catch (error) {
    console.log(chalk.red("\n❌ Erro no processo de commit da tag:" + error.message));
    throw new Error(`❌ Erro no processo de commit da tag: ${error.message}`);
  }
}

// #endregion COMMIT DE TAGS

// #region CRIA ARQUIVO DE RELEASE

function createReleaseFile() {
  const releaseInfo = {
    project: respostaProjeto,
    version: version,
    tag: tag,
    notes: respostaPatchNotes || "Atualização de rotina",
    timestamp: new Date().toISOString()
  };

  try {
    fs.writeFileSync('./release-info.json', JSON.stringify(releaseInfo, null, 2));
    console.log(chalk.white(`\n Arquivo de release criado com sucesso para projeto ${respostaProjeto} v${version}!\n`));
  }
  catch (error) {
    console.error(chalk.red('❌ Erro ao criar arquivo de release:' + error.message));
    return;
  }
}

// #endregion CRIA ARQUIVO DE RELEASE

// #region COMMIT E PUSH DOS ARQUIVOS

function commitFiles() {
  try {
    const packageJson = JSON.parse(fs.readFileSync(`../projects/${respostaProjeto}/package.json`, 'utf8'));

    execSync('git add .', { cwd: '../', stdio: 'inherit' });
    execSync(`git commit --allow-empty -m "${respostaProjeto} | v${packageJson.version} | Commit automático" -m "${respostaMensagemOpcional}"`, { cwd: '../', stdio: 'inherit' });
    execSync(`git push ${respostaRemoteRepo} ${currentBranch}`, { cwd: '../', stdio: 'inherit' });
    
    console.log(chalk.green('✅ Commit e push realizados com sucesso!\n'));
  }
  catch (error) {
    console.error(chalk.red('❌ Erro ao realizar commit:' + error.message));
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
        choices: ['ngx-sp-infra', 'ngx-sp-auth', 'ngx-sp-views', 'Cancelar'],
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
          default: false,
          name: 'executaTestes'
        },
        {
          message: 'Para qual repo os commits devem ser feitos? (origin = "https://github.com/SISPROV6/infra-code-libs", azure = "https://SisproERP@dev.azure.com/SisproERP/PeD/_git/infra-code-libs")',
          type: 'list',
          choices: ['origin', 'azure'],
          name: 'repo'
        },
        {
          message: 'Deseja adicionar uma mensagem adicional ao commit?',
          type: 'input',
          name: 'mensagemCommit'
        },
        {
          message: 'Deseja adicionar uma mensagem customizada para a release que será gerada?',
          type: 'input',
          name: 'mensagemRelease'
        }
      ]);


      respostaProjeto = answers.projeto;
      respostaVersao = respostas.versao;
      respostaIsExecutaTestes = respostas.executaTestes;
      respostaRemoteRepo = respostas.repo;
      respostaMensagemOpcional = respostas.mensagemCommit;
      respostaPatchNotes = respostas.mensagemRelease;

      console.log(`\n\nRevise os dados informados:
  - Projeto a ser publicado: ${chalk.blueBright(respostaProjeto)}
  - Versão a ser incrementada: ${chalk.blueBright(respostaVersao)}
  - Nome do repositório remoto: ${chalk.blueBright(respostaRemoteRepo)}
  - Executar testes automatizados? ${chalk.blueBright(respostaIsExecutaTestes ? 'Sim' : 'Não')}
  - Mensagem opcional de commit: ${chalk.italic.blueBright(respostaMensagemOpcional == '' ? `Nenhuma` : `"${respostaMensagemOpcional}"`)}
  - Mensagem de release: ${chalk.italic.blueBright(respostaPatchNotes == '' ? `Atualização de rotina` : `"${respostaPatchNotes}"`)}\n`);

      await inquirer.prompt([ {
          message: 'Você confirma estas informações?',
          type: 'confirm',
          default: true,
          name: 'confirmaDeploy'
        }
      ]).then(confirma => {
        if (!confirma.confirmaDeploy) throw new Error("\n❌ Processo cancelado pelo usuário.");

        console.log(chalk.yellow('\n🎲 Iniciando processo...\n'));

        // Realiza o build do projeto
        console.log(chalk.yellow('\n📦 Buildando projeto...'));
        buildProject();

        // Rodar testes unitários
        console.log(chalk.yellow('\n🧪 Executando testes unitários...'));
        executarTestes();

        // Atualiza versão do projeto com ou sem tags
        console.log(chalk.yellow('\n🔄 Atualizando versão...'));
        updateVersion();

        // Commit e push da tag de versão
        console.log(chalk.yellow('\n📤 Realizando commit das tags de versão...'));
        commitTag();

        // Criação de arquivo de release localmente para ser enviado no commit
        console.log(chalk.yellow('\n📤 Criando arquivo de release local...'));
        createReleaseFile();

        // Commit e push dos arquivos
        console.log(chalk.yellow('\n📦 Commitando alterações...'));
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