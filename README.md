# Real Estate Skiptracer and Google Sheet Updater

## Overview

This project is designed to pull a list of names from a google sheet, skip trace each one using an API and return the skiptraced data back into the correct google sheet.  This solves a problem we have where skiptracing many names take a lot of time.  It normally takes about 10 minutes to skip trace one person successfully, this will trim that time down to half a second.  If we skip trace 50 people a week manually, it would take about 4 hours.  With this bot, it will take a little less than half a minute.

## Features

- **Skiptracing API Integration**: Uses an API to skiptrace leads.
- **Google Sheet Integration**: Updates a Google Sheet with the scraped data.
- **Easy Deployment**: Utilizes Fly.io for seamless deployment and hosting of the skiptracer.

## Prerequisites

Before using this tool, make sure you have the following:

- Node.js installed
- Google API credentials for the Google Sheets API
- Google Sheet ID for the target spreadsheet
- A Fly.io account for deployment

## Setup

1. Clone the repository:
   `git clone [https://github.com/yourusername/reskipper.git](https://github.com/Jmartimus/reskipper)`

2. Configure Google API Credentials:
   - Follow the instructions to obtain Google API credentials and save them in a file named reskipper-key.json in the public directory. 
   - Ensure that the credentials are correctly imported in the googlesheets/auth.ts file.

3. Set Google Sheet ID in Configuration: Get the ID of the target Google Sheet.
   Open the secrets.ts file and set the GOOGLE_SHEET_ID variable to the obtained ID as `const spreadsheetId`. You will also need to make sure that your ranges are set according to your google sheet columns.  Make this change in the constants file.
   
4. Set up your account with scrapeak API and get your API url and API key, add them to the secrets file.


5. Install Yarn: Ensure that Yarn is installed on your machine. If not, you can install it using:
   `npm install -g yarn`

6. Run the build command to compile TypeScript files for server: `yarn build-server`

7. Start the reskipper server: `yarn start-server`

8. In another terminal tab, run: `yarn dev`

These steps should initialize the Real Estate Skiptracer, grab data from the google sheet, skiptrace the list of names, and update the configured Google Sheet accordingly.

## Deployment with Fly.io
To deploy the project using Fly.io:

1. Sign up for a Fly.io account if you haven't already.
2. Follow Fly.io documentation to set up your application.
3. Update the necessary configuration files for deployment, such as fly.toml and run `fly deploy` to redeploy app with new changes.
**Just because you merge code, does not mean this gets redeployed**

## Scripts
- `yarn dev`: Starts the Vite development server for the frontend.
- `yarn start-server`: Builds the backend server and starts it using ts-node.
- `yarn start`: Starts both the Vite development server and the backend server using a shell script.
- `yarn build`: Compiles the TypeScript files for the frontend and builds the Vite production assets.
- `yarn build-server`: Compiles the TypeScript files for the backend server.
- `yarn lint`: Runs ESLint on the project files with specific options to report unused disable directives and sets the maximum warnings to 0.
- `yarn preview`: Starts the Vite preview server to serve the built production assets.
