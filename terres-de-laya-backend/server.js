const express = require("express");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs").promises;
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


const homeserverUrl = "https://chat.terresdelaya.fr";
const password = "#PdMbcAFJ$C3";  // Store your password securely in environment variables


app.post("/api/register-user", async (req, res) => {
  const { email, password, username, user_metadata } = req.body;

  try {
    // Get the token first
    const tokenResponse = await axios.post(
      "https://terresdelaya.eu.auth0.com/oauth/token",
      {
        client_id: process.env.CLIENT_ID, // Ensure to securely store and retrieve these credentials.
        client_secret: process.env.CLIENT_SECRET,
        audience: "https://terresdelaya.eu.auth0.com/api/v2/",
        grant_type: "client_credentials",
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Register the user
    const userResponse = await axios.post(
      "https://terresdelaya.eu.auth0.com/api/v2/users",
      {
        email,
        password,
        username,
        user_metadata,
        connection: "Username-Password-Authentication", // Replace with your connection name
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Auto-invite the user to the space
    const matrixUserId = `@${username}:terresdelaya.fr`; // Construct the Matrix user ID
    const jwt = await generateJwt("bot");

    // Exchange JWT for an access token
    const loginResponse = await axios.post(homeserverUrl + "/_matrix/client/r0/login", {
      type: "org.matrix.login.jwt",
      token: jwt,
    });
  
    const accessTokenForMatrix = loginResponse.data.access_token;
    const storage = new SimpleFsStorageProvider("invite-bot.json");
    const client = new MatrixClient(homeserverUrl, accessTokenForMatrix, storage);

    const userJwt = await generateJwt(username);
    const loginResponseAsUser = await axios.post(homeserverUrl + "/_matrix/client/r0/login", {
      type: "org.matrix.login.jwt",
      token: userJwt,
    });

    // Invite the user to the rooms
    const rooms = [
      {
        "room_id": "!uiFNwStLLlVHzJaJJW:chat.terresdelaya.fr",
        "room_alias": "#terres-de-laya:chat.terresdelaya.fr"
      },
      {
        "room_id": "!CSezpSKmveaQFOILVn:chat.terresdelaya.fr",
        "room_alias": "#general:chat.terresdelaya.fr"
      }, 
      {
        "room_id": "!EzaUmbNUwUzmZGDmYp:chat.terresdelaya.fr",
        "room_alias": "#support:chat.terresdelaya.fr"
      },
      {
        "room_id": "!KJZYqUDAREsDTymALo:chat.terresdelaya.fr",
        "room_alias": "#chambre-hotes:chat.terresdelaya.fr"
      },
      {
        "room_id": "!cCgsiFsiOoOQrMTXNE:chat.terresdelaya.fr",
        "room_alias": "#mobilite-partagee:chat.terresdelaya.fr"
      },
      {
        "room_id": "!gvdayDddZqxNbFZhhd:chat.terresdelaya.fr",
        "room_alias": "#voitures-partagees:chat.terresdelaya.fr"
      },
      {
        "room_id": "!pjdufUzHvCRwnGjNzC:chat.terresdelaya.fr",
        "room_alias": "#potagers-partages:chat.terresdelaya.fr"
      },
      {
        "room_id": "!aeXStOUkYFUABXUbGM:chat.terresdelaya.fr",
        "room_alias": "#evenements:chat.terresdelaya.fr"
      },
      {
        "room_id": "!OLipmyPLmvBzIoIngL:chat.terresdelaya.fr",
        "room_alias": "#syndic-de-copropriete:chat.terresdelaya.fr"
      }, 
      {
        "room_id": "!MxBgRYlkeYSNbHcshB:chat.terresdelaya.fr",
        "room_alias": "#espace-commun:chat.terresdelaya.fr"
      },
      {
        "room_id": "!RfkDjnLqsENQjlkSgm:chat.terresdelaya.fr",
        "room_alias": "#parents:chat.terresdelaya.fr"
      },
      {
        "room_id": "!NrBSRUkQzkiyWvpjOT:chat.terresdelaya.fr",
        "room_alias": "#boite-idees:chat.terresdelaya.fr"
      },
    ];


    try {
      for (const room of rooms) {
        console.log(`Start inviting User ${matrixUserId} to room ${room.room_alias}`);
        await client.inviteUser(matrixUserId, room.room_id);
        console.log(`User ${matrixUserId} invited to room ${room.room_alias}`);
      }
    } catch (inviteError) {
      console.error("Error inviting user to rooms:", inviteError);
    }

    res.json(userResponse.data);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Error registering user");
  }
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});

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