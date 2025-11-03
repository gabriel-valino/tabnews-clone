const { spawn } = require("node:child_process");

const isWindows = process.platform === "win32";
let isStopping = false;

const log = (msg) => console.log(`\n${msg}\n`);

const run = (command, args = [], options = {}) => {
  return spawn(command, args, {
    stdio: "inherit",
    shell: isWindows,
    ...options,
  });
};

const runSequential = async (command, args = [], options = {}) => {
  return new Promise((resolve, reject) => {
    const child = run(command, args, options);
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`❌ Erro ao rodar: ${command} ${args.join(" ")}`));
      } else resolve();
    });
  });
};

const stopContainers = () => {
  if (isStopping) return;
  isStopping = true;

  log("\n\n🧹 Encerrando containers...");
  const down = run("npm", ["run", "services:stop"]);
  down.on("exit", () => {
    log("✅ Containers encerrados.");
    process.exit(0);
  });
};

(async () => {
  try {
    log("🚀 Subindo containers...");
    await runSequential("npm", ["run", "services:up"]);

    log("⏳ Aguardando o banco de dados...");
    await runSequential("npm", ["run", "services:wait:database"]);

    log("📜 Executando migrations...");
    await runSequential("npm", ["run", "migrations:up"]);

    log("✅ Containers e banco prontos! Iniciando servidor...");

    // eslint-disable-next-line no-unused-vars
    const dev = run("next", ["dev"]);

    process.on("SIGINT", stopContainers);
    process.on("SIGTERM", stopContainers);

    if (isWindows) {
      process.on("exit", stopContainers);
    }
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
})();
