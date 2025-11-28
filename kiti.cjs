// kiti.cjs — versão 0.2.2, pkg-friendly, 100% funcional, AIO

const fs = require("fs");
const path = require("path");
const os = require("os");
const readline = require("readline");

// -------------------------
// ASCII BANNER
// -------------------------
console.log(`
 ██╗  ██╗██╗████████╗██╗
 ██║ ██╔╝██║╚══██╔══╝██║
 █████╔╝ ██║   ██║   ██║
 ██╔═██╗ ██║   ██║   ██║
 ██║  ██╗██║   ██║   ██║
 ╚═╝  ╚═╝╚═╝   ╚═╝   ╚═╝

       k i t i   c l i
`);

// -------------------------
// PASTA DE DADOS (fora do exe)
// -------------------------
const dataDir = path.join(os.homedir(), ".kiti");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

// -------------------------
// USER CONFIG
// -------------------------
const userConfigPath = path.join(dataDir, "user.json");
if (!fs.existsSync(userConfigPath)) {
    fs.writeFileSync(userConfigPath, JSON.stringify({
        username: "default",
        theme: "normal",
        createdAt: new Date().toISOString()
    }, null, 4));
}

let userConfig = JSON.parse(fs.readFileSync(userConfigPath, "utf8"));
let currentTheme = userConfig.theme || "normal";

// -------------------------
// TEMAS
// -------------------------
const themes = {
    neon: { color: "\u001b[36m", name: "neon" },
    vaporwave: { color: "\u001b[35m", name: "vaporwave" },
    win98: { color: "\u001b[34m", name: "win98" },
    dark: { color: "\u001b[37m", name: "dark" }
};

// -------------------------
// COLOR + PROMPT
// -------------------------
function promptColor() {
    const t = themes[currentTheme];
    return t ? t.color : "\u001b[37m";
}

function buildPrompt(cwd) {
    return `${promptColor()}kiti(${cwd})>\u001b[0m `;
}

// -------------------------
// CLI CORE
// -------------------------
let currentDir = process.cwd();
let editMode = false;
let editBuffer = "";
let editFilePath = "";

// -------------------------
// COMANDOS
// -------------------------
function runCommand(cmd) {

    // MODO EDIÇÃO
    if (editMode) {
        if (cmd === "/save") {
            fs.writeFileSync(editFilePath, editBuffer, "utf8");
            console.log("Arquivo salvo com sucesso!");
            editMode = false;
            editBuffer = "";
            editFilePath = "";
            return;
        }
        editBuffer += cmd + "\n";
        return;
    }

    const [command, ...args] = cmd.split(" ");

    switch (command) {

        case "cd":
            const target = path.resolve(currentDir, args.join(" "));
            if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
                currentDir = target;
            } else {
                console.log("Diretório inválido");
            }
            break;

        case "ls":
            console.log(fs.readdirSync(currentDir).join("\n"));
            break;

        case "open":
            const filePath = path.join(currentDir, args.join(" "));
            if (fs.existsSync(filePath)) {
                console.log(fs.readFileSync(filePath, "utf8"));
            } else {
                console.log("Arquivo inexistente");
            }
            break;

        case "edit":
            const f = path.join(currentDir, args.join(" "));
            editFilePath = f;

            if (fs.existsSync(f)) {
                console.log("Editando arquivo existente");
                editBuffer = fs.readFileSync(f, "utf8");
            } else {
                console.log("Arquivo novo");
                editBuffer = "";
            }

            console.log("--------------------");
            console.log("Digite o novo conteúdo. Quando terminar escreva: /save");
            console.log("--------------------");

            editMode = true;
            break;

        case "theme":
            const t = args[0];
            if (themes[t]) {
                currentTheme = t;
                // salva no user.json (fora do snapshot)
                userConfig.theme = t;
                fs.writeFileSync(userConfigPath, JSON.stringify(userConfig, null, 4));
                console.log(`Tema trocado para: ${t}`);
            } else {
                console.log("Tema inexistente. Disponíveis: neon, vaporwave, win98, dark");
            }
            break;

        case "config":
            console.log(JSON.stringify(userConfig, null, 4));
            break;

        case "echo":
            console.log(args.join(" "));
            break;

        case "calc":
            try {
                console.log(eval(args.join(" ")));
            } catch {
                console.log("Erro na expressão");
            }
            break;

        case "cp":
        case "copy":
            try {
                const src = path.resolve(currentDir, args[0]);
                const dest = path.resolve(currentDir, args[1]);
                if (!fs.existsSync(src)) return console.log("Arquivo de origem não existe");
                fs.copyFileSync(src, dest);
            } catch(e) {
                console.log("Erro ao copiar:", e.message);
            }
            break;

        case "mv":
        case "move":
            try {
                const src = path.resolve(currentDir, args[0]);
                const dest = path.resolve(currentDir, args[1]);
                if (!fs.existsSync(src)) return console.log("Arquivo de origem não existe");
                fs.renameSync(src, dest);
            } catch(e) {
                console.log("Erro ao mover:", e.message);
            }
            break;

        case "help":
            console.log(`
Comandos Kiti CLI:
  cd <dir>
  ls
  open <arquivo>
  edit <arquivo>
  theme <tema>
  config
  echo <texto>
  calc <expressão>
  cp/mv <origem> <destino>
  help
  exit
`);
            break;

        case "exit":
            console.log("Saindo do Kiti CLI...");
            process.exit(0);
            break;

        case "":
            break;

        default:
            console.log("Comando inexistente.");
    }
}

// -------------------------
// LOOP PRINCIPAL
// -------------------------
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function loop() {
    rl.question(buildPrompt(currentDir), (answer) => {
        runCommand(answer.trim());
        loop();
    });
}

loop();
