import { useState, useEffect, useCallback } from 'react';
import { AUTH_MESSAGES } from '../constants';

const useWebSocket = () => {
  const [status, setStatus] = useState('Not Scraping');
  const [authStatus, setAuthStatus] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [scrapingCompleted, setScrapingCompleted] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const WS_URL =
      window.location.hostname === 'rescraper.fly.dev'
        ? 'wss://rescraper.fly.dev/'
        : 'ws://localhost:8080';

    const webSocket = new WebSocket(WS_URL);

    webSocket.onopen = () => {
      console.log('WebSocket connection established.');
    };

    webSocket.onmessage = (event) => {
      const message = event.data;
      console.log('Received message from server:', message);

      if (message.startsWith(AUTH_MESSAGES.SUCCESS)) {
        setIsAuthorized(true);
        setAuthStatus(AUTH_MESSAGES.SUCCESS);
      } else if (message.startsWith(AUTH_MESSAGES.DENIED)) {
        setAuthStatus(`${AUTH_MESSAGES.DENIED} - Refresh page to try again.`);
      } else {
        setStatus(message);
      }
    };

    webSocket.onclose = () => {
      console.log('WebSocket connection closed.');
      setScraping(false);
      setStatus('Scraping completed!');
      setScrapingCompleted(true);
    };

    webSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setScraping(false);
      setStatus(`Error: ${(error as ErrorEvent).message}`);
    };

    setWs(webSocket);

    return () => {
      if (ws) {
        webSocket.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(
    (username: string, password: string) => {
      if (ws) {
        ws.send(JSON.stringify({ username, password }));
      }
    },
    [ws]
  );

  const scrape = useCallback(() => {
    if (scrapingCompleted) {
      window.location.reload();
    } else {
      setScraping(true);
      setStatus('Loading scraper...');
      if (ws) {
        ws.send('Scraping...');
      }
    }
  }, [ws, scrapingCompleted]);

  return {
    status,
    authStatus,
    isAuthorized,
    scraping,
    scrapingCompleted,
    login,
    scrape,
  };
};

export default useWebSocket;
