import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import { type Sheets } from '../../src/types';
import path, { dirname } from 'path';

export const authenticateSheets = async (): Promise<Sheets> => {
  const dirName = dirname(__filename);
  const keyFilePath = path.join(dirName, '../../src/assets/reskipper-key.json');
  const auth = new GoogleAuth({
    keyFile: keyFilePath,
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });
  return google.sheets({ version: 'v4', auth });
};
