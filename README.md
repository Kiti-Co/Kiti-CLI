# Kiti OS Server
## Para rodar basta:
### Windows
- Abrir o Microsoft Windows PowerShell
- Rodar: iwr -useb https://raw.githubusercontent.com/Kiti-Co/Kiti-CLI/main/install-kiti.ps1 | iex
- Digitar: kiti
- Pronto!
### Linux
- Abrir o CMD
- Rodar: curl -L https://raw.githubusercontent.com/Kiti-Co/Kiti-CLI/main/install-kiti.sh | bash
- Digitar: kiti
- Pronto!
Um terminal simples em Node.js, baseado em CommonJS, com suporte a temas, edição de arquivos, navegação de diretórios e configuração persistente através de `user.json`.

---

## Recursos

- Navegação básica (`cd`, `ls`)
- Leitura de arquivos (`open`)
- Editor interno com salvamento (`edit` + `/save`)
- Sistema de temas com persistência (`theme <nome>`)
- Configuração automática no primeiro uso (`user.json`)
- Comando `exit` para encerrar o CLI
- Arquitetura AIO (um único arquivo: `kiti.cjs`)
- Apps

---

## Temas disponíveis

- **normal** — ciano  
- **roxo** — magenta  
- **azul** — azul  
- **branco** — branco  

O tema escolhido fica salvo em `user.json` e é carregado automaticamente em todas as execuções seguintes.

# Apps
##📝 Estrutura básica de um app
```// meuApp.app.js```
```module.exports = function(MiniOS) {```
```    MiniOS.print("Hello world! 🚀");```

```    MiniOS.readInput("Digite algo:", (resposta) => {```
```        MiniOS.print("Você digitou: " + resposta);```
```    });```
```};```


Nome do arquivo: nomeDoApp.app.js

Função exportada: obrigatório

Parâmetro: MiniOS (a API)

## KitiOS Server Api
| Função / Propriedade        | Uso                         | Exemplo                                                           |
| --------------------------- | --------------------------- | ----------------------------------------------------------------- |
| `MiniOS.print(msg)`         | Mostra mensagem no terminal | `MiniOS.print("Olá!");`                                           |
| `MiniOS.clear()`            | Limpa o terminal            | `MiniOS.clear();`                                                 |
| `MiniOS.cwd()`              | Retorna diretório atual     | `console.log(MiniOS.cwd());`                                      |
| `MiniOS.readInput(msg, cb)` | Mostra prompt e lê input    | `MiniOS.readInput("Digite seu nome:", res => MiniOS.print(res));` |
| `MiniOS.fs`                 | Acesso ao módulo `fs`       | `MiniOS.fs.writeFileSync("teste.txt","oi");`                      |
| `MiniOS.path`               | Acesso ao módulo `path`     | `const full = MiniOS.path.join(MiniOS.cwd(), "teste.txt");`       |
| `MiniOS.os`                 | Acesso ao módulo `os`       | `MiniOS.print(MiniOS.os.platform());`                             |

## Comandos CLI para APPS
| Comando             | Descrição                   |                                   |
| ------------------- | --------------------------- | --------------------------------- |
| `loadapp <caminho>` | Carrega um app de `.app.js` | `loadapp apps/guessnumber.app.js` |
| `run <nome>`        | Executa um app carregado    | `run guessnumber`                 |


### Exemplos na pasta "apps" do repositório
