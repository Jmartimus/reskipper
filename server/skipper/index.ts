import { authenticateSheets } from '../googleSheets/auth';
import type WebSocket from 'ws';
import { GoogleSheetCellData } from '../../src/types';
import {
  createUpdateRequests,
  fetchDataFromSheet,
  getSheetId,
} from '../googleSheets/utils';
import { delay, fetchData } from './utils';
import {
  APIdelayTime,
  delayTime,
  googleSheetDataFetchRange,
  spreadSheetTitle,
  STATUS_MESSAGES,
} from '../../src/constants';
import { spreadsheetId } from '../secrets';

export const runReSkipper = async (ws: WebSocket): Promise<void> => {
  try {
    // Authenticating sheet
    ws.send(STATUS_MESSAGES.STEP_1);
    const sheets = await authenticateSheets();
    await delay(delayTime); // Delay so user can see message update.

    if (!sheets) {
      ws.send(
        'Failed google sheet authentication - closing down. Please try again later.'
      );
      return;
    }

    // Get google sheet data
    ws.send(STATUS_MESSAGES.STEP_2);
    const data = await fetchDataFromSheet(
      sheets,
      spreadsheetId,
      spreadSheetTitle,
      googleSheetDataFetchRange
    );
    await delay(delayTime); // Delay so user can see message update.

    // Get google sheet ID
    ws.send(STATUS_MESSAGES.STEP_3);
    const returnSheetId = await getSheetId(
      sheets,
      spreadsheetId,
      spreadSheetTitle
    );
    await delay(delayTime); // Delay so user can see message update.

    if (!data) {
      ws.send('No data to update - closing down. Please try again later.');
      return;
    }

    // Making skiptracing calls to API
    ws.send(STATUS_MESSAGES.STEP_4);
    const allResults: Array<GoogleSheetCellData> = [];
    for (const entry of data) {
      try {
        // default to louisiana unless we have incoming location data
        const location = entry.location ?? 'Louisiana';
        const result = await fetchData(entry.name, location, ws);
        if (!result) {
          ws.send(`Something went wrong with the API. Please try again later.`);
          return;
        }

        const { phoneNumbers, relatives } = result;
        allResults.push({ ...entry, phoneNumbers, relatives });
        await delay(APIdelayTime); // Delay for 500ms to ensure only 2 requests per second
      } catch (apiError) {
        console.error('Error fetching phone data:', apiError);
        ws.send(`Error fetching phone data for ${entry.name}: ${apiError}`);
      }
    }

    // Returning skiptraced data to google sheet.
    ws.send(STATUS_MESSAGES.STEP_5);
    const requests = createUpdateRequests(allResults, returnSheetId);

    // Execute batch update
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests,
      },
    });
    await delay(delayTime); // Delay so user can see message update.

    ws.send(STATUS_MESSAGES.STEP_6);
    await delay(delayTime); // Delay so user can see message update.
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error accessing or updating Google Sheet:', error);
      ws.send(`Error: ${error.message}`);
    } else {
      console.error(
        'Unexpected error type accessing or updating Google Sheet:',
        error
      );
      ws.send(`Unexpected error type: ${typeof error}`);
    }
  } finally {
    ws.close();
  }
};
