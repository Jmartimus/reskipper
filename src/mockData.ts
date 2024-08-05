import { ApiResponse, PersonData } from './types';

export const mockData = [
  { index: 4, name: 'Doyle Toney', location: 'Louisiana' },
  { index: 5, name: 'Kimberly Crane', location: 'Louisiana' },
];

export const mockPersonData: PersonData[] = [
  {
    fullName: 'Full Name Magee',
    location: 'Somewhere, USA',
    coordinate_lat: '20',
    coordinate_lng: '30',
    age: '82',
    currentHomeAddress: '122 Better Butter Blvd',
    pastAddresses: ['123 main', '456 notMain'],
    phone: ['1231231234', '4564564567', '7897897890'],
    aka: ['Sweet Slice'],
    relatives: ['Some peeps', 'Other peeps'],
  },
  {
    fullName: 'Full Name Magee2',
    location: 'Somewhere, USA2',
    coordinate_lat: '202',
    coordinate_lng: '302',
    age: '822',
    currentHomeAddress: '122 Better Butter Blvd2',
    pastAddresses: ['1223 main', '4526 notMain'],
    phone: ['12312312342', '45645645672', '78978978902'],
    aka: ['Sweet Slic2e'],
    relatives: ['Some peeps2', 'Other peeps2'],
  },
];

export const mockResData: ApiResponse = {
  is_success: true,
  data: mockPersonData,
  message: 'Something',
  info: {
    used_credits: 1000,
    remaining_credits: 1000,
  },
};
