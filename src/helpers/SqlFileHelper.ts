import * as path from "path";
import pgLib from "pg-promise";

const joinPath = path.join;

// Helper for linking to external query files:
export const sql = (file: string): pgLib.QueryFile => {
  const projectPath = path.resolve(__dirname + '/..');
  const fullPath = joinPath(projectPath, file);
  return new pgLib.QueryFile(fullPath, { minify: true });
}
