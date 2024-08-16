import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import { type Sheets } from '../../src/types';

export const authenticateSheets = async (): Promise<Sheets | null> => {
  try {
    const auth = new GoogleAuth({
      credentials: {
        type: process.env.GOOGLE_TYPE,
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
      },
      scopes: 'https://www.googleapis.com/auth/spreadsheets',
    });

    const sheets = google.sheets({ version: 'v4', auth });
    return sheets;
  } catch (error) {
    console.error('Error authenticating with Google Sheets API:', error);
    return null; // or you could throw the error again depending on your use case
  }
};
