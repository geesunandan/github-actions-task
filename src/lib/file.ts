import fs from 'fs';

interface IFileManager {
  readFile: (filePath: string) => Promise<string>;
}

class FileManager implements IFileManager {
  async readFile(filePath: string) {
    return new Promise<string>((resolve, reject) => {
      fs.readFile(filePath, { encoding: 'utf-8', flag: 'r' }, (error, data) => {
        if (error) {
          reject(error);
        }

        resolve(data);
      });
    });
  }
}

export default FileManager;
