# Scripts de Build e Deploy para o Azure

Abaixo estão os scripts de workflow usados no Github Actions refatorados para o Azure Pipelines

## build.yml

```yaml
trigger:
  branches:
    exclude:
      - main
      - next
      - test

pr:
  autoCancel: true

pool:
  vmImage: 'ubuntu-latest'

variables:
  NODE_VERSION: '20'

stages:
  - stage: BuildAndTest
    displayName: Build e Revisão
    jobs:
      - job: build
        displayName: Build e testes
        steps:
          - checkout: self
            fetchDepth: 0

          - task: NodeTool@0
            inputs:
              versionSpec: $(NODE_VERSION)
            displayName: Setup Node.js

          - script: npm ci
            displayName: Instalar dependências

          # Lê release-info.json e define variáveis
          - script: |
              PROJECT=$(jq -r '.project' deploy/release-info.json)
              VERSION=$(jq -r '.version' deploy/release-info.json)
              NOTES=$(jq -r '.notes' deploy/release-info.json)
              TAG=$(jq -r '.tag' deploy/release-info.json)
              echo "##vso[task.setvariable variable=PROJECT]$PROJECT"
              echo "##vso[task.setvariable variable=VERSION]$VERSION"
              echo "##vso[task.setvariable variable=NOTES]$NOTES"
              echo "##vso[task.setvariable variable=TAG]$TAG"
            displayName: Ler release-info.json

          # Build condicional
          - script: |
              if [ "$(PROJECT)" == "ngx-sp-auth" ]; then
                cd projects/ngx-sp-auth
                npm ci
                cd ../../
                npm run build:auth:prod
              elif [ "$(PROJECT)" == "ngx-sp-infra" ]; then
                npm run build:infra:prod
              fi
            displayName: Build da biblioteca

          # Testes com cobertura
          - script: |
              if [ "$(PROJECT)" == "ngx-sp-auth" ]; then
                npm run test:auth:sonar
              elif [ "$(PROJECT)" == "ngx-sp-infra" ]; then
                npm run test:infra:sonar
              fi
            displayName: Executa testes com cobertura

          # SonarCloud
          - task: SonarCloudPrepare@1
            inputs:
              SonarCloud: 'YourSonarServiceConnection'
              organization: 'your-org'
              scannerMode: 'CLI'
              configMode: 'manual'
              cliProjectKey: 'your-project-key'
              cliSources: '.'
            displayName: Preparar análise SonarCloud

          - script: |
              sonar-scanner \
                -Dsonar.token=$(SONAR_TOKEN)
            displayName: Executar análise SonarCloud

          - task: SonarCloudPublish@1
            displayName: Publicar resultados SonarCloud

          # Publica artefatos (substitui release do GitHub)
          - publish: $(Build.SourcesDirectory)/dist
            artifact: npm-package
            displayName: Publicar pacote como artifact
```

## main.yml (Publicação)

```yaml
trigger:
  branches:
    include:
      - main
      - next
      - test

pool:
  vmImage: 'ubuntu-latest'

variables:
  NODE_VERSION: '20'

stages:
  - stage: Test
    displayName: Continuous Deploy - Testes
    jobs:
      - job: run_unit_tests
        displayName: Executar testes e análise
        steps:
          - checkout: self
            fetchDepth: 0

          - task: NodeTool@0
            inputs:
              versionSpec: $(NODE_VERSION)
            displayName: Setup Node.js

          - script: npm ci
            displayName: Instalar dependências

          - script: |
              PROJECT=$(jq -r '.project' deploy/release-info.json)
              VERSION=$(jq -r '.version' deploy/release-info.json)
              NOTES=$(jq -r '.notes' deploy/release-info.json)
              TAG=$(jq -r '.tag' deploy/release-info.json)
              echo "##vso[task.setvariable variable=PROJECT]$PROJECT"
              echo "##vso[task.setvariable variable=VERSION]$VERSION"
              echo "##vso[task.setvariable variable=NOTES]$NOTES"
              echo "##vso[task.setvariable variable=TAG]$TAG"
            displayName: Ler release-info.json

          - script: |
              if [ "$(PROJECT)" == "ngx-sp-auth" ]; then
                npm run test:auth:sonar
              elif [ "$(PROJECT)" == "ngx-sp-infra" ]; then
                npm run test:infra:sonar
              fi
            displayName: Executar testes com cobertura

          - task: SonarCloudPrepare@1
            inputs:
              SonarCloud: 'YourSonarServiceConnection'
              organization: 'your-org'
              scannerMode: 'CLI'
              configMode: 'manual'
              cliProjectKey: 'your-project-key'
              cliSources: '.'
            displayName: Preparar análise SonarCloud

          - script: |
              sonar-scanner -Dsonar.token=$(SONAR_TOKEN)
            displayName: Executar análise SonarCloud

          - task: SonarCloudPublish@1
            displayName: Publicar resultados SonarCloud

  - stage: Deploy
    displayName: Continuous Deploy - Publicação
    dependsOn: Test
    condition: succeeded()
    jobs:
      - job: deploy_package
        displayName: Publicar pacote
        steps:
          - checkout: self
            fetchDepth: 0

          - task: NodeTool@0
            inputs:
              versionSpec: $(NODE_VERSION)
            displayName: Setup Node.js

          - script: |
              PROJECT=$(jq -r '.project' deploy/release-info.json)
              VERSION=$(jq -r '.version' deploy/release-info.json)
              NOTES=$(jq -r '.notes' deploy/release-info.json)
              TAG=$(jq -r '.tag' deploy/release-info.json)
              echo "##vso[task.setvariable variable=PROJECT]$PROJECT"
              echo "##vso[task.setvariable variable=VERSION]$VERSION"
              echo "##vso[task.setvariable variable=NOTES]$NOTES"
              echo "##vso[task.setvariable variable=TAG]$TAG"
            displayName: Ler release-info.json

          # Checa se package.json foi modificado
          - script: |
              if git diff --name-only HEAD~1 HEAD | grep -q "projects/$(PROJECT)/package.json"; then
                echo "##vso[task.setvariable variable=should_publish]true"
              else
                echo "##vso[task.setvariable variable=should_publish]false"
              fi
            displayName: Checar modificação de package.json

          # Instala dependências apenas se for publicar
          - script: npm install
            condition: eq(variables.should_publish, 'true')
            displayName: Instalar dependências (CD)

          # Build condicional
          - script: |
              if [ "$(PROJECT)" == "ngx-sp-auth" ]; then
                cd projects/ngx-sp-auth
                npm ci
                cd ../../
                npm run build:auth:prod
              elif [ "$(PROJECT)" == "ngx-sp-infra" ]; then
                npm run build:infra:prod
              fi
            condition: eq(variables.should_publish, 'true')
            displayName: Build da biblioteca

          # Publicação para Azure Artifacts (substitui NPM público)
          - task: Npm@1
            condition: eq(variables.should_publish, 'true')
            inputs:
              command: 'publish'
              workingDir: 'dist/$(PROJECT)'
              publishRegistry: 'useFeed'
              publishFeed: 'YourAzureArtifactsFeedName'
            displayName: Publicar pacote no Azure Artifacts

          # Salva notas de release como artifact
          - publish: $(Build.SourcesDirectory)/deploy/release-info.json
            artifact: release-info
            condition: eq(variables.should_publish, 'true')
            displayName: Publicar release-info como artifact
```
