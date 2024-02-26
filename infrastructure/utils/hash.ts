import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";

const calculateHashOfFile = (filePath: string): string => {
  const content = fs.readFileSync(filePath);
  const hash = crypto.createHash("sha256");
  hash.update(content);
  return hash.digest("hex");
};

export const calculateHashOfDirectory = (directoryPath: string): string => {
  const baseHash = crypto.createHash("sha256");

  const processDirectory = (currentPath: string) => {
    const items = fs.readdirSync(currentPath);

    for (const item of items) {
      const itemPath = path.join(currentPath, item);
      const stats = fs.statSync(itemPath);
      if (stats.isDirectory()) {
        processDirectory(itemPath);
      } else {
        const fileHash = calculateHashOfFile(itemPath);
        baseHash.update(fileHash);
      }
    }
  };

  processDirectory(directoryPath);

  return baseHash.digest("hex");
};
