import { type sheets_v4 } from 'googleapis';

export type Sheets = sheets_v4.Sheets;

export type GoogleRequestSchema = sheets_v4.Schema$Request;

export type GoogleSheetCellData = {
  index: number;
  name: string;
  location: string;
  phoneNumbers: string[];
  relatives: string[];
};

export interface PersonData {
  fullName: string;
  location: string;
  coordinate_lat: string;
  coordinate_lng: string;
  age: string;
  currentHomeAddress: string;
  pastAddresses: string[];
  phone: string[];
  aka: string[];
  relatives: string[];
}

export interface ApiResponse {
  is_success: boolean;
  data: PersonData[];
  message: string;
  info: {
    used_credits: number;
    remaining_credits: number;
  };
}
