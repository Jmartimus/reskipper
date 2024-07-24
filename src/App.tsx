import React from 'react';
import LoginForm from './components/LoginForm';
import ScraperControls from './components/ScraperControls';
import useWebSocket from './hooks/useWebsocket';
import './App.css';

const App: React.FC = () => {
  const {
    status,
    authStatus,
    isAuthorized,
    scraping,
    scrapingCompleted,
    login,
    scrape,
  } = useWebSocket();

  return (
    <div id="outerContainer">
      {!isAuthorized ? (
        <LoginForm onLogin={login} authStatus={authStatus} />
      ) : (
        <ScraperControls
          status={status}
          scraping={scraping}
          scrapingCompleted={scrapingCompleted}
          onScrape={scrape}
        />
      )}
    </div>
  );
};

export default App;
