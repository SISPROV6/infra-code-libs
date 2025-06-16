# 📦 Biblioteca Angular - Guia de Contribuição

Bem-vindo ao repositório da biblioteca Angular mantida pela equipe! Este guia foi criado para facilitar a colaboração e garantir que o processo de desenvolvimento siga padrões consistentes, portanto leia com atenção.

---

## 🧠 Visão Geral

Este projeto é uma biblioteca Angular publicada no NPM. Utilizamos três branches principais:

* **main** → Publicações estáveis (tag `latest` no NPM)
* **next** → Versões beta/próximas (tag `next`)
* **test** → Builds experimentais/internos (tag `test`)

Publicações são automáticas via CI após merge nessas branches. As versões seguem o padrão **SemVer**.

---

## 🚀 Como Contribuir

### 1. Antes de Começar

* Abra uma *issue* para discutir bugs ou novas funcionalidades.
* Certifique-se de que ninguém está trabalhando na mesma tarefa.

### 2. Criar uma Branch de Trabalho

```bash
# Sempre parta de main, next ou test conforme o objetivo (geralmente parta da next, pois geralmente, será a mais atualizada)
git checkout next
git pull

git checkout -b feature/nome-da-feature
```

### 3. Implementar Alterações

* Siga os padrões do projeto (lint, estilo, etc.).
* Escreva testes para novas funcionalidades ou correções.
* Certifique-se de evitar dependências circulares (você está dentro da lib, não importe nada da 'ngx-sp-infra', mas sim do caminho para o arquivo relacionado)

### 4. Mensagens de Commit

Utilize **Conventional Commits**:

```bash
feat: adicionar funcionalidade X
fix: corrigir erro em Y
docs: atualizar instruções
```

Para breaking changes:

```bash
feat!: alteração que quebra compatibilidade

# ou no corpo do commit
BREAKING CHANGE: isso altera a API pública de tal forma
```

### 5. Subir Código e Abrir PR

```bash
git push origin feature/nome-da-feature
```

Crie um Pull Request para `main`, `next` ou `test`.

Aguarde a revisão e aprovação. O CI rodará automaticamente.

---

## 🔬 Testando e Build Local

### Instalar Dependências

```bash
npm install
```

### Rodar Testes

```bash
npm test
```

### Gerar Build da Biblioteca

```bash
ng build --configuration production
```

### Testar em Outro Projeto

```bash
ng build ngx-sp-infra --watch

# No projeto destino de teste, certifique-se que a opção "preserveSymLinks" está true no angular.json e execute o install abaixo
npm install "file:C:/SisproErpCloud/INFRA/Fontes/Sp_106_Imports/infra-code-libs/dist/ngx-sp-infra"
```
