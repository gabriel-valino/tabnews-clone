import { loadEnvConfig } from "@next/env";

const jestConfig = async () => {
  const projectDir = process.cwd();
  loadEnvConfig(projectDir);
};

export default jestConfig;
