export enum STATUS_MESSAGES {
  STEP_1 = '1. Authenticating google sheet.',
  STEP_2 = '2. Google sheet authenticated, fetching data from sheet.',
  STEP_3 = '3. Filtering out previously skiptraced leads.',
  STEP_4 = '4. Data fetched, grabbing sheet ID.',
  STEP_5 = '5. Making skiptracing calls to API.',
  STEP_6 = '6. Returning skiptraced data to google sheet.',
  STEP_7 = '7. Skiptracing completed',
}

export enum AUTH_MESSAGES {
  SUCCESS = 'Authentication successful.',
  DENIED = 'Authentication failed. User not allowed.',
}

export const delayTime = 750;

// Could be different than above but needed to not overload API.
export const APIdelayTime = 500;

// Google sheet title we are using with skip tracer
export const spreadSheetTitle = 'Fresh Leads';

// Name column range
export const googleSheetDataFetchRange = 'D2:D';

// Column H to return numbers
export const returnPhoneNumbersColIdx = 7; // Column H (zero-based index is 7)

// Column I to return relatives
export const returnRelativesColIdx = 8; // Column I (zero-based index is 8)
