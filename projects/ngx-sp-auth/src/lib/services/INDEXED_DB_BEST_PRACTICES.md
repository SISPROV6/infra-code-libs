# IndexedDB Service - Guia de Uso e Boas Práticas

## 🔴 Problemas Corrigidos

### 1. **Race Condition em Logout/Login**
**Problema:** Após `deleteDatabase()` + novo `initializeDatabase()`, operações ficavam presas indefinidamente.

**Causa:** 
- Múltiplas chamadas concorrentes a `openDB()` durante a recriação da database
- Conexões antigas (`this.request`) ficando em estado `blocked`
- Falta de sincronização entre `closeOpenConnection()` e `initializeDatabase()`

**Solução:** Implementado `DatabaseLock` que garante execução serial das operações críticas.

---

### 2. **Conexão Aberta Para Cada Operação**
**Problema:** Cada chamada a `get()`, `add()`, `update()`, `delete()` abria uma nova conexão e fechava imediatamente, criando deadlock quando a database estava sendo recriada.

**Solução:** Agora usa uma única instância persistente `this.request`, reutilizada por todas as operações.

---

### 3. **Inicialização Sem Sincronização**
**Problema:** No componente, você chamava `this._indexedDB.initializeDatabase()` no constructor **sem await**, causando race condition quando `ngOnInit()` tentava usar a database.

**Solução:** Implementado `_ensureInitialized()` que aguarda a conclusão se initialization ainda estiver em progresso.

---

## ✅ Padrão Correto de Uso

### **NO COMPONENTE**

```typescript
import { Component, OnInit } from '@angular/core';
import { IndexedDBService, ObjectToStore } from '@path/to/indexed-db.service';

interface UsuariosFilter {
  pesquisa: string;
  isActive: boolean;
  page: number;
  itemsPerPage: number;
}

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  
  textoPesquisa: string = '';
  isActive: boolean = true;
  page: number = 1;
  itemsPerPage: number = 10;

  constructor(private _indexedDB: IndexedDBService) {
    // ❌ NÃO faça isso aqui
    // this._indexedDB.initializeDatabase();
  }

  async ngOnInit() {
    try {
      // ✅ SEMPRE faça com await no ngOnInit()
      await this._indexedDB.initializeDatabase();

      // Agora sim, é seguro usar qualquer operação
      const restored = await this._indexedDB.validate(
        'usuarios',
        {
          key: 'usuarios',
          context: 'usuarios-lista',
          payload: {
            pesquisa: '',
            isActive: true,
            page: 1,
            itemsPerPage: 10
          }
        }
      );

      if (restored) {
        this.textoPesquisa = restored.pesquisa;
        this.isActive = restored.isActive;
        this.page = restored.page;
        this.itemsPerPage = restored.itemsPerPage;
      }

      this.getUsuariosList(this.textoPesquisa);
    } catch (error) {
      console.error('Erro ao inicializar filtros:', error);
      // Tratar erro apropriadamente
    }
  }

  async getUsuariosList(search: string = "") {
    try {
      // ✅ Seguro usar operações aqui
      await this._indexedDB.update({
        key: 'usuarios',
        context: 'usuarios-lista',
        payload: {
          pesquisa: this.textoPesquisa,
          isActive: this.isActive,
          page: this.page,
          itemsPerPage: this.itemsPerPage,
        }
      });
    } catch (error) {
      console.error('Erro ao atualizar filtros:', error);
    }
  }
}
```

---

## 🔐 Padrão Correto de Logout/Login

### **NO AUTH SERVICE OU LOGOUT HANDLER**

```typescript
async logout() {
  try {
    // 1️⃣ Primeiro, fechar a conexão aberta
    await this._indexedDB.closeOpenConnection();
    
    // 2️⃣ Depois, deletar a database
    await this._indexedDB.deleteDatabase();
    
    // 3️⃣ Outras operações de logout
    await this._authService.logout();
    
    // 4️⃣ Navegar para login
    this.router.navigate(['/login']);
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    // Mesmo com erro, tenta navegar para login
    this.router.navigate(['/login']);
  }
}
```

### **NO COMPONENTE DE LOGIN, AO COMPLETAR LOGIN**

```typescript
async onLoginSuccess() {
  try {
    // Login realizado com sucesso
    // A database será recriada quando o novo componente chamar:
    // await this._indexedDB.initializeDatabase();
    
    // Navegar para o componente que usa IndexedDB
    this.router.navigate(['/usuarios']);
  } catch (error) {
    console.error('Erro ao navegar após login:', error);
  }
}
```

---

## 📋 Checklist de Implementação

- [ ] Remover qualquer chamada a `initializeDatabase()` do constructor
- [ ] Adicionar `await this._indexedDB.initializeDatabase()` no **início do `ngOnInit()`**
- [ ] Envolver operações do IndexedDB em `try/catch`
- [ ] Usar o padrão `closeOpenConnection()` → `deleteDatabase()` no logout
- [ ] Testar fluxo completo: logout → login → carregamento de dados
- [ ] Verificar console do navegador para warnings/errors

---

## 🔄 Fluxo Completo de Funcionamento

```
┌─────────────────────────────────────────────────────────────────┐
│ PRIMEIRA CARGA                                                  │
├─────────────────────────────────────────────────────────────────┤
│ 1. Componente cria (constructor sem initDB)                     │
│ 2. ngOnInit() → await initializeDatabase()                      │
│    ├─ Lock adquirida                                            │
│    ├─ openDB() cria database + objectStore                      │
│    ├─ this.request = conexão persistente                        │
│    ├─ _isInitialized = true                                     │
│    └─ Lock liberada                                             │
│ 3. ngOnInit() continua → validate() busca dados                 │
│    ├─ _ensureInitialized() → verificar se tá pronto            │
│    └─ this.request.get() executa com conexão persistente        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ LOGOUT                                                          │
├─────────────────────────────────────────────────────────────────┤
│ 1. closeOpenConnection()                                        │
│    ├─ Lock adquirida                                            │
│    ├─ this.request.close()                                      │
│    ├─ this.request = undefined                                  │
│    ├─ _isInitialized = false                                    │
│    └─ Lock liberada                                             │
│ 2. deleteDatabase()                                             │
│    ├─ Lock adquirida                                            │
│    ├─ _closeConnection() novamente (seguro, já foi feito)       │
│    ├─ deleteDB() remove a database                              │
│    └─ Lock liberada                                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ LOGIN + NOVO COMPONENTE                                         │
├─────────────────────────────────────────────────────────────────┤
│ 1. Novo componente criado (constructor sem initDB)              │
│ 2. ngOnInit() → await initializeDatabase()                      │
│    ├─ Lock adquirida                                            │
│    ├─ _isInitialized === false                                  │
│    ├─ openDB() com upgrade novamente                            │
│    ├─ Novo objectStore criado                                   │
│    ├─ this.request = nova conexão persistente                   │
│    ├─ _isInitialized = true                                     │
│    └─ Lock liberada (IMPORTANTE!)                               │
│ 3. ngOnInit() continua → operações funcionam normalmente        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🐛 Debugging

Se ainda tiver problemas, abra o DevTools e verifique:

### **No Console:**
```javascript
// Verificar se existe indexedDB
console.log('IndexedDB disponível:', !!window.indexedDB);

// Listar databases existentes
// Chrome: Abre DevTools → Application → IndexedDB
```

### **Se travar novamente:**
1. Abra DevTools → Application → Storage → IndexedDB
2. Verifique se existe database com o nome esperado
3. Se houver múltiplas versões, pode ser sinal de problema
4. Pressione F5 para limpar

### **Logs disponíveis:**
O service loga automaticamente:
- Inicialização bem-sucedida
- Warnings quando há outras abas (blocked/blocking)
- Erros de operações

---

## 📝 Resumo das Mudanças

| Problema | Solução |
|----------|---------|
| Race condition entre logout/login | `DatabaseLock` + `_ensureInitialized()` |
| Múltiplas conexões abertas | Uma única instância persistente `this.request` |
| Inicialização sem sincronização | Promise tracking com `_initPromise` |
| Sem tratamento de estado | Flags `_isInitialized` sincronizadas |
| Sem feedback do que acontecia | Melhor documentação + exemplos |

