# 📦 Biblioteca Angular - Guia de Contribuição e Publicação

Bem-vindo ao repositório da biblioteca Angular mantida pela equipe! Este guia foi criado para facilitar a colaboração e garantir que o processo de publicação siga padrões consistentes, portanto leia com atenção.

---

## 📦 Publicação

A publicação é feita via CI no merge de `main`, `next` ou `test`. Mas é possível preparar localmente:

### Script Local de Release

Recomenda-se que execute um ```ng build``` local antes de realizar o publish, para evitar problemas no pipeline
Após garantir que está funcional:

```bash
npm run deploy
```

Este script:

* Atualiza versão com `npm version`
* Roda testes (opcional, pule informando nas opções pré-definidas)
* Cria e envia git tag
* Vai realizar um commit e push automático com uma mensagem padronizada

Após rodar o script:

1. Abra um PR
2. Após merge, o CI publicará automaticamente no NPM

---

## 🔖 Tags no NPM

| Branch | Tag NPM | Descrição                  |
| ------ | ------- | -------------------------- |
| main   | latest  | Versão estável oficial     |
| next   | next    | Próxima versão, beta       |
| test   | test    | Build interno/experimental |

---

## 🧰 Dicas Técnicas

* Dependências Angular devem estar em `peerDependencies`
* Use `semantic-release` e `conventional-changelog` (se configurado) para automatizar changelog
* Proteja branches principais com revisão obrigatória no GitHub

---

## 🧑‍💻 Colaboradores

Você pode ser adicionado como colaborador com acesso ao CI/NPM. Fale com os mantenedores para mais informações.

---

Qualquer dúvida ou sugestão, abra uma issue!

🛠️ *Feito com carinho para devs que colaboram.*
