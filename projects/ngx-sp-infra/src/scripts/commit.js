const fs = require('fs');
const execSync = require('child_process').execSync;

/** Lê e retorna o conteúdo do package.json como objeto.
 * @returns {object} Objeto JSON com os dados do package.json. */
function readPackageJson() {
  const packagePath = 'projects/ngx-sp-infra/package.json';
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    return packageJson;
  }
  catch (error) {
    console.error(`\nErro ao ler o arquivo package.json: ${error.message}`);
    process.exit(1); // Encerra o script em caso de erro
  }
}


/** Realiza o commit das alterações na branch especificada.
 * @param {string} branch - Nome da branch onde será feito o commit. */
function commit(branch, repo) {
  const packageJson = readPackageJson();
  
  try {
    // Adiciona as alterações e faz commit
    console.log(`\nAdicionando alterações e realizando commit...`);
    execSync(`git add .`, { stdio: 'inherit' });
    execSync(`git commit --allow-empty -m "v${packageJson.version} | Commit automático" -m "Commit automático realizado via script pós build"`, { stdio: 'inherit' });
    
    // Push das alterações
    console.log(`\nEnviando commit para a branch ${branch}...`);
    execSync(`git push ${repo} ${branch}`, { stdio: 'inherit' });
    
    console.log(`\nCommit automático realizado com sucesso via script. Acompanhe o processo de publicação pelo ${repo === 'github' ? 'Github Actions' : 'Azure DevOps'}!\n`);
  }
  catch (error) { console.log(`Erro durante o commit: ${error.message}`); }
}


const readline = require('readline');

// Interfaces de entrada do usuário
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Pergunta ao usuário se ele deseja fazer commit no repositório GIT (https://github.com/SISPROV6/ngx-sp-infra)...
rl.question("Deseja fazer commit no repositório GIT (https://github.com/SISPROV6/ngx-sp-infra)? (S/N): ", (useGit) => {
 
  // ...se SIM...pega a branch atual e pergunta ao usuário se será feito o commit nela ou em outra
  if (useGit.trim().toUpperCase() === "S") {

    // Pergunta ao usuário qual repositório remoto será usado, se nada informado usará o github
    rl.question("Informe o nome do repositório remoto (se nada informado usará github): ", (repoName) => {
      const repo = repoName.trim() || "github"; // Se não for informada, usar o "github"

      try {
        // Obtém a branch atual
        const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
        console.log(`Repositório escolhido: ${repo}`);
        console.log(`Branch atual: ${currentBranch}\n`);
        
        rl.question("Informe a branch para commit (pressione Enter para usar a branch atual): ", (branchName) => {
          const branch = branchName.trim() || currentBranch; // Se não for informada, usar a branch atual
          commit(branch, repo);
  
          rl.close();
        });
      } catch (error) {
        console.error(`Erro ao obter a branch atual: ${error.message}`);
        rl.close();
      }
    });
  }
  else {
    console.log("Operação de commit cancelada.\n");
    rl.close();
  }
});
