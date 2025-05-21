import { exec } from "child_process";
import path from "path";

export const backupDatabase = async () => {
  const backupPath = path.join("backups", `backup-${Date.now()}`);
  const cmd = `mongodump --uri="${process.env.MONGO_URI}" --out=${backupPath}`;

  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) return reject(`Backup error: ${stderr}`);
      resolve(`Backup completed: ${stdout}`);
    });
  });
};
