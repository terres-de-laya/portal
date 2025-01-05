const express = require("express");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs").promises;
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

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
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
