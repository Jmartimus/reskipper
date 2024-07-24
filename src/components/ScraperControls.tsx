import React from 'react';

interface ScraperControlsProps {
  status: string;
  scraping: boolean;
  scrapingCompleted: boolean;
  onScrape: () => void;
}

const ScraperControls: React.FC<ScraperControlsProps> = ({
  status,
  scraping,
  scrapingCompleted,
  onScrape,
}) => {
  return (
    <div id="scraperControls">
      <h2>Run ReScraper</h2>
      <div id="statusContainer">
        <p>Scraping status updates:</p>
        <div id="status">{status}</div>
        <button id="scrapeButton" onClick={onScrape} disabled={scraping}>
          {scrapingCompleted
            ? 'Reload page'
            : scraping
            ? 'Scraping...'
            : 'Scrape'}
        </button>
      </div>
    </div>
  );
};

export default ScraperControls;
