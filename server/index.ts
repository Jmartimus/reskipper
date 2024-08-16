import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import { runReSkipper } from './skipper';
import { type AuthorizedWebSocket, authenticateUser } from './authenticate';
import { configDotenv } from 'dotenv';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.static('public'));

const port = 8080;

configDotenv();

wss.on('connection', (ws: AuthorizedWebSocket) => {
  ws.isAuthorized = false;
  ws.on('message', (message: string) => {
    if (!ws.isAuthorized) {
      authenticateUser(ws, message);
    } else {
      console.log('User is authorized!');
      runReSkipper(ws)
        .then(() => {
          ws.send('Skipping completed successfully.');
          console.log('reskipper ran');
        })
        .catch((error) => {
          console.error('Error during skipping:', error);
          ws.send('Internal Server Error');
        });
    }
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});
