export enum STATUS_MESSAGES {
  STEP_1 = '1. Authenticating google sheet.',
  STEP_2 = '2. Fetching data from sheet and filtering.',
  STEP_3 = '3. Data fetched, grabbing sheet ID.',
  STEP_4 = '4. Making skiptracing calls to API.',
  STEP_5 = '5. Returning skiptraced data to google sheet.',
  STEP_6 = '6. Skiptracing completed',
}

export enum AUTH_MESSAGES {
  SUCCESS = 'Authentication successful.',
  DENIED = 'Authentication failed. User not allowed.',
}

export const delayTime = 750;

// Could be different than above but needed to not overload API.
export const APIdelayTime = 500;

// Google sheet title we are using with skip tracer
export const spreadSheetTitle = ' Test Fresh Leads';

// Location column through contact numbers column range
export const googleSheetDataFetchRange = 'C2:G';

// Column G to return numbers
export const returnPhoneNumbersColIdx = 6; // Column G (zero-based index is 6)

// Column O to return relatives
export const returnRelativesColIdx = 14; // Column O (zero-based index is 14)

// API throttle to only return the first 10 items in the list
export const APIThrottle = 10;
