import React from 'react';
import LoginForm from './components/LoginForm';
import useWebSocket from './hooks/useWebsocket';
import './App.css';
import SkipperControls from './components/SkipperControls';

const App: React.FC = () => {
  const {
    status,
    authStatus,
    isAuthorized,
    skipping,
    skippingCompleted,
    login,
    skip,
  } = useWebSocket();

  return (
    <div id="outerContainer">
      {!isAuthorized ? (
        <LoginForm onLogin={login} authStatus={authStatus} />
      ) : (
        <SkipperControls
          status={status}
          skipping={skipping}
          skippingCompleted={skippingCompleted}
          onSkip={skip}
        />
      )}
    </div>
  );
};

export default App;
