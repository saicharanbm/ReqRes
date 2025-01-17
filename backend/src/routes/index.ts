import { Router } from "express";
import { oauth2Client } from "../utils/googleClient";
import axios from "axios";

export const router = Router();

router.post("/google", async (req, res) => {
  const { code } = req.body;
  if (!code) {
    res.status(400).send("Missing code");
    return;
  }
  const googleResponse = await oauth2Client.getToken(code);

  if (!googleResponse) {
    res.status(400).send("Invalid code");
    return;
  }
  const userData = await axios.get(
    "https://www.googleapis.com/oauth2/v1/userinfo",
    {
      headers: {
        Authorization: `Bearer ${googleResponse.tokens.access_token}`,
      },
    }
  );
  const { name, email, picture } = userData.data;
  console.log(name, email, picture);

  res.json(userData.data);
});
