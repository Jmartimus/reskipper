#!/bin/sh

# Build the server first
yarn build-server

# Start the backend server
yarn start-server &

# Start the Vite development server in the background
yarn dev
