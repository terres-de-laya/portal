const express = require("express");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs").promises;
const app = express();

app.use(cors());
app.use(express.json());


const homeserverUrl = "https://chat.terresdelaya.fr";
const password = "#PdMbcAFJ$C3";  // Store your password securely in environment variables

const {
  MatrixClient,
  SimpleFsStorageProvider,
  AutojoinRoomsMixin,
} = require("matrix-bot-sdk");

(async () => {
  try {
    const jwt = await generateJwt("bot");
    
    console.log("Bot ready with token:", jwt);
    await startBot(jwt);
  } catch (err) {
    console.error("Failed to start bot:", err);
  }
})();

async function startBot(jwt) {

    // Exchange JWT for an access token
    const loginResponse = await axios.post(homeserverUrl + "/_matrix/client/r0/login", {
      type: "org.matrix.login.jwt",
      token: jwt,
    });
  
    const accessToken = loginResponse.data.access_token;

  // Initialize Matrix client with the JWT token
  const storage = new SimpleFsStorageProvider("welcome-bot.json");
  const client = new MatrixClient(homeserverUrl, accessToken, storage);

  // Enable autojoin functionality
  AutojoinRoomsMixin.setupOnClient(client);

  // Welcome message for new users
  
  client.on("room.member", async (roomId, event) => {
    if (event.membership === "join" && event.state_key !== client.getUserId()) {
      try {
        // Fetch the room state to check if it's a space
        const roomState = await client.getRoomState(roomId);
        const isSpace = roomState.some(
          (stateEvent) => stateEvent.type === "m.room.create" && stateEvent.content.type === "m.space"
        );

        if (isSpace) {
          console.log(`User ${event.state_key} joined space ${roomId}`);
          const welcomeMessage = await fs.readFile('welcome-message.txt', 'utf8');
          await client.sendText(roomId, welcomeMessage);
        }
      } catch (error) {
        console.error("Error processing join event:", error);
      }
    }
  });

  // Respond to specific messages
  client.on("room.message", async (roomId, event) => {
    if (!event.content || event.sender === client.getUserId()) return;

    const body = event.content.body;
    if (body.startsWith("!welcome")) {
      try {
        const welcomeMessage = await fs.readFile('welcome-message.txt', 'utf8');
        await client.sendText(roomId, welcomeMessage);
      } catch (error) {
        console.error("Error reading welcome message file:", error);
      }
    }
  });

  // Start the bot
  try {
    await client.start();
    console.log("Bot started and ready to welcome users!");
  } catch (err) {
    console.error("Failed to start the bot:", err);
  }
}

async function generateJwt(username) {
  const jwt = require('jsonwebtoken');

  // Define payload with bot's Matrix user ID
  const payload = {
    iss: "backend.terresdelaya.fr",
    "sub": username,
    aud: ["chat.terresdelaya.fr"],    // Audience (Matrix server URL)
  };

  const secret = password; // Secret key used to sign the JWT

  // JWT options
  const options = {
    algorithm: 'HS256',
    expiresIn: '1h', // Set token expiry (e.g., 1 hour)
  };

  // Generate the JWT token
  const token = jwt.sign(payload, secret, options);
  
  console.log('Generated JWT:', token);
  return token;
}