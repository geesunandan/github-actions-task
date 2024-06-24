import FileManager from './file';

describe('FileManager:', () => {
  describe('readFile', () => {
    describe('given correct path to read file', () => {
      it('returns the text of file', async () => {
        const data = await new FileManager().readFile('./test/fixtures/readfile.txt');

        expect(data).toEqual('Read file to test\n');
      });
    });
  });

  describe('given INCORRECT path to read file', () => {
    it('rejects with error', async () => {
      expect(new FileManager().readFile('./readFile.txt')).rejects;
    });
  });
});
