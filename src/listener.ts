import chalk from "chalk";
import { Application } from "express";

export const listener = (app : Application , PORT : any, pkg : any) =>{
  app.listen(PORT, () => {
    console.log(
      chalk.green.bold(`✅ Server running on http://localhost:${PORT}`)
    );
    console.log(chalk.cyan(`📦 Project: ${pkg.name} | v${pkg.version}`));
  });
}
