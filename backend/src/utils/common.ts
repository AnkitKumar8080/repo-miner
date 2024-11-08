import { createHash } from "crypto";
import { promises as fs } from "fs";
import path from "path";

const excludedFilesAndFolders = [
  // Log files and debug logs
  "logs",
  "*.log",
  "npm-debug.log*",
  "yarn-debug.log*",
  "yarn-error.log*",
  "pnpm-debug.log*",
  "lerna-debug.log*",

  // Node-related files and folders
  "node_modules",
  "dist",
  "dist-ssr",
  "package-lock.json",

  // Editor and environment files
  ".local",
  ".vscode/*",
  "!.vscode/extensions.json",
  ".idea",
  ".DS_Store",
  ".suo",
  ".ntvs*",
  ".njsproj",
  ".sln",
  ".sw?",
  ".env",

  // Source control and IDE-specific files
  ".git",
  ".VSCodeCounter",

  // Public folders and assets
  "public",
  "images",
  "screenshots",

  // Media files (images, videos, audio)
  ".svg",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".bmp",
  ".tiff",
  ".webp",
  ".ico",

  // Video files
  ".mp4",
  ".avi",
  ".mkv",
  ".mov",
  ".flv",
  ".wmv",
  ".webm",
  ".m4v",

  // Audio files
  ".mp3",
  ".wav",
  ".ogg",
  ".flac",
  ".aac",
  ".m4a",

  // Additional miscellaneous binary formats
  ".pdf",
  ".docx",
  ".xlsx",
  ".pptx",
  ".zip",
  ".rar",
  ".7z",
  ".tar",
  ".gz",
];

export const hashString = (string: string) =>
  createHash("sha256").update(string).digest("hex").slice(0, 30);

// Remove a directory and its contents recursively (asynchronously)
export const removeDir = async (dirPath: string): Promise<void> => {
  const dirContents = await fs.readdir(dirPath);

  for (const item of dirContents) {
    const itemPath = path.join(dirPath, item);
    const itemStats = await fs.stat(itemPath);

    if (itemStats.isDirectory()) {
      await removeDir(itemPath);
    } else {
      await fs.unlink(itemPath);
    }
  }

  // remove the root directory itself
  await fs.rmdir(dirPath);
};

// Create a directory (asynchronously)
export const createDir = async (dirPath: string): Promise<void> => {
  // Check for existing dir asynchronously
  try {
    const isExist = await fs
      .access(dirPath)
      .then(() => true)
      .catch(() => false);

    // If dir exists, remove it
    if (isExist) {
      await removeDir(dirPath);
    }

    // Create a new directory asynchronously
    await fs.mkdir(dirPath, { recursive: true });
    console.log(`Directory created: ${dirPath}`);
  } catch (error) {
    console.error("Error creating directory:", error);
  }
};

// create file chunks
export const createFilechunks = async (
  filePath: string,
  splitFactor: number = 100,
  overlapFactor: number = 20
): Promise<any> => {
  // get the file data
  const fileData = await fs.readFile(filePath, "utf-8");
  const fileDataLines = fileData.split("\n");

  const totalLines = fileDataLines.length;

  const fileChunks = [];

  let curLine = 0;
  while (curLine < totalLines) {
    let endLine = curLine + splitFactor;
    if (endLine < curLine + splitFactor) {
      endLine = totalLines;
    }

    const chunk = fileDataLines.slice(curLine, splitFactor).join("\n");

    fileChunks.push({
      filePath: filePath,
      startLine: curLine,
      endLine: endLine,
      content: chunk,
    });

    curLine = curLine + splitFactor - overlapFactor;
  }

  return fileChunks;
};

// filter files and folders from repo
export const getRepoFilePaths = async (
  dirPath: string
): Promise<string[] | []> => {
  // stores the required paths of files needed to be chunked
  const result = [] as string[];

  // recursively read all the dir's
  const readdir = async (currentPath: string) => {
    const filesAndFoldersList = await fs.readdir(currentPath);

    for (const item of filesAndFoldersList) {
      if (
        excludedFilesAndFolders.includes(item) ||
        excludedFilesAndFolders.includes("." + item?.split(".").pop())
      ) {
        continue; // skip the excluded folder
      }

      // get absolute path of the item
      const itemPath = path.join(currentPath, item);

      // get the stats
      const itemStats = await fs.stat(itemPath);

      if (itemStats.isDirectory()) {
        await readdir(itemPath);
      } else {
        result.push(itemPath);
      }
    }
  };

  // start the rec func
  await readdir(dirPath);

  return result;
};
