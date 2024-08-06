// import axios from 'axios';
import { mockResData } from '../../mockData';

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
  console.log({ name, location });
  // comment back in when we want to use API instead of mock data.
  // try {
  //   const response = await axios.get<ApiResponse>(api_url, {
  //     params: {
  //       api_key,
  //       search_by: 'name',
  //       name,
  //       location,
  //     },
  //   });

  // const responseContent = response.data;
  const responseContent = mockResData;
  if (responseContent.is_success) {
    const phoneNumbers = responseContent.data
      .map((person) => person.phone)
      .flat(); // Flatten the array of phone numbers

    const relatives = responseContent.data
      .map((person) => person.relatives)
      .flat(); // Flatten the array of relatives

    return {
      phoneNumbers: phoneNumbers.length ? phoneNumbers : ['No data found'],
      relatives: relatives.length ? relatives : ['No data found'],
    };
  } else {
    console.error('Error fetching data:', responseContent.message);
    return null;
    // } catch (error) {
    //   console.error('Error fetching data:', error);
    //   return null;
    // }
  }
};

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
