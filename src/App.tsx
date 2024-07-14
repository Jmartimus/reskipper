// import { useState } from 'react';
import './App.css';

function App() {
  // const [count, setCount] = useState(0);

  return (
    <>
      <div id="outerContainer">
        <form id="loginForm">
          <h2>Login</h2>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="username"
          />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="password"
          />
          <button type="button" id="loginButton">
            Login
          </button>
          <div id="authStatus"></div>
        </form>
        <div id="scraperControls">
          <h2>Run ReScraper</h2>
          <p>Scraping status updates:</p>
          <div id="status">Not Scraping</div>
          <button id="scrapeButton" disabled>
            Scrape
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
