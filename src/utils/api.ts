import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

const DIR = Directory.Documents;

async function readJson(filename: string) {
  try {
    const result = await Filesystem.readFile({
      path: filename,
      directory: DIR,
      encoding: Encoding.UTF8,
    });
    return JSON.parse(result.data as string);
  } catch {
    // File doesn't exist yet
    return filename === 'data.json' ? { habits: [], entries: {} } : {};
  }
}

async function writeJson(filename: string, body: unknown) {
  await Filesystem.writeFile({
    path: filename,
    data: JSON.stringify(body, null, 2),
    directory: DIR,
    encoding: Encoding.UTF8,
    recursive: true,
  });
  return { status: 'ok' };
}

export const api = {
  getData: ()               => readJson('data.json'),
  saveData: (body: unknown) => writeJson('data.json', body),
  getDiary: ()              => readJson('diary.json'),
  saveDiary: (body: unknown) => writeJson('diary.json', body),
};