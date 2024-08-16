import axios from 'axios';
// import { mockResData } from '../../mockData';
import { ApiResponse } from '../../src/types';
import { APIThrottle } from '../../src/constants';
import { api_key, api_url } from '../secrets';
import { WebSocket } from 'ws';

/**
 * Fetches phone data and relatives for a given name and location.
 *
 * @param {string} name - The name of the person to search for.
 * @param {string} location - The location of the person to search for.
 * @param {WebSocket} ws - The WebSocket connection to send updates to.
 * @returns {Promise<{ phoneNumbers: string[], relatives: string[] } | null>} - A promise that resolves to an object containing arrays of phone numbers and relatives, or null if there was an error.
 */
export const fetchData = async (
  name: string,
  location: string,
  ws: WebSocket
): Promise<{
  phoneNumbers: string[];
  relatives: string[];
} | null> => {
  console.log('Skiptracing the following:', { name, location });
  ws.send(`Skiptracing ${name}`);

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

    if (responseContent.is_success) {
      const phoneNumbers = Array.from(
        new Set(
          responseContent.data
            .map((person) =>
              person.phone === undefined ? 'No data found' : person.phone
            )
            .flat()
        )
      ).slice(0, APIThrottle);

      const relatives = Array.from(
        new Set(
          responseContent.data
            .map((person) =>
              person.relatives === undefined
                ? 'No data found'
                : person.relatives
            )
            .flat()
            .join(' • ')
            .split(' • ')
            .map((relative) => relative.replace(/\./g, ','))
        )
      ).slice(0, APIThrottle);

      return { phoneNumbers, relatives };
    } else {
      const errorMessage = `Error fetching data: ${responseContent.message}`;
      console.error(errorMessage);
      ws.send(errorMessage); // Send error message via WebSocket
      return null;
    }
  } catch (error) {
    const errorMessage = `Error fetching data: ${error.message || error}`;
    console.error(errorMessage);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with a status other than 2xx
        ws.send(
          `Error: Server responded with status ${error.response.status} - ${error.response.statusText}`
        );
      } else if (error.request) {
        ws.send('Error: No response received from server.');
      } else {
        ws.send('Error: Request setup failed.');
      }
    } else {
      ws.send(errorMessage);
    }

    return null;
  }
};

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
