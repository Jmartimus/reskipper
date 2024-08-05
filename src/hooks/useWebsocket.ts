import { useState, useEffect, useCallback } from 'react';
import { AUTH_MESSAGES } from '../constants';

const useWebSocket = () => {
  const [status, setStatus] = useState('Not Skipping');
  const [authStatus, setAuthStatus] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [skipping, setSkipping] = useState(false);
  const [skippingCompleted, setSkippingCompleted] = useState(false);
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
      setSkipping(false);
      setStatus('skipping completed!');
      setSkippingCompleted(true);
    };

    webSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setSkipping(false);
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

  const skip = useCallback(() => {
    if (skippingCompleted) {
      window.location.reload();
    } else {
      setSkipping(true);
      setStatus('Loading skip-tracer...');
      if (ws) {
        ws.send('skipping...');
      }
    }
  }, [ws, skippingCompleted]);

  return {
    status,
    authStatus,
    isAuthorized,
    skipping,
    skippingCompleted,
    login,
    skip,
  };
};

export default useWebSocket;
