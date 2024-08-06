import {
  GoogleRequestSchema,
  GoogleSheetCellData,
  type Sheets,
} from '../../types';
import {
  returnPhoneNumbersColIdx,
  returnRelativesColIdx,
} from '../../constants';

/**
 * Fetches data from a Google Spreadsheet.
 * @param sheets - Google Sheets API instance.
 * @param spreadsheetId - ID of the Google Spreadsheet.
 * @param sheetName - Name of the sheet to fetch data from.
 * @param columnRange - The range of the column to fetch data from (e.g., 'A:B').
 * @returns A promise that resolves to an array of objects containing row index, name, and location.
 * @throws An error if there is an issue fetching data from the Google Sheet.
 */
export const fetchDataFromSheet = async (
  sheets: Sheets,
  spreadsheetId: string,
  sheetName: string,
  columnRange: string
): Promise<GoogleSheetCellData[] | null> => {
  try {
    const range = `${sheetName}!${columnRange}`;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows: string[][] = response.data.values as string[][];
    if (!rows || rows.length === 0) {
      console.log('No data found.');
      return [];
    }

    return rows.map((row, index) => ({
      index: index + 2, // first data row is at index 2
      location: row[0] || 'Louisiana', // Location from column C (zero-based index 0)
      name: row[1], // Name from column D (zero-based index 1)
      phoneNumbers: [],
      relatives: [],
    }));
  } catch (error) {
    console.error('Error fetching data from Google Sheet:', error);
    throw error;
  }
};

/**
 * Retrieves the sheet ID for a given sheet name in a specified Google Spreadsheet.
 *
 * @param {Sheets} sheets - The authenticated Google Sheets instance.
 * @param {string} spreadsheetId - The ID of the Google Spreadsheet.
 * @param {string} sheetName - The name of the sheet to retrieve the ID for.
 * @returns {Promise<number>} - A promise that resolves to the sheet ID.
 * @throws {Error} - Throws an error if the sheet ID cannot be retrieved.
 */
export const getSheetId = async (
  sheets: Sheets,
  spreadsheetId: string,
  sheetName: string
): Promise<number> => {
  try {
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: spreadsheetId,
    });

    // Check if the response data exists and has sheets
    if (!spreadsheet.data || !spreadsheet.data.sheets) {
      throw new Error('No sheets found in the spreadsheet.');
    }

    // Find the sheet with the matching title
    const sheet = spreadsheet.data.sheets.find(
      (sheet) => sheet.properties?.title === sheetName
    );

    // Check if the sheet was found
    if (!sheet || !sheet.properties?.sheetId) {
      throw new Error(`Sheet with name "${sheetName}" not found.`);
    }

    // Return the sheet ID
    return sheet.properties.sheetId;
  } catch (error) {
    throw new Error(`Error retrieving sheet ID`);
  }
};

/**
 * Creates a list of requests to update Google Sheets with phone numbers and relatives.
 *
 * @param {Array<GoogleSheetCellData>} allResults - Array of objects containing row index, phone numbers, and relatives.
 * @param {number} returnSheetId - The sheet ID to update.
 * @returns {GoogleRequestSchema[]} Array of requests to update cells in Google Sheets.
 */
export function createUpdateRequests(
  allResults: Array<GoogleSheetCellData>,
  returnSheetId: number
): GoogleRequestSchema[] {
  return allResults.flatMap((entry) => {
    // Concatenate phone numbers and relatives into single strings
    const phoneNumbersString = entry.phoneNumbers.join(', ');
    const relativesString = entry.relatives.join(', ');

    return [
      {
        updateCells: {
          range: {
            sheetId: returnSheetId,
            startRowIndex: entry.index - 1, // Zero-based index for Google Sheets
            endRowIndex: entry.index, // Single row
            startColumnIndex: returnPhoneNumbersColIdx, // Column H (zero-based index is 7)
            endColumnIndex: returnPhoneNumbersColIdx + 1, // Single column (H)
          },
          rows: [
            {
              values: [
                {
                  userEnteredValue: {
                    stringValue: phoneNumbersString, // Set concatenated string as cell value
                  },
                },
              ],
            },
          ],
          fields: 'userEnteredValue',
        },
      },
      {
        updateCells: {
          range: {
            sheetId: returnSheetId,
            startRowIndex: entry.index - 1, // Zero-based index for Google Sheets
            endRowIndex: entry.index, // Single row
            startColumnIndex: returnRelativesColIdx, // Column I (zero-based index is 8)
            endColumnIndex: returnRelativesColIdx + 1, // Single column (I)
          },
          rows: [
            {
              values: [
                {
                  userEnteredValue: {
                    stringValue: relativesString, // Set concatenated string as cell value
                  },
                },
              ],
            },
          ],
          fields: 'userEnteredValue',
        },
      },
    ];
  });
}
