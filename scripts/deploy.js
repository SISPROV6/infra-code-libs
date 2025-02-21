const fs = require('fs');
const execSync = require('child_process').execSync;


// #region ATUALIZAR VERSÃO DO PROJETO

function updateVersion(version, suffix) {
  // Lê e inicializa o package.json
  let packageJson = JSON.parse(fs.readFileSync('../../package.json', 'utf8'));

  // Atualiza a versão sem criar um novo tag do Git
  execSync(`npm version ${version} --no-git-tag-version`, { stdio: 'inherit' });
  packageJson = JSON.parse(fs.readFileSync('../../package.json', 'utf8'));

  // Adiciona o sufixo à versão
  const newVersion = suffix ? `${packageJson.version}${suffix.startsWith('-') ? suffix : `-${suffix}`}` : packageJson.version;
  packageJson.version = newVersion;

  // Escreve a nova versão no package.json
  fs.writeFileSync('../../package.json', JSON.stringify(packageJson, null, 2) + '\n');
}

// Sufixo a ser adicionado, se não informado não terá nada
const version = process.argv[2];
const suffix = process.argv[3] || '';
updateVersion(version, suffix);

// #endregion ATUALIZAR VERSÃO DO PROJETO

// --------------------------------------------------------------------------------

// #region COMMIT DE TAGS

function removeExistingTag(version) {
  try {
    execSync(`git tag -d v${version}`, { stdio: 'inherit' });
    execSync(`git push --delete origin v${version}`, { stdio: 'inherit' });
    console.log(`\n\nTag v${version} removida com sucesso.`);
  } catch (error) {
    if (!error.message.includes('Command failed')) {
      throw new Error(`\n\nErro ao tentar remover a tag: ${error.message}`);
    }
    console.log(`\n\nTag v${version} não existe, prosseguindo com a criação da nova tag.`);
  }
}

function createAndPushTag(version) {
  try {
    execSync(`git tag v${version}`, { stdio: 'inherit' });
    execSync(`git push origin v${version}`, { stdio: 'inherit' });
    console.log(`\n\nTag v${version} criada e enviada com sucesso.`);
  } catch (error) {
    throw new Error(`\n\nErro ao criar ou enviar a tag: ${error.message}`);
  }
}

function commitTag() {
  const packageJson = JSON.parse(require('fs').readFileSync('../../package.json', 'utf8'));
  const newVersion = packageJson.version;

  if (!newVersion) {
    console.error("\n\nA versão no package.json está inválida ou não foi encontrada.");
    process.exit(1);
  }

  try {
    removeExistingTag(newVersion);
    createAndPushTag(newVersion);
    console.log("\n\nTag de versão commitada e enviada com sucesso!");
  } catch (error) {
    console.error("\n\nErro no processo de commit da tag:", error.message);
  }
}


rl.question("\n\nVocê quer commitar a tag de versão? (S/N): ", (answer) => {
  if (answer.trim().toUpperCase() === "S") commitTag();
  else console.log("\nTag não commitada por escolha do usuário. Prosseguindo com o processo...\n");

  rl.close();
});

// #endregion COMMIT DE TAGS

// --------------------------------------------------------

// #region COMMIT E PUSH DE ARQUIVOS

function readPackageJson() {
  const packagePath = 'projects/ngx-sp-infra/package.json';

  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    console.log(`\n\nVersão atual do package.json: ${packageJson.version}`);
    return packageJson;
  } catch (error) {
    console.error(`\n\nErro ao ler o arquivo package.json: ${error.message}`);
    process.exit(1);
  }
}

function commit(branch) {
  const packageJson = readPackageJson();

  try {
    console.log(`\n\nFazendo checkout para a branch ${branch}...`);
    execSync(`git checkout ${branch}`, { stdio: 'inherit' });

    console.log(`\n\nAdicionando alterações e realizando commit...`);
    execSync(`git add .`, { stdio: 'inherit' });
    execSync(`git commit --allow-empty -m "v${packageJson.version} | Commit automático" -m "Commit automático realizado via script pós build"`, { stdio: 'inherit' });

    console.log(`Enviando commit para a branch ${branch}...`);
    execSync(`git push origin ${branch}`, { stdio: 'inherit' });

    console.log("\nCommit automático realizado com sucesso via script. Acompanhe o processo de publicação pelo GitHub Actions!\n");
  } catch (error) {
    console.error(`Erro durante o commit: ${error.message}`);
  }
}

rl.question("\n\nInforme a branch para commit (se não informada irá para 'main'): ", (answer) => {
  const branch = answer.trim() || "main";
  commit(branch);
  rl.close();
});

// #endregion COMMIT E PUSH DE ARQUIVOS

// --------------------------------------------------------

// #region INTERFACE DE INTERAÇÃO

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// #endregion INTERFACE DE INTERAÇÃO
