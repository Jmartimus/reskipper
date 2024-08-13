// import axios from 'axios';
import axios from 'axios';
// import { mockResData } from '../../mockData';
import { ApiResponse } from '../../types';
import { api_key, api_url } from '../../secrets';
import { APIThrottle } from '../../constants';

/**
 * Fetches phone data and relatives for a given name and location.
 *
 * @param {string} name - The name of the person to search for.
 * @param {string} location - The location of the person to search for.
 * @returns {Promise<{ phoneNumbers: string[], relatives: string[] } | null>} - A promise that resolves to an object containing arrays of phone numbers and relatives, or null if there was an error.
 */
export const fetchData = async (
  name: string,
  location: string
): Promise<{
  phoneNumbers: string[];
  relatives: string[];
} | null> => {
  console.log('Skiptracing the following:', { name, location });
  try {
    const response = await axios.get<ApiResponse>(api_url, {
      params: {
        api_key,
        search_by: 'name',
        name,
        location,
      },
    });

    const responseContent = response.data;
    // const responseContent = mockResData;
    if (responseContent.is_success) {
      const phoneNumbers = Array.from(
        new Set(
          responseContent.data
            .map((person) => person.phone)
            .flat() // Flatten the array of phone numbers
            .slice(0, APIThrottle) // Flatten the array of phone numbers and take only the first 10
        )
      );

      const relatives = Array.from(
        new Set(
          responseContent.data
            .map((person) => person.relatives)
            .flat()
            .join(' • ')
            .split(' • ')
            .slice(0, 10) // Split by ' • ', take the first 10
            .map((relative) => relative.replace(/\./g, ',')) // Replace dots with commas
        )
      );

      return {
        phoneNumbers: phoneNumbers.length
          ? phoneNumbers
          : phoneNumbers.concat('No data found'),
        relatives: relatives.length
          ? relatives
          : relatives.concat('No data found'),
      };
    } else {
      console.error('Error fetching data:', responseContent.message);
      return null;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
